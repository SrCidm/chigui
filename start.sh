#!/bin/bash

echo "🐾 Starting Chigui Development Servers..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Backend
echo -e "${BLUE}[1/2] Starting FastAPI Backend...${NC}"
cd backend
python3 -m venv venv 2>/dev/null || true
source venv/bin/activate
pip install -q -r requirements.txt
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend running at http://localhost:8000${NC}"
echo -e "${GREEN}  API Docs: http://localhost:8000/docs${NC}"
echo ""

# Frontend
echo -e "${BLUE}[2/2] Starting Next.js Frontend...${NC}"
cd ../frontend
npm install --silent
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend running at http://localhost:3000${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Chigui is ready!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait and cleanup
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
