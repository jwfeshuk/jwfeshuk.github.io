import Game from './game.js';
import View from './view.js';
import Controller from './controller.js';

let model = null;
let view = null;
let controller = null;

$(document).ready(() => {
    model = new Game(4);
    view = new View(model);
    controller = new Controller(model, view);

    $('body').empty().append(view.div);
});
