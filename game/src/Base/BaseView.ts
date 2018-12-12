class BaseView {
    private _canvasHelper: CanvasHelper
    private _homeView: HomeView
    private _GameView: GameView
    private _StartView: StartView
    public constructor(canvas: HTMLCanvasElement){
        this._canvasHelper = new CanvasHelper(canvas)
        this._StartView = new StartView(this._canvasHelper)
        this._homeView = new HomeView(this._canvasHelper)
        this._GameView = new GameView(this._canvasHelper)
        //this._homeView.homeScreen()
    }
    public render() {
        this._GameView.renderScreen()
    }
}