class app {
    private readonly _canvas: CanvasHelper
    private gold: number
    private wood: number
    
    constructor(canvasElem: HTMLCanvasElement) {
        this._canvas = canvasElem
        this.gold = 0
        this.wood = 0
    }

    public gameLoop(): void {

    }
}


let init = function () {
    const App = new app(<HTMLCanvasElement>document.getElementById('canvas'));
    window.setInterval(() => App.gameLoop(), 1000 / 60)
};
window.addEventListener('load', init);