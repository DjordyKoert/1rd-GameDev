class HomeView extends BaseView{
    protected _screen: string = "homeScreen";
    private _canvasHelper: CanvasHelper;
    private _context: 

    public constructor(screen: string){
        super(Canvas)
        this._screen = screen;
    }

    public homeScreen(){
        this.writeTextToCanvas("BACK", 140, horizontalCenter, 150);


    }

}