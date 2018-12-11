class HomeView extends BaseView{
    protected _screen: string = "homeScreen";
    private _context: CanvasRenderingContext2D;

    public constructor(screen: string){
        super(canvas)
        this._screen = screen;
    }

    public homeScreen(){
        this.writeTextToCanvas("BACK", 140, horizontalCenter, 150);


    }

}