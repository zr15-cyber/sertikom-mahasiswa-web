# Sertikom Mahasiswa - Platform Verifikasi Dokumen Mahasiswa

Aplikasi web modern untuk manajemen upload dokumen, verifikasi, jadwal, dan notifikasi mahasiswa.

## 🚀 Fitur Utama

### Untuk User (Mahasiswa)
- ✅ Registrasi & Login
- ✅ Login dengan Google OAuth
- ✅ Upload dokumen (PDF, DOC, DOCX, JPG, PNG)
- ✅ Tracking status dokumen (Pending, Verified, Rejected)
- ✅ Penjadwalan untuk pertemuan/verifikasi
- ✅ Notifikasi real-time dari admin
- ✅ Kelola profil (nama, NIM, nomor telepon)
- ✅ Dashboard dengan statistik

### Untuk Admin
- ✅ Dashboard dengan statistik lengkap
- ✅ Manajemen user (lihat, ubah role, ubah status)
- ✅ Verifikasi dokumen dengan catatan
- ✅ Tolak dokumen dengan alasan
- ✅ Activity logs untuk tracking semua aktivitas
- ✅ Manajemen daftar user
- ✅ Manajemen daftar dokumen

## 🛠️ Stack Teknologi

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Frontend**: EJS, HTML5, CSS3, Vanilla JavaScript
- **Autentikasi**: Passport.js (Local + Google OAuth)
- **File Upload**: Multer
- **Password Hashing**: Bcryptjs
- **Session Management**: Express-session

## 📋 Prerequisites

- Node.js v14 atau lebih tinggi
- npm atau yarn
- Git

## 🎯 Instalasi & Setup

### 1. Clone Repository atau Extract ZIP
```bash
git clone https://github.com/zr15-cyber/sertikom-mahasiswa-web.git
cd sertikom-mahasiswa-web

# atau jika dari ZIP
unzip sertikom-mahasiswa-web.zip
cd sertikom-mahasiswa-web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Edit file `.env` dan isi dengan konfigurasi Anda:
```env
PORT=3000
SESSION_SECRET=sertikom-secret-key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Setup Google OAuth (Optional)
Jika Anda ingin menggunakan fitur login dengan Google:
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru
3. Setup OAuth 2.0 credentials (Web application)
4. Tambahkan authorized redirect URIs: `http://localhost:3000/auth/google/callback`
5. Copy Client ID dan Client Secret ke file `.env`

