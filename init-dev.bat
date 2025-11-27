@echo off
echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo Installing backend dependencies...
cd backend
pip install -r requirements.txt
cd ..

echo Starting development servers...
npm run dev