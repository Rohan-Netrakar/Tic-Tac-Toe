document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const gameInfo = document.getElementById('gameInfo');
    const currentPlayerDisplay = document.getElementById('currentPlayer');
    const gameStatusDisplay = document.getElementById('gameStatus');
    const restartButton = document.getElementById('restartButton');

    let currentPlayer = 1;
    let gameActive = true;
    let gameState = ["", "", "", "", "", "", "", "", ""]; 
    // Represents the Tic-Tac-Toe board state

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(event) {
        const cell = event.target;
        const cellIndex = parseInt(cell.getAttribute('data-cell'));

        if (gameState[cellIndex] !== "" || !gameActive) {
            return;
        }

        gameState[cellIndex] = currentPlayer === 1 ? 'X' : 'O';
        cell.textContent = gameState[cellIndex];

        if (checkWin()) {
            gameStatusDisplay.textContent = `Player ${currentPlayer} wins!`;
            highlightWinningCells();
            gameActive = false;
            return;
        }

        if (checkDraw()) {
            gameStatusDisplay.textContent = 'It\'s a draw!';
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 1 ? 2 : 1;
        currentPlayerDisplay.textContent = currentPlayer;
    }

    function checkWin() {
        for (let condition of winningConditions) {
            let [a, b, c] = condition;
            if (gameState[a] !== "" && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return true;
            }
        }
        return false;
    }

    function checkDraw() {
        return gameState.every(cell => cell !== "");
    }

    function highlightWinningCells() {
        for (let condition of winningConditions) {
            let [a, b, c] = condition;
            if (gameState[a] !== "" && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                // Add a class to highlight the winning cells
                cells[a].classList.add('winning-cell');
                cells[b].classList.add('winning-cell');
                cells[c].classList.add('winning-cell');
                break;
            }
        }
    }

    function restartGame() {
        currentPlayer = 1;
        gameActive = true;
        gameState = ["", "", "", "", "", "", "", "", ""];
        gameStatusDisplay.textContent = 'Game in progress...';
        currentPlayerDisplay.textContent = currentPlayer;
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove('winning-cell'); // Remove winning-cell class on restart
        });
    }

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', restartGame);
});
