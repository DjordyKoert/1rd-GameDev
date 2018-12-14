class StartView {
    private CanvasHelper: CanvasHelper
    private _mouseHelper: MouseHelper
    private _rendered: boolean = false;
    private _clicked: boolean = false;

    public constructor(canvas: CanvasHelper) {
        this.CanvasHelper = canvas
        this._mouseHelper = new MouseHelper()
    }

    public renderScreen() {


        this.CanvasHelper.clear()

        this.CanvasHelper.writeTextToCanvas("SAMPLE TEXT", 50, (this.CanvasHelper.getWidth() / 2), 100, "white")

        this.CanvasHelper.createRect((this.CanvasHelper.getWidth() / 2) - 150, (this.CanvasHelper.getHeight() / 2) - 100, 300, 200)
        this.CanvasHelper.writeTextToCanvas("START SPEL", 30, this.CanvasHelper.getWidth() / 2, this.CanvasHelper.getHeight() / 2, "black")

        if (this._mouseHelper.getClick().click && !this._clicked) {

            if (this._mouseHelper.getClick().x > (this.CanvasHelper.getWidth() / 2) - 150 && this._mouseHelper.getClick().x < (this.CanvasHelper.getWidth() / 2) + 150) {
                if (this._mouseHelper.getClick().y > (this.CanvasHelper.getHeight() / 2) - 100 && this._mouseHelper.getClick().y < (this.CanvasHelper.getHeight() / 2) + 100) {
                    this._clicked = true
                    console.log("b")
                }
            }
        }
        if (!this._mouseHelper.getClick().click && this._clicked) {
            console.log("a")
            this._clicked = false
            this.CanvasHelper.clear();
            BaseView.changeScreen("home")
            event.preventDefault()

        }
        this.CanvasHelper.createRect((this.CanvasHelper.getWidth() / 2) - 150, (this.CanvasHelper.getHeight() / 2) + 500, 300, 200)
    }


}


