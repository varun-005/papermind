@echo off
echo Starting PDF Q&A Explorer servers...
echo.

echo Starting backend server...
start cmd /k "cd backend && venv\Scripts\activate && python -m uvicorn app.main:app --reload"

echo.
echo Waiting for backend to initialize (5 seconds)...
timeout /t 5 /nobreak > nul

echo.
echo Starting frontend server...
start cmd /k "cd frontend && npm start"

echo.
echo Servers starting up! The application will be available at:
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press any key to exit this window...
pause > nul 