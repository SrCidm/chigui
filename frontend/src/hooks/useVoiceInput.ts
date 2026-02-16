"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";

export function useVoiceInput() {
  const { settings } = useApp();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Check if speech recognition is supported (client-side only)
  useEffect(() => {
    const isSupported = typeof window !== "undefined" && (
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window
    );
    setSupported(isSupported);
  }, []);

  // Initialize recognition
  const initRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      console.error("Speech recognition not supported");
      return null;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Auto-detect language or use user preference
    if (settings.userLanguage === "auto") {
      recognition.lang = ""; // Let browser detect
    } else {
      const langMap: Record<string, string> = {
        en: "en-US",
        es: "es-ES",
        fr: "fr-FR",
        de: "de-DE",
        pt: "pt-PT",
        it: "it-IT",
        zh: "zh-CN",
        ja: "ja-JP",
        ar: "ar-SA",
      };
      recognition.lang = langMap[settings.userLanguage] || "en-US";
    }

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    return recognition;
  }, [settings.userLanguage]);

  // Start listening
  const startListening = useCallback(() => {
    const recognition = initRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      setTranscript(text);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  }, [initRecognition]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  }, []);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    listening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    supported,
  };
}
