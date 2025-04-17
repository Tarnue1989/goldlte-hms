// /js/session.js

document.addEventListener("DOMContentLoaded", () => {
    // ✅ Enforce token on all pages
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login.html";
      return;
    }
  
    // ✅ Logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        window.location.href = "/login.html";
      });
    }
  
    // ⏳ Idle logout after 15 mins
    let idleTimer;
    function resetIdleTimer() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        alert("You've been logged out due to inactivity. Please log in again.");
        window.location.href = "/login.html";
      }, 15 * 60 * 1000);
    }
  
    ["mousemove", "keydown", "click", "touchstart"].forEach(evt =>
      document.addEventListener(evt, resetIdleTimer)
    );
  
    resetIdleTimer();
  });
  