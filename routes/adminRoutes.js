const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../config/db');
const { ensureUser } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${safeName}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Format file tidak didukung.'));
  }
});

router.get('/dashboard', ensureUser, (req, res) => {
  db.all('SELECT * FROM documents WHERE user_id = ? ORDER BY uploaded_at DESC', [req.user.id], (err, docs) => {
    if (err) return res.status(500).send('Error');

    db.all('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10', [req.user.id], (notifErr, notifications) => {
      if (notifErr) return res.status(500).send('Error');

      db.all('SELECT * FROM schedules WHERE user_id = ? ORDER BY date ASC', [req.user.id], (schedErr, schedules) => {
        if (schedErr) return res.status(500).send('Error');

        const stats = {
          totalDocs: docs.length,
          pending: docs.filter((d) => d.status === 'pending').length,
          verified: docs.filter((d) => d.status === 'verified').length,
          rejected: docs.filter((d) => d.status === 'rejected').length
        };

        res.render('user/dashboard', {
          user: req.user,
          docs,
          notifications,
          schedules,
          stats
        });
      });
    });
  });
});

router.post('/upload', ensureUser, upload.single('document'), (req, res) => {
  if (!req.file) {
    req.flash('error_msg', 'Pilih file terlebih dahulu.');
    return res.redirect('/user/dashboard');
  }

  db.run(
    'INSERT INTO documents (user_id, file_name, file_path, file_type, file_size, status) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, req.file.originalname, req.file.path, path.extname(req.file.originalname).toLowerCase(), req.file.size, 'pending'],
    (err) => {
      if (err) {
        req.flash('error_msg', 'Upload gagal.');
        return res.redirect('/user/dashboard');
      }

      db.run(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [req.user.id, 'Upload Dokumen', 'Dokumen Anda berhasil dikirim dan menunggu verifikasi admin.', 'info']
      );

      req.flash('success_msg', 'Dokumen berhasil diupload dan menunggu verifikasi admin.');
      res.redirect('/user/dashboard');
    }
  );
});

router.post('/schedule', ensureUser, (req, res) => {
  const { date, time, title, notes } = req.body;

  if (!date || !time || !title) {
    req.flash('error_msg', 'Tanggal, waktu, dan judul jadwal wajib diisi.');
    return res.redirect('/user/dashboard');
  }

  db.run(
    'INSERT INTO schedules (user_id, date, time, title, notes, status) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, date, time, title, notes || '', 'scheduled'],
    (err) => {
      if (err) {
        req.flash('error_msg', 'Jadwal gagal dibuat.');
        return res.redirect('/user/dashboard');
      }

      req.flash('success_msg', 'Jadwal berhasil dibuat.');
      res.redirect('/user/dashboard');
    }
  );
});

router.get('/profile', ensureUser, (req, res) => {
  res.render('user/profile', { user: req.user });
});

router.post('/profile/update', ensureUser, (req, res) => {
  const { name, nim, phone } = req.body;

  db.run(
    'UPDATE users SET name = ?, nim = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, nim || '', phone || '', req.user.id],
    (err) => {
      if (err) {
        req.flash('error_msg', 'Profil gagal diperbarui.');
        return res.redirect('/user/profile');
      }

      req.flash('success_msg', 'Profil berhasil diperbarui.');
      res.redirect('/user/profile');
    }
  );
});

module.exports = router;
