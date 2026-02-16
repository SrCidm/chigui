# 🐾 Chigui — AI-Powered Spanish Learning Platform

> Your super chill AI Spanish tutor. Learn from any language, naturally.

<div align="center">

![Chigui Logo](frontend/public/logo.jpg)

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?logo=google)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://www.python.org/)

[Live Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

Chigui is a **conversational AI language tutor** that helps people worldwide learn Spanish through natural, contextual interactions. Unlike traditional language apps, Chigui:

- 🌍 **Detects your language** automatically (English, French, German, Portuguese, Italian, Chinese, Japanese, Arabic, etc.)
- 💬 **Responds in YOUR language** while teaching Spanish
- 🎙️ **Supports voice conversations** - speak and listen naturally
- 🎯 **Adapts to your level** - beginner, intermediate, or advanced
- 😎 **Super chill personality** - like learning from a friend, not a textbook
- 🔒 **100% free** - no subscriptions, no limits

**Philosophy:** Learn by doing. Speak, make mistakes, get corrected, improve.

---

## ✨ Features

### 🎤 **Current Features (v1.0)**

#### **💬 Conversational AI**
- Real-time chat with Gemini 2.5 Flash
- Multi-language support (8+ languages)
- Adaptive difficulty levels
- Natural, friendly corrections
- Regional dialect support (Spain, Mexico, neutral)

#### **🎙️ Voice & Audio**
- **Speech-to-Text** - Speak in any language, Chigui understands
- **Text-to-Speech** - Hear correct Spanish pronunciation
- **Dialect Selection** - Choose between Spain Spanish, Mexican Spanish, or neutral
- **Auto-play Responses** - Optional hands-free mode

#### **🎨 Personalization**
- **Theme Support** - Dark, light, or auto (system)
- **Language Detection** - Auto-detect your native language
- **Voice Settings** - Enable/disable TTS, auto-play
- **Profile Integration** - Google photo + name display

#### **📊 Data & Storage**
- **Offline-Ready** - Conversations saved locally (IndexedDB)
- **Conversation History** - Access past chats anytime
- **Notes System** - Save important words/phrases
- **Cross-Device Sync** - Via Firebase Auth

#### **🔒 Security**
- Google Sign-In via Firebase Auth
- Protected routes and sessions
- API keys secured on backend only
- JWT authentication for all API calls

#### **📱 Progressive Web App (PWA)**
- Installable on mobile and desktop
- Offline-ready architecture
- Native app-like experience
- Works on iOS and Android

---

## 🚀 Roadmap

### **Phase 2: Advanced Voice & Vision** 🎙️📸

#### **Voice Features**
- [ ] **Continuous Voice Mode** - Hands-free conversation flow
- [ ] **Pronunciation Scoring** - AI feedback on your accent
- [ ] **Real-time Translation** - Live voice-to-voice translation
- [ ] **Voice Commands** - "Chigui, repeat that slower"

#### **Vision Features**
- [ ] **Camera Translation** - Point camera at text → instant translation
- [ ] **Image Upload** - Send photos and ask "What's this in Spanish?"
- [ ] **OCR Support** - Extract and translate text from images
- [ ] **Visual Context** - Learn vocabulary from real-world objects

### **Phase 3: Gamification & Learning** 🎮

#### **Gamification System**
- [ ] **Daily Missions** - "Have a 5-minute conversation", "Learn 10 food words"
- [ ] **Streak Tracking** - Don't break the chain! 🔥
- [ ] **Achievement Badges** - Unlock milestones
- [ ] **XP & Levels** - Visual progress tracking
- [ ] **Global Leaderboard** - Optional ranking (privacy-first)

#### **Learning Tools**
- [ ] **Flashcards** - Spaced Repetition System (SRS)
- [ ] **Vocabulary Builder** - Track words learned
- [ ] **Grammar Drills** - Interactive exercises
- [ ] **Pronunciation Practice** - Targeted accent training

### **Phase 4: Advanced AI** 🧠 

- [ ] **Conversation Memory** - Chigui remembers past topics
- [ ] **Personalized Curriculum** - AI adapts to your weaknesses
- [ ] **Story Mode** - Learn through interactive narratives
- [ ] **Contextual Corrections** - "In Spain ___, in Mexico ___, in Argentina ___"
- [ ] **Cultural Insights** - Learn slang, customs, expressions

### **Phase 5: Productivity & Export** 📊

- [ ] **Progress Dashboard** - Vocabulary learned, hours practiced
- [ ] **Export to PDF** - Download conversations
- [ ] **Weak Spot Detection** - AI identifies repeated mistakes
- [ ] **Study Recommendations** - "Focus on subjunctive this week"
- [ ] **Custom Study Plans** - Tailored learning paths

### **Phase 6: Social & Community** 👥

- [ ] **Language Exchange** - Match with native speakers
- [ ] **Group Challenges** - Team-based goals
- [ ] **Community Forum** - Ask questions, share resources
- [ ] **Live Tutor Sessions** - Human + AI hybrid learning
- [ ] **Friend System** - Learn with others

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Firebase Auth | Authentication |
| IndexedDB | Offline storage |
| Web Speech API | Voice input/output (FREE) |
| PWA | Mobile app experience |

### **Backend**
| Technology | Purpose |
|------------|---------|
| FastAPI | Python web framework |
| Gemini 2.5 Flash | AI conversation model |
| Firebase Admin SDK | Auth verification |
| Firestore | Database |
| Pydantic | Data validation |
| Uvicorn | ASGI server |

### **Infrastructure**
| Service | Purpose | Cost |
|---------|---------|------|
| Vercel | Frontend hosting | Free |
| Render/Railway | Backend hosting | Free |
| Firebase | Auth + Database | Free |
| Gemini API | AI responses | Free (1M tokens/month) |

**Total Cost: $0/month** 🎉

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER DEVICE                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │        Next.js 14 PWA (Frontend)                      │  │
│  │  • Firebase Auth (Google Sign-In)                     │  │
│  │  • Web Speech API (Voice I/O)                         │  │
│  │  • IndexedDB (Offline Storage)                        │  │
│  │  • Axios API Client (auto-injects JWT)                │  │
│  └────────────────┬──────────────────────────────────────┘  │
└───────────────────┼──────────────────────────────────────────┘
                    │ HTTPS + JWT
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI Backend                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Security Middleware (Firebase JWT Verification)     │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 ▼                                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes                                          │   │
│  │  • /api/chat      → Gemini proxy                     │   │
│  │  • /api/progress  → User stats                       │   │
│  │  • /api/vision    → Image analysis (planned)         │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 ▼                                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Gemini Service (API key secured)                   │   │
│  │  • Multi-language detection                          │   │
│  │  • Contextual responses                              │   │
│  │  • Personality injection                             │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────┬─────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              External Services                              │
│  • Gemini 2.5 Flash (AI responses)                          │
│  • Firebase Firestore (user data, conversations)            │
│  • Firebase Storage (images, audio files — planned)         │
└─────────────────────────────────────────────────────────────┘
```

### **Security Model**

```
User → Firebase Auth → JWT Token → FastAPI validates → Gemini API
                                         ↓
                                    Firestore DB
```

**Key principle:** API keys and credentials live **only** on the backend. Frontend only holds public Firebase config.

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Firebase project ([free](https://firebase.google.com))
- Gemini API key ([free](https://aistudio.google.com))

### **Installation**

#### **1. Clone the repository**
```bash
git clone https://github.com/yourusername/chigui.git
cd chigui
```

#### **2. Backend Setup**
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Firebase & Gemini credentials

# Run server
uvicorn app.main:app --reload
```

Backend will run at `http://localhost:8000`

#### **3. Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Firebase config

# Run development server
npm run dev
```

Frontend will run at `http://localhost:3000`

---

## 📦 Environment Variables

### **Backend** (`backend/.env`)
```bash
# App
APP_ENV=development
SECRET_KEY=your-random-secret-key

# Gemini API
GEMINI_API_KEY=AIza...  # From https://aistudio.google.com
GEMINI_MODEL=gemini-2.5-flash

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# CORS
ALLOWED_ORIGINS=["http://localhost:3000","https://chigui.app"]
```

### **Frontend** (`frontend/.env.local`)
```bash
# Firebase Web Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=1:...

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📱 Mobile Testing

### **Option 1: Local Network**
```bash
# Get your local IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Start frontend with IP binding
npm run dev -- --hostname 0.0.0.0

# Access from mobile (same WiFi)
http://192.168.x.x:3000
```

### **Option 2: ngrok (Public URL)**
```bash
# Install ngrok
npm install -g ngrok

# Expose frontend
ngrok http 3000

# Add ngrok URL to Firebase Console:
# Authentication → Settings → Authorized domains
```

---

## 🎨 Design Philosophy

1. **Conversational-first** - Learn by talking, not studying
2. **Zero embarrassment** - AI never judges, always encourages
3. **Practical Spanish** - Teach what people actually say
4. **Adaptive difficulty** - Meets you where you are
5. **Privacy-first** - Your data stays yours
6. **100% free** - No paywalls, no subscriptions

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini** for the conversational AI
- **Firebase** for authentication and database
- **Vercel** for frontend hosting
- **The open-source community** for amazing tools

---

## 📧 Contact

**Sergio Cid** — Full Stack Developer

- Portfolio: [sergiocid.dev](#)
- GitHub: [@Sergio Cid](https://github.com/srcidm)
- LinkedIn: [Sergio Cid](https://linkedin.com/in/srcidm)

**Project Link:** [https://github.com/srcidm/chigui](https://github.com/srcidm/chigui)

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=srcidm/chigui&type=Date)](https://star-history.com/#srcidm/chigui&Date)

---

<div align="center">

**Made with ❤️ and ☕ in Spain**

[⬆ Back to Top](#-chigui--ai-powered-spanish-learning-platform)

</div>
