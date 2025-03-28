document.addEventListener('DOMContentLoaded', () => {
  fetch('games.json')
    .then(response => response.json())
    .then(data => {
      console.log('Games data loaded:', data);  // Add logging to check if the data loads correctly
      loadGames(data);
    })
    .catch(error => {
      console.error("Error loading games:", error); // Log any errors in loading the games
    });
});

function loadGames(data) {
  const games = data.games;
  const gameGrid = document.getElementById("game-grid");
  gameGrid.innerHTML = ""; // Clear any existing content

  games.forEach(game => {
    console.log('Creating game card for:', game); // Log each game as it is processed

    const card = document.createElement("div");
    card.classList.add("game-card");

    card.innerHTML = `
      <img src="${game.icon}" alt="${game.alt}">
      <span>${game.name}</span>
    `;

    // Add click event listener to load the game
    card.addEventListener("click", function() {
      console.log('Loading game URL:', game.url);  // Log the URL when clicked
      loadGame(game.url);
    });

    gameGrid.appendChild(card);
  });
}

function loadGame(gameUrl) {
  const iframeContainer = document.getElementById("iframe-container");
  // Hide the game grid
  document.getElementById("game-grid").style.display = "none";
  // Load the game in an iframe
  iframeContainer.innerHTML = `<iframe src="${gameUrl}" width="100%" height="600px" frameborder="0" allowfullscreen></iframe>`;
  iframeContainer.style.display = "block";
}
