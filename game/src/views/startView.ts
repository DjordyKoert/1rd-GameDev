class StartView {
    private CanvasHelper: CanvasHelper
   
    public constructor(canvas: CanvasHelper) {
        this.CanvasHelper = canvas
    }

    public renderScreen(){
        this.CanvasHelper.writeButtonToCanvas(200,200,200,200, "START GAME", 50)
    }
}
