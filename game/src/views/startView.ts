class StartView extends BaseView {
    protected _screen: string = "homeScreen";
    private _context: CanvasRenderingContext2D;
    protected CanvasHelper: CanvasHelper
   
    public constructor(screen: string, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement){
        super(canvas)
        this._screen = screen;
        this._context = ctx;
        this.CanvasHelper = new CanvasHelper(canvas)
    }

    public renderScreen(){
        this.CanvasHelper.writeButtonToCanvas(200,200,200,200, "START GAME", 50)
    }
}
