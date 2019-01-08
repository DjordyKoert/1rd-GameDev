class HomeView extends BaseView {
    protected _screen: string = "homeScreen";
    protected imageCenter: number;
    private _rendered: boolean = false;
    private MouseHelper: MouseHelper
    private planetList: Array<string>
    private planetXCoords: Array<number>
    private planetYCoords: Array<number>
    private _gameView: GameView
    private clicked: boolean

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        this.MouseHelper = new MouseHelper()
        this._gameView = new GameView(canvas)
        this.clicked = false
        this.planetList = [
            "./assets/images/temporary_textures/homeScreen_planet2.png",

        ]

        this.planetXCoords = [
            this._canvasHelper.getWidth() / 2 - 250,
        ]

        this.planetYCoords = [
            200
        ]
    }

    public renderScreen(): void {
        this.drawPlanets();
        this.drawBackButton();
        this.screenClick();
        // console.log("home rendered")
    }

    public drawPlanets() {
        const maxPlanets: number = 3;

        for (let i = 0; i < maxPlanets; i++) {
            this._canvasHelper.writeImageToCanvas(this.planetList[i], this.planetXCoords[i], this.planetYCoords[i], 500, 500)


            this._canvasHelper.writeTextToCanvas("new world", 50, this.planetXCoords[i] + 250, this.planetYCoords[i] + 540)
        }
    }

    public drawBackButton() {

        this._canvasHelper.createRect(0, 0, 150, 100)
        this._canvasHelper.writeTextToCanvas("BACK", 30, 75, 50, "black")
        if (this.MouseHelper.getClick().x > 0 && this.MouseHelper.getClick().x < 150) {
            if (this.MouseHelper.getClick().y > 0 && this.MouseHelper.getClick().y < 100) {
                //this.curScreen = "start"
                this._canvasHelper.clear()
            }
        }
    }

    public screenClick() {
        if (this.MouseHelper.getClick().click && !this.clicked) {
            // received a mouse down event
            this.clicked = true;
        }

        if (!this.MouseHelper.getClick().click && this.clicked) {
            // receive a mouse up event after mouse down
            this.clicked = false;
            for (let i = 0; i < this.planetList.length; i++) {
                // console.log(this.clicked);
                if (this.MouseHelper.getClick().x > this.planetXCoords[i] && this.MouseHelper.getClick().x < this.planetXCoords[i] + 500) {
                    if (this.MouseHelper.getClick().y > this.planetYCoords[i] && this.MouseHelper.getClick().y < this.planetYCoords[i] + 500) {
                        let person = prompt("Please enter your name", "");
                        if (person == null || person == "") {
                            window.alert("voer eerst een naam in (maximaal 10 letters)")
                        }
                        else {
                            if(person.length > 10 ){
                                window.alert("je naam mag maximaal 10 letters lang zijn");
                                return
                            }
                            this._canvasHelper.clear();
                            App._screen = "game"
                            App._name = person
                        }
                    }
                }
            }
        }
    }
}



