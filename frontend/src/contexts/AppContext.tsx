"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Tipos
export type Theme = "dark" | "light" | "auto";
export type Dialect = "spain" | "mexico" | "neutral";
export type UserLanguage = "en" | "fr" | "de" | "pt" | "it" | "zh" | "ja" | "ar" | "auto";

interface AppSettings {
  theme: Theme;
  dialect: Dialect;
  userLanguage: UserLanguage;
  voiceEnabled: boolean;
  autoPlayTTS: boolean;
}

interface AppContextType {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  theme: "dark",
  dialect: "neutral",
  userLanguage: "auto",
  voiceEnabled: true,
  autoPlayTTS: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chigui_settings");
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chigui_settings", JSON.stringify(settings));
    
    // Apply theme to document
    if (settings.theme === "dark" || (settings.theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  return (
    <AppContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
