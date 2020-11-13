export default class Game {
    constructor(size) {
        // handle if size <2 ?
        this.size = size;   // size of one side of board

        this.gameState = {  // game state object
            board: [],
            score: 0,
            won: false,
            over: false
        }

        // initialize board to empty
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                this.gameState.board[row * this.size + col] = 0;
            }
        }

        // add 2 random new tiles to board
        this.gameState.board[0] = generateNewTile();
        this.gameState.board[1] = generateNewTile();

        // randomize game board
        shuffle(this.gameState.board);

        // listeners
        this.moveListeners = [];
        this.winListeners = [];
        this.loseListeners = [];

    }

    updateMoveListeners() {
        this.moveListeners.forEach((l) => l(this.gameState));
    }

    updateWinListeners() {
        this.winListeners.forEach((l) => l(this.gameState));
    }

    updateLoseListeners() {
        this.loseListeners.forEach((l) => l(this.gameState));
    }


    /**
     * Resets the game back to a random starting position.
     */
    setupNewGame() {
        this.gameState = {  // reset game state object to defaults
            board: [],
            score: 0,
            won: false,
            over: false
        }

        // initialize board to empty
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                this.gameState.board[row * this.size + col] = 0;
            }
        }

        // add 2 random new tiles to board
        this.gameState.board[0] = generateNewTile();
        this.gameState.board[1] = generateNewTile();

        // randomize game board
        shuffle(this.gameState.board);

        // listeners
        // this.moveListeners = [];
        // this.winListeners = [];
        // this.loseListeners = [];

    }

    /**
     * Given a gameState object, it loads that board, score, etc...
     * @param {Object} gameState 
     */
    loadGame(gameState) {
        this.gameState = gameState;
    }

    /**
     * Given "up", "down", "left", or "right" as string input, it makes the appropriate shifts and adds a random tile.
     * @param {String} direction 
     */
    move(direction) {

        const boardBefore = [...this.gameState.board];
        let made2048 = false;

        // shift all values in this.gameState.board in direction
        switch (direction) {
            case "up":
                // for size 4x4
                // col 0: 0, 4, 8, 12
                // col 1: 1, 5, 9, 13       
                // col 2: 2, 6, 10, 14
                // col 3: 3, 7, 11, 15
                for (let col = 0; col < this.size; col++) {
                    let tiles = []
                    for (let row = 0; row < this.size; row++) {
                        tiles.push(this.gameState.board[row * this.size + col]);
                    }
                    let pos = 0;
                    for (let i = 0; i < this.size; i++) {
                        if (tiles[i] == 0) {    // empty tile
                            continue;
                        } else {                // tile found
                            let j = i + 1;
                            let followingTile = false;
                            while (j < this.size) {
                                if (tiles[j] == 0) {
                                    j++;
                                } else {
                                    followingTile = true;
                                    if (tiles[i] == tiles[j]) {   // combine values at pos
                                        let newTile = tiles[i] + tiles[j];
                                        if (newTile == 2048) {
                                            made2048 = true;
                                            if (!this.gameState.won) {                      // checks if game was not already won
                                                this.gameState.won = true;
                                            }
                                        }
                                        this.gameState.board[pos * this.size + col] = newTile;
                                        this.gameState.score += newTile;
                                        tiles[i] = 0;
                                        tiles[j] = 0;
                                        pos++;
                                        break;
                                    } else {                    // shift i to pos
                                        this.gameState.board[pos * this.size + col] = tiles[i];
                                        tiles[i] = 0;
                                        pos++;
                                        break;
                                    }
                                }
                            }
                            if (!followingTile) {
                                this.gameState.board[pos * this.size + col] = tiles[i];
                                pos++;
                            }
                        }
                    }
                    while (pos < this.size) {
                        this.gameState.board[pos * this.size + col] = 0;
                        pos++;
                    }
                }
                break;

            case "down":
                // for size 4x4
                // col 0: 12, 8, 4, 0
                // col 1: 13, 9, 5, 1       
                // col 2: 14, 10, 6, 2
                // col 3: 15, 11, 7, 3
                for (let col = 0; col < this.size; col++) {
                    let tiles = []
                    for (let row = this.size - 1; row >= 0; row--) {
                        tiles.push(this.gameState.board[row * this.size + col]);
                    }
                    let pos = this.size - 1;
                    for (let i = 0; i < this.size; i++) {
                        if (tiles[i] == 0) {    // empty tile
                            continue;
                        } else {                // tile found
                            let j = i + 1;
                            let followingTile = false;
                            while (j < this.size) {
                                if (tiles[j] == 0) {
                                    j++;
                                } else {
                                    followingTile = true;
                                    if (tiles[i] == tiles[j]) {   // combine values at pos
                                        let newTile = tiles[i] + tiles[j];
                                        if (newTile == 2048) {
                                            made2048 = true;
                                            if (!this.gameState.won) {                      // checks if game was not already won
                                                this.gameState.won = true;
                                            }
                                        }
                                        this.gameState.board[pos * this.size + col] = newTile;
                                        this.gameState.score += newTile;
                                        tiles[i] = 0;
                                        tiles[j] = 0;
                                        pos--;
                                        break;
                                    } else {                    // shift i to pos
                                        this.gameState.board[pos * this.size + col] = tiles[i];
                                        tiles[i] = 0;
                                        pos--;
                                        break;
                                    }
                                }
                            }
                            if (!followingTile) {
                                this.gameState.board[pos * this.size + col] = tiles[i];
                                pos--;
                            }
                        }
                    }
                    while (pos >= 0) {
                        this.gameState.board[pos * this.size + col] = 0;
                        pos--;
                    }
                }
                break;

            case "left":
                // for size 4x4
                // row 0: 0, 1, 2, 3
                // row 1: 4, 5, 6, 7       
                // row 2: 8, 9, 10, 11
                // row 3: 12, 13, 14, 15
                for (let row = 0; row < this.size; row++) {
                    let tiles = []
                    for (let col = 0; col < this.size; col++) {
                        tiles.push(this.gameState.board[row * this.size + col]);
                    }
                    let pos = 0;
                    for (let i = 0; i < this.size; i++) {
                        if (tiles[i] == 0) {    // empty tile
                            continue;
                        } else {                // tile found
                            let j = i + 1;
                            let followingTile = false;
                            while (j < this.size) {
                                if (tiles[j] == 0) {
                                    j++;
                                } else {
                                    followingTile = true;
                                    if (tiles[i] == tiles[j]) {   // combine values at pos
                                        let newTile = tiles[i] + tiles[j];
                                        if (newTile == 2048) {
                                            made2048 = true;
                                            if (!this.gameState.won) {                      // checks if game was not already won
                                                this.gameState.won = true;
                                            }
                                        }
                                        this.gameState.board[row * this.size + pos] = newTile;
                                        this.gameState.score += newTile;
                                        tiles[i] = 0;
                                        tiles[j] = 0;
                                        pos++;
                                        break;
                                    } else {                    // shift i to pos
                                        this.gameState.board[row * this.size + pos] = tiles[i];
                                        tiles[i] = 0;
                                        pos++;
                                        break;
                                    }
                                }
                            }
                            if (!followingTile) {
                                this.gameState.board[row * this.size + pos] = tiles[i];
                                pos++;
                            }
                        }
                    }
                    while (pos < this.size) {
                        this.gameState.board[row * this.size + pos] = 0;
                        pos++;
                    }
                }
                break;

            case "right":
                // for size 4x4
                // row 0: 3, 2, 1, 0
                // row 1: 7, 6, 5, 4       
                // row 2: 11, 10, 9, 8
                // row 3: 15, 14, 13, 12
                for (let row = 0; row < this.size; row++) {
                    let tiles = []
                    for (let col = this.size - 1; col >= 0; col--) {
                        tiles.push(this.gameState.board[row * this.size + col]);
                    }
                    let pos = this.size - 1;
                    for (let i = 0; i < this.size; i++) {
                        if (tiles[i] == 0) {    // empty tile
                            continue;
                        } else {                // tile found
                            let j = i + 1;
                            let followingTile = false;
                            while (j < this.size) {
                                if (tiles[j] == 0) {
                                    j++;
                                } else {
                                    followingTile = true;
                                    if (tiles[i] == tiles[j]) {   // combine values at pos
                                        let newTile = tiles[i] + tiles[j];
                                        if (newTile == 2048) {
                                            made2048 = true;
                                            if (!this.gameState.won) {                      // checks if game was not already won
                                                this.gameState.won = true;
                                            }
                                        }
                                        this.gameState.board[row * this.size + pos] = newTile;
                                        this.gameState.score += newTile;
                                        tiles[i] = 0;
                                        tiles[j] = 0;
                                        pos--;
                                        break;
                                    } else {                    // shift i to pos
                                        this.gameState.board[row * this.size + pos] = tiles[i];
                                        tiles[i] = 0;
                                        pos--;
                                        break;
                                    }
                                }
                            }
                            if (!followingTile) {
                                this.gameState.board[row * this.size + pos] = tiles[i];
                                pos--;
                            }
                        }
                    }
                    while (pos >= 0) {
                        this.gameState.board[row * this.size + pos] = 0;
                        pos--;
                    }
                }
                break;

            default:
                break;
        }


        // Check if legal move was made...
        // A legal move is one that causes pieces to slide or collapse on the board.
        if (JSON.stringify(boardBefore) == JSON.stringify(this.gameState.board)) {      // break if legal move was not made
            //console.log("Not currently a legal move: " + direction);
            return;
        }

        // generate random new tile
        let newTile;
        let rng = Math.random();
        if (rng < .90) {
            newTile = 2;    // 90% chance
        } else {
            newTile = 4;    // 10% chance
        }

        // get array of empty tile indexes
        let emptyIndexes = []
        for (let i = 0; i < this.gameState.board.length; i++) {
            if (this.gameState.board[i] == 0) {
                emptyIndexes.push(i);
            }
        }

        // add tile randomly to random index
        shuffle(emptyIndexes);
        this.gameState.board[emptyIndexes[0]] = newTile;

        // update move listeners
        this.updateMoveListeners();
        
        //checks if game was won
        if (made2048 && this.gameState.won) {
            this.updateWinListeners();
        }


        // checks if there are still moves left after adding random tile
        if (!this.checkMoves()) {
            this.updateLoseListeners();            // calls lose listener
            this.gameState.over = true;
        }

    }


    /**
     * Return true if another move is still available.
     * Return false if no moves are available.
     */
    checkMoves() {
        /**** Check if any empty tiles remain ****/
        if (this.gameState.board.includes(0)) {
            return true;
        }

        /**** Check if any possible combinations remain ****/
        // Check "vertical" move
        for (let col = 0; col < this.size; col++) {
            let tiles = []
            for (let row = 0; row < this.size - 1; row++) {
                if (this.gameState.board[row * this.size + col] == this.gameState.board[(row + 1) * this.size + col]) {
                    return true;
                }
            }
        }

        // Check "horizontal" move
        for (let row = 0; row < this.size; row++) {
            let tiles = []
            for (let col = 0; col < this.size - 1; col++) {
                if (this.gameState.board[row * this.size + col] == this.gameState.board[row * this.size + (col + 1)]) {
                    return true;
                }
            }
        }

        /**** No Legal Moves Available */
        return false;

    }


    /**
     * Returns a string representation of the game as text/ascii.
     */
    toString() {
        let board = "";
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.gameState.board[row * this.size + col] == 0) {
                    board += "[ ] ";
                } else {
                    board += "[" + this.gameState.board[row * this.size + col] + "] ";
                }
            }
            board += "\n"
        }
        return board;
    }


    onMove(callback) {
        this.moveListeners.push(callback);
    }

    onWin(callback) {
        this.winListeners.push(callback);
    }

    onLose(callback) {
        this.loseListeners.push(callback);
    }

    /**
     * Returns an accurate gameState object representing the current game state.
     */
    getGameState() {
        return this.gameState;
    }

    checkWon() {
        return this.gameState.won;
    }

    checkOver() {
        return this.gameState.over;
    }


}

/**
 * Generate a new tile with given probabilities
 * 90% chance = 2
 * 10% chance = 4
 * @return {number}     Tile value, either 2 or 4
 */
let generateNewTile = function () {
    let rng = Math.random();
    if (rng < .90) {
        return 2;    // 90% chance
    } else {
        return 4;    // 10% chance
    }
}


/*
* Randomly shuffle an array
* https://stackoverflow.com/a/2450976/1293256
* @param  {Array} array The array to shuffle
* @return {String}      The first item in the shuffled array
*/
let shuffle = function (array) {

    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;

};
