document.addEventListener("DOMContentLoaded", () => {
  // For show and hide passwords and icons based on user input in signup page

  const passwordEyeIcon = document.querySelector(".password-eye-icon");
  const showPassword = document.querySelector(".show-password");
  const passwordInput = document.querySelector("#password");

  const confirmPasswordEyeIcon = document.querySelector(
    ".confirm-password-eye-icon"
  );
  const showConfirmPassword = document.querySelector(".show-confirm-password");
  const confirmPasswordInput = document.querySelector("#confirmPassword");

  passwordEyeIcon.addEventListener("click", () => {
    togglePassword();
  });
  showPassword.addEventListener("click", () => {
    togglePassword();
  });

  confirmPasswordEyeIcon.addEventListener("click", () => {
    toggleConfirmPassword();
  });
  showConfirmPassword.addEventListener("click", () => {
    toggleConfirmPassword();
  });

  function togglePassword() {
    const passwordType = passwordInput.getAttribute("type");

    if (passwordType === "password") {
      passwordInput.setAttribute("type", "text");
      passwordEyeIcon.classList.add("hide");
      showPassword.classList.remove("hide");
    } else {
      passwordInput.setAttribute("type", "password");
      showPassword.classList.add("hide");
      passwordEyeIcon.classList.remove("hide");
    }
  }

  function toggleConfirmPassword() {
    const passwordType = confirmPasswordInput.getAttribute("type");

    if (passwordType === "password") {
      confirmPasswordInput.setAttribute("type", "text");
      confirmPasswordEyeIcon.classList.add("hide");
      showConfirmPassword.classList.remove("hide");
    } else {
      confirmPasswordInput.setAttribute("type", "password");
      showConfirmPassword.classList.add("hide");
      confirmPasswordEyeIcon.classList.remove("hide");
    }
  }
});
