class HomeView {
    protected _screen: string = "homeScreen";
    protected CanvasHelper: CanvasHelper;
    protected imageCenter: number;
    protected image: CanvasImageSource;
    

    public constructor(canvas: CanvasHelper){
        this.CanvasHelper = canvas;
    }

    public getImageWidth(){

    }

    public renderScreen(){
        
        const planetList: Array<string> = [
            "./assets/images/temporary_textures/homeScreen_planet2.png",
            "./assets/images/temporary_textures/homeScreen_planet2.png",
            "./assets/images/temporary_textures/homeScreen_planet2.png",
        ]
        
        const planetXCoords: Array<number> =[
            250,
            750,
            1250
        ]
        const planetYCoords: Array<number> =[
            300,
            400,
            200
        ]
        const maxPlanets: number = 3;

        for (let i = 0; i < maxPlanets; i++) {
            this.CanvasHelper.writeImageToCanvas(planetList[i], planetXCoords[i], planetYCoords[i], 300, 300)
        }
        // this.CanvasHelper.writeImageToCanvas("./assets/images/temporary_textures/homeScreen_planet2.png", 250, 300, 300, 300)
        // this.CanvasHelper.writeImageToCanvas("./assets/images/temporary_textures/homeScreen_planet2.png", 750, 400, 300, 300)
        // this.CanvasHelper.writeImageToCanvas("./assets/images/temporary_textures/homeScreen_planet2.png", 1250, 200, 300, 300)
        
        this.CanvasHelper.writeButtonToCanvas(0,0,150,100, "BACK", 20);
        // this.CanvasHelper.writeButtonToCanvas(275,325,250,250, "", 0,"transparent");
        // this.CanvasHelper.writeButtonToCanvas(775,425,250,250, "", 0, "transparent");
        // this.CanvasHelper.writeButtonToCanvas(1275,225,250,250, "", 0,"transparent");

        this.getImageWidth()
    }
}
