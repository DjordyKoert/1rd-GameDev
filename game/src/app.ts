/// <reference path="./Helpers/CanvasHelper.ts" />
class App {
    private readonly _canvas: BaseView
    public static _gold: number = 0
    public static _wood: number = 0
    public static _stone: number = 0
    public static _klimaat: number = 0

    constructor(canvasElem: HTMLCanvasElement) {
        this._canvas = new BaseView(canvasElem)
        BaseView.changeScreen("home")
    }

    public gameLoop(): void {
        this._canvas.render()
    }


    public static updateWood(num: number) {
        this._wood += num
    }
    public static getWood() {
        return this._wood
    }
    
    public static updateGold(num: number) {
        this._gold += num
    }
    public static getGold() {
        return this._gold
    }
    
    public static updateStone(num: number) {
        this._stone += num
    }
    public static getStone() {
        return this._stone
    }

    public static updateKlimaat(num: number) {
        this._klimaat += num
        if (this._klimaat >= 75) {
            this._klimaat = 75
        }
    }
    public static getKlimaat() {
        return this._klimaat
    }
}


let init = function () {
    const Game = new App(<HTMLCanvasElement>document.getElementById('canvas'));
    window.setInterval(() => Game.gameLoop(), 1000 / 60)
};
window.addEventListener('load', init);