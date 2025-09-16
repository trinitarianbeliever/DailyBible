// Array containing all the data for multiple pages (will be loaded from JSON)
let allVerses = [];

const tableBody = document.getElementById('verseTableBody');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageCounter = document.getElementById('pageCounter');
const chapterInput = document.getElementById('chapterInput');
const jumpBtn = document.getElementById('jumpBtn');
const verseSearchInput = document.getElementById('verseSearchInput');
const verseSearchBtn = document.getElementById('verseSearchBtn');
const searchMessage = document.getElementById('searchMessage');
let currentPage = 0;

/**
 * Fetches the verse data from the JSON file and initializes the application.
 */
async function initialize() {
    try {
        const response = await fetch('data.json');
        allVerses = await response.json();
        renderTable(currentPage);
        updateButtons();
    } catch (error) {
        console.error('Error fetching the verse data:', error);
    }
}

/**
 * Clears all highlights from the table cells.
 */
function clearHighlights() {
    const cells = tableBody.querySelectorAll('td');
    cells.forEach(cell => {
        cell.classList.remove('highlighted-verse');
    });
}

/**
 * Renders the table with the verses for the current page.
 * @param {number} pageIndex - The index of the page to display.
 */
function renderTable(pageIndex) {
    // Clear existing table content and any previous highlights
    tableBody.innerHTML = '';
    clearHighlights();
    
    // Get the verses for the current page
    const verses = allVerses[pageIndex];

    // Build and append new rows
    verses.forEach(rowData => {
        const row = document.createElement('tr');
        rowData.forEach(cellData => {
            const cell = document.createElement('td');
            // Use the new CSS class for styling
            cell.className = 'verse-cell';
            cell.textContent = cellData;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
    updatePageCounter();
}

/**
 * Highlights the cell containing the search term.
 * @param {string} searchTerm - The term to search for.
 */
function highlightVerse(searchTerm) {
    const cells = tableBody.querySelectorAll('td');
    cells.forEach(cell => {
        if (cell.textContent.toLowerCase() === searchTerm.toLowerCase()) {
            cell.classList.add('highlighted-verse');
        }
    });
}


/**
 * Updates the state of the navigation buttons.
 * Disables 'Previous' on the first page and 'Next' on the last page.
 */
function updateButtons() {
    // The disabled property handles the styling via CSS, no need to add/remove classes
    prevBtn.disabled = (currentPage === 0);
    nextBtn.disabled = (currentPage === allVerses.length - 1);
}

/**
 * Updates the page counter text.
 */
function updatePageCounter() {
    pageCounter.textContent = `CHAPTER ${currentPage + 1} OF ${allVerses.length}`;
}

/**
 * Handles jumping to a specific chapter number.
 */
function handleJump() {
    const chapterNumber = parseInt(chapterInput.value, 10);
    const maxChapters = allVerses.length;
    
    if (chapterNumber >= 1 && chapterNumber <= maxChapters) {
        currentPage = chapterNumber - 1;
        renderTable(currentPage);
        updateButtons();
    } else {
        // Optionally, provide user feedback for invalid input
        // For now, we'll just log an error
        console.error(`Invalid chapter number. Please enter a number between 1 and ${maxChapters}.`);
    }
}

/**
 * Handles searching for a specific verse.
 */
function handleSearch() {
    const searchTerm = verseSearchInput.value.trim();
    clearHighlights();
    searchMessage.classList.add('hidden');

    if (searchTerm === "") {
        return;
    }

    for (let i = 0; i < allVerses.length; i++) {
        const page = allVerses[i];
        for (let j = 0; j < page.length; j++) {
            for (let k = 0; k < page[j].length; k++) {
                if (page[j][k].toLowerCase() === searchTerm.toLowerCase()) {
                    currentPage = i;
                    renderTable(currentPage);
                    highlightVerse(searchTerm);
                    updateButtons();
                    return;
                }
            }
        }
    }

    searchMessage.classList.remove('hidden');
}


// Event listeners for the navigation buttons
nextBtn.addEventListener('click', () => {
    if (currentPage < allVerses.length - 1) {
        currentPage++;
        renderTable(currentPage);
        updateButtons();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        renderTable(currentPage);
        updateButtons();
    }
});

// Event listener for the jump button
jumpBtn.addEventListener('click', handleJump);
chapterInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleJump();
    }
});

// Event listener for the verse search button
verseSearchBtn.addEventListener('click', handleSearch);
verseSearchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// Event listener for keyboard navigation
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        prevBtn.click();
    } else if (event.key === 'ArrowRight') {
        nextBtn.click();
    }
});

// Initial render
initialize();

