class HomeView extends BaseView {
    protected _screen: string = "homeScreen";
    protected _imageCenter: number;
    private _rendered: boolean
    protected _mouseHelper: MouseHelper
    private _planetList: string
    private _planetXcoord: number
    private _planetYcoord: number
    private _gameView: GameView
    private _clicked: boolean



    public constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        this._mouseHelper = new MouseHelper()
        this._gameView = new GameView(canvas)
        this._clicked = false
        this._planetList = "./assets/images/temporary_textures/homeScreen_planet2.png",
            this._planetXcoord = (this._canvasHelper.getWidth() / 2) - 250
        this._planetYcoord = (this._canvasHelper.getHeight() / 2) - 250


    }

    public renderScreen(): void {
        if (!this._rendered) {
            this.drawPlanets();
            this.drawBackButton();
        }
        this._rendered = true
        this.screenClick();
        // console.log("home rendered")
    }

    public drawPlanets() {
        this._canvasHelper.writeImageToCanvas(this._planetList, this._planetXcoord, this._planetYcoord, 500, 500)
        this._canvasHelper.writeTextToCanvas("Nieuwe Wereld", 50, this._planetXcoord + 250, this._planetYcoord + 540)
    }

    public drawBackButton() {
        this._canvasHelper.createRect(0, 0, 152, 102, 'green')
        this._canvasHelper.createRect(0, 0, 150, 100)
        this._canvasHelper.writeTextToCanvas("TERUG", 30, 75, 50, "black")
    }

    public screenClick() {
        if (this._mouseHelper.getClick().click && !this._clicked) {
            // received a mouse down event
            this._clicked = true;
        }

        if (!this._mouseHelper.getClick().click && this._clicked) {
            // receive a mouse up event after mouse down
            this._clicked = false;

            if (!this._clicked) {
                if (this._mouseHelper.getClick().x > this._planetXcoord && this._mouseHelper.getClick().x < this._planetXcoord + 500) {
                    if (this._mouseHelper.getClick().y > this._planetYcoord && this._mouseHelper.getClick().y < this._planetYcoord + 500) {
                        console.log('planet clicked')
                        let person = prompt("Voer je naam in", "");
                        if (person == null || person == "") {
                            window.alert("Voer een naam in")
                        }
                        else {
                            if (person.length > 10) {
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

        if (this._clicked) {
            if (this._mouseHelper.getClick().x > 0 && this._mouseHelper.getClick().x < 150) {
                if (this._mouseHelper.getClick().y > 0 && this._mouseHelper.getClick().y < 100) {
                    this._canvasHelper.createRect(0, 0, 152, 102)
                    this._canvasHelper.writeTextToCanvas("TERUG", 30, 77, 52, "black")
                }
            }
        }
        if (!this._clicked) {
            if (this._mouseHelper.getClick().x > 0 && this._mouseHelper.getClick().x < 150) {
                if (this._mouseHelper.getClick().y > 0 && this._mouseHelper.getClick().y < 100) {
                    this._canvasHelper.clear()
                    this._rendered = false
                    App._screen = 'start'
                }
            }
        }
    }
}



