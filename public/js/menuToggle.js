
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById('hamburgerMenu');
  const menu = document.getElementById('mobileMenu');
  if (hamburger && menu) {
    hamburger.addEventListener("click", () => {
      menu.classList.toggle("visible");
    });
  }
});
