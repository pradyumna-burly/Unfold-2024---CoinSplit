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

// Update balances table
function updateBalancesTable() {
    const tableBody = document.getElementById('balances-table');
    tableBody.innerHTML = '';
    Object.entries(balances).forEach(([person, balance]) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${person}</td><td>${balance.toFixed(2)}</td>`;
        tableBody.appendChild(row);
    });
}

// Calculate settlements
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
        
        // Find UPI ID for the creditor
        const creditorUPI = groupMembers.find(m => m.name === creditor.person)?.upi || '';
        
        creditor.balance -= amount;
        debtor.balance -= amount;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${debtor.person}</td>
            <td>${creditor.person}</td>
            <td>${amount.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-primary pay-now" 
                        data-from="${debtor.person}" 
                        data-to="${creditor.person}" 
                        data-amount="${amount.toFixed(2)}"
                        data-upi="${creditorUPI}">
                    Pay Now
                </button>
                <button class="btn btn-sm btn-success paid" 
                        data-from="${debtor.person}" 
                        data-to="${creditor.person}" 
                        data-amount="${amount.toFixed(2)}"
                        style="display:none;">
                    Paid
                </button>
            </td>
        `;
        tableBody.appendChild(row);
        
        if (creditor.balance > 0) creditors.push(creditor);
        if (debtor.balance > 0) debtors.push(debtor);
    }
    
    // Add event listeners for Pay Now and Paid buttons
    addPaymentButtonListeners();
}

// Add event listeners for Pay Now and Paid buttons
function addPaymentButtonListeners() {
    document.querySelectorAll('.pay-now').forEach(button => {
        button.addEventListener('click', function() {
            const upi = this.dataset.upi;
            const amount = this.dataset.amount;
            const from = this.dataset.from;
            const to = this.dataset.to;
            
            // Generate UPI payment URL
            const upiPaymentURL = `upi://pay?pa=${upi}&pn=${to}&am=${amount}&tn=Payment from ${from}`;
            
            // Generate QR Code
            const qr = qrcode(0, 'M');
            qr.addData(upiPaymentURL);
            qr.make();
            
            // Display QR Code in modal
            const qrCodeContainer = document.getElementById('qrcode');
            qrCodeContainer.innerHTML = qr.createImgTag(5);
            
            // Update payment details
            const paymentDetails = document.getElementById('payment-details');
            paymentDetails.textContent = `Pay ${amount} to ${to}`;
            
            // Show the modal
            const qrModal = new bootstrap.Modal(document.getElementById('qrCodeModal'));
            qrModal.show();
            
            // Hide Pay Now, show Paid button
            this.style.display = 'none';
            this.nextElementSibling.style.display = 'inline-block';
        });
    });
    
    document.querySelectorAll('.paid').forEach(button => {
        button.addEventListener('click', function() {
            const from = this.dataset.from;
            const to = this.dataset.to;
            const amount = parseFloat(this.dataset.amount);
            
            // Remove this settlement
            this.closest('tr').remove();
            
            // Update balances
            balances[from] += amount;
            balances[to] -= amount;
            
            // Recalculate and update tables
            updateBalancesTable();
            calculateSettlements();
        });
    });
}

// Reset balances and settlements
document.getElementById('reset-button').addEventListener('click', function () {
    Object.keys(balances).forEach(key => delete balances[key]);
    updateBalancesTable();
    calculateSettlements();
});