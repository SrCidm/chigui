"use client";

import { useApp } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleClearChat = () => {
    if (confirm("Clear chat history? This will delete all your conversations.")) {
      if (typeof window !== "undefined" && user) {
        localStorage.removeItem(`chigui_chat_history_${user.uid}`);
        alert("Chat history cleared! ✓");
      }
    }
  };

  const handleClearAllData = () => {
    if (confirm("⚠️ WARNING: This will reset EVERYTHING!\n\n- Chat history\n- Settings\n- Theme preferences\n\nAre you sure?")) {
      if (confirm("Last chance! Reset app completely?")) {
        if (typeof window !== "undefined" && user) {
          // Clear chat history
          localStorage.removeItem(`chigui_chat_history_${user.uid}`);
          // Clear settings
          localStorage.removeItem('chigui_settings');
          // Clear theme
          localStorage.removeItem('chigui_theme');
          // Reload app
          alert("App reset! Reloading...");
          setTimeout(() => window.location.reload(), 500);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ← Back
          </button>
        </div>

        {/* Appearance */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-orange-400">Appearance</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4 shadow">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => updateSettings({ theme: e.target.value as any })}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Language & Dialect */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-orange-400">Language & Dialect</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4 shadow">
            <div>
              <label className="block text-sm font-medium mb-2">Your Native Language</label>
              <select
                value={settings.userLanguage}
                onChange={(e) => updateSettings({ userLanguage: e.target.value as any })}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="auto">Auto-detect</option>
                <option value="en">English</option>
                <option value="fr">Français (French)</option>
                <option value="de">Deutsch (German)</option>
                <option value="pt">Português (Portuguese)</option>
                <option value="it">Italiano (Italian)</option>
                <option value="zh">中文 (Chinese)</option>
                <option value="ja">日本語 (Japanese)</option>
                <option value="ar">العربية (Arabic)</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Chigui will respond in this language
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Spanish Dialect</label>
              <select
                value={settings.dialect}
                onChange={(e) => updateSettings({ dialect: e.target.value as any })}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="neutral">Neutral (All regions)</option>
                <option value="spain">Spain (Español de España)</option>
                <option value="mexico">Mexico (Español de México)</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Affects pronunciation and regional vocabulary
              </p>
            </div>
          </div>
        </section>

        {/* Voice Settings */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-orange-400">Voice</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Voice Enabled</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Enable text-to-speech</p>
              </div>
              <button
                onClick={() => updateSettings({ voiceEnabled: !settings.voiceEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  settings.voiceEnabled ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.voiceEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-play Responses</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Chigui speaks automatically</p>
              </div>
              <button
                onClick={() => updateSettings({ autoPlayTTS: !settings.autoPlayTTS })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  settings.autoPlayTTS ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    settings.autoPlayTTS ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Data Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Data</h2>
          
          <div className="space-y-3">
            {/* Clear Chat History */}
            <button
              onClick={handleClearChat}
              className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Clear Chat History
            </button>

            {/* Reset App (Dangerous) */}
            <button
              onClick={handleClearAllData}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Reset App (Clear Everything)
            </button>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Reset will delete chat history, settings, and theme preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
