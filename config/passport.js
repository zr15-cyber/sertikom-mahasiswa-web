require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const bodyParser = require('body-parser');

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3000;

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('db')) fs.mkdirSync('db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'sertikom-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

app.use('/', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

// Initialize database
try {
  db.init();
} catch (error) {
  console.log('Database init failed:', error.message);
}

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return req.user.role === 'admin'
      ? res.redirect('/admin/dashboard')
      : res.redirect('/user/dashboard');
  }
  res.render('landing');
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log('========================================');
  console.log('🚀 Sertikom Mahasiswa Server Started');
  console.log(`📍 http://localhost:${PORT}`);
  console.log('========================================');
});
