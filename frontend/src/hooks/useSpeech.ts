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
  const [currentText, setCurrentText] = useState("");
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

    const dialectMap = {
      spain: ["es-ES"],
      mexico: ["es-MX", "es-US"],
      neutral: ["es-ES", "es-MX", "es-US", "es"],
    };

    const preferredLangs = dialectMap[settings.dialect];
    const maleKeywords = ["male", "jorge", "diego", "juan", "carlos", "miguel", "hombre", "masculino"];
    
    for (const lang of preferredLangs) {
      const maleVoice = voices.find((v) => 
        v.lang.startsWith(lang) && 
        maleKeywords.some(keyword => v.name.toLowerCase().includes(keyword))
      );
      if (maleVoice) return maleVoice.voice;
      
      const anyVoice = voices.find((v) => v.lang.startsWith(lang));
      if (anyVoice) return anyVoice.voice;
    }

    return voices[0]?.voice || null;
  }, [voices, settings.dialect]);

  // Internal function to actually speak
  const speakWithSpeed = useCallback((text: string, currentSpeed: number) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);

    // Small delay to ensure cancel completes
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = getVoice();
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = "es";
      utterance.rate = currentSpeed;
      utterance.pitch = 0.9;

      utterance.onstart = () => {
        setSpeaking(true);
        setCurrentText(text);
      };
      
      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
        setCurrentText("");
      };
      
      utterance.onerror = () => {
        setSpeaking(false);
        setPaused(false);
        setCurrentText("");
      };
      
      utterance.onpause = () => setPaused(true);
      utterance.onresume = () => setPaused(false);

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [getVoice]);

  // Public speak function
  const speak = useCallback(
    (text: string) => {
      if (!settings.voiceEnabled) return;
      speakWithSpeed(text, speed);
    },
    [settings.voiceEnabled, speed, speakWithSpeed]
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
    setCurrentText("");
  }, []);

  // Change speed - THIS IS THE KEY FIX
  const changeSpeed = useCallback((newSpeed: number) => {
    console.log(`[useSpeech] Changing speed from ${speed} to ${newSpeed}`);
    setSpeed(newSpeed);
    
    // If currently speaking, restart with new speed
    if (speaking && currentText) {
      console.log(`[useSpeech] Restarting audio with new speed: ${newSpeed}`);
      speakWithSpeed(currentText, newSpeed);
    }
  }, [speaking, currentText, speed, speakWithSpeed]);

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