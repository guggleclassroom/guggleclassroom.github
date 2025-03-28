document.addEventListener('DOMContentLoaded', () => {
    fetch('games.json')
        .then(response => response.json())
        .then(data => loadGames(data))
        .catch(error => {
            console.error("Error loading games:", error);
            document.getElementById("game-grid").innerHTML = "<p>Sorry, we couldn't load the games at the moment. Please try again later.</p>";
        });
});

// Function to load games into the UI
function loadGames(data) {
    const gameGrid = document.getElementById("game-grid");
    gameGrid.innerHTML = ""; // Clear any existing content

    if (data && data.games && data.games.length > 0) {
        data.games.forEach(game => {
            const card = document.createElement("div");
            card.classList.add("game-card");

            // Fallback for missing game icon
            const icon = game.icon || 'path/to/default-placeholder.png'; 

            card.innerHTML = `
                <img src="${icon}" alt="${game.alt || 'Game icon'}">
                <span>${game.name}</span>
            `;

            // When the card is clicked, load the game in the iframe overlay
            card.addEventListener("click", function() {
                loadGame(game.url);
            });

            gameGrid.appendChild(card);
        });
    } else {
        gameGrid.innerHTML = "<p>No games available.</p>";
    }
}

// Function to load the game in an iframe (already defined earlier in loader.js)
function loadGame(gameUrl) {
    const iframeContainer = document.getElementById("iframe-container");
    const loadingSpinner = document.createElement("div");
    loadingSpinner.classList.add("loading-spinner");
    iframeContainer.innerHTML = ''; // Clear previous content
    iframeContainer.appendChild(loadingSpinner);

    // Hide the game grid
    document.getElementById("game-grid").style.display = "none";

    // Load the game in an iframe
    const iframe = document.createElement("iframe");
    iframe.src = gameUrl;
    iframe.width = "100%";
    iframe.height = "600px";
    iframe.frameBorder = "0";
    iframe.allowFullscreen = true;

    iframe.onload = function() {
        iframeContainer.innerHTML = ''; // Clear the spinner
        iframeContainer.appendChild(iframe);
        iframeContainer.style.display = "block";
    };
}
