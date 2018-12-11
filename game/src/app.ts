/// <reference path="./Helpers/CanvasHelper.ts" />
class App {
    private readonly _baseView: BaseView
    private _gold: number
    private _wood: number

    constructor(canvasElem: HTMLCanvasElement) {
        this._baseView = new BaseView(canvasElem)
        this._gold = 0
        this._wood = 0
    }

    public gameLoop(): void {
        this._baseView.render()
    }
}


let init = function () {
    const Game = new App(<HTMLCanvasElement>document.getElementById('canvas'));
    window.setInterval(() => Game.gameLoop(), 1000 / 60)
    //Game.gameLoop()
};
window.addEventListener('load', init);