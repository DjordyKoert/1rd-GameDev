class BaseView {
    public curScreen: string
    protected _canvasHelper: CanvasHelper
    protected _mouseHelper: MouseHelper
    public constructor(canvas: HTMLCanvasElement, screen:string){
        this._canvasHelper = new CanvasHelper(canvas)
        this._mouseHelper = new MouseHelper()
        this.curScreen = screen
        //this._homeView.homeScreen()
    }

}