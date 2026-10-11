function ensureAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('error_msg', 'Silakan login terlebih dahulu.');
    return res.redirect('/login');
  }
  next();
}

function ensureUser(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('error_msg', 'Silakan login terlebih dahulu.');
    return res.redirect('/login');
  }

  if (req.user.role !== 'user') {
    req.flash('error_msg', 'Anda tidak memiliki akses ke halaman ini.');
    return res.redirect('/admin/dashboard');
  }

  next();
}

function ensureAdmin(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('error_msg', 'Silakan login terlebih dahulu.');
    return res.redirect('/login');
  }

  if (req.user.role !== 'admin') {
    req.flash('error_msg', 'Anda tidak memiliki akses ke halaman ini.');
    return res.redirect('/user/dashboard');
  }

  next();
}

module.exports = { ensureAuth, ensureUser, ensureAdmin };
