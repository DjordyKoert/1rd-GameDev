class HomeView {
    protected _screen: string = "homeScreen";
    protected CanvasHelper: CanvasHelper;
    protected imageCenter: number;
    private _rendered: boolean = false;
    private MouseHelper: MouseHelper
    private planetList: Array<string>
    private planetXCoords: Array<number>
    private planetYCoords: Array<number>
    private _gameView: GameView
    private clicked: boolean

    public constructor(canvas: CanvasHelper) {
        this.CanvasHelper = canvas;
        this.MouseHelper = new MouseHelper()
        this._gameView = new GameView(canvas)
        this.clicked = false
        this.planetList = [
            "./assets/images/temporary_textures/homeScreen_planet2.png",
            "./assets/images/temporary_textures/homeScreen_planet2.png",
            "./assets/images/temporary_textures/homeScreen_planet2.png",
        ]

        this.planetXCoords = [
            this.CanvasHelper.getWidth() / 6 - 150,
            this.CanvasHelper.getWidth() / 2 - 150,
            this.CanvasHelper.getWidth() / 1.25 - 150,
        ]

        this.planetYCoords = [
            300,
            400,
            200
        ]

    }


    public renderScreen() {
        if (!this._rendered) {

            const maxPlanets: number = 3;

            for (let i = 0; i < maxPlanets; i++) {
                this.CanvasHelper.writeImageToCanvas(this.planetList[i], this.planetXCoords[i], this.planetYCoords[i], 300, 300)


                this.CanvasHelper.writeTextToCanvas("new world", 30, this.planetXCoords[i] + 150, this.planetYCoords[i] + 310)
            }

            this.CanvasHelper.writeButtonToCanvas(0, 0, 150, 100, "BACK", 30);
            this._rendered = true
        }
        for (let i = 0; i < this.planetList.length; i++) {

            if (this.MouseHelper.getClick().click && !this.clicked) {
               
                if (this.MouseHelper.getClick().x > this.planetXCoords[i] && this.MouseHelper.getClick().x < this.planetXCoords[i] + 300) { 
                    if(this.MouseHelper.getClick().y > this.planetYCoords[i] && this.MouseHelper.getClick().y < this.planetYCoords[i] + 300){
                        const nameWindow = window.prompt("Voer hier de naam van je planeet in", "")

                        if (nameWindow == ""){
                        this.renderScreen()}
                        else{
                            this.clicked = true
                            this.CanvasHelper.clear()
                            BaseView.changeScreen("game")

                        }
                    }
                }
            }
        }
    }
}
