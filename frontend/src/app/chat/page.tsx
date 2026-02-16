"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth, logout } from "@/lib/firebase";
import { sendChatMessage, Message } from "@/lib/api";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import { useSpeech } from "@/hooks/useSpeech";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useCamera } from "@/hooks/useCamera";
import { useApp } from "@/contexts/AppContext";
import AudioControls from "@/components/AudioControls";

const STORAGE_KEY = "chigui_chat_history";

export default function ChatPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Hooks
  const { speak, speaking } = useSpeech();
  const { listening, transcript, startListening, stopListening, clearTranscript, supported: voiceSupported } = useVoiceInput();
  const { 
    image, 
    showOptions, 
    openCameraOptions, 
    closeOptions, 
    takePhoto, 
    chooseFromGallery, 
    clearImage, 
    fileInputRef, 
    cameraInputRef, 
    handleFileChange 
  } = useCamera();
  const { settings } = useApp();

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Load chat history from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${user.uid}`);
      if (saved) {
        try {
          const history = JSON.parse(saved);
          setMessages(history);
        } catch (e) {
          console.error("Failed to load chat history:", e);
        }
      }
    }
  }, [user]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (typeof window !== "undefined" && user && messages.length > 0) {
      localStorage.setItem(`${STORAGE_KEY}_${user.uid}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle voice input transcript
  useEffect(() => {
    if (transcript && !listening) {
      setInput(transcript);
      clearTranscript();
    }
  }, [transcript, listening, clearTranscript]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if ((!messageText.trim() && !image) || sending) return;

    const userMessage: Message = { 
      role: "user", 
      text: messageText || "¿Qué ves en esta imagen?",
      image: image || undefined // Include image if present
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    
    // Clear image AFTER adding to messages
    const currentImage = image;
    if (currentImage) clearImage();
    
    setSending(true);

    try {
      // Send ENTIRE history to AI for context/memory
      const reply = await sendChatMessage(updatedMessages, "beginner");
      const aiMessage: Message = { role: "model", text: reply };
      setMessages((prev) => [...prev, aiMessage]);
      
      // Auto-play TTS if enabled
      if (settings.autoPlayTTS && settings.voiceEnabled) {
        speak(reply);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "model",
        text: "Sorry, I couldn't process that. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  const handleVoiceToggle = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleClearChat = () => {
    if (confirm("Clear entire chat history? This will erase Chigui's memory of your conversations.")) {
      setMessages([]);
      if (typeof window !== "undefined" && user) {
        localStorage.removeItem(`${STORAGE_KEY}_${user.uid}`);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Header - Fixed */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10">
            <Image
              src="/logo.jpg"
              alt="Chigui"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-orange-400">Chigui</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">Your Spanish AI tutor</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Clear Chat Button */}
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition p-1.5 sm:p-2"
              title="Clear Chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}

          {user?.photoURL && (
            <div className="relative w-7 h-7 sm:w-8 sm:h-8">
              <Image
                src={user.photoURL}
                alt={user.displayName || "User"}
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
          
          <button
            onClick={() => router.push("/settings")}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition p-1.5 sm:p-2"
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Messages - Scrollable area with bottom padding */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 pb-40 sm:pb-32">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-500 mt-10 sm:mt-20">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 opacity-50">
              <Image
                src="/logo.jpg"
                alt="Chigui"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-base sm:text-lg">¡Hola! I'm Chigui 🐾</p>
            <p className="text-sm mt-2">Your super chill Spanish homie!</p>
            <p className="text-xs mt-1 text-gray-400 dark:text-gray-600">Speak, type, or send a photo</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-xs md:max-w-md lg:max-w-lg px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
                msg.role === "user"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              {/* Show image if present */}
              {msg.image && (
                <img 
                  src={msg.image} 
                  alt="User upload" 
                  className="rounded-lg mb-2 max-w-full h-auto"
                />
              )}
              
              <p className="whitespace-pre-wrap text-sm sm:text-base">{msg.text}</p>
              
              {msg.role === "model" && settings.voiceEnabled && (
                <button
                  onClick={() => speak(msg.text)}
                  className="mt-2 text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
                  disabled={speaking}
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
                  </svg>
                  {speaking ? "Playing..." : "Listen"}
                </button>
              )}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-800 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Audio Controls */}
      <AudioControls />

      {/* Camera Options Modal */}
      {showOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeOptions}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 m-4 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Choose an option</h3>
            <div className="space-y-3">
              <button
                onClick={takePhoto}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Take Photo
              </button>
              <button
                onClick={chooseFromGallery}
                className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Choose from Gallery
              </button>
              <button
                onClick={closeOptions}
                className="w-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white px-4 py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Bar - FIXED AT BOTTOM */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-2 sm:py-3 pb-safe-or-4 z-30">
        {listening && (
          <div className="mb-2 text-center text-xs sm:text-sm text-orange-400 animate-pulse">
            🎤 Listening... Speak now
          </div>
        )}

        {image && (
          <div className="mb-2 relative inline-block">
            <img src={image} alt="Preview" className="h-20 rounded-lg" />
            <button
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        
        <div className="w-full max-w-4xl mx-auto flex gap-1 sm:gap-2 items-end overflow-hidden">
          {/* Voice Button */}
          {voiceSupported && (
            <button
              onClick={handleVoiceToggle}
              disabled={sending}
              className={`flex-shrink-0 p-2 sm:p-3 rounded-lg transition touch-manipulation ${
                listening
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              } disabled:opacity-50`}
              title={listening ? "Stop" : "Voice"}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          {/* Camera Button */}
          <button
            onClick={openCameraOptions}
            disabled={sending}
            className="flex-shrink-0 p-2 sm:p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition disabled:opacity-50 touch-manipulation"
            title="Camera"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Hidden inputs - CORREGIDOS */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={listening ? "Listening..." : image ? "Describe..." : "Type..."}
            disabled={sending || listening}
            className="flex-1 min-w-0 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-2 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 placeholder-gray-500 dark:placeholder-gray-400"
          />

          {/* Send Button - Responsive */}
          <button
            onClick={() => handleSend()}
            disabled={(!input.trim() && !image) || sending || listening}
            className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition disabled:opacity-50"
          >
            <span className="hidden sm:inline">Send</span>
            <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}