/// <reference path="./Helpers/CanvasHelper.ts" />
class App {
    private readonly _canvas: CanvasHelper
    private _gold: number
    private _wood: number
    
    constructor(canvasElem: HTMLCanvasElement) {
        this._canvas = new CanvasHelper(canvasElem)
        this._gold = 0
        this._wood = 0
    }

    public gameLoop(): void {

    }
}


let init = function () {
    const Game = new App(<HTMLCanvasElement>document.getElementById('canvas'));
    window.setInterval(() => Game.gameLoop(), 1000 / 60)
};
window.addEventListener('load', init);