class GameView {
    protected _screen: string = "gameScreen";
    protected CanvasHelper: CanvasHelper
    private _mouseHelper: MouseHelper
    private xCoord: number
    private yCoord: number
    private lines: number
    private sqSize: number
    private gridsRendered: boolean
    private tileImages: Array<string>
    private _BuilderView: BuilderView
    private _UIView: UIView
    private _ToolbarView: ToolbarView
    public tileInfo: Array<any>

    public constructor(canvas: CanvasHelper) {
        this.CanvasHelper = canvas
        this._mouseHelper = new MouseHelper()
        this._BuilderView = new BuilderView(canvas)
        this._UIView = new UIView(canvas)
        this._ToolbarView = new ToolbarView(canvas)
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
        if (!this.gridsRendered) { this.renderGrid(); this.gridsRendered = true }
        this._ToolbarView.renderToolbar()
        this._UIView.renderScreen()
        this.CanvasHelper.writeTextToCanvas("Djordy was hier ;), ik heb gekut met een muziekje", 90, this.CanvasHelper.getCenter().X, this.CanvasHelper.getCenter().Y, "red", "center")
        this.CanvasHelper.loadingBar(400, 300, 100, 20, App._klimaat, 100)
    }
    public renderGrid() {
        let music = new Audio("./assets/sounds/yeet2.mp3")
        music.play()
        setTimeout(() => {
            let music2 = new Audio("./assets/sounds/yeet.mp3")
            music2.play()
        }, 15000)
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
        //Clean this.tileInfo so it only contains info about things INSIDE the screen
        this.tileInfo = this.tileInfo.filter(x => x.xStart <= this.CanvasHelper.getWidth() && x.yStart <= this.CanvasHelper.getHeight())
        let allHouses = this.tileInfo.filter(x => x.imageSrc == this.tileImages[1])
        allHouses.forEach(() => {
            App._klimaat += 1
        });
        window.addEventListener("mousedown", e => {
            if (ToolbarView.getTool() == "axe") {
                let filter = this.tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                if (!filter) return;
                if (filter.imageSrc == "./assets/images/houses/house.png") {
                    this.CanvasHelper.writeImageToCanvas(this.tileImages[0], filter.xStart, filter.yStart, filter.xEnd - filter.xStart, filter.yEnd - filter.yStart)
                    let n = this.tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                    this.tileInfo.splice(n, 1)
                    let vr = { xStart: filter.xStart, xEnd: filter.xEnd - filter.xStart + this.sqSize, yStart: filter.yStart, yEnd: filter.yEnd - filter.yStart, imageSrc: this.tileImages[0] }
                    this.tileInfo.push(vr)
                    App._gold += 6
                    App._klimaat -= 1
                }
            }
        })
    }
}