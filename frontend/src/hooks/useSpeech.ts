"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useApp } from "@/contexts/AppContext";

interface Voice {
  lang: string;
  name: string;
  voice: SpeechSynthesisVoice;
}

export function useSpeech() {
  const { settings } = useApp();
  const [voices, setVoices] = useState<Voice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const spanishVoices = availableVoices
        .filter((v) => v.lang.startsWith("es"))
        .map((v) => ({
          lang: v.lang,
          name: v.name,
          voice: v,
        }));
      setVoices(spanishVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Get best MALE voice for selected dialect
  const getVoice = useCallback(() => {
    if (voices.length === 0) return null;

    // Dialect preferences
    const dialectMap = {
      spain: ["es-ES"],
      mexico: ["es-MX", "es-US"],
      neutral: ["es-ES", "es-MX", "es-US", "es"],
    };

    const preferredLangs = dialectMap[settings.dialect];

    // Find MALE voice (prefer names with "Male", "Jorge", "Diego", etc.)
    const maleKeywords = ["male", "jorge", "diego", "juan", "carlos", "miguel", "hombre", "masculino"];
    
    for (const lang of preferredLangs) {
      // Try to find male voice first
      const maleVoice = voices.find((v) => 
        v.lang.startsWith(lang) && 
        maleKeywords.some(keyword => v.name.toLowerCase().includes(keyword))
      );
      if (maleVoice) return maleVoice.voice;
      
      // Fallback to any voice from that region
      const anyVoice = voices.find((v) => v.lang.startsWith(lang));
      if (anyVoice) return anyVoice.voice;
    }

    // Last resort: any Spanish voice
    return voices[0]?.voice || null;
  }, [voices, settings.dialect]);

  // Speak text
  const speak = useCallback(
    (text: string) => {
      if (!settings.voiceEnabled) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      setPaused(false);

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = getVoice();
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = "es";
      utterance.rate = speed;
      utterance.pitch = 0.9; // Slightly lower pitch for more masculine sound

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
      };
      utterance.onerror = () => {
        setSpeaking(false);
        setPaused(false);
      };
      utterance.onpause = () => setPaused(true);
      utterance.onresume = () => setPaused(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [settings.voiceEnabled, getVoice, speed]
  );

  // Pause speaking
  const pause = useCallback(() => {
    if (speaking && !paused) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }, [speaking, paused]);

  // Resume speaking
  const resume = useCallback(() => {
    if (speaking && paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  }, [speaking, paused]);

  // Stop speaking
  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }, []);

  // Change speed
  const changeSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
    // If currently speaking, restart with new speed
    if (speaking && utteranceRef.current) {
      const currentText = utteranceRef.current.text;
      stop();
      setTimeout(() => speak(currentText), 100);
    }
  }, [speaking, stop, speak]);

  return { 
    speak, 
    stop, 
    pause, 
    resume, 
    speaking, 
    paused,
    speed,
    changeSpeed,
    voices, 
    enabled: settings.voiceEnabled 
  };
}
