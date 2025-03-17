function createGameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(0);
        }
    }

    const getBoard = () => board;

    const placePiece = (row, col, piece) => {
        board[row].splice(col,1,piece);
    }

    const printBoard = () => {
        for (let i = 0; i<rows;i++) {
            console.log(`${board[i]}\n`);
        }
    }
    
    return {getBoard, placePiece, printBoard};
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

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.\n`);
    };

    const playRound = (row, column) => {
        console.log(`Dropping ${getActivePlayer().name}'s token into row ${row+1} and column ${column+1}...\n`);
        board.placePiece(row, column, getActivePlayer().piece);

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

        let winner = checkWinner();
        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {playRound,getActivePlayer};
}

const game = gameController();

game.playRound(0,0); //x
game.playRound(0,1); //o
game.playRound(1,1); //x
game.playRound(1,1); //o
game.playRound(1,2); //x
game.playRound(2,1); //o