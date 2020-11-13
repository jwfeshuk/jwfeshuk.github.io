// let View = class {
export default class View {
    constructor(model) {
        this.model = model;
        this.listeners = [];
        this.div = $('<div class="container"></div>');

        let title = $('<h1>2048</h1>');
        this.div.append(title);

        // new game
        let resetButton = $('<button>New Game</button>')
            .on('click', () => {
                this.updateListeners({
                    action: 'reset',
                });
            });
        
        this.div.append(resetButton);

        // board
        let board = $('<div class="board"></div>');
        for (let r=0; r<model.size; r++) {
            for (let c=0; c<model.size; c++) {
                let tile_view = new TileView(model.gameState.board[r * model.size + c]);
                board.append(tile_view.div);
            }
        }
        this.div.append(board);

        // move listener
        $(document).on('keydown', (e) => {
            let move = '';
            switch (e.keyCode) {
                case 37:    // left arrow
                case 65:    // a
                    move = 'left';
                    break;
                case 38:    // up arrow
                case 87:    // w
                    move = 'up';
                    break;
                case 39:    // right arrow
                case 68:    // d
                    move = 'right';
                    break;
                case 40:    // down arrow
                case 83:    //
                    move = 'down';
                    break;
            }

            this.updateListeners({
                action: 'move',
                move: move
            });

        })

        // message
        this.div.append($('<div class="message"></div>').hide());

        // score
        this.div.append($('<div class="score">Score: <span id="score">0</span>'));

        // instructions
        let instructions = `<p><b>HOW TO PLAY:</b> Use your <b>arrow keys</b> 
            or <b>WASD keys</b> to move the tiles. Tiles with the same number
            <b>merge into one</b> when they touch. Add them up to reach 
            <b>2048!</b></p>`;

        this.div.append(instructions);

    }

    addListener(listener) {
        let idx = this.listeners.findIndex((l) => l == listener);
        if (idx == -1) {
            this.listeners.push(listener);
        }
    }

    removeListener(listener) {
        let idx = this.listeners.findIndex((l) => l == listener);
        if (idx != -1) {
            this.listeners.splice(idx, 1);
        }
    }

    updateListeners(event) {
        this.listeners.forEach((l) => l(event));
    }

    update() {
        let board = $('<div class="board"></div>');
        for (let r=0; r<this.model.size; r++) {
            for (let c=0; c<this.model.size; c++) {
                let tile_view = new TileView(this.model.gameState.board[r * this.model.size + c]);
                board.append(tile_view.div);
            }
        }
        $("div.board").replaceWith(board);
        $("#score").html(this.model.gameState.score);

        if (!this.model.checkWon() && !this.model.checkOver()) {
            $("div.message").empty().hide();

        }
        if (this.model.checkWon()) {
            $("div.message").html("You WON!!!").show();
        }
        if (this.model.checkOver()) {
            $("div.message").html("Game Over! Try again?").show();
        }

    }

}

let TileView = class {
    constructor(value) {
        if (value != 0) {
            this.div = $(`<div class="tile tile-${value}">${value}</div>`);
        } else {
            this.div = $(`<div class="tile tile-${value}"></div>`);
        }
    }
}

