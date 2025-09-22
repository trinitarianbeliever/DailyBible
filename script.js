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
const randomBtn = document.getElementById('randomBtn');
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
        // Hide the search message on initialization
        searchMessage.classList.add('hidden');
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
    // Show the table and navigation containers
    document.getElementById('mainTableContainer').classList.remove('hidden');
    document.getElementById('navigationContainer').classList.remove('hidden');

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
            cell.textContent = cellData; // Using textContent is a key security measure
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
    updatePageCounter();
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
 * Sanitizes user input to prevent XSS attacks.
 * It creates a temporary div and uses textContent to escape any HTML tags.
 * @param {string} input - The raw user input.
 * @returns {string} The sanitized input.
 */
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Highlights the cell containing the search term.
 * @param {string} searchTerm - The term to search for.
 */
function highlightVerse(searchTerm) {
    const cells = tableBody.querySelectorAll('td');
    cells.forEach(cell => {
        // We use textContent here because we are only reading the text value.
        if (cell.textContent.toLowerCase() === searchTerm.toLowerCase()) {
            cell.classList.add('highlighted-verse');
        }
    });
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
    }
}

/**
 * Handles searching for a specific verse.
 */
function handleSearch() {
    // Sanitize the input before using it
    const searchTerm = sanitizeInput(verseSearchInput.value.trim());
    clearHighlights();
    searchMessage.classList.add('hidden'); // Hide the message initially

    if (searchTerm === "") {
        return;
    }

    let verseFound = false;

    // Iterate through all chapters to find the verse
    for (let i = 0; i < allVerses.length; i++) {
        const page = allVerses[i];
        for (let j = 0; j < page.length; j++) {
            for (let k = 0; k < page[j].length; k++) {
                if (page[j][k].toLowerCase() === searchTerm.toLowerCase()) {
                    // Verse found, set the current page and render the table
                    currentPage = i;
                    renderTable(currentPage);
                    highlightVerse(searchTerm);
                    updateButtons();

                    // Update and show the "found" message
                    searchMessage.textContent = 'Verse found.';
                    searchMessage.style.color = 'rgb(74, 222, 128)'; // A green color for success
                    searchMessage.classList.remove('hidden');

                    verseFound = true;
                    return; // Exit the function after finding the verse
                }
            }
        }
    }

    // If the loop completes and the verse was not found
    if (!verseFound) {
        searchMessage.textContent = 'Verse not found.';
        searchMessage.style.color = 'rgb(239, 68, 68)'; // The original red color for error
        searchMessage.classList.remove('hidden');
    }
}

/**
 * Selects and displays a random verse.
 */
function showRandomVerse() {
    const flattenedVerses = allVerses.flat(2).filter(verse => verse.trim() !== "");
    if (flattenedVerses.length === 0) {
        // Handle case where there are no verses
        console.error("No verses available to display.");
        searchMessage.textContent = 'No verses available.';
        searchMessage.style.color = 'rgb(239, 68, 68)';
        searchMessage.classList.remove('hidden');
        document.getElementById('mainTableContainer').classList.add('hidden');
        document.getElementById('navigationContainer').classList.add('hidden');
        return;
    }

    const randomIndex = Math.floor(Math.random() * flattenedVerses.length);
    const randomVerse = flattenedVerses[randomIndex];

    // Clear the existing table and highlights
    tableBody.innerHTML = '';
    clearHighlights();

    // Create a new table row and cell for the random verse
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.className = 'verse-cell highlighted-verse'; // Apply the highlighted style
    cell.textContent = randomVerse;
    row.appendChild(cell);
    tableBody.appendChild(row);

    // Show the table but hide the navigation
    document.getElementById('mainTableContainer').classList.remove('hidden');
    document.getElementById('navigationContainer').classList.add('hidden');
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

// Event listener for the new Random button
randomBtn.addEventListener('click', showRandomVerse);

// Event listener for keyboard navigation
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        prevBtn.click();
    } else if (event.key === 'ArrowRight') {
        nextBtn.click();
    }
});

// Initial render on page load
window.onload = initialize;
