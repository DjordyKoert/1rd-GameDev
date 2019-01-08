class StartView extends BaseView {
    protected _canvasHelper: CanvasHelper
    protected _homeView: HomeView

    private _rendered: boolean = false;
    private _clicked: boolean = false;
    private _buttonDimension: Array<number>
    private _gameName: string = 'PLANET MANAGER'

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        this._homeView = new HomeView(canvas)
        this._buttonDimension = [225, 125]
    }

    /**
     * Renders the StartScreen
     */
    public renderScreen() {

        if (!this._rendered) {
            this.drawTitle();
            this.drawStartButton();
        }
        this._rendered = true
        this.buttonClick();
        // console.log("start")
    }

    /**
     * Draw the titlescreen
     */
    public drawTitle() {
        this._canvasHelper.writeTextToCanvas(this._gameName, 125, (this._canvasHelper.getWidth() / 2) + 2, 102, "black")
        this._canvasHelper.writeTextToCanvas(this._gameName, 125, (this._canvasHelper.getWidth() / 2), 100, "white")
    }

    /**
     * Draws the Startbutton
     */
    private drawStartButton() {
        this._canvasHelper.createRect((this._canvasHelper.getWidth() / 2) - (this._buttonDimension[0] / 2), (this._canvasHelper.getHeight() / 2) - (this._buttonDimension[1] / 2), this._buttonDimension[0] + 2, this._buttonDimension[1] + 2, "green")
        this._canvasHelper.createRect((this._canvasHelper.getWidth() / 2) - (this._buttonDimension[0] / 2), (this._canvasHelper.getHeight() / 2) - (this._buttonDimension[1] / 2), this._buttonDimension[0], this._buttonDimension[1])
        this._canvasHelper.writeTextToCanvas("START SPEL", 30, this._canvasHelper.getWidth() / 2, this._canvasHelper.getHeight() / 2, "black")
    }

    /**
     * Checks if you pressed in the Startbutton to advance to the homescreen
     */
    private buttonClick() {
        if (this._mouseHelper.getClick().click && !this._clicked) {
            // received a mouse down event
            this._clicked = true;
        }

        if (!this._mouseHelper.getClick().click && this._clicked) {
            // receive a mouse up event after mouse down
            this._clicked = false;
        }

        // Looks if you pressed M1 @ the start button
        if (this._clicked) {
            if (this._mouseHelper.getClick().x > (this._canvasHelper.getWidth() / 2) - (this._buttonDimension[0] / 2) && this._mouseHelper.getClick().x < (this._canvasHelper.getWidth() / 2) + (this._buttonDimension[0] / 2)) {
                if (this._mouseHelper.getClick().y > (this._canvasHelper.getHeight() / 2) - (this._buttonDimension[1] / 2) && this._mouseHelper.getClick().y < (this._canvasHelper.getHeight() / 2) + (this._buttonDimension[1] / 2)) {

                    // Startbutton Animation
                    this._canvasHelper.clear((this._canvasHelper.getWidth() / 2) - (this._buttonDimension[0] / 2) - 2, (this._canvasHelper.getHeight() / 2) - (this._buttonDimension[1] / 2) - 2, this._buttonDimension[0] + 4, this._buttonDimension[1] + 4)
                    this._canvasHelper.createRect((this._canvasHelper.getWidth() / 2) - (this._buttonDimension[0] / 2) + 2, (this._canvasHelper.getHeight() / 2) - (this._buttonDimension[1] / 2) + 2, this._buttonDimension[0], this._buttonDimension[1])
                    this._canvasHelper.writeTextToCanvas("START SPEL", 30, (this._canvasHelper.getWidth() / 2) + 2, (this._canvasHelper.getHeight() / 2) + 2, "black")
                }
            }
        }
        // Looks if you released M1 @ the start button
        if (!this._clicked) {
            if (this._mouseHelper.getClick().x > (this._canvasHelper.getWidth() / 2) - (this._buttonDimension[0] / 2) && this._mouseHelper.getClick().x < (this._canvasHelper.getWidth() / 2) + (this._buttonDimension[0] / 2)) {
                if (this._mouseHelper.getClick().y > (this._canvasHelper.getHeight() / 2) - (this._buttonDimension[1] / 2) && this._mouseHelper.getClick().y < (this._canvasHelper.getHeight() / 2) + (this._buttonDimension[1] / 2)) {
                    
                    // Clears screen and advance to the homescreen
                    this._canvasHelper.clear()
                    this._rendered = false
                    App._screen = "home"
                }
            }
        }

    }
}



