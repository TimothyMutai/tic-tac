const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => [...board]; // Return a shallow copy of the board

    const setMark = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, resetBoard };
})();

const Player = (name, mark) => {
    return { name, mark };
};

// const player1 = Player("Alice", "X"); // Player 1 is Alice with mark X.
// const player2 = Player("Bob", "O"); // Player 2 is Bob with mark O.

let player1;
let player2;
let currentPlayer;
let gameOver = false;

const startGame = (name1, name2) => {
    player1 = Player(name1, "X");
    player2 = Player(name2, "O");
    currentPlayer = player1;
    gameOver = false;
    Gameboard.resetBoard();
    console.log("Game Started");
};

const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
};

const playRound = (index) => {
    if (gameOver) return;

    const success = Gameboard.setMark(index, currentPlayer.mark);
    if (!success) {
        console.log("Cell already occupied!");
        return;
    }

    if (checkWin()) {
        console.log(`${currentPlayer.name} wins!`);
        gameOver = true;
        return;
    }

    if (checkTie()) {
        console.log("It's a tie!");
        gameOver = true;
        return;
    }

    switchPlayer();
};

const checkWin = () => {
    const board = Gameboard.getBoard();
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winPatterns.some(pattern =>
        pattern.every(index => board[index] === currentPlayer.mark)
    );
};

const checkTie = () => {
    return Gameboard.getBoard().every(cell => cell !== "");
};

return {
    startGame,
    playRound
};

const DisplayController = (() => {
    const cells = document.querySelectorAll(".cell");

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            const index = cell.dataset.index;
            GameController.playRound(index);
            renderBoard();
        });
    });

    return {
        renderBoard
    };
})();


