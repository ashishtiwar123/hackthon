// DOM Elements
const addItemBtn = document.getElementById('addItemBtn');
const addItemModal = document.getElementById('addItemModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const saveItemBtn = document.getElementById('saveItemBtn');
const addItemForm = document.getElementById('addItemForm');
const fileInput = document.getElementById('itemImage');
const fileNameDisplay = document.querySelector('.file-name');
const selectAllCheckbox = document.getElementById('selectAll');
const itemCheckboxes = document.querySelectorAll('.item-checkbox');

// Sample inventory data for demonstration
let inventoryData = [
    {
        id: 'WH-1001',
        name: 'Wireless Headphones',
        category: 'Electronics',
        stock: 245,
        status: 'In Stock',
        lastUpdated: '2023-09-15'
    },
    {
        id: 'WH-1002',
        name: 'Smart Watch',
        category: 'Electronics',
        stock: 112,
        status: 'In Stock',
        lastUpdated: '2023-09-14'
    },
    {
        id: 'WH-1003',
        name: 'Bluetooth Speaker',
        category: 'Electronics',
        stock: 18,
        status: 'Low Stock',
        lastUpdated: '2023-09-13'
    },
    {
        id: 'WH-1004',
        name: 'Laptop Stand',
        category: 'Accessories',
        stock: 0,
        status: 'Out of Stock',
        lastUpdated: '2023-09-12'
    },
    {
        id: 'WH-1005',
        name: 'Wireless Keyboard',
        category: 'Electronics',
        stock: 87,
        status: 'In Stock',
        lastUpdated: '2023-09-11'
    }
];

// Local Storage Functions
function saveInventoryData() {
    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
}

function loadInventoryData() {
    const savedData = localStorage.getItem('inventoryData');
    if (savedData) {
        inventoryData = JSON.parse(savedData);
        // Update the table with saved data
        // This would be implemented in a full version
    }
}

// Modal Functions
function openModal() {
    addItemModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

function closeModalFunc() {
    addItemModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    addItemForm.reset();
    fileNameDisplay.textContent = 'No file chosen';
}

// Event Listeners
addItemBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFunc);
cancelBtn.addEventListener('click', closeModalFunc);

// Close modal when clicking outside the modal content
addItemModal.addEventListener('click', function(event) {
    if (event.target === addItemModal) {
        closeModalFunc();
    }
});

// File input change handler
fileInput.addEventListener('change', function() {
    if (this.files.length > 0) {
        fileNameDisplay.textContent = this.files[0].name;
    } else {
        fileNameDisplay.textContent = 'No file chosen';
    }
});

// Select all checkboxes functionality
selectAllCheckbox.addEventListener('change', function() {
    itemCheckboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
});

// Save item functionality
saveItemBtn.addEventListener('click', function() {
    // Check if form is valid
    if (!addItemForm.checkValidity()) {
        addItemForm.reportValidity();
        return;
    }
    
    // Get form values
    const itemName = document.getElementById('itemName').value;
    const itemCategory = document.getElementById('itemCategory').value;
    const itemQuantity = parseInt(document.getElementById('itemQuantity').value);
    const itemSKU = document.getElementById('itemSKU').value;
    
    // Generate a new ID
    const newId = `WH-${1000 + inventoryData.length + 1}`;
    
    // Determine status based on quantity
    let status;
    if (itemQuantity === 0) {
        status = 'Out of Stock';
    } else if (itemQuantity <= 20) {
        status = 'Low Stock';
    } else {
        status = 'In Stock';
    }
    
    // Create new inventory item
    const newItem = {
        id: newId,
        name: itemName,
        category: itemCategory,
        stock: itemQuantity,
        status: status,
        lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    // Add to inventory data
    inventoryData.push(newItem);
    
    // Save to local storage
    saveInventoryData();
    
    // Add row to table (in a full implementation, we would refresh the table)
    addRowToTable(newItem);
    
    // Close modal
    closeModalFunc();
    
    // Show success message
    alert(`Item "${itemName}" has been added to inventory.`);
});

// Function to add a new row to the table
function addRowToTable(item) {
    const tableBody = document.querySelector('.inventory-table tbody');
    const newRow = document.createElement('tr');
    
    // Create status badge class based on status
    let statusClass;
    if (item.status === 'In Stock') {
        statusClass = 'in-stock';
    } else if (item.status === 'Low Stock') {
        statusClass = 'low-stock';
    } else {
        statusClass = 'out-of-stock';
    }
    
    newRow.innerHTML = `
        <td><input type="checkbox" class="item-checkbox"></td>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>${item.stock}</td>
        <td><span class="status-badge ${statusClass}">${item.status}</span></td>
        <td>${item.lastUpdated}</td>
        <td class="actions-cell">
            <button class="action-btn edit-btn"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete-btn"><i class="fas fa-trash"></i></button>
        </td>
    `;
    
    // Add event listeners to the new buttons
    const deleteBtn = newRow.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function() {
        if (confirm(`Are you sure you want to delete ${item.name}?`)) {
            // Remove from data
            inventoryData = inventoryData.filter(i => i.id !== item.id);
            // Save to local storage
            saveInventoryData();
            // Remove row
            newRow.remove();
        }
    });
    
    // Add the row to the table
    tableBody.appendChild(newRow);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load saved inventory data
    loadInventoryData();
    
    // Add event listeners to existing delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const itemId = row.querySelector('td:nth-child(2)').textContent;
            const itemName = row.querySelector('td:nth-child(3)').textContent;
            
            if (confirm(`Are you sure you want to delete ${itemName}?`)) {
                // Remove from data
                inventoryData = inventoryData.filter(item => item.id !== itemId);
                // Save to local storage
                saveInventoryData();
                // Remove row
                row.remove();
            }
        });
    });
    
    // Add event listeners to existing edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Edit functionality would be implemented in a full version.');
            // In a full implementation, this would open the modal with the item data
        });
    });
});


// Graph js 
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const graphData = {
    'Product A': [120, 135, 150, 110, 90, 105, 130, 145, 160, 170, 155, 140],
    'Product B': [80, 95, 105, 120, 135, 150, 140, 125, 110, 100, 90, 85],
    'Product C': [50, 45, 60, 75, 90, 100, 110, 105, 95, 80, 70, 65]
};

// Create chart
const ctx = document.getElementById('inventoryChart').getContext('2d');
const inventoryChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: months,
        datasets: [
            {
                label: 'Product A',
                data: graphData['Product A'],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
                borderWidth: 2,
                fill: true
            },
            {
                label: 'Product B',
                data: graphData['Product B'],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                borderWidth: 2,
                fill: true
            },
            {
                label: 'Product C',
                data: graphData['Product C'],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                borderWidth: 2,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Monthly Inventory Stock Levels',
                font: {
                    size: 16
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            },
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 12
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Units in Stock'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            }
        },
        elements: {
            point: {
                radius: 3,
                hoverRadius: 7
            }
        },
        interaction: {
            intersect: false,
            mode: 'nearest'
        }
    }
});