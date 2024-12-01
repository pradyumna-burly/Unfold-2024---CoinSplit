const groupMembers = [];

// Add a member
document.getElementById('group-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('member-name').value.trim();
    const upi = document.getElementById('member-upi').value.trim();

    if (name && upi) {
        groupMembers.push({ name, upi });
        updateMembersTable();
        document.getElementById('member-name').value = '';
        document.getElementById('member-upi').value = '';
    } else {
        alert('Please fill in all fields!');
    }
});

function updateMembersTable() {
    const membersList = document.getElementById('members-list');
    membersList.innerHTML = '';
    groupMembers.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${member.name}</td><td>${member.upi}</td>`;
        membersList.appendChild(row);
    });

    // Save to localStorage
    localStorage.setItem('groupMembers', JSON.stringify(groupMembers));
}
