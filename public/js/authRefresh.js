let refreshInterval;

function refreshAccessToken() {
  fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include', // Send refreshToken cookie
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(data => {
    if (!data.accessToken) {
      console.warn('❌ Token refresh failed. Redirecting to login.');
      window.location.href = '/login.html';
    } else {
      console.log('🔄 Access token refreshed');
      localStorage.setItem('token', data.accessToken);
      sessionStorage.setItem('token', data.accessToken);

      // ✅ After token refresh, load content if function is available
      if (typeof loadAllContent === 'function') {
        const lang = document.getElementById('langSelect')?.value || 'en';
        loadAllContent(lang);
      }
    }
  })
  .catch(err => {
    console.error('Refresh error:', err);
    window.location.href = '/login.html';
  });
}

function startTokenRefreshInterval() {
  refreshInterval = setInterval(refreshAccessToken, 14 * 60 * 1000); // Every 14 minutes
}

document.addEventListener('DOMContentLoaded', () => {
  refreshAccessToken();        // Immediate token refresh on load
  startTokenRefreshInterval(); // Keep session alive
});
