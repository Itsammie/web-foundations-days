let allUsers = [];

const loadUsersBtn = document.getElementById('load-users');
const filterInput = document.getElementById('filter-input');
const statusEl = document.getElementById('status');
const usersListEl = document.getElementById('users-list');

async function loadUsers() {
    loadUsersBtn.disabled = true;
    statusEl.textContent = 'Loading users...';
    usersListEl.innerHTML = '';

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        allUsers = await response.json();
        statusEl.textContent = `Successfully loaded ${allUsers.length} users.`;
        renderUsers(allUsers);
    } catch (error) {
        statusEl.textContent = `Failed to load users: ${error.message}`;
    } finally {
        loadUsersBtn.disabled = false;
    }
}

function renderUsers(list) {
    usersListEl.innerHTML = '';

    if (list.length === 0) {
        statusEl.textContent = 'No users match your filter.';
        return;
    }

    list.forEach(user => {
        const li = document.createElement('li');

        const nameStrong = document.createElement('strong');
        nameStrong.textContent = user.name;

        const details = document.createElement('span');
        details.textContent = ` — Email: ${user.email} | City: ${user.address.city} | Company: ${user.company.name}`;

        li.appendChild(nameStrong);
        li.appendChild(details);
        usersListEl.appendChild(li);
    });
}

// Event Listeners
loadUsersBtn.addEventListener('click', loadUsers);

filterInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = allUsers.filter(user => user.name.toLowerCase().includes(query));
    
    renderUsers(filtered);
    
    if (filtered.length === 0 && allUsers.length > 0) {
        statusEl.textContent = 'No users match your filter.';
    } else if (allUsers.length > 0) {
        statusEl.textContent = `Showing ${filtered.length} of ${allUsers.length} users.`;
    }
});