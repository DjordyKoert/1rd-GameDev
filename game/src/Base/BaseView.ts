class BaseView {
    private _canvasHelper: CanvasHelper
    private _homeView: HomeView
    private _BuilderView: BuilderView
    private _GameView: GameView
    private _UIView: UIView
    public constructor(canvas: HTMLCanvasElement){
        this._canvasHelper = new CanvasHelper(canvas)
        
        this._homeView = new HomeView(this._canvasHelper)
        this._BuilderView = new BuilderView(this._canvasHelper)
        this._GameView = new GameView(this._canvasHelper)
        this._UIView = new UIView(this._canvasHelper)
        //this._homeView.homeScreen()
    }
    public render() {
        this._homeView.renderScreen()
    }
}