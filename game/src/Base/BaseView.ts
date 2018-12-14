class BaseView {
    public curScreen: string
    protected _canvasHelper: CanvasHelper
    public constructor(canvas: HTMLCanvasElement, screen:string){
        this._canvasHelper = new CanvasHelper(canvas)
        this.curScreen = screen
        //this._homeView.homeScreen()
    }

}