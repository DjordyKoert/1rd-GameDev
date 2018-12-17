class GameView extends BaseView {
    protected _screen: string = "gameScreen";
    protected _mouseHelper: MouseHelper
    protected xCoord: number
    protected yCoord: number
    protected lines: number
    protected sqSize: number
    private gridsRendered: boolean
    protected tileImages: Array<string>
    // private _BuilderView: BuilderView
    // private BuilderViewOn: boolean
    // private _UIView: UIView
    // private _ToolbarView: ToolbarView
    protected tileInfo: Array<any>

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas, "game")
        
        this._mouseHelper = new MouseHelper()
        //this._BuilderView = new BuilderView(canvas)
        this.gridsRendered = false
        this.xCoord = this.yCoord = 0
        this.lines = 10
        //Check screen size to make grids fit
        if (this._canvasHelper.getWidth() > this._canvasHelper.getHeight()) {
            this.sqSize = this._canvasHelper.getWidth() / this.lines
        }
        else {
            this.sqSize = this._canvasHelper.getHeight() / this.lines
        }
        this.tileImages = [
            "./assets/images/foliage/tree.png",
            "./assets/images/houses/house.png",
            null,
        ]
        this.tileInfo = [{}]
        // this.renderGrid()
        this.renderScreen()
    }
    public renderScreen(){
        this.renderGrid()
        // this._ToolbarView.renderToolbar()
        // this._UIView.renderScreen()
        // if (this.BuilderViewOn) this._BuilderView.renderScreen()
        // this._canvasHelper.loadingBar(400, 300, 100, 20, App._klimaat, 100)
    }
    public renderGrid() {
        this._canvasHelper._context.beginPath()
        if (this.gridsRendered) {
            this.xCoord = 0
            this.yCoord = 0
            for (let line = 0; line < this.lines; line++) {
                this._canvasHelper.moveTo(0, this.yCoord)
                this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this.yCoord)
                this._canvasHelper.moveTo(this.xCoord, 0)
                this._canvasHelper.lineTo(this.xCoord, this._canvasHelper.getHeight())
                this.tileInfo.forEach(tile => {
                    this._canvasHelper.writeImageToCanvas(tile.imageSrc, tile.xStart, tile.yStart, tile.xEnd - tile.xStart, tile.yEnd - tile.yStart)
                });
            }

        }
        else {
            for (let line = 0; line < this.lines; line++) {
                this._canvasHelper.moveTo(0, this.yCoord)
                this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this.yCoord)
                this._canvasHelper.moveTo(this.xCoord, 0)
                this._canvasHelper.lineTo(this.xCoord, this._canvasHelper.getHeight())
                //this.CanvasHelper.createRect(this.xCoord, 0, this.sqSize, this.sqSize)
                for (let i = 0; i < this.lines; i++) {
                    let imageSrc = this.tileImages[MathHelper.randomNumber(0, this.tileImages.length - 1)]
                    //Draw Grass
                    this._canvasHelper.writeImageToCanvas("./assets/images/earth_textures/earth.png", this.xCoord, this.sqSize * i, this.sqSize, this.sqSize)
                    this._canvasHelper.writeImageToCanvas(imageSrc, this.xCoord, this.sqSize * i, this.sqSize, this.sqSize)
                    //Try to create array with objects
                    let vr = { xStart: this.xCoord, xEnd: this.xCoord + this.sqSize, yStart: this.sqSize * i, yEnd: (this.sqSize * i) + this.sqSize, imageSrc: imageSrc }
                    this.tileInfo.push(vr)
                }

                this.xCoord += this.sqSize
                this.yCoord += this.sqSize
            }
            //Clean this.tileInfo so it only contains info about things INSIDE the screen
            this.tileInfo = this.tileInfo.filter(x => x.xStart <= this._canvasHelper.getWidth() && x.yStart <= this._canvasHelper.getHeight())
            let allHouses = this.tileInfo.filter(x => x.imageSrc == this.tileImages[1])
            allHouses.forEach(() => {
                App._klimaat += 1
            });
            window.addEventListener("mousedown", e => {
                if (ToolbarView.getTool() == "axe") {
                    let filter = this.tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                    if (!filter) return;
                    if (filter.imageSrc == "./assets/images/foliage/tree.png") {
                        this._canvasHelper.writeImageToCanvas(this.tileInfo[0], filter.xStart, filter.yStart, filter.xEnd - filter.xStart, filter.yEnd - filter.yStart)
                        let n = this.tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                        this.tileInfo.splice(n, 1)
                        let vr = { xStart: filter.xStart, xEnd: filter.xEnd - filter.xStart, yStart: filter.yStart, yEnd: filter.yEnd - filter.yStart, imageSrc: this.tileImages[0] }
                        this.tileInfo.push(vr)
                        App._gold += 6
                        App._klimaat -= 1
                    }
                }
            })
            window.addEventListener("keypress", press => {
                if (press.key == " ") {
                    // if (this.BuilderViewOn) { this.BuilderViewOn = false;}
                    // else this.BuilderViewOn = true
                }
            })

            this.gridsRendered = true
        }
    }
}