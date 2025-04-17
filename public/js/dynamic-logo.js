document.addEventListener("DOMContentLoaded", () => {
    const logoImg = document.querySelector("img[alt='Logo']");
    if (!logoImg) return;
  
    fetch("/api/settings")
      .then(res => res.ok ? res.json() : Promise.reject("Settings fetch failed"))
      .then(data => {
        if (data.logo_path) {
          const filename = data.logo_path.split('\\').pop().split('/').pop();
          logoImg.src = `/assets/logos/${filename}`;
        }
      })
      .catch(() => {
        logoImg.src = "/assets/logos/logo.png"; // fallback
      });
  });
  