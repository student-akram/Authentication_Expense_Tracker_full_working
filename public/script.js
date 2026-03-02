let currentPage = 1;

let pageSize = localStorage.getItem("pageSize")
    ? parseInt(localStorage.getItem("pageSize"))
    : 10;

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");
    const form = document.getElementById("expenseForm");
    const list = document.getElementById("expenseList");

    // ================= STATUS MESSAGE AFTER PAYMENT =================
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (status === "success") {
        alert("🎉 Payment Successful! You are now Premium.");
        window.history.replaceState({}, document.title, "/index.html");
    }

    if (status === "failed") {
        alert("❌ Payment Failed.");
        window.history.replaceState({}, document.title, "/index.html");
    }

    // 🔐 CHECK TOKEN
    if (form && !token) {
        window.location.href = "/login.html";
        return;
    }

    // ================= DOWNLOAD BUTTON =================
    const downloadBtn = document.getElementById("downloadBtn");

    if (downloadBtn) {
        downloadBtn.addEventListener("click", async () => {
            try {
                const response = await fetch("/premium/download", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message);
                    return;
                }

                window.location.href = data.fileURL;

            } catch (err) {
                console.error("Download error:", err);
            }
        });
    }

    // ================= BUY PREMIUM =================
    const buyPremiumBtn = document.getElementById("buyPremiumBtn");

    if (buyPremiumBtn) {
        buyPremiumBtn.addEventListener("click", async () => {
            try {
                const response = await fetch("/payment/create-order", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || "Unable to create order");
                    return;
                }

                if (!data.payment_session_id) {
                    alert("Invalid payment session");
                    return;
                }

                const cashfree = Cashfree({
                    mode: "sandbox"
                });

                cashfree.checkout({
                    paymentSessionId: data.payment_session_id,
                    redirectTarget: "_self"
                });

            } catch (err) {
                console.error("Payment error:", err);
                alert("Payment initialization failed");
            }
        });
    }

    // ================= LOGOUT =================
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.href = "/login.html";
        });
    }

    // ================= ADD EXPENSE =================
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const amount = document.getElementById("amount").value;
            const description = document.getElementById("description").value;
            const category = document.getElementById("category").value;

            try {
                const response = await fetch("/expense/add-expense", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ amount, description, category })
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message);
                }

                form.reset();
                loadExpenses(1);

            } catch (error) {
                alert(error.message);
            }
        });
    }

    // ================= LOAD EXPENSES =================
    async function loadExpenses(page = 1) {
        try {
            currentPage = page;

            const response = await fetch(`/expense/get-expenses?page=${page}&limit=${pageSize}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            list.innerHTML = "";

            data.expenses.forEach(exp => {

                const li = document.createElement("li");
                li.className = "expense-item";

                li.innerHTML = `
                    <div>
                        <strong>₹${exp.amount}</strong> - ${exp.description}
                        <br>
                        <small>${exp.category || ""}</small>
                    </div>
                    <button class="delete-btn" onclick="deleteExpense(${exp.id})">Delete</button>
                `;

                list.appendChild(li);
            });

            createPagination(data.totalPages, data.currentPage);

        } catch (error) {
            console.log("Error fetching expenses:", error);
        }
    }

    // ================= DELETE =================
    window.deleteExpense = async function (id) {
        try {
            await fetch(`/expense/delete-expense/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            loadExpenses(currentPage);

        } catch (error) {
            console.log("Delete error:", error);
        }
    };

    // ================= PAGINATION =================
    function createPagination(totalPages, currentPage) {
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.innerText = i;

            if (i === currentPage) {
                btn.classList.add("active");
            }

            btn.onclick = () => loadExpenses(i);
            pagination.appendChild(btn);
        }
    }

    if (form) {
        loadExpenses(1);
    }

});