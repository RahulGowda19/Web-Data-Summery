let currentData = null;

// Event Listeners
document.getElementById('uploadBtn').addEventListener('click', handleFileUpload);
document.getElementById('displayBtn').addEventListener('click', displayData);
document.getElementById('emailBtn').addEventListener('click', sendEmail);
document.getElementById('downloadBtn').addEventListener('click', downloadData);
document.getElementById('deleteBtn').addEventListener('click', deleteData);

// File Upload Handler
function handleFileUpload() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a CSV file first');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        currentData = parseCSV(text);
        alert('File uploaded successfully!');
        // Automatically display the data after upload
        displayData();
    };
    reader.readAsText(file);
}

// CSV Parser
function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        const values = lines[i].split(',').map(value => value.trim());
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index];
        });
        data.push(row);
    }

    return data;
}

// Display Data
function displayData() {
    if (!currentData) {
        alert('No data available. Please upload a file first.');
        return;
    }

    const displayDiv = document.getElementById('dataDisplay');
    const headers = Object.keys(currentData[0]);
    
    let tableHTML = '<table class="table table-striped"><thead><tr>';
    headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';

    currentData.forEach(row => {
        tableHTML += '<tr>';
        headers.forEach(header => {
            tableHTML += `<td>${row[header]}</td>`;
        });
        tableHTML += '</tr>';
    });

    tableHTML += '</tbody></table>';
    displayDiv.innerHTML = tableHTML;
    
    // Add show class to trigger the animation
    displayDiv.classList.add('show');
}

// Send Email
async function sendEmail() {
    if (!currentData) {
        alert('No data available. Please upload a file first.');
        return;
    }

    const senderEmail = document.getElementById('senderEmail').value.trim();
    const receiverEmail = document.getElementById('receiverEmail').value.trim();

    if (!senderEmail || !receiverEmail) {
        alert('Please enter both sender and receiver email addresses.');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail) || !emailRegex.test(receiverEmail)) {
        alert('Please enter valid email addresses.');
        return;
    }

    // Convert data to CSV format for email
    const headers = Object.keys(currentData[0]);
    let csvContent = headers.join(',') + '\n';
    currentData.forEach(row => {
        const values = headers.map(header => row[header]);
        csvContent += values.join(',') + '\n';
    });

    try {
        const response = await fetch('/send_email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender: senderEmail,
                receiver: receiverEmail,
                csv_data: csvContent
            })
        });

        const result = await response.json();
        
        if (response.ok) {
            alert('Email sent successfully!');
        } else {
            alert(`Error sending email: ${result.error}`);
        }
    } catch (error) {
        alert('Error connecting to the server. Please make sure the backend is running.');
        console.error('Error:', error);
    }
}

// Download Data
function downloadData() {
    if (!currentData) {
        alert('No data available. Please upload a file first.');
        return;
    }

    // Get filter values
    const filterDate = document.getElementById('filterDate').value;
    const filterRestaurant = document.getElementById('filterRestaurant').value.trim().toLowerCase();

    // Filter the data
    let filteredData = [...currentData];
    
    if (filterDate) {
        filteredData = filteredData.filter(row => {
            const rowDate = new Date(row['Order Date']).toISOString().split('T')[0];
            return rowDate === filterDate;
        });
    }

    if (filterRestaurant) {
        filteredData = filteredData.filter(row => {
            const restaurantName = (row['Restaurant Name'] || '').toLowerCase();
            return restaurantName.includes(filterRestaurant);
        });
    }

    if (filteredData.length === 0) {
        alert('No data matches the selected filters.');
        return;
    }

    // Convert filtered data to CSV
    const headers = Object.keys(filteredData[0]);
    let csvContent = headers.join(',') + '\n';

    filteredData.forEach(row => {
        const values = headers.map(header => row[header]);
        csvContent += values.join(',') + '\n';
    });

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Create filename based on filters
    let filename = 'exported_data';
    if (filterDate) filename += `_${filterDate}`;
    if (filterRestaurant) filename += `_${filterRestaurant}`;
    filename += '.csv';
    
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Delete Data
function deleteData() {
    if (!currentData) {
        alert('No data available to delete.');
        return;
    }

    // Get filter values
    const filterDate = document.getElementById('deleteFilterDate').value;
    const filterRestaurant = document.getElementById('deleteFilterRestaurant').value.trim().toLowerCase();

    // Filter the data
    let filteredData = [...currentData];
    
    if (filterDate) {
        filteredData = filteredData.filter(row => {
            const rowDate = new Date(row['Order Date']).toISOString().split('T')[0];
            return rowDate === filterDate;
        });
    }

    if (filterRestaurant) {
        filteredData = filteredData.filter(row => {
            const restaurantName = (row['Restaurant Name'] || '').toLowerCase();
            return restaurantName.includes(filterRestaurant);
        });
    }

    if (filteredData.length === 0) {
        alert('No data matches the selected filters.');
        return;
    }

    // Show confirmation message with filter details
    let confirmationMessage = 'Are you sure you want to delete ';
    if (filterDate || filterRestaurant) {
        confirmationMessage += 'the filtered data';
        if (filterDate) confirmationMessage += ` for date: ${filterDate}`;
        if (filterRestaurant) confirmationMessage += ` for restaurant: ${filterRestaurant}`;
    } else {
        confirmationMessage += 'all data';
    }
    confirmationMessage += '?';

    if (confirm(confirmationMessage)) {
        if (filterDate || filterRestaurant) {
            // Remove filtered data from currentData
            currentData = currentData.filter(row => {
                const rowDate = new Date(row['Order Date']).toISOString().split('T')[0];
                const restaurantName = (row['Restaurant Name'] || '').toLowerCase();
                
                if (filterDate && rowDate === filterDate) return false;
                if (filterRestaurant && restaurantName.includes(filterRestaurant)) return false;
                return true;
            });
        } else {
            // Delete all data
            currentData = null;
            document.getElementById('csvFile').value = '';
        }

        // Clear the display and remove show class
        const displayDiv = document.getElementById('dataDisplay');
        displayDiv.innerHTML = '';
        displayDiv.classList.remove('show');
        
        // Clear filter inputs
        document.getElementById('deleteFilterDate').value = '';
        document.getElementById('deleteFilterRestaurant').value = '';
        
        alert('Data has been deleted successfully.');
    }
} 