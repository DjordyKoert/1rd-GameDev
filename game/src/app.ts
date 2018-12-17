/// <reference path="./Helpers/CanvasHelper.ts" />
class App {
    private _homeView: HomeView
    private _startView:StartView
    private _gameView: GameView
    public static _gold: number
    public static _wood: number
    public static _stone: number
    public static _klimaat: number

    constructor(canvasElem: HTMLCanvasElement) {
        this._homeView = new HomeView(canvasElem)
        this._startView = new StartView(canvasElem)
        this._gameView = new GameView(canvasElem)
        App._klimaat = 0
        App._gold = 0
        App._wood = 0
        App._stone = 0
    }

    public gameLoop(): void {
        console.log(this._startView.curScreen)
    }


    // public static updateWood(num: number) {
    //     this._wood += num
    // }
    // public static getWood() {
    //     return this._wood
    // }
    
    // public static updateGold(num: number) {
    //     this._gold += num
    // }
    // public static getGold() {
    //     return this._gold
    // }
    
    // public static updateStone(num: number) {
    //     this._stone += num
    // }
    // public static getStone() {
    //     return this._stone
    // }

    // public static updateKlimaat(num: number) {
    //     this._klimaat += num
    //     if (this._klimaat >= 75) {
    //         this._klimaat = 75
    //     }
    // }
    // public static getKlimaat() {
    //     return this._klimaat
    // }
}


let init = function () {
    const Game = new App(<HTMLCanvasElement>document.getElementById('canvas'));
    window.setInterval(() => Game.gameLoop(), 1000 / 60)
};
window.addEventListener('load', init);