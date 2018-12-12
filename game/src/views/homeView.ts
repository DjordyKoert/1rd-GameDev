class HomeView {
    protected _screen: string = "homeScreen";
    protected CanvasHelper: CanvasHelper

    public constructor(canvas: CanvasHelper){
        this.CanvasHelper = canvas
    }

    public renderScreen(){
        this.CanvasHelper.writeImageToCanvas("./assets/images/temporary_textures/homeScreen_planet.png", 250, 300)
        this.CanvasHelper.writeImageToCanvas("./assets/images/temporary_textures/homeScreen_planet.png", 750, 400)
        this.CanvasHelper.writeImageToCanvas("./assets/images/temporary_textures/homeScreen_planet.png", 1250, 200)
        
        this.CanvasHelper.writeButtonToCanvas(0,0,150,100, "BACK", 20);
        this.CanvasHelper.writeButtonToCanvas(275,325,250,250, "", 0,"transparent");
        this.CanvasHelper.writeButtonToCanvas(775,425,250,250, "", 0, "transparent");
        this.CanvasHelper.writeButtonToCanvas(1275,225,250,250, "", 0,"transparent");


    }
}
