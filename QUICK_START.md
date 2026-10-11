# Sertikom Mahasiswa - Quick Start Guide

## 🚀 Mulai Cepat

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment
```bash
cp .env.example .env
```

### Step 3: Run Application
```bash
npm run dev
```

### Step 4: Buka Browser
```
http://localhost:3000
```

## 👤 Login Admin

**Email**: admin@sertikom.com  
**Password**: Admin@123

## 📋 Fitur Utama

### User (Mahasiswa)
- Login/Register
- Upload dokumen
- Lihat status dokumen
- Buat jadwal
- Terima notifikasi
- Kelola profil

### Admin
- Dashboard statistik
- Manajemen user
- Verifikasi dokumen
- Tolak dokumen
- Lihat activity log

## 🔧 Konfigurasi (Opsional)

### Google OAuth Login

1. Buka https://console.cloud.google.com/
2. Buat project baru
3. Setup OAuth 2.0 credentials
4. Copy Client ID dan Secret ke `.env`:
   ```env
   GOOGLE_CLIENT_ID=your_id
   GOOGLE_CLIENT_SECRET=your_secret
   ```
5. Tambahkan authorized redirect: `http://localhost:3000/auth/google/callback`

### Ubah Port

Edit `.env`:
```env
PORT=5000
```

## 📁 Struktur Database

Database SQLite otomatis dibuat dengan tabel:
- `users` - Data pengguna
- `documents` - File yang diupload
- `schedules` - Jadwal
- `notifications` - Notifikasi
- `activity_logs` - Log aktivitas

## 🐛 Troubleshooting

### Port sudah digunakan
```bash
PORT=5000 npm run dev
```

### Database error
```bash
rm db/sertikom.db && npm run dev
```

### Dependencies error
```bash
rm -rf node_modules && npm install
```

## 📚 Dokumentasi Lengkap

Lihat file `INSTALLATION.md` untuk dokumentasi lengkap dan penjelasan fitur admin.

## 💡 Tips

- Default session berlaku 8 jam
- File upload maksimal 10MB
- Format file yang didukung: PDF, DOC, DOCX, JPG, PNG
- Admin default dibuat otomatis di setup pertama

## 🔒 Keamanan

- Password di-hash dengan bcryptjs
- Session management dengan express-session
- Role-based access control
- Input validation pada semua form
- File type validation

---

Happy coding! 🚀
