class HomeView {
    protected _screen: string = "homeScreen";
    protected CanvasHelper: CanvasHelper

    public constructor(canvas: CanvasHelper){
        this.CanvasHelper = canvas
    }

    public renderScreen(){
        this.CanvasHelper.createRect(0,0,150,100)
        this.CanvasHelper.writeTextToCanvas("BArewwfCK", 24, 20, 20, "purple");
    }
}
