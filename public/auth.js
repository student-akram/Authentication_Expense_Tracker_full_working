document.addEventListener("DOMContentLoaded", () => {

    console.log("Auth JS Loaded");

    // ================= SIGNUP =================
    const signupForm = document.getElementById('signupForm');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            console.log("Submitting...");

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
                console.log(data);

                alert("Signup Successful!");
                window.location.href = "index.html";

            } catch (err) {
                console.log("Signup Error:", err);
            }
        });
    }

    // ================= LOGIN =================
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
});