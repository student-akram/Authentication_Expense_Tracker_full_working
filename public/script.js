document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // 🔐 CHECK TOKEN (ONLY FOR DASHBOARD)
    // ==========================
    const token = localStorage.getItem("token");

    const isDashboard = document.getElementById("expenseForm");

    if (isDashboard && !token) {
        window.location.href = "/login.html";
        return;
    }

    // ==========================
    // FORGOT PASSWORD
    // ==========================
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
            } catch (err) {
                console.log("Forgot password error:", err);
                alert("Something went wrong");
            }
        });
    }

    // ==========================
    // LOGOUT
    // ==========================
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "/login.html";
        });
    }

    // ==========================
    // ADD EXPENSE
    // ==========================
    const form = document.getElementById("expenseForm");
    const list = document.getElementById("expenseList");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const amount = document.getElementById("amount").value;
            const description = document.getElementById("description").value;

            try {
                const response = await fetch("/expense/add-expense", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ amount, description })
                });

                if (response.status === 401) {
                    handleUnauthorized();
                    return;
                }

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message);
                }

                form.reset();
                loadExpenses();

            } catch (error) {
                console.log("Add expense error:", error);
                alert(error.message);
            }
        });
    }

    // ==========================
    // LOAD EXPENSES
    // ==========================
    async function loadExpenses() {
        try {
            const response = await fetch("/expense/get-expenses", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to fetch expenses");
            }

            const data = await response.json();
            list.innerHTML = "";

            data.forEach(exp => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <div>
                        <strong>₹${exp.amount}</strong> - ${exp.description}
                        <br>
                        <small>${exp.category || ""}</small>
                    </div>
                    <button onclick="deleteExpense(${exp.id})">Delete</button>
                `;
                list.appendChild(li);
            });

        } catch (error) {
            console.log("Fetch expense error:", error);
        }
    }

    // ==========================
    // DELETE EXPENSE
    // ==========================
    window.deleteExpense = async function (id) {
        try {
            const response = await fetch(`/expense/delete-expense/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            loadExpenses();

        } catch (error) {
            console.log("Delete error:", error);
        }
    };

    function handleUnauthorized() {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login.html";
    }

    if (form) {
        loadExpenses();
    }

});