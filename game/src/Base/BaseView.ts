class BaseView {
    protected _canvasHelper: CanvasHelper
    protected _mouseHelper: MouseHelper
    public constructor(canvas: HTMLCanvasElement){
        this._canvasHelper = new CanvasHelper(canvas)
        this._mouseHelper = new MouseHelper()
        //this._homeView.homeScreen()
    }

}