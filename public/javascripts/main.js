document.addEventListener("DOMContentLoaded", () => {
  const mobileBtn = document.querySelector(".mobile-btn");
  const mobileMenu = document.querySelector("#mobile-menu");
  const dropdownDefaultButton = document.querySelector(
    "#dropdownDefaultButton"
  );
  const dropdown = document.querySelector("#dropdown");

  mobileBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  dropdownDefaultButton.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });
});
