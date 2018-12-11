class BaseView {

    protected _canvas: HTMLCanvasElement
    private _canvasHelper: CanvasHelper

    protected constructor(canvas: HTMLCanvasElement){

        this._canvasHelper = new CanvasHelper(canvas)

    }
}