// Fake data (frontend only)
const expenses = [
  { date: "2026-02-25", desc: "Salary", category: "Income", amount: 50000 },
  { date: "2026-02-26", desc: "Groceries", category: "Food", amount: -2000 },
  { date: "2026-02-27", desc: "Petrol", category: "Transport", amount: -1500 },
  { date: "2026-02-28", desc: "Freelance", category: "Income", amount: 10000 },
];

let currentFilter = "monthly";

function setFilter(filter) {
  currentFilter = filter;
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById("reportBody");
  tbody.innerHTML = "";

  let totalIncome = 0;
  let totalExpense = 0;

  expenses.forEach(item => {
    const row = `
      <tr>
        <td>${item.date}</td>
        <td>${item.desc}</td>
        <td>${item.category}</td>
        <td>₹ ${item.amount}</td>
      </tr>
    `;
    tbody.innerHTML += row;

    if (item.amount > 0) {
      totalIncome += item.amount;
    } else {
      totalExpense += item.amount;
    }
  });

  document.getElementById("totalIncome").textContent = totalIncome;
  document.getElementById("totalExpense").textContent = totalExpense;
  document.getElementById("netSavings").textContent =
    totalIncome + totalExpense;
}

renderTable();