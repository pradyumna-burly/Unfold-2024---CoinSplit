const balances = {};
const groupMembers = JSON.parse(localStorage.getItem('groupMembers')) || [];

// Populate dropdowns
const payerSelect = document.getElementById('payer');
const participantsSelect = document.getElementById('participants');

groupMembers.forEach(member => {
    const option = document.createElement('option');
    option.value = member.name;
    option.textContent = member.name;
    payerSelect.appendChild(option);

    const multiOption = document.createElement('option');
    multiOption.value = member.name;
    multiOption.textContent = member.name;
    participantsSelect.appendChild(multiOption);
});

// Add expense
document.getElementById('expense-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const payer = payerSelect.value;
    const amount = parseFloat(document.getElementById('amount').value);
    const participants = Array.from(participantsSelect.selectedOptions).map(opt => opt.value);

    if (!payer || isNaN(amount) || participants.length === 0) {
        alert('Please fill in all fields correctly!');
        return;
    }

    if (!participants.includes(payer)) participants.push(payer);

    const share = amount / participants.length;

    participants.forEach(person => {
        if (!balances[person]) balances[person] = 0;
        balances[person] -= share;
    });

    if (!balances[payer]) balances[payer] = 0;
    balances[payer] += amount;

    updateBalancesTable();
    calculateSettlements();
});

function updateBalancesTable() {
    const tableBody = document.getElementById('balances-table');
    tableBody.innerHTML = '';
    Object.entries(balances).forEach(([person, balance]) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${person}</td><td>${balance.toFixed(2)}</td>`;
        tableBody.appendChild(row);
    });
}

function calculateSettlements() {
    const tableBody = document.getElementById('settlement-table');
    tableBody.innerHTML = '';

    const creditors = [];
    const debtors = [];

    Object.entries(balances).forEach(([person, balance]) => {
        if (balance > 0) creditors.push({ person, balance });
        else if (balance < 0) debtors.push({ person, balance: -balance });
    });

    while (creditors.length && debtors.length) {
        const creditor = creditors.pop();
        const debtor = debtors.pop();
        const amount = Math.min(creditor.balance, debtor.balance);

        creditor.balance -= amount;
        debtor.balance -= amount;

        const row = document.createElement('tr');
        row.innerHTML = `<td>${debtor.person}</td><td>${creditor.person}</td><td>${amount.toFixed(2)}</td>`;
        tableBody.appendChild(row);

        if (creditor.balance > 0) creditors.push(creditor);
        if (debtor.balance > 0) debtors.push(debtor);
    }
}

document.getElementById('reset-button').addEventListener('click', function () {
    localStorage.clear();
    location.reload();
});
