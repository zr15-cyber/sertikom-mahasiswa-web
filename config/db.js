const express = require('express');
const fs = require('fs');
const { db } = require('../config/db');
const { ensureAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', ensureAdmin, (req, res) => {
  db.get('SELECT COUNT(*) AS total FROM users', (errUsers, userCount) => {
    db.get('SELECT COUNT(*) AS total FROM documents', (errDocs, docCount) => {
      db.get("SELECT COUNT(*) AS total FROM documents WHERE status = 'pending'", (errPending, pendingCount) => {
        db.get("SELECT COUNT(*) AS total FROM documents WHERE status = 'verified'", (errVerified, verifiedCount) => {
          db.all('SELECT d.*, u.name AS author_name FROM documents d JOIN users u ON u.id = d.user_id ORDER BY d.uploaded_at DESC LIMIT 10', (errRecentDocs, recentDocs) => {
            db.all('SELECT * FROM users ORDER BY created_at DESC LIMIT 10', (errRecentUsers, recentUsers) => {
              db.all('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 10', (errLogs, logs) => {
                res.render('admin/dashboard', {
                  user: req.user,
                  stats: {
                    totalUsers: userCount.total,
                    totalDocuments: docCount.total,
                    pending: pendingCount.total,
                    verified: verifiedCount.total
                  },
                  recentDocs,
                  recentUsers,
                  logs
                });
              });
            });
          });
        });
      });
    });
  });
});

router.get('/users', ensureAdmin, (req, res) => {
  db.all('SELECT * FROM users ORDER BY created_at DESC', (err, users) => {
    if (err) return res.status(500).send('Error');
    res.render('admin/users', { user: req.user, users });
  });
});

router.post('/user/:id/status', ensureAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['pending', 'active', 'banned'];

  if (!validStatuses.includes(status)) {
    return res.json({ success: false, message: 'Status tidak valid.' });
  }

  db.run('UPDATE users SET status = ? WHERE id = ?', [status, id], (err) => {
    if (err) {
      return res.json({ success: false, message: 'Gagal mengubah status.' });
    }

    db.run(
      'INSERT INTO activity_logs (admin_id, action, target_id, target_type, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'user_status_update', id, 'user', `Status user diubah menjadi ${status}`]
    );

    return res.json({ success: true });
  });
});

router.post('/user/:id/role', ensureAdmin, (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const validRoles = ['user', 'admin'];

  if (!validRoles.includes(role)) {
    return res.json({ success: false, message: 'Role tidak valid.' });
  }

  db.run('UPDATE users SET role = ? WHERE id = ?', [role, id], (err) => {
    if (err) {
      return res.json({ success: false, message: 'Gagal mengubah role.' });
    }

    db.run(
      'INSERT INTO activity_logs (admin_id, action, target_id, target_type, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'user_role_update', id, 'user', `Role user diubah menjadi ${role}`]
    );

    return res.json({ success: true });
  });
});

router.get('/documents', ensureAdmin, (req, res) => {
  db.all(
    'SELECT d.*, u.name, u.email FROM documents d JOIN users u ON u.id = d.user_id ORDER BY d.uploaded_at DESC',
    (err, docs) => {
      if (err) return res.status(500).send('Error');
      res.render('admin/documents', { user: req.user, docs });
    }
  );
});

router.get('/logs', ensureAdmin, (req, res) => {
  db.all('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 50', (err, logs) => {
    if (err) return res.status(500).send('Error');
    res.render('admin/logs', { user: req.user, logs });
  });
});

router.post('/document/:id/verify', ensureAdmin, (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  db.get('SELECT * FROM documents WHERE id = ?', [id], (err, doc) => {
    if (!doc) {
      return res.json({ success: false, message: 'Dokumen tidak ditemukan.' });
    }

    db.run(
      'UPDATE documents SET status = ?, verification_notes = ?, verified_by = ?, verified_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['verified', notes || '', req.user.id, id],
      (updateErr) => {
        if (updateErr) {
          return res.json({ success: false, message: 'Gagal verifikasi dokumen.' });
        }

        db.run(
          'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
          [doc.user_id, 'Dokumen Diverifikasi', 'Dokumen Anda telah berhasil diverifikasi.', 'success']
        );

        db.run(
          'INSERT INTO activity_logs (admin_id, action, target_id, target_type, details) VALUES (?, ?, ?, ?, ?)',
          [req.user.id, 'document_verified', id, 'document', `Dokumen ${id} diverifikasi`]
        );

        return res.json({ success: true });
      }
    );
  });
});

router.post('/document/:id/reject', ensureAdmin, (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  if (!notes || !notes.trim()) {
    return res.json({ success: false, message: 'Alasan penolakan wajib diisi.' });
  }

  db.get('SELECT * FROM documents WHERE id = ?', [id], (err, doc) => {
    if (!doc) {
      return res.json({ success: false, message: 'Dokumen tidak ditemukan.' });
    }

    db.run(
      'UPDATE documents SET status = ?, verification_notes = ?, verified_by = ?, verified_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['rejected', notes, req.user.id, id],
      (updateErr) => {
        if (updateErr) {
          return res.json({ success: false, message: 'Gagal menolak dokumen.' });
        }

        db.run(
          'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
          [doc.user_id, 'Dokumen Ditolak', `Dokumen Anda ditolak. Alasan: ${notes}`, 'danger']
        );

        db.run(
          'INSERT INTO activity_logs (admin_id, action, target_id, target_type, details) VALUES (?, ?, ?, ?, ?)',
          [req.user.id, 'document_rejected', id, 'document', `Dokumen ${id} ditolak`]
        );

        return res.json({ success: true });
      }
    );
  });
});

module.exports = router;
