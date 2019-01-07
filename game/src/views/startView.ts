class StartView extends BaseView {
    protected _canvasHelper: CanvasHelper
    private _rendered: boolean = false;
    private _clicked: boolean = false;
    protected _homeView: HomeView
    private _buttonDimension: Array<number>

    private _gameName: string = 'PLACEHOLDER'

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        this._homeView = new HomeView(canvas)
        this._buttonDimension = [225, 125]
    }

    public renderScreen() {
        this.drawTitle();
        this.drawStartButton();
        this.buttonClick();
        // console.log("start")
    }


    public drawTitle() {
        this._canvasHelper.writeTextToCanvas(this._gameName, 50, (this._canvasHelper.getWidth() / 2), 100, "white")
    }

    public drawStartButton() {
        this._canvasHelper.createRect((this._canvasHelper.getWidth() / 2) - (this._buttonDimension[0] / 2), (this._canvasHelper.getHeight() / 2) - (this._buttonDimension[1] / 2), this._buttonDimension[0] + 2, this._buttonDimension[1] + 2, "black")
        this._canvasHelper.createRect((this._canvasHelper.getWidth() / 2) - (this._buttonDimension[0] / 2), (this._canvasHelper.getHeight() / 2) - (this._buttonDimension[1] / 2), this._buttonDimension[0], this._buttonDimension[1])
        this._canvasHelper.writeTextToCanvas("START SPEL", 30, this._canvasHelper.getWidth() / 2, this._canvasHelper.getHeight() / 2, "black")
    }

    public buttonClick() {
        if (this._mouseHelper.getClick().click && !this._clicked) {
            // received a mouse down event
            this._clicked = true;
        }

        if (!this._mouseHelper.getClick().click && this._clicked) {
            // receive a mouse up event after mouse down
            this._clicked = false;
        }

        // console.log(this._clicked);
        if (this._clicked) {
            if (this._mouseHelper.getClick().x > (this._canvasHelper.getWidth() / 2) - (this._buttonDimension[0] / 2) && this._mouseHelper.getClick().x < (this._canvasHelper.getWidth() / 2) + (this._buttonDimension[0] / 2)) {
                if (this._mouseHelper.getClick().y > (this._canvasHelper.getHeight() / 2) - (this._buttonDimension[1] / 2) && this._mouseHelper.getClick().y < (this._canvasHelper.getHeight() / 2) + (this._buttonDimension[1] / 2)) {
                    // console.log('pressed')
                }
            }
        }
        if (!this._clicked) {
            if (this._mouseHelper.getClick().x > (this._canvasHelper.getWidth() / 2) - (this._buttonDimension[0] / 2) && this._mouseHelper.getClick().x < (this._canvasHelper.getWidth() / 2) + (this._buttonDimension[0] / 2)) {
                if (this._mouseHelper.getClick().y > (this._canvasHelper.getHeight() / 2) - (this._buttonDimension[1] / 2) && this._mouseHelper.getClick().y < (this._canvasHelper.getHeight() / 2) + (this._buttonDimension[1] / 2)) {
                    // console.log('released')
                    this._canvasHelper.clear
                    App._screen = "home"
                }
            }
        }

    }

}



