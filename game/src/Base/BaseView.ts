class BaseView {
    protected _canvasHelper: CanvasHelper
    private _canvas: HTMLCanvasElement
    private _HomeView: HomeView
    private _BuilderView: BuilderView

    public constructor(canvas: HTMLCanvasElement){
        this._canvasHelper = new CanvasHelper(canvas)
        this._canvas = canvas

        this._HomeView = new HomeView(canvas)
        this._BuilderView = new BuilderView(canvas)

    }

    public render(){
        console.log("baseview render")
        this._HomeView.render()
    }
}