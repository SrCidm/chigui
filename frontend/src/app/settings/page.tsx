"use client";

import { useApp } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const router = useRouter();

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

        {/* Data */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-orange-400">Data</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3 shadow">
            <button
              onClick={() => {
                if (confirm("Clear all conversation history? This cannot be undone.")) {
                  indexedDB.deleteDatabase("chigui_db");
                  alert("History cleared!");
                }
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Clear All Data
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
