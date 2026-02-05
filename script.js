// GAMEBOARD MODULE
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => [...board];

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

    return { getBoard, setMark, resetBoard };
})();

// PLAYER FACTORY
const Player = (name, mark) => ({ name, mark });

// GAME CONTROLLER
const GameController = (() => {
    let player1, player2, currentPlayer;
    let gameOver = false;
    let winner = null;

    const startGame = () => {
        player1 = Player("Timothy", "X");
        player2 = Player("Mutai", "O");
        currentPlayer = player1;
        gameOver = false;
        winner = null;
        Gameboard.resetBoard();
    };

    const playRound = (index) => {
        if (gameOver) return;

        if (!Gameboard.setMark(index, currentPlayer.mark)) return;

        if (checkWin()) {
            winner = currentPlayer;
            gameOver = true;
            return;
        }

        if (checkTie()) {
            gameOver = true;
            return;
        }

        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWin = () => {
        const board = Gameboard.getBoard();
        const wins = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return wins.some(pattern =>
            pattern.every(i => board[i] === currentPlayer.mark)
        );
    };

    const checkTie = () => {
        return Gameboard.getBoard().every(cell => cell !== "");
    };

    return {
        startGame,
        playRound,
        getCurrentPlayer: () => currentPlayer,
        isGameOver: () => gameOver,
        getWinner: () => winner
    };
})();

// DISPLAY CONTROLLER
const DisplayController = (() => {
    const cells = document.querySelectorAll(".cell");
    const status = document.getElementById("status");
    const restartBtn = document.getElementById("restart");

    const render = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, i) => cell.textContent = board[i]);
        updateStatus();
    };

    const updateStatus = () => {
        if (GameController.isGameOver()) {
            const winner = GameController.getWinner();
            status.textContent = winner
                ? `${winner.name} wins! 🎉`
                : "It's a tie 🤝";
        } else {
            const player = GameController.getCurrentPlayer();
            status.textContent = `${player.name}'s turn (${player.mark})`;
        }
    };

    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            GameController.playRound(Number(cell.dataset.index));
            render();
        });
    });

    restartBtn.addEventListener("click", () => {
        GameController.startGame();
        render();
    });

    return { render };
})();

// INITIAL LOAD
GameController.startGame();
DisplayController.render();
