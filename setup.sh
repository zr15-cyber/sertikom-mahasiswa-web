#!/bin/bash

echo "================================"
echo "Sertikom Mahasiswa Setup"
echo "================================"
echo ""

echo "📦 Installing dependencies..."
npm install

echo ""
echo "📝 Creating .env file..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✓ .env file created. Please configure it."
else
  echo "✓ .env file already exists."
fi

echo ""
echo "📂 Creating necessary directories..."
mkdir -p uploads
mkdir -p db

echo ""
echo "================================"
echo "✅ Setup completed!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Configure .env file with your settings"
echo "2. Run: npm run dev"
echo ""
echo "Admin credentials:"
echo "  Email: admin@sertikom.com"
echo "  Password: Admin@123"
echo ""
echo "Access: http://localhost:3000"
