/// <reference path="./Helpers/CanvasHelper.ts" />
class App {
    private readonly _canvas: BaseView
    public _gold: number
    public _wood: number
    public _stone: number

    constructor(canvasElem: HTMLCanvasElement) {
        this._canvas = new BaseView(canvasElem)
        this._gold = 0
        this._wood = 0
        this._stone = 0
    }

    public gameLoop(): void {
        this._canvas.render()
    }

    public getGold(): number {
        return this._gold
    }
}


let init = function () {
    const Game = new App(<HTMLCanvasElement>document.getElementById('canvas'));
    window.setInterval(() => Game.gameLoop(), 1000 / 60)
};
window.addEventListener('load', init);