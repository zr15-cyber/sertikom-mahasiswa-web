const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { db } = require('./db');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      const name = profile.displayName || 'Google User';

      if (!email) {
        return done(new Error('Email not found in Google profile'));
      }

      db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return done(err);
        if (user) return done(null, user);

        db.run(
          'INSERT INTO users (name, email, google_id, role, status) VALUES (?, ?, ?, ?, ?)',
          [name, email, profile.id, 'user', 'pending'],
          function (insertErr) {
            if (insertErr) return done(insertErr);
            db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (findErr, newUser) => {
              if (findErr) return done(findErr);
              done(null, newUser);
            });
          }
        );
      });
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
    if (err) return done(err);
    done(null, user);
  });
});
