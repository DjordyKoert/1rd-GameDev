class App {
    private readonly _canvas: CanvasHelper
    private gold: number
    private wood: number
    protected homeView: HomeView
    


    constructor(canvasElem: HTMLCanvasElement) {
        this._canvas = canvasElem
        this.gold = 0
        this.wood = 0

        //this.homeView.homeScreen()
    }

    public gameLoop(): void {

    }
}


let init = function () {
    const Game = new App(<HTMLCanvasElement>document.getElementById('canvas'));
    window.setInterval(() => Game.gameLoop(), 1000 / 60)
};
window.addEventListener('load', init);