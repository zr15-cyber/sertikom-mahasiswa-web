const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { db } = require('../config/db');

const router = express.Router();

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return req.user.role === 'admin'
      ? res.redirect('/admin/dashboard')
      : res.redirect('/user/dashboard');
  }
  res.render('auth/login');
});

router.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    return req.user.role === 'admin'
      ? res.redirect('/admin/dashboard')
      : res.redirect('/user/dashboard');
  }
  res.render('auth/register');
});

router.post('/register', async (req, res) => {
  const { name, email, password, password_confirm } = req.body;

  if (!name || !email || !password || !password_confirm) {
    req.flash('error_msg', 'Semua field wajib diisi.');
    return res.redirect('/register');
  }

  if (password !== password_confirm) {
    req.flash('error_msg', 'Konfirmasi password tidak cocok.');
    return res.redirect('/register');
  }

  if (password.length < 6) {
    req.flash('error_msg', 'Password minimal 6 karakter.');
    return res.redirect('/register');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, 'user', 'pending'],
      (err) => {
        if (err) {
          req.flash('error_msg', 'Email sudah terdaftar atau terjadi kesalahan.');
          return res.redirect('/register');
        }

        req.flash('success_msg', 'Akun berhasil dibuat. Silakan login.');
        res.redirect('/login');
      }
    );
  } catch (error) {
    req.flash('error_msg', 'Terjadi kesalahan saat mendaftar.');
    res.redirect('/register');
  }
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('error_msg', 'Email dan password wajib diisi.');
    return res.redirect('/login');
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error_msg', 'Email tidak ditemukan.');
      return res.redirect('/login');
    }

    if (!user.password) {
      req.flash('error_msg', 'Akun ini dibuat melalui Google. Silakan login dengan Google.');
      return res.redirect('/login');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('error_msg', 'Password salah.');
      return res.redirect('/login');
    }

    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      res.redirect(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    });
  });
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success_msg', 'Anda berhasil logout.');
    res.redirect('/login');
  });
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    res.redirect(req.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
  }
);

module.exports = router;
