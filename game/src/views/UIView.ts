class UIView {
    protected _screen: string = "homeScreen";
    protected CanvasHelper: CanvasHelper
    private app: App
    public constructor(canvas: CanvasHelper){
        this.CanvasHelper = canvas
    }

    public renderScreen(){
        console.log(this.app.getGold())
        this.CanvasHelper.createRect(0, 0, 350, 50, "white")
        this.CanvasHelper.writeTextToCanvas("Wood", 20, 30, 25, "black", "center")
        this.CanvasHelper.writeTextToCanvas("Stone", 20, 240, 25, "black", "center")
        this.CanvasHelper.writeTextToCanvas(`${this.app.getGold()}`, 20, 40, 25, "black", "center")
        
    }
}
