document.addEventListener("DOMContentLoaded", () => {
  const loginPasswordEyeIcon = document.querySelector(
    ".login-password-eye-icon"
  );
  const loginShowPassword = document.querySelector(".login-show-password");
  const loginPasswordInput = document.querySelector(".login-password");

  loginPasswordEyeIcon.addEventListener("click", () => {
    toggleLoginPassword();
  });

  loginShowPassword.addEventListener("click", () => {
    toggleLoginPassword();
  });

  function toggleLoginPassword() {
    const passwordType = loginPasswordInput.getAttribute("type");

    if (passwordType === "password") {
      loginPasswordInput.setAttribute("type", "text");
      loginPasswordEyeIcon.classList.add("hide");
      loginShowPassword.classList.remove("hide");
    } else {
      loginPasswordInput.setAttribute("type", "password");
      loginShowPassword.classList.add("hide");
      loginPasswordEyeIcon.classList.remove("hide");
    }
  }
});