### 5. Jalankan Aplikasi
```bash
# Development mode dengan auto-reload
npm run dev

# atau Production mode
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

## 👤 Akun Default

Saat pertama kali database dibuat, akun admin default akan otomatis dibuat:

**Email**: admin@sertikom.com  
**Password**: Admin@123

## 📁 Struktur Folder

```
sertikom-mahasiswa-web/
├── config/
│   ├── db.js                 # Database initialization & schema
│   └── passport.js           # Passport authentication config
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── authRoutes.js        # Auth routes (login, register, logout, Google OAuth)
│   ├── adminRoutes.js       # Admin dashboard & management routes
│   └── userRoutes.js        # User dashboard & upload routes
├── public/
│   ├── css/
│   │   └── style.css        # Main stylesheet (modern & responsive)
│   └── js/
│       └── main.js          # Frontend JavaScript
├── views/
│   ├── landing.ejs          # Home page
│   ├── auth/
│   │   ├── login.ejs        # Login page
│   │   └── register.ejs     # Register page
│   ├── user/
│   │   ├── dashboard.ejs    # User dashboard
│   │   └── profile.ejs      # User profile
│   ├── admin/
│   │   ├── dashboard.ejs    # Admin dashboard
│   │   ├── users.ejs        # User management
│   │   ├── documents.ejs    # Document management
│   │   └── logs.ejs         # Activity logs
│   └── 404.ejs              # 404 page
├── uploads/                  # Folder untuk file yang diupload
├── db/                       # Database file
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore file
├── package.json              # Dependencies
├── server.js                 # Main server file
└── README.md                 # Documentation
```

## 🔐 Akses Admin - Penjelasan Lengkap

### 1. Dashboard Admin
**Akses**: `/admin/dashboard`

**Fitur**:
- Statistik lengkap (total user, dokumen, pending, verified)
- Dokumen terbaru (10 dokumen terakhir)
- User terbaru (10 user terakhir)
- Activity logs (log aktivitas admin)

### 2. Manajemen User
**Akses**: `/admin/users`

**Fitur yang bisa dilakukan admin**:
- **Melihat Daftar User**: Lihat semua user yang terdaftar
- **Lihat Detail User**: Klik nama user untuk melihat detail lengkap
- **Ubah Role User**: User → Admin atau Admin → User
- **Ubah Status User**: Pending, Active, atau Banned
- **Hapus User**: Menghapus user dan semua datanya

### 3. Manajemen Dokumen
**Akses**: `/admin/documents`

**Fitur yang bisa dilakukan admin**:
- **Melihat Semua Dokumen**: Daftar dokumen dari semua user
- **Review Dokumen**: Lihat preview dan detail file
- **Verifikasi Dokumen**: Setujui dokumen dengan catatan
- **Tolak Dokumen**: Tolak dokumen dengan alasan penolakan
- **Hapus Dokumen**: Hapus file yang tidak diperlukan

### 4. Activity Logs
**Akses**: `/admin/logs`

**Tracking yang tercatat**:
- User login/logout
- User register account baru
- Upload dokumen
- Verifikasi dokumen
- Penolakan dokumen
- Ubah role user
- Ubah status user

## 🔒 Keamanan

1. **Password Hashing**: Menggunakan bcryptjs
2. **Session Management**: Express-session dengan cookie secure
3. **Role-based Access Control**: Middleware untuk cek role
4. **File Upload Validation**: Limit ukuran dan tipe file tertentu
5. **SQL Injection Protection**: Parameterized queries

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint: 768px untuk tablet/mobile
- Semua fitur accessible dari mobile
- Touch-friendly interface

## 🚀 Deploy

### Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set PORT=3000
git push heroku main
```

### VPS
1. Install Node.js di server
2. Clone repository
3. Setup environment variables
4. Gunakan PM2 untuk process management
5. Setup reverse proxy dengan Nginx

## 🎨 Customization

### Mengubah Tema Warna
Edit file `public/css/style.css` bagian `:root` untuk mengubah warna utama:

```css
:root {
  --primary: #2563eb;          /* Warna utama */
  --primary-dark: #1e40af;     /* Warna utama gelap */
  --success: #22c55e;          /* Warna sukses */
  --danger: #ef4444;           /* Warna danger */
  /* ... */
}
```

### Mengubah Nama Aplikasi
1. Edit `views/landing.ejs` dan ubah "Sertikom" menjadi nama aplikasi Anda
2. Edit `config/db.js` dan ubah nama admin default
3. Edit `server.js` dan ubah console.log

## 📝 Catatan Penting

- Database SQLite akan otomatis dibuat di folder `db/` saat pertama kali aplikasi dijalankan
- File yang diupload akan disimpan di folder `uploads/`
- Admin default akan dibuat otomatis saat database dibuat
- Untuk login Google, pastikan Anda sudah mengonfigurasi Google OAuth
- Session berlaku 8 jam

## 🐛 Troubleshooting

### Port 3000 sudah digunakan
```bash
# Gunakan port lain
PORT=5000 npm run dev
```

### Database error
```bash
# Hapus database dan buat ulang
rm db/sertikom.db
npm run dev
```

### Module not found
```bash
# Install ulang dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

Jika ada pertanyaan atau masalah, silahkan buat issue di GitHub atau hubungi developer.

## 📄 License

MIT License - Bebas digunakan untuk keperluan apapun

## 👨‍💻 Developer

**Sertikom Mahasiswa** dibuat dengan ❤️ menggunakan Node.js dan Express.js

---

**Version**: 1.0.0  
**Last Updated**: Oktober 2026
