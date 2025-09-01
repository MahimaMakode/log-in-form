 // Get forms
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    function showRegister() {
      loginForm.classList.remove("active");
      registerForm.classList.add("active");
    }

    function showLogin() {
      registerForm.classList.remove("active");
      loginForm.classList.add("active");
    }
