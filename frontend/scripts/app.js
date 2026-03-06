const API = '/api';
const tokenKey = 'finance_token';
const themeToggle = document.getElementById('themeToggle');
const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const categorySelect = document.getElementById('categorySelect');
const transactionsList = document.getElementById('transactionsList');
const goalsList = document.getElementById('goalsList');
let categoryChart;
let monthlyChart;
let editingId = null;

const request = async (url, options = {}) => {
  const token = localStorage.getItem(tokenKey);
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API}${url}`, { ...options, headers });
  if (response.status === 204) return null;
  return response.json();
};

const currency = (value) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const serializeForm = (form) => Object.fromEntries(new FormData(form).entries());

document.getElementById('registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = serializeForm(event.target);
  const data = await request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  if (data.token) {
    localStorage.setItem(tokenKey, data.token);
    loadApp();
  }
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = serializeForm(event.target);
  const data = await request('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
  if (data.token) {
    localStorage.setItem(tokenKey, data.token);
    loadApp();
  }
});

document.getElementById('forgotForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = serializeForm(event.target);
  const data = await request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(payload) });
  alert(data.message + (data.resetToken ? ` Token: ${data.resetToken}` : ''));
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem(tokenKey);
  appSection.classList.add('hidden');
  authSection.classList.remove('hidden');
});

document.getElementById('categoryForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = serializeForm(event.target);
  await request('/categories', { method: 'POST', body: JSON.stringify(payload) });
  event.target.reset();
  await loadCategories();
});

document.getElementById('transactionForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = serializeForm(event.target);
  payload.amount = Number(payload.amount);

  if (editingId) {
    await request(`/transactions/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
    editingId = null;
  } else {
    await request('/transactions', { method: 'POST', body: JSON.stringify(payload) });
  }

  event.target.reset();
  await Promise.all([loadTransactions(), loadDashboard()]);
});

document.getElementById('goalForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = serializeForm(event.target);
  payload.targetAmount = Number(payload.targetAmount);
  await request('/goals', { method: 'POST', body: JSON.stringify(payload) });
  event.target.reset();
  await loadGoals();
});

document.getElementById('csvBtn').addEventListener('click', async () => {
  const list = await request('/transactions');
  const rows = ['data,tipo,descrição,categoria,valor'];
  list.forEach((item) => rows.push(`${item.transaction_date},${item.type},${item.description},${item.category_name},${item.amount}`));
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'relatorio_financeiro.csv';
  link.click();
});

document.getElementById('pdfBtn').addEventListener('click', async () => {
  const list = await request('/transactions');
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`<h1>Relatório Financeiro</h1>${list.map((x) => `<p>${x.transaction_date} - ${x.description} - ${x.type} - R$ ${x.amount}</p>`).join('')}`);
  printWindow.print();
});

const loadCategories = async () => {
  const categories = await request('/categories');
  categorySelect.innerHTML = categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');
};

const loadTransactions = async () => {
  const transactions = await request('/transactions');
  transactionsList.innerHTML = transactions
    .map(
      (t) => `<div class="transaction-item">
      <strong>${t.description}</strong>
      <span>${t.category_name || 'Sem categoria'} - ${currency(t.amount)} - ${t.type}</span>
      <small>${t.transaction_date}</small>
      <div>
        <button class="small-btn" onclick='editTransaction(${JSON.stringify(t)})'>Editar</button>
        <button class="small-btn" onclick='deleteTransaction(${t.id})'>Excluir</button>
      </div>
    </div>`,
    )
    .join('');
};

window.editTransaction = (transaction) => {
  editingId = transaction.id;
  const form = document.getElementById('transactionForm');
  form.type.value = transaction.type;
  form.amount.value = Number(transaction.amount);
  form.description.value = transaction.description;
  form.categoryId.value = transaction.category_id;
  form.transactionDate.value = transaction.transaction_date;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteTransaction = async (id) => {
  await request(`/transactions/${id}`, { method: 'DELETE' });
  await Promise.all([loadTransactions(), loadDashboard()]);
};

const loadGoals = async () => {
  const goals = await request('/goals');
  goalsList.innerHTML = goals
    .map(
      (g) => `<div class="goal-item">
      <strong>${g.name}</strong>
      <small>${currency(g.current_amount)} / ${currency(g.target_amount)} (Prazo: ${g.deadline})</small>
      <div class="progress"><div style="width:${Math.min(g.progress * 100, 100)}%"></div></div>
      <button class="small-btn" onclick="addContribution(${g.id})">Adicionar aporte R$ 100</button>
    </div>`,
    )
    .join('');
};

window.addContribution = async (goalId) => {
  await request(`/goals/${goalId}/contribute`, { method: 'POST', body: JSON.stringify({ amount: 100 }) });
  await loadGoals();
};

const loadDashboard = async () => {
  const dashboard = await request('/transactions/dashboard/summary');
  document.getElementById('totalBalance').textContent = currency(dashboard.totalBalance);
  document.getElementById('monthlyIncome').textContent = currency(dashboard.monthlyIncome);
  document.getElementById('monthlyExpense').textContent = currency(dashboard.monthlyExpense);

  const categoryCtx = document.getElementById('categoryChart');
  const monthlyCtx = document.getElementById('monthlyChart');

  if (categoryChart) categoryChart.destroy();
  if (monthlyChart) monthlyChart.destroy();

  categoryChart = new Chart(categoryCtx, {
    type: 'doughnut',
    data: {
      labels: dashboard.categoryChart.map((x) => x.category || 'Sem categoria'),
      datasets: [{ data: dashboard.categoryChart.map((x) => x.total) }],
    },
  });

  monthlyChart = new Chart(monthlyCtx, {
    type: 'line',
    data: {
      labels: dashboard.monthlyChart.map((x) => x.month),
      datasets: [
        { label: 'Receita', data: dashboard.monthlyChart.map((x) => x.income), borderColor: '#10b981' },
        { label: 'Despesa', data: dashboard.monthlyChart.map((x) => x.expense), borderColor: '#ef4444' },
      ],
    },
  });
};

const loadApp = async () => {
  authSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  await loadCategories();
  await loadTransactions();
  await loadGoals();
  await loadDashboard();
};

themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

if (localStorage.getItem(tokenKey)) {
  loadApp();
}
