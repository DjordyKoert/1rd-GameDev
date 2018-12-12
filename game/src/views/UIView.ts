class UIView {
    protected _screen: string = "homeScreen";
    protected CanvasHelper: CanvasHelper
    public constructor(canvas: CanvasHelper){
        this.CanvasHelper = canvas
    }

    public renderScreen(){
        this.CanvasHelper.writeImageToCanvas("./assets/images/backgrounds/UIBackground.png", 0, 0, 1600, 1080)
        this.CanvasHelper.writeImageToCanvas("./assets/images/resources/woodResource.png", 5, 0, 50, 50)
        this.CanvasHelper.writeImageToCanvas("./assets/images/resources/stoneResource.png", 210, 0, 50, 50)
        this.CanvasHelper.writeImageToCanvas("./assets/images/resources/goldResource.png", 400, 0, 50, 50)
        this.CanvasHelper.writeTextToCanvas(`${App.getGold()}`, 20, 100, 25, "white", "center")
        
        
    }
}
