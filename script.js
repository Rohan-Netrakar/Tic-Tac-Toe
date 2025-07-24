document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll(".cell");
  const currentPlayerElement = document.getElementById("currentPlayer");
  const gameStatusElement = document.getElementById("gameStatus");
  const restartButton = document.getElementById("restartButton");
  const playerIndicators = document.querySelectorAll(".player-indicator");
  const modeButtons = document.querySelectorAll(".mode-btn");
  const player2Name = document.getElementById("player2Name");

  let currentPlayer = 1;
  let gameBoard = ["", "", "", "", "", "", "", "", ""];
  let gameActive = true;
  let gameMode = "pvp"; // 'pvp' or 'pvc'
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  // Mode selection
  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modeButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      gameMode = button.dataset.mode;
      player2Name.textContent = gameMode === "pvc" ? "Computer" : "Player 2";
      initGame();
    });
  });

  // Initialize game
  initGame();

  function initGame() {
    cells.forEach((cell) => {
      cell.classList.remove("x", "o", "winning-cell", "ai-thinking");
      cell.addEventListener("click", handleCellClick, { once: true });
    });

    currentPlayer = 1;
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayerElement.textContent = currentPlayer;
    gameStatusElement.textContent = "Game in progress...";
    gameStatusElement.style.color = "#4ecca3";

    // Update player indicators
    playerIndicators.forEach((indicator) =>
      indicator.classList.remove("active")
    );
    playerIndicators[0].classList.add("active");
  }

  function handleCellClick(e) {
    if (!gameActive) return;

    const cell = e.target;
    const cellIndex = parseInt(cell.getAttribute("data-cell"));

    if (gameBoard[cellIndex] !== "") return;

    // Update game state
    gameBoard[cellIndex] = currentPlayer === 1 ? "x" : "o";
    cell.classList.add(currentPlayer === 1 ? "x" : "o");

    // Check for win or draw
    if (checkWin()) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      // Switch player
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      currentPlayerElement.textContent = currentPlayer;

      // Update player indicators
      playerIndicators.forEach((indicator) =>
        indicator.classList.remove("active")
      );
      playerIndicators[currentPlayer - 1].classList.add("active");

      // If it's computer's turn in PVC mode
      if (gameMode === "pvc" && currentPlayer === 2 && gameActive) {
        setTimeout(computerMove, 800); // Delay for better UX
      }
    }
  }

  function computerMove() {
    if (!gameActive) return;

    // Show thinking animation
    gameStatusElement.textContent = "Computer is thinking...";

    // Simulate thinking delay
    setTimeout(() => {
      // Simple AI logic:
      // 1. Try to win
      // 2. Block opponent
      // 3. Choose center if available
      // 4. Choose random corner
      // 5. Choose random cell

      let moveIndex = -1;

      // Try to win
      moveIndex = findWinningMove("o");
      if (moveIndex === -1) {
        // Block player from winning
        moveIndex = findWinningMove("x");
      }

      // Choose center if available
      if (moveIndex === -1 && gameBoard[4] === "") {
        moveIndex = 4;
      }

      // Choose a random corner
      if (moveIndex === -1) {
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(
          (index) => gameBoard[index] === ""
        );
        if (availableCorners.length > 0) {
          moveIndex =
            availableCorners[
              Math.floor(Math.random() * availableCorners.length)
            ];
        }
      }

      // Choose a random available cell
      if (moveIndex === -1) {
        const availableCells = gameBoard
          .map((cell, index) => (cell === "" ? index : null))
          .filter((index) => index !== null);

        if (availableCells.length > 0) {
          moveIndex =
            availableCells[Math.floor(Math.random() * availableCells.length)];
        }
      }

      // Make the computer move
      if (moveIndex !== -1) {
        const cell = document.querySelector(`.cell[data-cell="${moveIndex}"]`);
        gameBoard[moveIndex] = "o";
        cell.classList.add("o");

        // Remove event listener to prevent human interaction during computer's turn
        cell.removeEventListener("click", handleCellClick);

        // Check for win or draw after computer move
        if (checkWin()) {
          endGame(false);
        } else if (isDraw()) {
          endGame(true);
        } else {
          // Switch back to player
          currentPlayer = 1;
          currentPlayerElement.textContent = currentPlayer;
          gameStatusElement.textContent = "Game in progress...";

          // Update player indicators
          playerIndicators.forEach((indicator) =>
            indicator.classList.remove("active")
          );
          playerIndicators[0].classList.add("active");
        }
      }
    }, 800);
  }

  function findWinningMove(symbol) {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      const boardValues = [gameBoard[a], gameBoard[b], gameBoard[c]];

      // Count symbols and empty cells
      const symbolCount = boardValues.filter((val) => val === symbol).length;
      const emptyCount = boardValues.filter((val) => val === "").length;

      if (symbolCount === 2 && emptyCount === 1) {
        // Return the empty cell index
        if (gameBoard[a] === "") return a;
        if (gameBoard[b] === "") return b;
        if (gameBoard[c] === "") return c;
      }
    }
    return -1;
  }

  function checkWin() {
    return winningCombinations.some((combination) => {
      const [a, b, c] = combination;
      if (
        gameBoard[a] &&
        gameBoard[a] === gameBoard[b] &&
        gameBoard[a] === gameBoard[c]
      ) {
        // Highlight winning cells
        combination.forEach((index) => {
          cells[index].classList.add("winning-cell");
        });
        return true;
      }
      return false;
    });
  }

  function isDraw() {
    return gameBoard.every((cell) => cell !== "");
  }

  function endGame(isDraw) {
    gameActive = false;

    if (isDraw) {
      gameStatusElement.textContent = "Game ended in a draw!";
      gameStatusElement.style.color = "#feb47b";
    } else {
      gameStatusElement.textContent = `Player ${currentPlayer} wins!`;
      gameStatusElement.style.color = "#ff7e5f";
    }
  }

  restartButton.addEventListener("click", initGame);

  // Add hover effects for mobile
  cells.forEach((cell) => {
    cell.addEventListener("touchstart", function () {
      this.classList.add("hover-effect");
    });

    cell.addEventListener("touchend", function () {
      this.classList.remove("hover-effect");
    });
  });
});
