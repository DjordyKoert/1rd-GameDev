class BaseView {
    protected _canvasHelper: CanvasHelper
    private _HomeView: HomeView
    private _BuilderView: BuilderView

    public constructor(canvas: HTMLCanvasElement){
        this._canvasHelper = new CanvasHelper(canvas)

        this._HomeView = new HomeView(this._canvasHelper)
        this._BuilderView = new BuilderView(this._canvasHelper)
        console.log("new baseview")
    }

    public render(){
        console.log("baseview render")
        this._HomeView.homeScreen()
    }
}