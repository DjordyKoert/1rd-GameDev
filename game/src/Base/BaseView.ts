class BaseView {
    protected _canvasHelper: CanvasHelper
    protected _canvasHelperOverlay: CanvasHelper
    protected _canvasWarning: CanvasHelper
    protected _mouseHelper: MouseHelper
    public constructor(canvas: HTMLCanvasElement){
        this._canvasHelper = new CanvasHelper(canvas)
        this._canvasHelperOverlay = new CanvasHelper(<HTMLCanvasElement>document.getElementById("canvasOverlay"))
        this._canvasWarning = new CanvasHelper(<HTMLCanvasElement>document.getElementById("canvasWarning"))
        this._mouseHelper = new MouseHelper()
        //this._homeView.homeScreen()
    }
    protected ResourceCheck(wood: number, stone: number, gold: number): boolean {
        if (App._wood >= wood && App._stone >= stone && App._gold >= gold) {
            App._wood -= wood
            App._stone -= stone
            App._gold -= gold
            return true
        }
        else { this._canvasWarning.writeWarning(`Je mist ${App._wood - wood} hout, ${App._stone - stone} steen en ${App._gold - gold} goud`); return false }
    }
}