document.addEventListener("DOMContentLoaded", () => {
  const dropdownMenu = document.querySelector(".dropdown-menu");
  const dropBtn = document.querySelector(".drop-btn");
  const mobileBtn = document.querySelector(".mobile-btn");
  const mobileMenu = document.querySelector("#mobile-menu");

  dropBtn.addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden");
  });

  mobileBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
});
