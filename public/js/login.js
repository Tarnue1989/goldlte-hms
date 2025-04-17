document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const resetForm = document.getElementById("resetPasswordForm");
  const passwordResetFields = document.getElementById("passwordResetFields");
  const errorMsg = document.getElementById("errorMsg");
  const passwordInput = document.getElementById("password");
  const logoImage = document.getElementById("dynamicLogo");
  const faviconTag = document.getElementById("faviconTag");
  const apiBase = window.location.origin;

  // 🖼️ Load dynamic logo & favicon from /api/settings
  if (logoImage || faviconTag) {
    fetch(`${apiBase}/api/settings`)
      .then(res => res.json())
      .then(data => {
        const path = data.logo_path ? data.logo_path.split('\\').pop() : 'logo.png';
        if (logoImage) logoImage.src = `/assets/logos/${path}`;
        if (faviconTag) faviconTag.href = `/assets/logos/${path}`;
      })
      .catch(() => {
        if (logoImage) logoImage.src = '/assets/misc/default-logo.png';
        if (faviconTag) faviconTag.href = '/assets/misc/default-logo.png';
      });
  }

  // 🔐 Handle login
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.style.display = "none";

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value.trim();
    const remember = document.getElementById("rememberMe").checked;

    try {
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.forceReset && data.userId) {
          sessionStorage.setItem("pendingUserId", data.userId);
          sessionStorage.setItem("tempToken", data.tempToken || "");

          loginForm.style.display = "none";
          resetForm.style.display = "block";
          passwordResetFields.style.display = "block";

          errorMsg.textContent = data.message || "Password reset required.";
          errorMsg.style.display = "block";
          return;
        }

        errorMsg.textContent = data.message || "Invalid credentials.";
        errorMsg.style.display = "block";
        return;
      }

      const { accessToken, user } = data;
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("accessToken", accessToken);

      loginForm.reset();

      if (user.role === "Admin") {
        window.location.href = "/admin/dashboard.html";
      } else if (user.department_id) {
        window.location.href = `/department/${user.department_id}.html`;
      } else {
        window.location.href = "/dashboard.html";
      }
    } catch (err) {
      console.error("Login Error:", err);
      errorMsg.textContent = "Login failed. Please try again.";
      errorMsg.style.display = "block";
    }
  });

  // 🔁 Handle forced password reset
  resetForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.style.display = "none";

    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const userId = sessionStorage.getItem("pendingUserId");
    const tempToken = sessionStorage.getItem("tempToken");

    if (!newPassword || !confirmPassword) {
      errorMsg.textContent = "Please fill in both password fields.";
      errorMsg.style.display = "block";
      return;
    }

    if (newPassword !== confirmPassword) {
      errorMsg.textContent = "Passwords do not match.";
      errorMsg.style.display = "block";
      return;
    }

    if (!userId || !tempToken) {
      errorMsg.textContent = "❌ Missing session data. Please try logging in again.";
      errorMsg.style.display = "block";
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tempToken}`,
        },
        body: JSON.stringify({ userId, newPassword }),
      });

      let result = {};
      try {
        result = await res.json();
      } catch (e) {
        console.warn("Failed to parse JSON response", e);
      }

      if (!res.ok) {
        errorMsg.textContent = result.message || "Password reset failed.";
        errorMsg.style.display = "block";
        return;
      }

      alert("✅ Password updated. Please log in.");
      sessionStorage.clear();
      window.location.href = "/login.html";
    } catch (err) {
      console.error("Password Reset Error:", err);
      errorMsg.textContent = "Error resetting password.";
      errorMsg.style.display = "block";
    }
  });
});
