// IndexedDB wrapper for offline storage
// Stores: conversations, notes, flashcards

const DB_NAME = "chigui_db";
const DB_VERSION = 1;

// Database initialization
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;

      // Conversations store
      if (!db.objectStoreNames.contains("conversations")) {
        const convStore = db.createObjectStore("conversations", { keyPath: "id", autoIncrement: true });
        convStore.createIndex("timestamp", "timestamp", { unique: false });
        convStore.createIndex("userId", "userId", { unique: false });
      }

      // Notes store
      if (!db.objectStoreNames.contains("notes")) {
        const notesStore = db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
        notesStore.createIndex("timestamp", "timestamp", { unique: false });
        notesStore.createIndex("category", "category", { unique: false });
      }

      // Flashcards store
      if (!db.objectStoreNames.contains("flashcards")) {
        const flashStore = db.createObjectStore("flashcards", { keyPath: "id", autoIncrement: true });
        flashStore.createIndex("nextReview", "nextReview", { unique: false });
        flashStore.createIndex("difficulty", "difficulty", { unique: false });
      }
    };
  });
}

// Conversation operations
export interface Conversation {
  id?: number;
  userId: string;
  messages: Array<{ role: string; text: string }>;
  timestamp: number;
  title?: string;
}

export async function saveConversation(conv: Omit<Conversation, "id">): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("conversations", "readwrite");
    const store = tx.objectStore("conversations");
    const request = store.add(conv);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export async function getConversations(userId: string, limit = 50): Promise<Conversation[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("conversations", "readonly");
    const store = tx.objectStore("conversations");
    const index = store.index("userId");
    const request = index.getAll(userId, limit);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteConversation(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("conversations", "readwrite");
    const store = tx.objectStore("conversations");
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Note operations
export interface Note {
  id?: number;
  text: string;
  translation?: string;
  category: "word" | "phrase" | "grammar" | "other";
  timestamp: number;
}

export async function saveNote(note: Omit<Note, "id">): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("notes", "readwrite");
    const store = tx.objectStore("notes");
    const request = store.add(note);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export async function getNotes(category?: string): Promise<Note[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("notes", "readonly");
    const store = tx.objectStore("notes");
    
    if (category) {
      const index = store.index("category");
      const request = index.getAll(category);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    } else {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }
  });
}

export async function deleteNote(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("notes", "readwrite");
    const store = tx.objectStore("notes");
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Flashcard operations (Spaced Repetition)
export interface Flashcard {
  id?: number;
  front: string;
  back: string;
  difficulty: number; // 0-5 (SuperMemo algorithm)
  interval: number; // Days until next review
  nextReview: number; // Timestamp
  repetitions: number;
}

export async function saveFlashcard(card: Omit<Flashcard, "id">): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("flashcards", "readwrite");
    const store = tx.objectStore("flashcards");
    const request = store.add(card);
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export async function getFlashcardsDue(): Promise<Flashcard[]> {
  const db = await openDB();
  const now = Date.now();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("flashcards", "readonly");
    const store = tx.objectStore("flashcards");
    const index = store.index("nextReview");
    const request = index.getAll(IDBKeyRange.upperBound(now));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function updateFlashcard(id: number, updates: Partial<Flashcard>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("flashcards", "readwrite");
    const store = tx.objectStore("flashcards");
    const getRequest = store.get(id);
    
    getRequest.onsuccess = () => {
      const card = { ...getRequest.result, ...updates };
      const putRequest = store.put(card);
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

// Search conversations
export async function searchConversations(query: string, userId: string): Promise<Conversation[]> {
  const conversations = await getConversations(userId);
  const lowerQuery = query.toLowerCase();
  
  return conversations.filter((conv) =>
    conv.messages.some((msg) => msg.text.toLowerCase().includes(lowerQuery)) ||
    conv.title?.toLowerCase().includes(lowerQuery)
  );
}
