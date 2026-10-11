// Toast Notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span>${message}</span>
      <button class="toast-close">&times;</button>
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// User Role and Status Updates
document.addEventListener('DOMContentLoaded', () => {
  const roleSelects = document.querySelectorAll('select[data-type="role"]');
  const statusSelects = document.querySelectorAll('select[data-type="status"]');
  const docActionButtons = document.querySelectorAll('[data-action]');

  // Handle role change
  roleSelects.forEach((select) => {
    select.addEventListener('change', async function () {
      const userId = this.dataset.userId;
      const newRole = this.value;
      const oldRole = this.dataset.oldValue;

      if (newRole === oldRole) return;

      try {
        const response = await fetch(`/admin/user/${userId}/role`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole })
        });

        const data = await response.json();
        if (data.success) {
          this.dataset.oldValue = newRole;
          showToast(`Role berhasil diubah menjadi ${newRole}`, 'success');
        } else {
          this.value = oldRole;
          showToast(data.message || 'Gagal mengubah role', 'error');
        }
      } catch (error) {
        this.value = oldRole;
        showToast('Terjadi kesalahan', 'error');
      }
    });
    select.dataset.oldValue = select.value;
  });

  // Handle status change
  statusSelects.forEach((select) => {
    select.addEventListener('change', async function () {
      const userId = this.dataset.userId;
      const newStatus = this.value;
      const oldStatus = this.dataset.oldValue;

      if (newStatus === oldStatus) return;

      try {
        const response = await fetch(`/admin/user/${userId}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();
        if (data.success) {
          this.dataset.oldValue = newStatus;
          showToast(`Status berhasil diubah menjadi ${newStatus}`, 'success');
        } else {
          this.value = oldStatus;
          showToast(data.message || 'Gagal mengubah status', 'error');
        }
      } catch (error) {
        this.value = oldStatus;
        showToast('Terjadi kesalahan', 'error');
      }
    });
    select.dataset.oldValue = select.value;
  });

  // Handle document verification and rejection
  docActionButtons.forEach((button) => {
    button.addEventListener('click', async function (e) {
      e.preventDefault();
      const docId = this.dataset.id;
      const action = this.dataset.action;

      let notes = '';
      if (action === 'reject') {
        notes = prompt('Masukkan alasan penolakan dokumen:');
        if (!notes) return;
      } else if (action === 'verify') {
        notes = prompt('Tambahkan catatan (opsional):', '') || '';
      }

      try {
        const response = await fetch(`/admin/document/${docId}/${action}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes })
        });

        const data = await response.json();
        if (data.success) {
          showToast(
            action === 'verify' ? 'Dokumen berhasil diverifikasi' : 'Dokumen berhasil ditolak',
            'success'
          );
          setTimeout(() => location.reload(), 500);
        } else {
          showToast(data.message || 'Gagal memproses dokumen', 'error');
        }
      } catch (error) {
        showToast('Terjadi kesalahan', 'error');
      }
    });
  });
});

// CSS untuk Toast
const toastStyles = `
  .toast {
    position: fixed;
    bottom: -100px;
    right: 20px;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transition: bottom 0.3s ease;
    z-index: 10000;
    max-width: 400px;
  }

  .toast.show {
    bottom: 20px;
  }

  .toast-success {
    border-left: 4px solid #22c55e;
  }

  .toast-error {
    border-left: 4px solid #ef4444;
  }

  .toast-warning {
    border-left: 4px solid #f59e0b;
  }

  .toast-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .toast-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6b7280;
    padding: 0;
    line-height: 1;
  }
`;

const style = document.createElement('style');
style.textContent = toastStyles;
document.head.appendChild(style);
