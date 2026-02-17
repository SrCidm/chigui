# 🐾 Chigui - Learn Spanish with AI

> An intelligent Spanish learning Progressive Web App (PWA) featuring conversational AI, voice synthesis, image recognition, and personalized learning paths.

![Chigui Banner](./frontend/public/logo.jpg)

## 🌟 Features

### 🎯 Core Learning
- **AI Tutor**: Natural conversations with Gemini 2.5 Flash
- **Adaptive Responses**: Personality-driven teaching (casual, sarcastic style)
- **Multi-modal Input**: Text, voice, and image support
- **Progress Tracking**: Persistent chat history with user levels

### 🎨 User Experience
- **PWA Support**: Install as native app on mobile/desktop
- **Dark/Light Mode**: Full theme support
- **Voice Features**: Text-to-speech with adjustable speed (1x-2x)
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Profile Management**: Google OAuth authentication with session persistence

### 🛠️ Technical Highlights
- **Type-safe**: Full TypeScript implementation
- **Real-time**: Streaming responses with typing effect
- **Optimized**: IndexedDB for chat persistence
- **Secure**: Environment-based configuration with CORS

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────┐
│  Frontend (Next.js 14 + TypeScript)     │
│  - React 18 with App Router             │
│  - Tailwind CSS + Responsive Design     │
│  - Firebase Auth + PWA                  │
│  └─> Deployed on Firebase Hosting       │
└─────────────────────────────────────────┘
                    ↓ HTTPS
┌─────────────────────────────────────────┐
│  Backend (FastAPI + Python 3.11)        │
│  - Gemini AI Integration                │
│  - Firebase Admin SDK                   │
│  - CORS + Security                      │
│  └─> Deployed on Render                 │
└─────────────────────────────────────────┘
```

---

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Auth**: Firebase Authentication
- **PWA**: next-pwa
- **State**: React Hooks + IndexedDB
- **Deployment**: Firebase Hosting

### Backend
- **Framework**: FastAPI 0.104+
- **Language**: Python 3.11
- **AI**: Google Gemini 2.5 Flash
- **Auth**: Firebase Admin SDK
- **Deployment**: Render

---

## 📦 Installation

### Prerequisites
- Node.js 18+ & Bun/npm
- Python 3.11+
- Firebase project
- Gemini API key

### 1. Clone Repository
```bash
git clone https://github.com/srcidm/chigui.git
cd chigui
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your keys:
# - GEMINI_API_KEY
# - FIREBASE_PROJECT_ID
# - FIREBASE_PRIVATE_KEY
# - ALLOWED_ORIGINS

# Run server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Firebase config:
# - NEXT_PUBLIC_API_URL=http://localhost:8000
# - NEXT_PUBLIC_FIREBASE_API_KEY
# - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# - NEXT_PUBLIC_FIREBASE_PROJECT_ID
# - NEXT_PUBLIC_FIREBASE_APP_ID

# Run development server
npm run dev
```

### 4. Access App
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs

---

## 🌐 Deployment

### Backend → Render
```bash
cd backend

# Render will auto-deploy from GitHub
# Configure environment variables in Render dashboard:
# - GEMINI_API_KEY
# - FIREBASE_PROJECT_ID
# - FIREBASE_PRIVATE_KEY
# - ALLOWED_ORIGINS=["https://your-app.web.app"]
```

### Frontend → Firebase Hosting
```bash
cd frontend

# Build for production
npm run build

# Deploy
firebase deploy
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-1.5-flash
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
ALLOWED_ORIGINS=["http://localhost:3000","https://your-app.web.app"]
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 📱 Features Roadmap

- [x] Google OAuth authentication
- [x] Text-based conversations
- [x] Voice synthesis (TTS)
- [x] Image recognition (Gemini Vision)
- [x] Dark/Light theme
- [x] PWA support
- [x] Chat history persistence
- [ ] Speech-to-text (STT)
- [ ] Multi-language support
- [ ] Spaced repetition exercises
- [ ] Progress analytics dashboard
- [ ] Social learning features

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sergio Cid**
- Portfolio: https://srcidm.netlify.app
- GitHub: [@SergioCid](https://github.com/Srcidm)
- LinkedIn: [https://www.linkedin.com/in/srcidm]

---

## 🙏 Acknowledgments

- Google Gemini AI for conversational intelligence
- Firebase for authentication & hosting
- Render for reliable backend hosting
- Next.js team for amazing framework
- FastAPI for elegant Python APIs

---

## 📞 Support

For issues or questions:
- Open an [Issue](https://github.com/srcidm/chigui/issues)
- Email: sergio.g.cid.m@gmail.com

---

**Made with ❤️ and ☕ in Spain** 🇪🇸