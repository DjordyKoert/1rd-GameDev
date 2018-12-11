class HomeView extends BaseView{
    protected _screen: string = "homeScreen";
    //private _context: CanvasRenderingContext2D;
    //protected CanvasHelper: CanvasHelper

    public constructor(/*screen: string, ctx: CanvasRenderingContext2D,*/ canvas: HTMLCanvasElement){
        super(canvas)
        // this._screen = screen;
        // this._context = ctx;
        // this.CanvasHelper = new CanvasHelper(canvas)
        this.homeScreen()
    }

    public homeScreen(){
        this._canvasHelper.createRect(0,0,150,100)
        this._canvasHelper.writeTextToCanvas("BACK", 24, 20, 20, "black");
    }
}
