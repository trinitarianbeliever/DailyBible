document.addEventListener('DOMContentLoaded', () => {
    
    // Define other variables as before
    const versesPerPage = 21;
    let currentPage = 0;
    let filteredVerses = [];

    const verseContainer = document.getElementById('verse-container');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const currentPageInfo = document.getElementById('current-page-info');
    const totalPagesInfo = document.getElementById('total-pages-info');
    const searchInput = document.getElementById('search-input');
    const clearSearchButton = document.getElementById('clear-search-button');
    const pageInput = document.getElementById('page-input');
    const goButton = document.getElementById('go-button');
    
    // Asynchronous function to load the verses from the JSON file
    async function loadVerses() {
        try {
            const response = await fetch('./data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allVerses = await response.json();
            
            // Now that you have the data, initialize the application
            filteredVerses = allVerses;
            renderVerses(currentPage, filteredVerses);
            
            // Re-define the filterAndRender function to use the loaded data
            function filterAndRender() {
                const searchTerm = searchInput.value.toLowerCase().trim();
                
                if (searchTerm === "") {
                    filteredVerses = allVerses;
                } else {
                    filteredVerses = allVerses.filter(verse => verse.toLowerCase() === searchTerm);
                }
                
                currentPage = 0;
                renderVerses(currentPage, filteredVerses);
            }
            
            // Add all your event listeners here, inside the async function,
            // so they are attached only after the data has been loaded.
            nextButton.addEventListener('click', () => {
                const totalPages = Math.ceil(filteredVerses.length / versesPerPage);
                if (currentPage < totalPages - 1) {
                    currentPage++;
                    renderVerses(currentPage, filteredVerses);
                }
            });

            prevButton.addEventListener('click', () => {
                if (currentPage > 0) {
                    currentPage--;
                    renderVerses(currentPage, filteredVerses);
                }
            });

            searchInput.addEventListener('keyup', filterAndRender);
            
            clearSearchButton.addEventListener('click', () => {
                searchInput.value = '';
                filterAndRender();
            });

            goButton.addEventListener('click', () => {
                const pageNumber = parseInt(pageInput.value, 10);
                const totalPages = Math.ceil(filteredVerses.length / versesPerPage);

                if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
                    currentPage = pageNumber - 1;
                    renderVerses(currentPage, filteredVerses);
                } else {
                    console.log('Invalid page number. Please enter a number between 1 and ' + totalPages);
                }
                pageInput.value = '';
            });

        } catch (error) {
            console.error('Failed to load verses:', error);
            // Optionally, display an error message on the page
            verseContainer.innerHTML = '<p class="text-red-500">Failed to load verses. Please check the data file.</p>';
        }
    }
    
    // The renderVerses function remains the same.
    function renderVerses(page, verses) {
        const totalPages = Math.ceil(verses.length / versesPerPage);
        verseContainer.innerHTML = '';
        const startIndex = page * versesPerPage;
        const endIndex = startIndex + versesPerPage;
        const versesToDisplay = verses.slice(startIndex, endIndex);

        versesToDisplay.forEach(verse => {
            const verseDiv = document.createElement('div');
            verseDiv.className = "flex items-center justify-center text-center text-[#FFFFFF] text-base sm:text-lg p-4 cursor-pointer hover:bg-gray-800 transition-colors duration-200 border border-[#555555] rounded-md";
            verseDiv.textContent = verse;
            verseContainer.appendChild(verseDiv);
        });

        currentPageInfo.textContent = page + 1;
        totalPagesInfo.textContent = totalPages > 0 ? totalPages : 1;
        prevButton.disabled = page === 0 || totalPages === 0;
        nextButton.disabled = page >= totalPages - 1 || totalPages === 0;
        prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
        nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
    }

    // Call the async function to start the process
    loadVerses();
});
