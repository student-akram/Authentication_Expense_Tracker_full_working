document.addEventListener("DOMContentLoaded", () => {

    console.log("Auth JS Loaded");

    // ================= SIGNUP =================
    const signupForm = document.getElementById('signupForm');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/user/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();
                alert("Signup Successful!");
                window.location.href = "login.html";

            } catch (err) {
                console.log("Signup Error:", err);
            }
        });
    }

    // ================= LOGIN =================
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const res = await fetch('/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/index.html';
            } else {
                alert(data.message);
            }
        });
    }

    // ================= FORGOT PASSWORD =================
    const forgotForm = document.getElementById("forgot-form");

    if (forgotForm) {
        forgotForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;

            try {
                const response = await axios.post(
    "http://localhost:3100/password/forgotpassword",
    { email }
);

                alert(response.data.message);

            } catch (error) {
                console.log("Forgot password error:", error);
                messageDiv.textContent = "If the email is registered, a reset link has been sent.";
messageDiv.className = "message success";
            }
        });
    }

});