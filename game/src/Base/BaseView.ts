class BaseView {
    private _canvasHelper: CanvasHelper
    private _homeView: HomeView
    private _BuilderView: BuilderView
    public constructor(canvas: HTMLCanvasElement){
        this._canvasHelper = new CanvasHelper(canvas)
        
        this._homeView = new HomeView(this._canvasHelper)
        this._BuilderView = new BuilderView(this._canvasHelper)
        //this._homeView.homeScreen()
    }
    public render() {
        this._homeView.renderScreen()
    }
}