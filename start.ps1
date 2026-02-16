Write-Host "🐾 Starting Chigui Development Servers..." -ForegroundColor Cyan
Write-Host ""

# Backend
Write-Host "[1/2] Starting FastAPI Backend..." -ForegroundColor Blue
Set-Location backend
if (-not (Test-Path venv)) {
    python -m venv venv
}
& .\venv\Scripts\Activate.ps1
pip install -q -r requirements.txt
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& .\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 8000"
Write-Host "✓ Backend running at http://localhost:8000" -ForegroundColor Green
Write-Host "  API Docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""

# Frontend
Write-Host "[2/2] Starting Next.js Frontend..." -ForegroundColor Blue
Set-Location ..\frontend
npm install --silent
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
Write-Host "✓ Frontend running at http://localhost:3000" -ForegroundColor Green
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🚀 Chigui is ready!" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:3000"
Write-Host "   Backend:  http://localhost:8000/docs"
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Two new windows opened. Close them to stop servers." -ForegroundColor Yellow

Set-Location ..