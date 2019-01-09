/// <reference path="./Helpers/CanvasHelper.ts" />
class App {
    private _homeView: HomeView
    private _startView: StartView
    private _gameView: GameView
    private _gameOverView: GameOverView
    public static _gold: number
    public static _wood: number
    public static _stone: number
    public static _klimaat: number
    public static _screen: string
    public static _name: string
    public static _timer: number

    constructor(canvasElem: HTMLCanvasElement) {
        this._homeView = new HomeView(canvasElem)
        this._startView = new StartView(canvasElem)
        this._gameView = new GameView(canvasElem)
        this._gameOverView = new GameOverView(canvasElem)
        App._klimaat = 1
        App._gold = 0
        App._wood = 0
        App._stone = 0
        App._screen = "start"
        App._timer = 0

        setInterval(() => this.timer(), 1000)
    }

    public timer(){
        App._timer += 1
        console.log(App._timer)
    }

    public gameLoop(): void {
        if (App._screen == "start") this._startView.renderScreen()
        if (App._screen == "home") this._homeView.renderScreen()
        if (App._screen == "game") this._gameView.renderScreen()
        if (App._screen == "gameover") this._gameOverView.renderScreen()



        if (App._klimaat <= 0) App._screen = "gameover"
        if(App._klimaat >= 100){
            if(App._wood >= 500){
                if(App._gold >= 500){
                    if(App._stone >= 500){
                        App._screen = "gameover"
                    }
                }
            }
        }
    }
    
}


let init = function () {
    const Game = new App(<HTMLCanvasElement>document.getElementById('canvas'));
    window.setInterval(() => Game.gameLoop(), 1000 / 60)

};
window.addEventListener('load', init);