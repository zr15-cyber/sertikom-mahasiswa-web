@echo off
echo ================================
echo Sertikom Mahasiswa Setup
echo ================================
echo.

echo Updating npm packages...
call npm install

echo.
echo Creating .env file...
if not exist .env (
  copy .env.example .env
  echo .env file created. Please configure it.
) else (
  echo .env file already exists.
)

echo.
echo Creating necessary directories...
if not exist uploads mkdir uploads
if not exist db mkdir db

echo.
echo ================================
echo Setup completed!
echo ================================
echo.
echo Next steps:
echo 1. Configure .env file with your settings
echo 2. Run: npm run dev
echo.
echo Admin credentials:
echo   Email: admin@sertikom.com
echo   Password: Admin@123
echo.
echo Access: http://localhost:3000
pause
