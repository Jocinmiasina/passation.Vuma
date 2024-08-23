// Function to add an entry to the results table
function addEntry() {
    const date = document.getElementById("date").value;
    const operator = document.getElementById("operator").value;
    const shift = document.getElementById("shift").value;
    const entry = document.getElementById("entry").value;
    const exit = document.getElementById("exit").value;
    const observations = document.getElementById("observations").value;

    const newEntry = { date, operator, shift, entry, exit, observations };

    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.push(newEntry);
    localStorage.setItem('entries', JSON.stringify(entries));

    renderEntries();
}

// Function to render entries from Local Storage to the table
function renderEntries() {
    const table = document.getElementById("resultsTable").getElementsByTagName('tbody')[0];
    table.innerHTML = ""; // Clear current table content

    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.forEach((entry, index) => {
        const newRow = table.insertRow();
        newRow.insertCell(0).innerText = entry.date;
        newRow.insertCell(1).innerText = entry.operator;
        newRow.insertCell(2).innerText = entry.shift;
        newRow.insertCell(3).innerText = entry.entry;
        newRow.insertCell(4).innerText = entry.exit;
        newRow.insertCell(5).innerText = entry.observations;

        // Action button for deletion
        const actionsCell = newRow.insertCell(6);
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Supprimer";
        deleteButton.className = "deleteButton.innerText";
        deleteButton.onclick = () => deleteEntry(index);
        actionsCell.appendChild(deleteButton);
    });
}

// Function to delete an entry
function deleteEntry(index) {
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(entries));
    renderEntries();
}

// Function to search an entry (simple example)
function searchEntry() {
    const operator = document.getElementById("operator").value;
    const table = document.getElementById("resultsTable").getElementsByTagName('tbody')[0];

    for (let row of table.rows) {
        if (row.cells[1].innerText === operator) {
            row.style.backgroundColor = "#FFFF99";
        } else {
            row.style.backgroundColor = "";
        }
    }
}

// Function to download the results as PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const table = document.getElementById("resultsTable");
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    let y = 10;
    const rowHeight = 10;

    doc.text("Results", 10, y);
    y += rowHeight;

    rows.forEach((row, i) => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, j) => {
            doc.text(cell.innerText, 10 + index * 30, y);
        });
        y += rowHeight;
        if (y > 280) { // Check if page limit reached
            doc.addPage();
            y = 10;
        }
    });

    doc.save('results.pdf');
}

// Function to download the results as Excel
function downloadExcel() {
    const table = document.getElementById("resultsTable");
    const wb = XLSX.utils.table_to_book(table, { sheet: "Results" });
    XLSX.writeFile(wb, 'results.xlsx');
}

// Call renderEntries on page load to display stored entries
window.onload = renderEntries;
