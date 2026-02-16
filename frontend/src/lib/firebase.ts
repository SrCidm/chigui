import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey:     process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId:      process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Singleton — Next.js hot reload creates multiple instances without this guard
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ─── Auth helpers ──────────────────────────────────────────────

/**
 * Returns the current user's ID token.
 * This token is sent to FastAPI — NEVER the user's password.
 */
export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function logout() {
  return signOut(auth);
}
