function createGameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(createSquare().getPiece());
        }
    }

    const getBoard = () => board;

    const placePiece = (row, col, piece) => {
        board[row].splice(col,1,piece);
    }
    
    return {getBoard, placePiece};
}

function createSquare() {
    let sqValue = 0;

    const addPiece = (piece) => {
        sqValue = piece;
    }

    const getPiece = () => sqValue;

    return {addPiece, getPiece};
}

function createPlayer(name,piece) {
    return {name, piece};
}

function gameController() {
    const board = createGameboard();
    const player1 = createPlayer("Player X", 1);
    const player2 = createPlayer("Player O", 2);
    const players = [player1,player2];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const checkWinner = () => {
        let winner = '';
        const currentBoard = board.getBoard();
        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i].every(val => val === 1) || currentBoard[i].every(val => val === 2)) {
                winner = getActivePlayer().name;
            }
        }

        for (let j = 0; j < currentBoard.length; j++) {
            let col = currentBoard.map(row => row[j]);
            if (col.every(val => val === 1) || col.every(val => val === 2)) {
                winner = getActivePlayer().name;
            }
        }

        if (currentBoard.every((row, i) => row[i] === 1) || currentBoard.every((row, i) => row[i] === 2)) {
            winner = getActivePlayer().name;
        }

        if (currentBoard.every((row, i) => row[currentBoard.length - 1 - i] === 1) || currentBoard.every((row, i) => row[currentBoard.length - 1 - i] === 2)) {
            winner = getActivePlayer().name;
        }

        return winner;
    }

    const playRound = (row, column) => {
        board.placePiece(row, column, getActivePlayer().piece);

        if (checkWinner() === "") switchPlayerTurn();
    };

    return {playRound,getActivePlayer, getBoard: board.getBoard, checkWinner};
}

function ScreenController() {
    const game = gameController();
    const turnUpdate = document.querySelector('.header h2');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        console.log(board);
        const activePlayer = game.getActivePlayer();

        turnUpdate.textContent = `${activePlayer.name}'s turn`;

        board.forEach((row,rowIndex) => {
            row.forEach((square, index) => {

              const cellButton = document.createElement("button");
              cellButton.classList.add("cell");

              cellButton.dataset.column = index;
              cellButton.dataset.row = rowIndex;
              cellButton.textContent = square;
              boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandler(e) {
        const selectedCol = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedCol && selectedRow) return;

        game.playRound(selectedRow, selectedCol);

        if (game.checkWinner() !== "") {
            const winner = game.checkWinner();
            winnerMessage.textContent = `${winner} wins!`
            dialog.showModal();
        }

        updateScreen();
    }

    boardDiv.addEventListener("click",clickHandler);
    updateScreen();

    const dialog = document.querySelector("dialog");
    const winnerMessage = document.querySelector("dialog h1");
    const restart = document.querySelector("dialog button");

    restart.addEventListener("click", () => {
        location.reload();
        dialog.close();
    })
}

ScreenController();