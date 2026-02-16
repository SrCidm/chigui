@echo off
echo 🐾 Starting Chigui Development Servers...
echo.

:: Backend
echo [1/2] Starting FastAPI Backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -q -r requirements.txt
start cmd /k "uvicorn app.main:app --reload --port 8000"
echo ✓ Backend running at http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.

:: Frontend
echo [2/2] Starting Next.js Frontend...
cd ..\frontend
call npm install --silent
start cmd /k "npm run dev"
echo ✓ Frontend running at http://localhost:3000
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🚀 Chigui is ready!
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000/docs
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

pause
