let currentPage = 1;

let pageSize = localStorage.getItem("pageSize")
    ? parseInt(localStorage.getItem("pageSize"))
    : 10;

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");
    const form = document.getElementById("expenseForm");
    const list = document.getElementById("expenseList");

    // ==========================
    // 🔐 CHECK TOKEN (Dashboard Only)
    // ==========================
    if (form && !token) {
        window.location.href = "/login.html";
        return;
    }

    const pageSizeSelect = document.getElementById("pageSizeSelect");

    if (pageSizeSelect) {
        pageSizeSelect.value = pageSize;

        pageSizeSelect.addEventListener("change", () => {
            pageSize = parseInt(pageSizeSelect.value);
            localStorage.setItem("pageSize", pageSize);
            currentPage = 1;
            loadExpenses(currentPage);
        });
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
                    "/password/forgotpassword",
                    { email }
                );

                alert(response.data.message);

            } catch (err) {
                console.log("Forgot password error:", err);
                alert("If the email is registered, a reset link has been sent.");
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
                        "Authorization": `Bearer ${token}`
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
                loadExpenses(1);

            } catch (error) {
                console.log("Add expense error:", error);
                alert(error.message);
            }
        });
    }

    // ==========================
    // LOAD EXPENSES (PAGINATION)
    // ==========================
    async function loadExpenses(page = 1) {
        try {
            currentPage = page;

            const response = await fetch(`/expense/get-expenses?page=${page}&limit=${pageSize}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            const data = await response.json();

            if (page > data.totalPages && data.totalPages > 0) {
                currentPage = data.totalPages;
                loadExpenses(currentPage);
                return;
            }

            list.innerHTML = "";

            data.expenses.forEach(exp => {
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

            createPagination(data.totalPages, data.currentPage);

        } catch (error) {
            console.log("Error fetching expenses:", error);
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
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            loadExpenses(currentPage);

        } catch (error) {
            console.log("Delete error:", error);
        }
    };

    // ==========================
    // PAGINATION UI
    // ==========================
    function createPagination(totalPages, currentPage) {
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = "";

        if (currentPage > 1) {
            const prev = document.createElement("button");
            prev.innerText = "Previous";
            prev.classList.add("page-btn");
            prev.onclick = () => loadExpenses(currentPage - 1);
            pagination.appendChild(prev);
        }

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.innerText = i;
            btn.classList.add("page-btn");

            if (i === currentPage) {
                btn.classList.add("active-page");
            }

            btn.onclick = () => loadExpenses(i);
            pagination.appendChild(btn);
        }

        if (currentPage < totalPages) {
            const next = document.createElement("button");
            next.innerText = "Next";
            next.classList.add("page-btn");
            next.onclick = () => loadExpenses(currentPage + 1);
            pagination.appendChild(next);
        }
    }

    // ==========================
    // HANDLE SESSION EXPIRE
    // ==========================
    function handleUnauthorized() {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login.html";
    }

    if (form) {
        loadExpenses(1);
    }

});