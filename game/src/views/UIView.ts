class UIView {
    protected _screen: string = "homeScreen";
    protected CanvasHelper: CanvasHelper
    private app: App
    public constructor(canvas: CanvasHelper){
        this.CanvasHelper = canvas
    }

    public renderScreen(){
        //console.log(this.app.getGold())
        this.CanvasHelper.createRect(0, 0, 590, 50, "brown")
        this.CanvasHelper.writeImageToCanvas("./assets/images/resources/woodResource.png", 5, 0, 50, 50)
        this.CanvasHelper.writeImageToCanvas("./assets/images/resources/stoneResource.png", 210, 0, 50, 50)
        this.CanvasHelper.writeImageToCanvas("./assets/images/resources/goldResource.png", 400, 0, 50, 50)
        //this.CanvasHelper.writeTextToCanvas(`${this.app.getGold()}`, 20, 40, 25, "black", "center")
        
    }
}
