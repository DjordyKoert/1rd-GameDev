class BaseView {
    private _canvasHelper: CanvasHelper

    public constructor(canvas: HTMLCanvasElement){

        this._canvasHelper = new CanvasHelper(canvas)

    }
}