document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburgerMenu");
  const mobileMenu = document.getElementById("mobileMenu");

  let menuOpen = false;

  if (hamburger && mobileMenu) {
    // Toggle menu on hamburger click
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      menuOpen = !menuOpen;
      mobileMenu.style.display = menuOpen ? "flex" : "none";
    });

    // Prevent menu from closing when clicking inside it
    mobileMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Close menu on outside click
    document.addEventListener("click", () => {
      if (menuOpen) {
        mobileMenu.style.display = "none";
        menuOpen = false;
      }
    });

    // ✅ Auto-close mobile menu when resizing to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        mobileMenu.style.display = "none";
        menuOpen = false;
      }
    });
  }
});
