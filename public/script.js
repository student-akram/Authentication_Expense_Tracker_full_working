document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById('expenseForm');
    const list = document.getElementById('expenseList');
    const logoutBtn = document.getElementById('logoutBtn');

    // 🔐 Check if user is logged in
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    // ==========================
    // LOGOUT
    // ==========================
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');  // remove JWT
            window.location.replace("/login.html");  // prevent back navigation
        });
    }

    // ==========================
    // ADD EXPENSE
    // ==========================
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;

    try {
        const response = await fetch('/expense/add-expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                amount,
                description,
                aiProvider: "gemini"   // 🔥 AI enabled
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || "Error adding expense");
        }

        form.reset();
        loadExpenses();

    } catch (error) {
        console.log("Error adding expense:", error);
        alert(error.message);
    }
});
    // ==========================
    // LOAD EXPENSES
    // ==========================
    async function loadExpenses() {
        try {
            const response = await fetch('/expense/get-expenses', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch expenses");
            }

            const data = await response.json();
            list.innerHTML = "";

            data.forEach(exp => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div>
                        <strong>₹${exp.amount}</strong> - ${exp.description}
                        <br>
                        <small>${exp.category}</small>
                    </div>
                    <button onclick="deleteExpense(${exp.id})">Delete</button>
                `;
                list.appendChild(li);
            });

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
                method: 'DELETE',
                headers: {
                     'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete expense");
            }

            loadExpenses();

        } catch (error) {
            console.log("Error deleting expense:", error);
        }
    };

    // 🚀 Load expenses on page load
    loadExpenses();
});