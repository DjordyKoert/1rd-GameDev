class BuilderView{
    private _canvasHelper: CanvasHelper
    protected _screen: string = "homeScreen";
    //private _context: CanvasRenderingContext2D;
    //protected CanvasHelper: CanvasHelper

    public constructor(canvas: CanvasHelper){
        this._canvasHelper = canvas
        //super(canvas)
        // this._screen = screen;
        // this._context = ctx;
        // this.CanvasHelper = new CanvasHelper(canvas)
        //this.homeScreen()
    }
}