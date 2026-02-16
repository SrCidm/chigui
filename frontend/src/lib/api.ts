import axios from "axios";
import { auth } from "./firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to all requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Message {
  role: "user" | "model";
  text: string;
  image?: string; // Base64 image data
}

export async function sendChatMessage(
  messages: Message[],
  level: string = "beginner"
): Promise<string> {
  try {
    const response = await api.post("/api/chat", {
      messages,
      level,
    });
    return response.data.reply;
  } catch (error: any) {
    console.error("Chat API error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || "Failed to send message");
  }
}

export default api;