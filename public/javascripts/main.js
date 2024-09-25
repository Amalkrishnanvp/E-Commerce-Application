document.addEventListener("DOMContentLoaded", () => {
  const mobileBtn = document.querySelector(".mobile-btn");
  const mobileMenu = document.querySelector("#mobile-menu");
  const dropdownDefaultButton = document.querySelector(
    "#dropdownDefaultButton"
  );
  const dropdown = document.querySelector("#dropdown");
  const userMenuButton = document.querySelector("#user-menu-button");
  const deleteModal = document.querySelector("#deleteModal");
  const deleteBtn = document.querySelector(".delete-btn");

  mobileBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  dropdownDefaultButton.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });

  userMenuButton.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });

  function doConfirm() {
    alert("hi");
  }
});
