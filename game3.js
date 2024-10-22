const categories = {
    "Brownfield": "A previously developed site, often contaminated by industrial use, but can be cleaned and redeveloped. Example: Old factories turned into housing after cleanup.",
    "Heat Islands": "Urban areas hotter than nearby rural areas due to heat-retaining materials like concrete. Example: Cities feel hotter than the countryside in summer.",
    "Light Pollution": "Excessive outdoor lighting that obscures stars and disrupts wildlife.",
    "Renewable vs Non-Renewable Materials": "Renewable materials like bamboo regrow quickly; non-renewable ones like coal take millions of years to form.",
    "Daylight Efficiency": "Designing buildings to maximise natural light and outdoor views for better well-being and energy savings.",
    "Renewable Energy": "Energy from natural sources like the sun or wind that replenishes naturally.",
    "Energy Transition": "Shifting from fossil fuels to renewable energy to reduce environmental damages and carbon emission.",
    "Embodied Energy": "The total energy used to make a product, from raw material extraction to construction.",
    "Prefabrication": "A construction method through which the building parts are pre-made in factories and assembled on-site to reduce waste and costs.",
    "Greywater": "Wastewater from showers and sinks that can be reused for things like watering plants or flushing the toilet.",
    "Inclusive Design": "Designing products and spaces accessible to all people, regardless of ability. Example: Ramps for wheelchair users.",
    "Nature-based Solutions": "Using nature or natural processes to solve problems, like planting trees to reduce flooding.",
    "Low-Emitting Materials": "Materials that release fewer harmful chemicals to the surroundings, improving indoor air quality and health of occupants.",
    "Passive Energy Strategies": "Designing buildings to use natural light and heat to lower energy use. Example: Using large windows for sunlight instead of electric lights.",
    "Stormwater Management": "Systems that control rainwater to prevent flooding and pollution. Example: Rain gardens that soak up stormwater.",
    "Water-Efficient Landscaping": "Using plants and systems that require less water, like drought-tolerant plants or efficient sprinklers.",
    "Reuse": "Using materials or products for the second time without major intervention or repair.",
    "Construction and Demolition Waste Management": "Reducing waste from building projects either during demolition phase or construction phase.",
    "Local Materials": "Using materials sourced from nearby to lower transport emissions and support the local economy.",
    "Certified Wood": "Wood from forests managed sustainably, ensuring responsible forestry and regenerating the trees.",
};


let selectedCategory = null;
let correctMatches = 0;
let currentSetIndex = 0;
const itemsPerSet = 5; // Set size per round
let confettiInterval; // To store the confetti interval

document.addEventListener('DOMContentLoaded', () => {
    const categoryGrid = document.getElementById("category-grid");
    const unitGrid = document.getElementById("unit-grid");
    const restartButton = document.getElementById('restartButton');
    const timerDisplay = document.getElementById('timer');
    let interval;
    let timeElapsed = 0;

    const categoriesArray = Object.keys(categories);

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createCard(text, clickHandler) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.textContent = text;
        card.addEventListener("click", () => clickHandler(card));
        return card;
    }

    function selectCategory(card) {
        if (selectedCategory) {
            selectedCategory.classList.remove("selected", "incorrect-match");
        }
        selectedCategory = card;
        selectedCategory.classList.add("selected");
    }
    function updateProgressBar() {
        const progressBar = document.getElementById("progressBar");
        const totalMatches = categoriesArray.length;
        const progressPercentage = (correctMatches / totalMatches) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.textContent = `${Math.round(progressPercentage)}%`;
    }

    function selectUnit(unitCard) {
        if (!selectedCategory) return; // No category selected yet
        const category = selectedCategory.textContent;
        const unit = unitCard.textContent;

        if (categories[category] === unit) {
            // Correct match
            selectedCategory.classList.add("correct-match", "disabled");
            unitCard.classList.add("correct-match", "disabled");
            correctMatches++;

            // Update the progress bar
            updateProgressBar();

            // Check if all matches are completed
            if (correctMatches === categoriesArray.length) {
                showCompletionMessage();
                return;
            }

            // Check if the current set (6 matches) is complete
            if (correctMatches % itemsPerSet === 0) {
                loadNextSet(); // Load the next set of items
            }
        } else {
            // Incorrect match
            selectedCategory.classList.add("incorrect-match");
            unitCard.classList.add("incorrect-match");
            setTimeout(() => {
                selectedCategory.classList.remove("selected", "incorrect-match");
                unitCard.classList.remove("incorrect-match");
            }, 1000); // Reset after 1 second
        }
        // Clear selected category
        selectedCategory = null;
    }


    function loadNextSet() {
        categoryGrid.innerHTML = '';
        unitGrid.innerHTML = '';

        // Slice the next set of categories and units
        const currentSetCategories = categoriesArray.slice(currentSetIndex * itemsPerSet, (currentSetIndex + 1) * itemsPerSet);
        const currentSetUnits = currentSetCategories.map(category => categories[category]);

        // Shuffle units to randomize matching
        shuffle(currentSetUnits);

        // Add categories and units to the grid
        currentSetCategories.forEach(category => {
            categoryGrid.appendChild(createCard(category, selectCategory));
        });

        currentSetUnits.forEach(unit => {
            unitGrid.appendChild(createCard(unit, selectUnit));
        });

        currentSetIndex++; // Move to the next set
    }

    function showCompletionMessage() {
        // Clear the grids and stop the timer
        clearInterval(interval);
        categoryGrid.innerHTML = '';
        unitGrid.innerHTML = '';

        // Remove the "Phrase" and "Description" labels
        const headers = document.querySelectorAll('h2');
        headers.forEach(header => header.remove());

        // Display the congratulatory message
        const message = document.createElement('div');
        message.classList.add('completion-message');
        message.innerHTML = `
          <h2>Well done on completing this challenge!</h2>
          <p>Your reward code is: <strong>171</strong></p>
        `;
        document.body.appendChild(message);

        // Start continuous confetti effect
        confettiInterval = setInterval(() => {
            confetti({
                particleCount: 150,
                spread: 60,
                origin: { y: 0.6 }
            });
        }, 500); // Confetti pops every 300 milliseconds
    }

    function resetGame() {
        clearInterval(interval);
        clearInterval(confettiInterval); // Stop confetti on reset
        timeElapsed = 0;
        timerDisplay.textContent = '00:00';
        selectedCategory = null;
        correctMatches = 0;
        currentSetIndex = 0;

        // Remove any previous completion message
        const oldMessage = document.querySelector('.completion-message');
        if (oldMessage) {
            oldMessage.remove();
        }

        // Recreate the "Phrase" and "Description" labels
        const columnHeaders = document.querySelectorAll('h2');
        if (!columnHeaders.length) {
            const phraseHeader = document.createElement('h2');
            phraseHeader.textContent = 'Phrase';
            categoryGrid.parentElement.insertBefore(phraseHeader, categoryGrid);

            const descriptionHeader = document.createElement('h2');
            descriptionHeader.textContent = 'Description';
            unitGrid.parentElement.insertBefore(descriptionHeader, unitGrid);
        }

        // Shuffle the entire set of categories
        shuffle(categoriesArray);

        loadNextSet(); // Start with the first set

        startTimer();
    }

    function startTimer() {
        interval = setInterval(() => {
            timeElapsed++;
            const minutes = Math.floor(timeElapsed / 60);
            const seconds = timeElapsed % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    restartButton.addEventListener('click', resetGame);
    resetGame(); // Initialise the game on page load
});