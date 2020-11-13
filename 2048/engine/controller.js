export default class Controller {

    constructor(model, view) {
        this.model = model;
        this.view = view;

        view.addListener((e) => {
            if (e.action == 'move') {
                this.move(e.move);
            } else if (e.action == 'reset') {
                this.reset();
            }
        })

    }

    move(direction) {
        this.model.move(direction);
        this.view.update();
    }

    reset() {
        this.model.setupNewGame();
        this.view.update();
    }

}