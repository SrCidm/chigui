import axios from "axios";
import { getIdToken } from "./firebase";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor ──────────────────────────────────────
// Automatically attaches the Firebase token to every request.
// The backend validates it — zero effort on each call site.
api.interceptors.request.use(async (config) => {
  const token = await getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor ─────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Chat API ─────────────────────────────────────────────────

export interface Message {
  role: "user" | "model";
  text: string;
}

export async function sendChatMessage(messages: Message[], level: string = "beginner") {
  const { data } = await api.post<{ reply: string }>("/api/chat", { messages, level });
  return data.reply;
}

export default api;
