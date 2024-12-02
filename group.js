let groupMembers = JSON.parse(localStorage.getItem('groupMembers')) || [];

// Add a new member to the group
document.getElementById('group-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('member-name').value.trim();
    const upi = document.getElementById('member-upi').value.trim();
    const sui = document.getElementById('member-sui').value.trim();
    const okto = document.getElementById('member-okto').value.trim();
    const base = document.getElementById('member-base').value.trim();

    if (name && upi && sui && okto && base) {
        groupMembers.push({ name, upi, sui, okto, base });
        updateMembersTable();
        // Clear form fields
        document.getElementById('member-name').value = '';
        document.getElementById('member-upi').value = '';
        document.getElementById('member-sui').value = '';
        document.getElementById('member-okto').value = '';
        document.getElementById('member-base').value = '';
    } else {
        alert('Please fill in all fields!');
    }
});

// Update members table
function updateMembersTable() {
    const membersList = document.getElementById('members-list');
    membersList.innerHTML = '';
    groupMembers.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.upi}</td>
            <td>${member.sui}</td>
            <td>${member.okto}</td>
            <td>${member.base}</td>
        `;
        membersList.appendChild(row);
    });

    // Save to localStorage
    localStorage.setItem('groupMembers', JSON.stringify(groupMembers));
}

// Reset group members
document.getElementById('reset-button').addEventListener('click', function () {
    groupMembers = [];
    updateMembersTable();
    localStorage.removeItem('groupMembers');
});

// Populate table on page load
updateMembersTable();
