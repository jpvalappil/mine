function toggleTheme() {
  const html = document.documentElement;
  html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

document.getElementById('btn-toggle-theme-nav').addEventListener('click', toggleTheme);
document.getElementById('btn-toggle-theme-card').addEventListener('click', toggleTheme);
document.getElementById('btn-toast-default').addEventListener('click', () => mine.toast('File saved successfully.'));
document.getElementById('btn-toast-success').addEventListener('click', () => mine.toast('Profile updated!', { type: 'success' }));
document.getElementById('btn-toast-error').addEventListener('click', () => mine.toast('Failed to connect.', { type: 'error', duration: 6000 }));
document.getElementById('btn-toast-action').addEventListener('click', () => {
  mine.toast('Message deleted.', { type: 'warning', action: { label: 'Undo', fn: () => mine.toast('Message restored.', { type: 'success' }) } });
});
document.getElementById('btn-toast-persistent').addEventListener('click', () => mine.toast('Upload in progress…', { duration: 0 }));
