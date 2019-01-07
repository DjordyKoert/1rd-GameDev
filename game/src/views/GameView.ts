class GameView extends BaseView {
    protected _screen: string = "gameScreen";
    protected _mouseHelper: MouseHelper
    protected _xCoord: number
    protected _yCoord: number
    protected _lines: number
    protected _sqSize: number
    private _gridsRendered: boolean
    private _tileImages: Array<string>
    private _tileInfo: Array<any>
    protected _homeView: HomeView
    //BuilderView
    private _viewWidth: number
    private _renderedBuilderView: boolean = false
    private _clickedBuilderView: boolean = false
    private _folded: boolean = true
    //ToolBarView
    private _clickedToolbar: boolean
    private _curTool: string
    private _renderedToolbar: boolean

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        this._mouseHelper = new MouseHelper()
        this._gridsRendered = false
        this._xCoord = this._yCoord = 0
        this._lines = 15
        //Check screen size to make grids fit
        if (this._canvasHelper.getWidth() > this._canvasHelper.getHeight()) {
            this._sqSize = this._canvasHelper.getWidth() / this._lines
        }
        else {
            this._sqSize = this._canvasHelper.getHeight() / this._lines
        }
        this._tileImages = [
            "./assets/images/foliage/tree.png",
            "./assets/images/earth_textures/earth.png",
            "./assets/images/earth_textures/earth.png",
            "./assets/images/earth_textures/mountain.png",
            "./assets/images/water/lake[n].png",
        ]
        this._tileInfo = [{}]
        this._clickedToolbar = this._renderedToolbar = false
        this._curTool = ""
    }
    private renderOverlay() {
        this.renderBuilderView()
        this.renderToolbarView()
        this.renderUIView()
        this.nameBox()
    }
    public renderScreen(): void {
        if (!this._gridsRendered) {
            this.renderNewGrid()
            setInterval(() => this.BuildingCheck(), 1000)
        }
        this.renderOverlay()
    }
    public renderOldGrid(): void {
        this._xCoord = 0
        this._yCoord = 0
        for (let line = 0; line < this._lines; line++) {
            this._canvasHelper.moveTo(0, this._yCoord)
            this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this._yCoord)
            this._canvasHelper.moveTo(this._xCoord, 0)
            this._canvasHelper.lineTo(this._xCoord, this._canvasHelper.getHeight())
        }
        this._tileInfo.forEach(tile => {
            if (tile.imageSrc == "./assets/images/houses/house.png") {
                this._canvasHelper.writeImageToCanvas("./assets/images/earth_textures/buildingEarth.png", tile.xStart, tile.yStart, tile.xEnd - tile.xStart, tile.yEnd - tile.yStart)
            }
            else {
                this._canvasHelper.writeImageToCanvas("./assets/images/earth_textures/earth.png", tile.xStart, tile.yStart, tile.xEnd - tile.xStart, tile.yEnd - tile.yStart)
            }
            this._canvasHelper.writeImageToCanvas(tile.imageSrc, tile.xStart, tile.yStart, tile.xEnd - tile.xStart, tile.yEnd - tile.yStart)
        });
    }
    public renderNewGrid(): void {
        for (let line = 0; line < this._lines; line++) {
            this._canvasHelper.moveTo(0, this._yCoord)
            this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this._yCoord)
            this._canvasHelper.moveTo(this._xCoord, 0)
            this._canvasHelper.lineTo(this._xCoord, this._canvasHelper.getHeight())
            //this.CanvasHelper.createRect(this.xCoord, 0, this.sqSize, this.sqSize)
            for (let i = 0; i < this._lines; i++) {
                let imageSrc = this._tileImages[MathHelper.randomNumber(0, this._tileImages.length - 1)]
                imageSrc = imageSrc.replace("[n]", `${MathHelper.randomNumber(1, 2)}`)
                //console.log(imageSrc)
                //Draw Grass
                this._canvasHelper.writeImageToCanvas("./assets/images/earth_textures/earth.png", this._xCoord, this._sqSize * i, this._sqSize, this._sqSize)
                this._canvasHelper.writeImageToCanvas(imageSrc, this._xCoord, this._sqSize * i, this._sqSize, this._sqSize)
                //Try to create array with objects
                let vr = { xStart: this._xCoord, xEnd: this._xCoord + this._sqSize, yStart: this._sqSize * i, yEnd: (this._sqSize * i) + this._sqSize, imageSrc: imageSrc }
                this._tileInfo.push(vr)
            }

            this._xCoord += this._sqSize
            this._yCoord += this._sqSize
        }
        //Clean this._tileInfo so it only contains info about things INSIDE the screen
        this._tileInfo = this._tileInfo.filter(x => x.xStart <= this._canvasHelper.getWidth() && x.yStart <= this._canvasHelper.getHeight())
        let allHouses = this._tileInfo.filter(x => x.imageSrc == this._tileImages[1])
        allHouses.forEach(() => {
            App._klimaat += 1
        });
        window.addEventListener("mousedown", e => {
            if (this._curTool == "axe") {
                document.body.style.cursor = "url('assets/cursors/Diamond_axeChop.png'), auto";
                let filter = this._tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                if (!filter) return;
                if (filter.imageSrc == "./assets/images/foliage/tree.png") {
                    let n = this._tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                    this._tileInfo[n].imageSrc = "./assets/images/earth_textures/earth.png"
                    this.renderOldGrid()
                    App._klimaat -= 5
                    App._wood += 10
                }
            }

            if (this._curTool == "hammer" && App.ResourceCheck(0, 0, 4)) {
                document.body.style.cursor = "url('assets/cursors/Diamond_hammerChop.png'), auto";
                let filter = this._tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                if (!filter) return;
                if (filter.imageSrc == "./assets/images/houses/house.png") {
                    let n = this._tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                    this._tileInfo[n].imageSrc = "./assets/images/earth_textures/earth.png"
                    this.renderOldGrid()
                    App._gold -= 5
                    App._klimaat += 1
                }
            }

            if (this._curTool == "pickaxe" && App.ResourceCheck(0, 0, 10)) {
                document.body.style.cursor = "url('assets/cursors/Diamond_PickaxeChop.png'), auto";
                let filter = this._tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                if (!filter) return;
                if (filter.imageSrc == "./assets/images/earth_textures/mountain.png") {
                    let n = this._tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                    this._tileInfo[n].imageSrc = "./assets/images/earth_textures/earth.png"
                    this.renderOldGrid()
                    App._gold -= 10
                    App._klimaat -= 1
                    App._stone += 5
                }
            }

        })

        window.addEventListener("mouseup", e => {
            if (this._curTool == "axe") {
                document.body.style.cursor = "url('assets/cursors/Diamond_axe.png'), auto";
            }
            if (this._curTool == "pickaxe") {
                document.body.style.cursor = "url('assets/cursors/Diamond_pickaxe.png'), auto";
            }
            if (this._curTool == "hammer") {
                document.body.style.cursor = "url('assets/cursors/Diamond_hammer.png'), auto";
            }

        })


        this._gridsRendered = true
    }


    //BuilderView
    public renderBuilderView(): void {
        if (this._folded) {
            this._viewWidth = 50
            this.renderFoldedBuilderView()
            this._renderedBuilderView = true
            if (this._mouseHelper.getClick().click && !this._clickedBuilderView) {
                if (this._mouseHelper.getClick().x > this._canvasHelper.getWidth() - this._viewWidth && this._mouseHelper.getClick().x < this._canvasHelper.getWidth()) {
                    if (this._mouseHelper.getClick().y > 0 && this._mouseHelper.getClick().y < 20) {
                        this._clickedBuilderView = true
                    }
                }
            }
            if (!this._mouseHelper.getClick().click && this._clickedBuilderView) {
                this._clickedBuilderView = false
                this._canvasHelper.clear(this._canvasHelper.getWidth() - this._viewWidth, 0, this._canvasHelper.getWidth(), this._canvasHelper.getHeight())
                this._folded = false
                this._renderedBuilderView = false
            }
        }
        if (!this._folded) {
            this._viewWidth = 300
            if (!this._renderedBuilderView) {
                this.renderUnFoldedBuilderView()
                this._renderedBuilderView = true
            }

            if (this._mouseHelper.getClick().click && !this._clickedBuilderView) {

                if (this._mouseHelper.getClick().x > this._canvasHelper.getWidth() - this._viewWidth + 190 && this._mouseHelper.getClick().x < this._canvasHelper.getWidth() - this._viewWidth + 190 + 90) {
                    if (this._mouseHelper.getClick().y > 80 && this._mouseHelper.getClick().y < 80 + 64) {
                        this._clickedBuilderView = true
                    }
                }
            }
            if (!this._mouseHelper.getClick().click && this._clickedBuilderView) {
                this._clickedBuilderView = false
                this._canvasHelper.clear(this._canvasHelper.getWidth() - this._viewWidth, 0, this._canvasHelper.getWidth(), this._canvasHelper.getHeight())
                this._folded = true
                this._renderedBuilderView = false
                //console.log('Image Released')
                let releasedTile = this._tileInfo.findIndex(x => x.xStart <= this._mouseHelper.getClick().x && x.xEnd >= this._mouseHelper.getClick().x && x.yStart <= this._mouseHelper.getClick().y && x.yEnd >= this._mouseHelper.getClick().y)
                if (this._tileInfo[releasedTile].imageSrc == "./assets/images/foliage/tree.png") this._canvasHelper.writeWarning("er staat hier een boom")
                else {
                    this._tileInfo[releasedTile].imageSrc = "./assets/images/houses/house.png"
                }
                this.renderOldGrid()
            }
        }
    }
    //ToolBar
    public renderToolbarView(): void {

        if (!this._renderedToolbar) {
            this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() * 0.2, this._canvasHelperOverlay.getHeight() * 0.8, this._canvasHelperOverlay.getWidth() * 0.6, this._canvasHelperOverlay.getHeight() * 0.2)
            this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() * 0.21, this._canvasHelperOverlay.getHeight() * 0.81, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.18, "red")
            this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() * 0.32, this._canvasHelperOverlay.getHeight() * 0.81, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.18, "blue")
            this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() * 0.43, this._canvasHelperOverlay.getHeight() * 0.81, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.18, "yellow")
            let DiamondAxe = new Image();
            let DiamondHammer = new Image();
            let DiamondPickaxe = new Image();
            DiamondAxe.addEventListener('load', () => {
                this._canvasHelperOverlay._context.drawImage(DiamondAxe, this._canvasHelperOverlay.getWidth() * 0.21, this._canvasHelperOverlay.getHeight() * 0.81, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.18)
                this._canvasHelperOverlay._context.drawImage(DiamondHammer, this._canvasHelperOverlay.getWidth() * 0.3057, this._canvasHelperOverlay.getHeight() * 0.79, this._canvasHelperOverlay.getWidth() * 0.12, this._canvasHelperOverlay.getHeight() * 0.20)
                this._canvasHelperOverlay._context.drawImage(DiamondPickaxe, this._canvasHelperOverlay.getWidth() * 0.43, this._canvasHelperOverlay.getHeight() * 0.83, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.15)
            });
            DiamondAxe.src = "./assets/images/toolBar_textures/Diamond_Axe.png"
            DiamondHammer.src = "./assets/images/toolBar_textures/Diamond_Hammer.png"
            DiamondPickaxe.src = "./assets/images/toolBar_textures/Diamond_Pickaxe.png"
            this._renderedToolbar = true
        }
        this.toolBarClick()
    }

    public toolBarClick(): void {
        if (this._mouseHelper.getClick().click && !this._clickedToolbar) {
            if (this._mouseHelper.getClick().x >= this._canvasHelper.getWidth() * 0.21 && this._mouseHelper.getClick().x <= (this._canvasHelper.getWidth() * 0.21 + this._canvasHelper.getWidth() * 0.1)) {
                if (this._mouseHelper.getClick().y >= this._canvasHelper.getHeight() * 0.81 && this._mouseHelper.getClick().y <= (this._canvasHelper.getHeight() * 0.81 + this._canvasHelper.getHeight() * 0.18)) {
                    if (this._curTool == "axe") {
                        this._clickedToolbar = true
                        this._curTool = undefined
                        document.body.style.cursor = 'default'
                        return
                    }


                    this._clickedToolbar = true
                    document.body.style.cursor = "url('assets/cursors/Diamond_axe.png'), auto";
                    this._curTool = "axe"
                }
            }
            if (this._mouseHelper.getClick().x >= this._canvasHelper.getWidth() * 0.32 && this._mouseHelper.getClick().x <= (this._canvasHelper.getWidth() * 0.32 + this._canvasHelper.getWidth() * 0.1)) {
                if (this._mouseHelper.getClick().y >= this._canvasHelper.getHeight() * 0.81 && this._mouseHelper.getClick().y <= (this._canvasHelper.getHeight() * 0.81 + this._canvasHelper.getWidth() * 0.18)) {
                    if (this._curTool == "hammer") {
                        this._clickedToolbar = true
                        this._curTool = undefined
                        document.body.style.cursor = 'default'
                        return
                    }
                    this._clickedToolbar = true
                    document.body.style.cursor = "url('assets/cursors/Diamond_hammer.png'), auto";
                    this._curTool = "hammer"
                }
            }
            if (this._mouseHelper.getClick().x >= this._canvasHelper.getWidth() * 0.43 && this._mouseHelper.getClick().x <= (this._canvasHelper.getWidth() * 0.43 + this._canvasHelper.getWidth() * 0.1)) {
                if (this._mouseHelper.getClick().y >= this._canvasHelper.getHeight() * 0.81 && this._mouseHelper.getClick().y <= (this._canvasHelper.getHeight() * 0.81 + this._canvasHelper.getWidth() * 0.18)) {
                    if (this._curTool == "pickaxe") {
                        this._clickedToolbar = true
                        this._curTool = undefined
                        document.body.style.cursor = 'default'
                        return
                    }

                    this._clickedToolbar = true
                    document.body.style.cursor = "url('assets/cursors/Diamond_Pickaxe.png'), auto";
                    this._curTool = "pickaxe"
                }
            }
        }
        if (!this._mouseHelper.getClick().click) this._clickedToolbar = false
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
        let imageGoldResource = new Image();
        // add the listener so the waiting will not affect the change
        imageUIBackground.addEventListener('load', () => {
            this._canvasHelperOverlay._context.drawImage(imageUIBackground, 0, 0, 1650, 1080);
            this._canvasHelperOverlay._context.drawImage(imageWoodResource, 5, 2, 50, 50);
            this._canvasHelperOverlay._context.drawImage(imageStoneResource, 210, 2, 50, 50);
            this._canvasHelperOverlay._context.drawImage(imageGoldResource, 400, 2, 50, 50);

            //this.d_context.clip();
            this._canvasHelperOverlay._context.font = "40px Minecraft";
            this._canvasHelperOverlay._context.fillStyle = "#ff00ff";
            this._canvasHelperOverlay._context.fillText(`${App._wood}`, 130, 33)
            this._canvasHelperOverlay._context.fillText(`${App._stone}`, 340, 33)
            this._canvasHelperOverlay._context.fillText(`${App._gold}`, 530, 33)
            this._canvasHelperOverlay.loadingBar(-11, 53, 590, 15, App._klimaat, 100)
        });
        imageUIBackground.src = "./assets/images/backgrounds/UIBackground.png"
        imageWoodResource.src = "./assets/images/resources/woodResource.png"
        imageStoneResource.src = "./assets/images/resources/stoneResource.png"
        imageGoldResource.src = "./assets/images/resources/goldResource.png"
    }
    //UnfoldedBuilderView
    private renderFoldedBuilderView(): void {
        this._canvasHelper.createRect(this._canvasHelper.getWidth() - this._viewWidth, 0, this._viewWidth, this._canvasHelper.getHeight(), 'green')
        this._canvasHelper.writeTextToCanvas('<--', 20, this._canvasHelper.getWidth() - 10, 10, 'black', 'right')
    }
    //FoldedBuilderView
    private renderUnFoldedBuilderView(): void {
        let _yPosLine1: number = 70
        let _yPosLine2: number = 155
        let _yposLine3: number = 250
        this._canvasHelper.createRect(this._canvasHelper.getWidth() - this._viewWidth, 0, this._viewWidth, this._canvasHelper.getHeight(), 'green')
        this._canvasHelper.writeTextToCanvas('GEBOUWEN', 48, (this._canvasHelper.getWidth() - this._viewWidth / 2), 40)
        this._canvasHelper.makeLine(this._canvasHelper.getWidth() - this._viewWidth, _yPosLine1, this._canvasHelper.getWidth(), _yPosLine1)
        // this._canvasHelper.moveTo(this._canvasHelper.getWidth() - this._viewWidth, _yPosLine1)
        // this._canvasHelper.lineTo(this._canvasHelper.getWidth(), _yPosLine1)
        this._canvasHelper.writeTextToCanvas('HUIS', 36, (this._canvasHelper.getWidth() - this._viewWidth + 10), 100, undefined, 'left')
        this._canvasHelper.writeTextToCanvas(`GOUD: 50`, 24, (this._canvasHelper.getWidth() - this._viewWidth + 10), 135, undefined, 'left')
        this._canvasHelper.writeImageToCanvas('./assets/images/houses/house.png', (this._canvasHelper.getWidth() - this._viewWidth + 190), 80, 90, 64)
        this._canvasHelper.makeLine(this._canvasHelper.getWidth() - this._viewWidth, _yPosLine2, this._canvasHelper.getWidth(), _yPosLine2)
        // this._canvasHelper.moveTo(this._canvasHelper.getWidth() - this._viewWidth, _yPosLine2)
        // this._canvasHelper.lineTo(this._canvasHelper.getWidth(), _yPosLine2)
        this._canvasHelper.writeTextToCanvas('FABRIEK', 36, (this._canvasHelper.getWidth() - this._viewWidth + 10), 200, undefined, 'left')
        this._canvasHelper.writeTextToCanvas(`GOUD: 50`, 24, (this._canvasHelper.getWidth() - this._viewWidth + 10), 235, undefined, 'left')
        this._canvasHelper.writeImageToCanvas('./assets/images/houses/fabriek1.png', (this._canvasHelper.getWidth() - this._viewWidth + 190), 180, 90, 64)

        this._canvasHelper.writeTextToCanvas('HOUTHAKKER', 36, (this._canvasHelper.getWidth() - this._viewWidth + 10), 300, undefined, 'left')
        this._canvasHelper.writeTextToCanvas(`GOUD: 50`, 24, (this._canvasHelper.getWidth() - this._viewWidth + 10), 335, undefined, 'left')
        this._canvasHelper.writeImageToCanvas('./assets/images/houses/lumberjack.png', (this._canvasHelper.getWidth() - this._viewWidth + 190), 320, 90, 64)

        this._canvasHelper.writeTextToCanvas('MIJNWERKER', 36, (this._canvasHelper.getWidth() - this._viewWidth + 10), 400, undefined, 'left')
        this._canvasHelper.writeTextToCanvas(`GOUD: 50`, 24, (this._canvasHelper.getWidth() - this._viewWidth + 10), 435, undefined, 'left')
        this._canvasHelper.writeImageToCanvas('./assets/images/houses/miner.png', (this._canvasHelper.getWidth() - this._viewWidth + 190), 380, 90, 64)

        this._canvasHelper.makeLine(this._canvasHelper.getWidth() - this._viewWidth, _yPosLine2, this._canvasHelper.getWidth(), _yPosLine2)
        this._canvasHelper.makeLine(this._canvasHelper.getWidth() - this._viewWidth, _yPosLine2, this._canvasHelper.getWidth(), _yPosLine2)
    }

    private BuildingCheck() {
        let Houses = this._tileInfo.filter(x => x.imageSrc == "./assets/images/houses/house.png")
        Houses.forEach(house => {
            App._gold += 1
        })
    }
    //nameBox
    public nameBox() {

        let nameBoxBackground = new Image();

        nameBoxBackground.addEventListener('load', () => {
            this._canvasHelperOverlay._context.drawImage(nameBoxBackground, this._canvasHelperOverlay.getWidth()/2 -220, 0);
            this._canvasHelperOverlay.writeTextToCanvas(App._name, 50, this._canvasHelperOverlay.getWidth() / 2, 30);
        })
        nameBoxBackground.src = "assets/images/backgrounds/nameBoxBackground.png"
    }
}