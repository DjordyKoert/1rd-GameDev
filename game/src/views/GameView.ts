class GameView {
    protected _screen: string = "gameScreen";
    protected CanvasHelper: CanvasHelper
    private xCoord: number
    private yCoord: number
    private lines: number
    private sqSize: number
    private image: CanvasImageSource
    private gridsRendered: boolean
    private tileImages: Array<string>
    private _BuilderView: BuilderView
    private _UIView: UIView
    public tileInfo: Array<any>

    public constructor(canvas: CanvasHelper) {
        this.CanvasHelper = canvas
        this._BuilderView = new BuilderView(canvas)
        this._UIView = new UIView(canvas)
        this.gridsRendered = false
        this.xCoord = this.yCoord = 0
        this.lines = 10
        //Check screen size to make grids fit
        if (this.CanvasHelper.getWidth() > this.CanvasHelper.getHeight()) {
            this.sqSize = this.CanvasHelper.getWidth() / this.lines
        }
        else {
            this.sqSize = this.CanvasHelper.getHeight() / this.lines
        }
        this.tileImages = [
            "./assets/images/earth_textures/grass.png",
            "./assets/images/houses/house.png",
        ]
        this.tileInfo = [{}]
       // this.renderGrid()
    }
    public renderScreen() {
        if (!this.gridsRendered) {this.renderGrid(); this.gridsRendered = true}
    }
    public renderGrid() {
        for (let line = 0; line < this.lines; line++) {
            this.CanvasHelper.moveTo(0, this.yCoord)
            this.CanvasHelper.lineTo(this.CanvasHelper.getWidth(), this.yCoord)
            this.CanvasHelper.moveTo(this.xCoord, 0)
            this.CanvasHelper.lineTo(this.xCoord, this.CanvasHelper.getHeight())
            //this.CanvasHelper.createRect(this.xCoord, 0, this.sqSize, this.sqSize)
            for (let i = 0; i < this.lines; i++) {
                let imageSrc = this.tileImages[MathHelper.randomNumber(0, this.tileImages.length - 1)]
                this.CanvasHelper.writeImageToCanvas(imageSrc, this.xCoord, this.sqSize * i, this.sqSize, this.sqSize)
                //Try to create array with objects
                let vr = { xStart: this.xCoord, xEnd: this.xCoord + this.sqSize, yStart: this.sqSize * i, yEnd: (this.sqSize * i) + this.sqSize, imageSrc: imageSrc }
                this.tileInfo.push(vr)
            }

            this.xCoord += this.sqSize
            this.yCoord += this.sqSize
        }
        this._UIView.renderScreen()
        window.addEventListener("mousedown", e => {
            // let  v = this.tileInfo.filter(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
            // console.log(v[0].imageSrc)
            this._BuilderView.renderScreen()
        })
    }
}