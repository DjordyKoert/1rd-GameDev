class GameView extends BaseView {
    protected _screen: string = "gameScreen";
    protected _mouseHelper: MouseHelper
    protected xCoord: number
    protected yCoord: number
    protected lines: number
    protected sqSize: number
    private gridsRendered: boolean
    private tileImages: Array<string>
    private tileInfo: Array<any>
    //BuilderView
    private _viewWidth: number
    private _yPosLine1: number = 70
    private _yPosLine2: number = 155
    private _rendered: boolean = false
    private _clicked: boolean = false
    public _folded: boolean = true
    //ToolBarView
    private clicked: boolean
    private curTool: string
    private rendered: boolean

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas, "game")
        this._mouseHelper = new MouseHelper()
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
            "./assets/images/earth_textures/earth.png",
        ]
        this.tileInfo = [{}]
        this.clicked = this.rendered = false
    }
    public renderScreen() {
        console.log(this.curTool)
        if (!this.gridsRendered) this.renderNewGrid()
        this.renderBuilderView()
        this.renderToolbarView()
        this.renderUIView()
        // if (this.BuilderViewOn) this._BuilderView.renderScreen()
        // this._canvasHelper.loadingBar(400, 300, 100, 20, App._klimaat, 100)
    }
    public renderOldGrid() {
        this._canvasHelper._context.beginPath()
        this.xCoord = 0
        this.yCoord = 0
        for (let line = 0; line < this.lines; line++) {
            this._canvasHelper.moveTo(0, this.yCoord)
            this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this.yCoord)
            this._canvasHelper.moveTo(this.xCoord, 0)
            this._canvasHelper.lineTo(this.xCoord, this._canvasHelper.getHeight())
            this.tileInfo.forEach(tile => {
                this._canvasHelper.writeImageToCanvas("./assets/images/earth_textures/earth.png", tile.xStart, tile.yStart, tile.xEnd - tile.xStart, tile.yEnd - tile.yStart)
                this._canvasHelper.writeImageToCanvas(tile.imageSrc, tile.xStart, tile.yStart, tile.xEnd - tile.xStart, tile.yEnd - tile.yStart)
            });
        }
    }
    public renderNewGrid() {
        this._canvasHelper._context.beginPath()

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
            if (this.curTool == "axe") {
                let filter = this.tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                if (!filter) return;
                if (filter.imageSrc == "./assets/images/foliage/tree.png") {
                    this._canvasHelper.writeImageToCanvas(this.tileInfo[0], filter.xStart, filter.yStart, filter.xEnd - filter.xStart, filter.yEnd - filter.yStart)
                    let n = this.tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                    this.tileInfo[n].imageSrc = "./assets/images/earth_textures/earth.png"
                    this.renderOldGrid()
                    App._gold += 6
                    App._klimaat -= 1
                }
            }
        })

        this.gridsRendered = true
    }


    //BuilderView
    public renderBuilderView() {
        if (this._folded) {
            this._viewWidth = 50

            this._canvasHelper.createRect(this._canvasHelper.getWidth() - this._viewWidth, 0, this._viewWidth, this._canvasHelper.getHeight(), 'green')
            this._canvasHelper.writeTextToCanvas('<--', 20, this._canvasHelper.getWidth() - 10, 10, 'black', 'right')
            this._rendered = true


            if (this._mouseHelper.getClick().click && !this._clicked) {
                if (this._mouseHelper.getClick().x > this._canvasHelper.getWidth() - this._viewWidth && this._mouseHelper.getClick().x < this._canvasHelper.getWidth()) {
                    if (this._mouseHelper.getClick().y > 0 && this._mouseHelper.getClick().y < 20) {
                        this._clicked = true
                    }
                }
            }
            if (!this._mouseHelper.getClick().click && this._clicked) {
                this._clicked = false
                this._canvasHelper.clear(this._canvasHelper.getWidth() - this._viewWidth, 0, this._canvasHelper.getWidth(), this._canvasHelper.getHeight())
                this._folded = false
                this._rendered = false
            }
        }
        if (!this._folded) {
            this._viewWidth = 300
            if (!this._rendered) {
                this._canvasHelper.createRect(this._canvasHelper.getWidth() - this._viewWidth, 0, this._viewWidth, this._canvasHelper.getHeight(), 'green')
                this._canvasHelper.writeTextToCanvas('GEBOUWEN', 48, (this._canvasHelper.getWidth() - this._viewWidth / 2), 40)
                this._canvasHelper.moveTo(this._canvasHelper.getWidth() - this._viewWidth, this._yPosLine1)
                this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this._yPosLine1)
                this._canvasHelper.writeTextToCanvas('HUIS', 36, (this._canvasHelper.getWidth() - this._viewWidth + 10), 100, undefined, 'left')
                this._canvasHelper.writeTextToCanvas(`DOEKOE: 50`, 24, (this._canvasHelper.getWidth() - this._viewWidth + 10), 135, undefined, 'left')
                this._canvasHelper.writeImageToCanvas('./assets/images/houses/house.png', (this._canvasHelper.getWidth() - this._viewWidth + 190), 80, 90, 64)
                this._canvasHelper.moveTo(this._canvasHelper.getWidth() - this._viewWidth, this._yPosLine2)
                this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this._yPosLine2)
                this._rendered = true
            }

            if (this._mouseHelper.getClick().click && !this._clicked) {

                if (this._mouseHelper.getClick().x > this._canvasHelper.getWidth() - this._viewWidth + 190 && this._mouseHelper.getClick().x < this._canvasHelper.getWidth() - this._viewWidth + 190 + 90) {
                    if (this._mouseHelper.getClick().y > 80 && this._mouseHelper.getClick().y < 80 + 64) {
                        this._clicked = true
                    }
                }
            }
            if (!this._mouseHelper.getClick().click && this._clicked) {
                this._clicked = false
                this._canvasHelper.clear(this._canvasHelper.getWidth() - this._viewWidth, 0, this._canvasHelper.getWidth(), this._canvasHelper.getHeight())
                this._folded = true
                this._rendered = false
                console.log('Image Released')
                let releasedTile = this.tileInfo.findIndex(x => x.xStart <= this._mouseHelper.getClick().x && x.xEnd >= this._mouseHelper.getClick().x && x.yStart <= this._mouseHelper.getClick().y && x.yEnd >= this._mouseHelper.getClick().y)
                if (this.tileInfo[releasedTile].imageSrc == "./assets/images/foliage/tree.png") console.log("nee")
                else {
                    this.tileInfo[releasedTile].imageSrc = "./assets/images/houses/house.png"
                }
                this.renderOldGrid()
            }
        }
    }
    //ToolBar
    public renderToolbarView() {
        this._canvasHelper.createRect(this._canvasHelper.getWidth() * 0.2, this._canvasHelper.getHeight() * 0.8, this._canvasHelper.getWidth() * 0.6, this._canvasHelper.getHeight() * 0.2)
        this._canvasHelper.createRect(this._canvasHelper.getWidth() * 0.21, this._canvasHelper.getHeight() * 0.81, this._canvasHelper.getWidth() * 0.1, this._canvasHelper.getHeight() * 0.18, "red")
        this.rendered = true

        this.toolBarClick()
    }

    public toolBarClick(): void {
        if (this._mouseHelper.getClick().click && !this.clicked) {
            if (this._mouseHelper.getClick().x >= this._canvasHelper.getWidth() * 0.21 && this._mouseHelper.getClick().x <= (this._canvasHelper.getWidth() * 0.21 + this._canvasHelper.getWidth() * 0.1)) {
                if (this._mouseHelper.getClick().y >= this._canvasHelper.getHeight() * 0.81 && this._mouseHelper.getClick().y <= (this._canvasHelper.getHeight() * 0.81 + this._canvasHelper.getHeight() * 0.18)) {
                    if (this.curTool == "axe") { this.clicked = true; this.curTool = undefined; return }
                    this.clicked = true
                    this.curTool = "axe"
                }
            }
        }
        if (!this._mouseHelper.getClick().click) this.clicked = false
    }

    //UIView
    public renderUIView() {

        // this.CanvasHelper.writeImageToCanvas("./assets/images/backgrounds/UIBackground.png", 0, 0, 1650, 1080)
        // this.CanvasHelper.writeTextToCanvas(`${App.getGold()}`, 50, 100, 30, "white", "center") 
        // this.CanvasHelper.writeImageToCanvas("./assets/images/resources/woodResource.png", 5, 2, 50, 50)
        // this.CanvasHelper.writeImageToCanvas("./assets/images/resources/stoneResource.png", 210, 2, 50, 50)
        // this.CanvasHelper.writeImageToCanvas("./assets/images/resources/goldResource.png", 400, 2, 50, 50)
        // //this.CanvasHelper.writeTextToCanvas(`${App.getGold()}`, 50, 100, 30, "white", "center")  
        let imageUIBackground = new Image();
        let imageWoodResource = new Image();
        let imageStoneResource = new Image();
        let imageGoldRecourse = new Image();
        // add the listener so the waiting will not affect the change
        imageUIBackground.addEventListener('load', () => {
            this._canvasHelper._context.drawImage(imageUIBackground, 0, 0, 1650, 1080);
            this._canvasHelper._context.drawImage(imageWoodResource, 5, 2, 50, 50);
            this._canvasHelper._context.drawImage(imageStoneResource, 210, 2, 50, 50);
            this._canvasHelper._context.drawImage(imageGoldRecourse, 400, 2, 50, 50);

            //this.d_context.clip();
            this._canvasHelper._context.font = "40px Minecraft";
            this._canvasHelper._context.fillStyle = "#ff00ff";
<<<<<<< HEAD
            this._canvasHelper._context.fillText(`${App._gold}`, 130, 33)
            this._canvasHelper._context.fillText(`${App._stone}`, 340, 33)
            this._canvasHelper._context.fillText(`${App._gold}`, 530, 33)
=======
            this._canvasHelper._context.fillText(`${App._gold}`, 80, 33)
            this._canvasHelper._context.fillText(`${App._stone}`, 290, 33)
            this._canvasHelper._context.fillText(`${App._gold}`, 480, 33)
            this._canvasHelper.loadingBar(500, 33, 50, 20, App._klimaat, 100)
>>>>>>> d1dae3cf918017f9f12fb19a14b25d7dd34f3513
        });
        imageUIBackground.src = "./assets/images/backgrounds/UIBackground.png"
        imageWoodResource.src = "./assets/images/resources/woodResource.png"
        imageStoneResource.src = "./assets/images/resources/stoneResource.png"
        imageGoldRecourse.src = "./assets/images/resources/goldResource.png"
    }
}