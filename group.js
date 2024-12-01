// Retrieve the existing group members from localStorage, or start with an empty array.
const groupMembers = JSON.parse(localStorage.getItem('groupMembers')) || [];

// Update the group members table after adding new member
function updateMembersTable() {
    const membersList = document.getElementById('members-list');
    membersList.innerHTML = ''; // Clear current list

    // Loop through the members and add them to the table
    groupMembers.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${member.name}</td><td>${member.upi}</td>`;
        membersList.appendChild(row);
    });

    // Save the updated group members list to localStorage
    localStorage.setItem('groupMembers', JSON.stringify(groupMembers));
}

// Event listener for adding a new member
document.getElementById('group-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    // Get the member name and UPI ID from the form fields
    const name = document.getElementById('member-name').value.trim();
    const upi = document.getElementById('member-upi').value.trim();

    // Validate the inputs before adding
    if (name && upi) {
        // Add the new member to the groupMembers array
        groupMembers.push({ name, upi });

        // Update the table with the new member
        updateMembersTable();

        // Clear the input fields after adding
        document.getElementById('member-name').value = '';
        document.getElementById('member-upi').value = '';
    } else {
        alert('Please fill in all fields!');
    }
});

// Initial call to display any existing members in the group
updateMembersTable();
