class App {
    private readonly _canvas: CanvasHelper
    private gold: number
    private wood: number
    
    constructor(canvasElem: HTMLCanvasElement) {
        this._canvas = new CanvasHelper(canvasElem)
        this.gold = 0
        this.wood = 0
    }

    public gameLoop(): void {

    }
}


let init = function () {
    const Game = new App(<HTMLCanvasElement>document.getElementById('canvas'));
    window.setInterval(() => Game.gameLoop(), 1000 / 60)
};
window.addEventListener('load', init);