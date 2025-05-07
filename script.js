const expenseTableBody = document.getElementById('expenseTableBody');
const addExpenseForm = document.getElementById('add-expense-form');
const updateExpenseForm = document.getElementById('update-expense-form');
const editForm = document.getElementById('edit-form');
const cancelEditButton = document.getElementById('cancel-edit');
const errorMessageDiv = document.getElementById('error-message');


function clearError() {
    errorMessageDiv.textContent = '';
}

function loadExpenses() {
    var total = 0; 
    clearError();
    fetch('https://localhost:7082/api/expenses/List')
        .then(response => {
            return response.json();
        })
        .then(data => {
            const expenses = data;
            expenseTableBody.innerHTML = '';
            expenses.forEach(expense => {
                const row = expenseTableBody.insertRow();
                const idCell = row.insertCell();
                const valueCell = row.insertCell();
                const descriptionCell = row.insertCell();
                const actionsCell = row.insertCell();

                idCell.textContent = expense.id;
                valueCell.textContent = expense.value;
                descriptionCell.textContent = expense.description;
                total += expense.value;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => showEditForm(expense));

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteExpense(expense.id));

                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);
            });
            let output = document.getElementById('total-value');
            output.textContent = total;
        })
        .catch(error => {
            console.error('Error loading expenses:', error);
            displayError('Failed to load expenses. Please try again later.');
        });
}

addExpenseForm.addEventListener('submit', (event) => 
{
    event.preventDefault();
    clearError();
    const value = document.getElementById('value').valueAsNumber;
    const description = document.getElementById('description').value;

    fetch('https://localhost:7082/api/expenses/Create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value, description })
    })
    .then(response => {
        
        loadExpenses();
        return response.json();
    })
    .then(() => {
        addExpenseForm.reset();
        loadExpenses();
    })
    .catch(error => {
        console.error('Error adding expense:', error);
    });
});

function showEditForm(expense) {
    document.getElementById('edit-id').value = expense.id;
    document.getElementById('edit-value').value = expense.value;
    document.getElementById('edit-description').value = expense.description;
    editForm.style.display = 'block';
}

cancelEditButton.addEventListener('click', () => {
    editForm.style.display = 'none';
});

updateExpenseForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearError();
    const id = document.getElementById('edit-id').value;
    const value = document.getElementById('edit-value').valueAsNumber;
    const description = document.getElementById('edit-description').value;

    fetch("https://localhost:7082/api/expenses/Update/" + id, { 
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, value, description })
    })
    .then(response => {
        
        loadExpenses();
        return response.json()
    })
    .then(() => {
        loadExpenses();
        editForm.style.display = 'none';
    })
    .catch(error => {
        console.error('Error updating expense:', error);
    });
});



function deleteExpense(id) {
    clearError();
    if (confirm('Are you sure you want to delete this expense?')) 
    {
        fetch("https://localhost:7082/api/expenses/Delete/" + id, {
            method: 'DELETE'
        })
        
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {                   
                });
            }
            if (response.status !== 204) {
                return response.json();
            }
            loadExpenses();
            return;
        })
        .then(() => {
            loadExpenses();
        })
        .catch(error => {
            console.error('Error deleting expense:', error);
        });
    }
}

loadExpenses();