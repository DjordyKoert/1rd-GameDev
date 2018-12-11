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

    public homeScreen(){
        this.CanvasHelper.writeTextToCanvas("PLAY", 24, 100, 100);
        
        this._context.fillStyle="#ffeda0";
        this._context.fillRect(0,0,150,100)
    }
}
