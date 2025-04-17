let manualLogout = false;

// Manual logout on click
document.getElementById('logoutBtn').addEventListener('click', () => {
  manualLogout = true;
  logoutUser(false);
});

async function logoutUser(auto = false) {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (err) {
    console.error('Logout failed:', err);
  } finally {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    
    if (auto && !manualLogout) {
      alert("You’ve been logged out due to inactivity.");
    }
    window.location.href = '/login.html';
  }
}

// Idle timer settings
const IDLE_LIMIT = 15 * 60 * 1000; // 15 mins
const WARNING_TIME = 1 * 60 * 1000; // Show warning 1 min before

let idleTimer, warningTimer;

// Reset both timers on activity
function resetIdleTimers() {
  clearTimeout(idleTimer);
  clearTimeout(warningTimer);
  hideIdleWarning();

  warningTimer = setTimeout(showIdleWarning, IDLE_LIMIT - WARNING_TIME);
  idleTimer = setTimeout(() => {
    console.warn('Auto-logging out due to inactivity.');
    logoutUser(true); // trigger with popup
  }, IDLE_LIMIT);
}

// Show warning to user
function showIdleWarning() {
  const warning = document.createElement('div');
  warning.id = 'idleWarning';
  warning.style.position = 'fixed';
  warning.style.bottom = '20px';
  warning.style.right = '20px';
  warning.style.padding = '15px 20px';
  warning.style.background = '#ffc107';
  warning.style.color = '#000';
  warning.style.fontWeight = 'bold';
  warning.style.borderRadius = '5px';
  warning.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
  warning.innerText = '⚠️ You’ll be logged out in 1 minute due to inactivity.';
  document.body.appendChild(warning);
}

// Remove warning
function hideIdleWarning() {
  const warning = document.getElementById('idleWarning');
  if (warning) {
    warning.remove();
  }
}

// Monitor user activity
['mousemove', 'keydown', 'scroll', 'click'].forEach(evt =>
  document.addEventListener(evt, resetIdleTimers)
);

// Toggle mobile sidebar
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("mobileMenu");
  const toggle = document.getElementById("hamburgerMenu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.style.display = menu.style.display === "flex" ? "none" : "flex";
    });

    // Hide menu when clicking outside it (mobile)
    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) {
        menu.style.display = "none";
      }
    });
  }

  // Session check
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  if (!token) {
    alert("You’ve been logged out. Please log in again.");
    window.location.href = "/login.html";
  } else {
    document.body.classList.remove("hidden");
  }
});

// Start timers
resetIdleTimers();
