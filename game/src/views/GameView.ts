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
    private _renderOverlay: boolean
    private _canvasOverlay = document.getElementById("canvasOverlay")
    //BuilderView
    private _viewWidth: number
    private _renderedBuilderView: boolean = false
    private _clickedBuilderView: boolean = false
    private _folded: boolean = true
    private _selectedBuilding: string
    //ToolBarView
    private _clickedToolbar: boolean
    private _curTool: string
    private _renderedToolbar: boolean
    private _clickedOverlayToggle: boolean
    private _renderInfo: boolean
    private _clickedInfoToggle: boolean
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
        this._renderOverlay = true
        this._curTool = ""
    }

    public renderScreen(): void {
        if (!this._gridsRendered) {
            this.renderNewGrid()
            this.renderTutorial()
            setInterval(() => this.BuildingCheck(), 1000)
        }

        if (App._klimaat < 75 && App._klimaat > 50) {
            this._canvasOverlay.classList.remove("opacity_50")
            this._canvasOverlay.classList.add("opacity_25")
        }

        if (App._klimaat < 50 && App._klimaat > 25) {
            this._canvasOverlay.classList.remove("opacity_75")
            this._canvasOverlay.classList.remove("opacity_25")
            this._canvasOverlay.classList.add("opacity_50")
        }

        if (App._klimaat < 25) {
            this._canvasOverlay.classList.remove("opacity_50")
            this._canvasOverlay.classList.add("opacity_75")
        }

        this.renderOverlayToggle()
        this.gameInfo()
        this.renderBuilderView()

        if (this._renderOverlay) {
            this.renderToolbarView()
            this.renderUIView()
            this.nameBox()

        }
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
            this._canvasHelper.writeImageToCanvas(tile.imageSrc, tile.xStart, tile.yStart, tile.xEnd - tile.xStart, tile.yEnd - tile.yStart)
        });
    }
    private renderSingleGrid(xStart: number, xEnd: number, yStart: number, yEnd: number, imageSrc: string): void {

        this._canvasHelper.writeImageToCanvas(imageSrc, xStart, yStart, xEnd - xStart, yEnd - yStart)
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
            if (App._screen != "game") return
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

            else if (this._curTool == "hammer") {
                document.body.style.cursor = "url('assets/cursors/Diamond_hammerChop.png'), auto";
                let filter = this._tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                if (!filter) return;
                if ((filter.imageSrc == "./assets/images/houses/house1.png" ||
                    filter.imageSrc == "./assets/images/houses/houseLevel2.png" ||
                    filter.imageSrc == "./assets/images/houses/lumberjack.png" ||
                    filter.imageSrc == "./assets/images/houses/Fabriek1.png" ||
                    filter.imageSrc == "./assets/images/houses/miner.png" ||
                    filter.imageSrc == "./assets/images/houses/powerPlant.png")
                    && this.ResourceCheck(0, 0, 40)) {
                    let n = this._tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                    this._tileInfo[n].imageSrc = "./assets/images/earth_textures/earth.png"
                    this.renderSingleGrid(filter.xStart, filter.xEnd, filter.yStart, filter.yEnd, filter.imageSrc)
                    console.log("clicked building")
                    App._klimaat += 1
                    return
                }
                this._canvasWarning.writeWarning("klik op een gebouw om deze te verwijderen (kost 40 goud)")
            }

            else if (this._curTool == "pickaxe" && this._tileInfo.filter(x => x.imageSrc == "./assets/images/houses/miner.png").length > 0) {
                document.body.style.cursor = "url('assets/cursors/Diamond_PickaxeChop.png'), auto";
                let filter = this._tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                if (!filter) return;
                if (filter.imageSrc == "./assets/images/earth_textures/mountain.png" && this.ResourceCheck(0, 0, 20)) {
                    let n = this._tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                    this._tileInfo[n].imageSrc = "./assets/images/earth_textures/earth.png"
                    this.renderOldGrid()
                    App._klimaat -= 2
                    App._stone += 10
                }
            }

            else if (this._curTool == "bucket") {
                document.body.style.cursor = "url('assets/cursors/Iron_Bucket_Cursor_Blub.png'), auto";
                let filter = this._tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                if (!filter) return;
                if ((filter.imageSrc == "./assets/images/water/lake1.png" || filter.imageSrc == "./assets/images/water/lake2.png") && this.ResourceCheck(0, 0, 15)) {
                    let n = this._tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                    this._tileInfo[n].imageSrc = "./assets/images/earth_textures/earth.png"
                    this.renderOldGrid()
                    App._klimaat += 1
                }
            }

            else if (this._curTool == "seed") {
                document.body.style.cursor = "url('assets/cursors/Seed_Cursor.png'), auto";
                let filter = this._tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                if (!filter) return;
                if ((filter.imageSrc == "./assets/images/earth_textures/earth.png") && this.ResourceCheck(0, 0, 30)) {
                    let n = this._tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                    this._tileInfo[n].imageSrc = "./assets/images/foliage/tree.png"
                    this.renderOldGrid()
                    App._klimaat += 5
                }
            }
            else {
                let filter = this._tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd)
                if (filter.imageSrc == "./assets/images/houses/house1.png" && this.ResourceCheck(100, 200, 100)) {
                    filter.imageSrc = "./assets/images/houses/houseLevel2.png"
                }
                else if (filter.imageSrc == "./assets/images/houses/Fabriek1.png" && this.ResourceCheck(150, 400, 150)) {
                    filter.imageSrc = "./assets/images/houses/powerPlant.png"
                }
                this.renderSingleGrid(filter.xStart, filter.xEnd, filter.yStart, filter.yEnd, filter.imageSrc)

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
            if (this._curTool == "bucket") {
                document.body.style.cursor = "url('assets/cursors/Iron_Bucket_Cursor.png'), auto";
            }
            if (this._curTool == "seed") {
                document.body.style.cursor = "url('assets/cursors/Seed_Cursor.png'), auto";
            }

        })
        this._gridsRendered = true
    }


    //BuilderView
    public renderBuilderView(): void {
        // open builderview
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
                this._canvasHelperOverlay.clear(this._canvasHelper.getWidth() - this._viewWidth, 0, this._canvasHelper.getWidth(), this._canvasHelper.getHeight())
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
                        this._clickedBuilderView = true;
                        this._selectedBuilding = "House";
                    }
                }
                if (this._mouseHelper.getClick().x > this._canvasHelper.getWidth() - this._viewWidth + 190 && this._mouseHelper.getClick().x < this._canvasHelper.getWidth() - this._viewWidth + 190 + 90) {
                    if (this._mouseHelper.getClick().y > 180 && this._mouseHelper.getClick().y < 180 + 64) {
                        this._clickedBuilderView = true;
                        this._selectedBuilding = "Fabriek";
                    }
                }
                if (this._mouseHelper.getClick().x > this._canvasHelper.getWidth() - this._viewWidth + 190 && this._mouseHelper.getClick().x < this._canvasHelper.getWidth() - this._viewWidth + 190 + 90) {
                    if (this._mouseHelper.getClick().y > 300 && this._mouseHelper.getClick().y < 300 + 64) {
                        this._clickedBuilderView = true;
                        this._selectedBuilding = "Houthakker";
                    }
                }
                if (this._mouseHelper.getClick().x > this._canvasHelper.getWidth() - this._viewWidth + 190 && this._mouseHelper.getClick().x < this._canvasHelper.getWidth() - this._viewWidth + 190 + 90) {
                    if (this._mouseHelper.getClick().y > 450 && this._mouseHelper.getClick().y < 450 + 64) {
                        this._clickedBuilderView = true;
                        this._selectedBuilding = "Mijnwerker";
                    }
                }
            }



            if (!this._mouseHelper.getClick().click && this._clickedBuilderView) {
                this._clickedBuilderView = false
                this._canvasHelperOverlay.clear(this._canvasHelper.getWidth() - this._viewWidth, 0, this._canvasHelper.getWidth(), this._canvasHelper.getHeight())
                this._folded = true
                this._renderedBuilderView = false
                console.log('Image Released')
                let releasedTile = this._tileInfo.findIndex(x => x.xStart <= this._mouseHelper.getClick().x && x.xEnd >= this._mouseHelper.getClick().x && x.yStart <= this._mouseHelper.getClick().y && x.yEnd >= this._mouseHelper.getClick().y)
                if (!this.checkPlacement(this._tileInfo[releasedTile].imageSrc)) this._canvasHelperOverlay.writeWarning("verwijder eerst wat hier staat")
                else {
                    if (this._selectedBuilding == "House") {
                        if (this.ResourceCheck(40, 0, 0)) {
                            this._tileInfo[releasedTile].imageSrc = "./assets/images/houses/house1.png"
                        }
                    } else if (this._selectedBuilding == "Fabriek") {
                        if (this.ResourceCheck(0, 0, 100)) {
                            this._tileInfo[releasedTile].imageSrc = "./assets/images/houses/Fabriek1.png"
                        }
                    } else if (this._selectedBuilding == "Houthakker") {
                        if (this.ResourceCheck(20, 0, 20)) {
                            this._tileInfo[releasedTile].imageSrc = "./assets/images/houses/lumberjack.png"
                        }
                    } else if (this._selectedBuilding == "Mijnwerker") {
                        if (this.ResourceCheck(10, 20, 40)) {
                            this._tileInfo[releasedTile].imageSrc = "./assets/images/houses/miner.png"
                        }
                    }
                }
                this.renderSingleGrid(this._tileInfo[releasedTile].xStart, this._tileInfo[releasedTile].xEnd, this._tileInfo[releasedTile].yStart, this._tileInfo[releasedTile].yEnd, this._tileInfo[releasedTile].imageSrc)
            }
        }
    }
    //ToolBar
    public renderToolbarView(): void {
        if (!this._renderedToolbar) {
            this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() * 0.2, this._canvasHelperOverlay.getHeight() * 0.8, this._canvasHelperOverlay.getWidth() * 0.6, this._canvasHelperOverlay.getHeight() * 0.2)
            this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() * 0.21, this._canvasHelperOverlay.getHeight() * 0.81, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.18, "red")
            this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() * 0.32, this._canvasHelperOverlay.getHeight() * 0.81, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.18, "purple")
            this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() * 0.43, this._canvasHelperOverlay.getHeight() * 0.81, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.18, "yellow")
            this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() * 0.54, this._canvasHelperOverlay.getHeight() * 0.81, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.18, "blue")
            this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() * 0.65, this._canvasHelperOverlay.getHeight() * 0.81, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.18, "lightgreen")
            let DiamondAxe = new Image();
            let DiamondHammer = new Image();
            let DiamondPickaxe = new Image();
            let IronBucket = new Image();
            let Seed = new Image();
            DiamondAxe.addEventListener('load', () => {
                this._canvasHelperOverlay._context.drawImage(DiamondAxe, this._canvasHelperOverlay.getWidth() * 0.21, this._canvasHelperOverlay.getHeight() * 0.81, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.18)
                this._canvasHelperOverlay._context.drawImage(DiamondHammer, this._canvasHelperOverlay.getWidth() * 0.3057, this._canvasHelperOverlay.getHeight() * 0.79, this._canvasHelperOverlay.getWidth() * 0.12, this._canvasHelperOverlay.getHeight() * 0.20)
                this._canvasHelperOverlay._context.drawImage(DiamondPickaxe, this._canvasHelperOverlay.getWidth() * 0.43, this._canvasHelperOverlay.getHeight() * 0.83, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.15)
                this._canvasHelperOverlay._context.drawImage(IronBucket, this._canvasHelperOverlay.getWidth() * 0.54, this._canvasHelperOverlay.getHeight() * 0.795, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.20)
                this._canvasHelperOverlay._context.drawImage(Seed, this._canvasHelperOverlay.getWidth() * 0.65, this._canvasHelperOverlay.getHeight() * 0.795, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.20)
            });
            DiamondAxe.src = "./assets/images/toolBar_textures/Diamond_Axe.png"
            DiamondHammer.src = "./assets/images/toolBar_textures/Diamond_Hammer.png"
            DiamondPickaxe.src = "./assets/images/toolBar_textures/Diamond_Pickaxe.png"
            IronBucket.src = "./assets/images/toolBar_textures/Iron_Bucket.png"
            Seed.src = "./assets/images/toolBar_textures/Oak_Sapling.png"
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
            if (this._mouseHelper.getClick().x >= this._canvasHelper.getWidth() * 0.54 && this._mouseHelper.getClick().x <= (this._canvasHelper.getWidth() * 0.54 + this._canvasHelper.getWidth() * 0.1)) {
                if (this._mouseHelper.getClick().y >= this._canvasHelper.getHeight() * 0.81 && this._mouseHelper.getClick().y <= (this._canvasHelper.getHeight() * 0.81 + this._canvasHelper.getWidth() * 0.18)) {
                    if (this._curTool == "bucket") {
                        this._clickedToolbar = true
                        this._curTool = undefined
                        document.body.style.cursor = 'default'
                        return
                    }
                    this._clickedToolbar = true
                    document.body.style.cursor = "url('assets/cursors/Iron_Bucket_Cursor.png'), auto";
                    this._curTool = "bucket"
                }
            }
            if (this._mouseHelper.getClick().x >= this._canvasHelper.getWidth() * 0.65 && this._mouseHelper.getClick().x <= (this._canvasHelper.getWidth() * 0.65 + this._canvasHelper.getWidth() * 0.1)) {
                if (this._mouseHelper.getClick().y >= this._canvasHelper.getHeight() * 0.81 && this._mouseHelper.getClick().y <= (this._canvasHelper.getHeight() * 0.81 + this._canvasHelper.getWidth() * 0.18)) {
                    if (this._curTool == "seed") {
                        this._clickedToolbar = true
                        this._curTool = undefined
                        document.body.style.cursor = 'default'
                        return
                    }
                    this._clickedToolbar = true
                    document.body.style.cursor = "url('assets/cursors/Seed_Cursor.png'), auto";
                    this._curTool = "seed"
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
            this._canvasHelperOverlay.writeTextToCanvas(App._klimaat.toFixed(1), 20, 580, 20, "white", "left")
        });
        imageUIBackground.src = "./assets/images/backgrounds/UIBackground.png"
        imageWoodResource.src = "./assets/images/resources/woodResource.png"
        imageStoneResource.src = "./assets/images/resources/stoneResource.png"
        imageGoldResource.src = "./assets/images/resources/goldResource.png"
    }
    //UnfoldedBuilderView
    private renderFoldedBuilderView(): void {
        this._canvasHelperOverlay.createRect(this._canvasHelper.getWidth() - this._viewWidth, 0, this._viewWidth, this._canvasHelper.getHeight(), 'green')
        this._canvasHelperOverlay.writeTextToCanvas('<--', 20, this._canvasHelperOverlay.getWidth() - 10, 10, 'black', 'right')
    }
    //FoldedBuilderView
    private renderUnFoldedBuilderView(): void {
        let _yPosLine1: number = 70
        let _yPosLine2: number = 155
        let _yposLine3: number = 250
        this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() - this._viewWidth, 0, this._viewWidth, this._canvasHelperOverlay.getHeight(), 'green')
        this._canvasHelperOverlay.writeTextToCanvas('GEBOUWEN', 48, (this._canvasHelperOverlay.getWidth() - this._viewWidth / 2), 40)
        this._canvasHelperOverlay.makeLine(this._canvasHelperOverlay.getWidth() - this._viewWidth, _yPosLine1, this._canvasHelperOverlay.getWidth(), _yPosLine1)
        // this._canvasHelperOverlay.moveTo(this._canvasHelperOverlay.getWidth() - this._viewWidth, _yPosLine1)
        // this._canvasHelperOverlay.lineTo(this._canvasHelperOverlay.getWidth(), _yPosLine1)
        this._canvasHelperOverlay.writeTextToCanvas('HUIS', 36, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 100, undefined, 'left')
        this._canvasHelperOverlay.writeTextToCanvas(`HOUT:40`, 20, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 135, undefined, 'left')
        this._canvasHelperOverlay.writeTextToCanvas(`EFFECT: + GOUD`, 15, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 150, undefined, 'left')
        this._canvasHelperOverlay.writeImageToCanvas('./assets/images/houses/house1.png', (this._canvasHelperOverlay.getWidth() - this._viewWidth + 190), 80, 90, 64)
        this._canvasHelperOverlay.makeLine(this._canvasHelperOverlay.getWidth() - this._viewWidth, _yPosLine2, this._canvasHelperOverlay.getWidth(), _yPosLine2)
        // this._canvasHelperOverlay.moveTo(this._canvasHelperOverlay.getWidth() - this._viewWidth, _yPosLine2)
        // this._canvasHelperOverlay.lineTo(this._canvasHelperOverlay.getWidth(), _yPosLine2)
        this._canvasHelperOverlay.writeTextToCanvas('FABRIEK', 36, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 200, undefined, 'left')
        this._canvasHelperOverlay.writeTextToCanvas(`GOUD:100`, 20, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 235, undefined, 'left')
        this._canvasHelperOverlay.writeTextToCanvas(`EFFECT: + STEEN`, 15, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 250, undefined, 'left')
        this._canvasHelperOverlay.writeTextToCanvas(`- KLIMAAT`, 15, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 72),265, undefined, 'left')
        this._canvasHelperOverlay.writeImageToCanvas('./assets/images/houses/fabriek1.png', (this._canvasHelperOverlay.getWidth() - this._viewWidth + 190), 180, 90, 64)

        this._canvasHelperOverlay.writeTextToCanvas('HOUTHAKKER', 36, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 300, undefined, 'left')
        this._canvasHelperOverlay.writeTextToCanvas(`HOUT:20, GOUD: 20`, 20, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 335, undefined, 'left')
        this._canvasHelperOverlay.writeTextToCanvas(`EFFECT: + HOUT`, 15, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 350, undefined, 'left')
        this._canvasHelperOverlay.writeTextToCanvas(`+ KLIMAAT`, 15, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 72),365, undefined, 'left')
        this._canvasHelperOverlay.writeImageToCanvas('./assets/images/houses/lumberjack.png', (this._canvasHelperOverlay.getWidth() - this._viewWidth + 190), 320, 90, 64)

        this._canvasHelperOverlay.writeTextToCanvas('MIJNWERKER', 36, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 400, undefined, 'left')
        this._canvasHelperOverlay.writeTextToCanvas(`HOUT:10,STEEN:20,GOUD:40`, 20, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 435, undefined, 'left')
        this._canvasHelperOverlay.writeTextToCanvas(`EFFECT: + STEEN`, 15, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 450, undefined, 'left')
        this._canvasHelperOverlay.writeTextToCanvas(`- KLIMAAT`, 15, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 72),465, undefined, 'left')
        this._canvasHelperOverlay.writeImageToCanvas('./assets/images/houses/miner.png', (this._canvasHelperOverlay.getWidth() - this._viewWidth + 190), 450, 90, 64)

        this._canvasHelperOverlay.makeLine(this._canvasHelperOverlay.getWidth() - this._viewWidth, _yPosLine2, this._canvasHelperOverlay.getWidth(), _yPosLine2)
        this._canvasHelperOverlay.makeLine(this._canvasHelperOverlay.getWidth() - this._viewWidth, _yPosLine2, this._canvasHelperOverlay.getWidth(), _yPosLine2)
    }
    //Overlay toggle button
    private renderOverlayToggle(): void {
        this._canvasHelperOverlay.writeImageToCanvas("./assets/images/toolBar_textures/eye.png", 0, this._canvasHelper.getHeight() - 40, 40, 40)
        if (this._mouseHelper.getClick().click && !this._clickedOverlayToggle) {
            if (this._mouseHelper.ClickCheck(0, 40, this._canvasHelper.getHeight() - 40, this._canvasHelper.getHeight())) {
                if (this._renderOverlay) {
                    this._renderOverlay = false
                    this._clickedOverlayToggle = true
                    this._canvasHelperOverlay.clear()
                    return
                }
                this._clickedOverlayToggle = true
                this._renderOverlay = true
                this._renderedBuilderView = false
                if (this._folded) this._folded = true
                this._renderedToolbar = false
            }
        }
        if (!this._mouseHelper.getClick().click) this._clickedOverlayToggle = false
    }

    private gameInfo() {
        this._canvasHelperOverlay.writeImageToCanvas("./assets/images/toolBar_textures/infoButton.png", 50, this._canvasHelper.getHeight() - 40, 40, 40)
        if (this._mouseHelper.getClick().click && !this._clickedInfoToggle) {
            if (this._mouseHelper.ClickCheck(50, 90, this._canvasHelper.getHeight() - 40, this._canvasHelper.getHeight())) {
                if (this._renderInfo) {
                    this._renderInfo = false
                    this._clickedInfoToggle = true
                    this._canvasWarning.clear()
                    return
                }
                this._renderInfo = true
                this._clickedInfoToggle = true
                this._canvasWarning.writeImageToCanvas("./assets/images/info.png", this._canvasWarning.getWidth() / 8, this._canvasWarning.getHeight() / 8, 1000, 450);
            }
        }
        if (!this._mouseHelper.getClick().click) this._clickedInfoToggle = false
    }


    private BuildingCheck() {
        let Houses = this._tileInfo.filter(x => x.imageSrc == "./assets/images/houses/house1.png")
        let HousesLevel2 = this._tileInfo.filter(x => x.imageSrc == "./assets/images/houses/houseLevel2.png")
        let Fabrieken = this._tileInfo.filter(x => x.imageSrc == "./assets/images/houses/Fabriek1.png")
        let Powerplants = this._tileInfo.filter(x => x.imageSrc == "./assets/images/houses/powerPlant.png")
        let Houthakkers = this._tileInfo.filter(x => x.imageSrc == "./assets/images/houses/lumberjack.png")
        let Mijnwerkers = this._tileInfo.filter(x => x.imageSrc == "./assets/images/houses/miner.png")
        Houses.forEach(House => {
            App._gold += 1
        })
        Fabrieken.forEach(Fabriek => {
            App._stone += 2
            App._klimaat -= 1
        });
        Powerplants.forEach(Fabriek => {
            App._stone += 5
            App._klimaat -= 2
        });
        Houthakkers.forEach(Fabriek => {
            App._wood += 1
            App._klimaat += 0.4
        });
        Mijnwerkers.forEach(Fabriek => {
            App._stone += 2
            App._klimaat -= 1
        });
        HousesLevel2.forEach(Fabriek => {
            App._gold += 3
            App._klimaat -= 3
        });
    }
    //nameBox
    public nameBox() {
        this._canvasHelperOverlay.writeTextToCanvas(App._name, 50, this._canvasHelperOverlay.getWidth() / 2, 30);
    }
    private renderTutorial(): void {
        this._canvasWarning.writeWarning(`Welkom ${App._name}`)
        setTimeout(() => {
            this._canvasWarning.writeWarning("Om je toolbar en resourcebalk aan/uit te zetten klik je op het oogje links onderin")
            setTimeout(() => { this._canvasWarning.writeWarning("Om gebouwen te plaatsen moet je ze SLEPEN"); }, 3000)
        }, 3000)
    }

    private checkPlacement(image: string): boolean {
        if (image == "./assets/images/houses/house1.png" ||
            image == "./assets/images/houses/houseLevel2.png" ||
            image == "./assets/images/houses/lumberjack.png" ||
            image == "./assets/images/houses/Fabriek1.png" ||
            image == "./assets/images/earth_textures/mountain.png" ||
            image == "./assets/images/earth_textures/water.png" ||
            image == "./assets/images/foliage/tree.png" ||
            image == "./assets/images/houses/miner.png" ||
            image == "./assets/images/houses/windMill.png" ||
            image == "./assets/images/water/lake1.png" ||
            image == "./assets/images/water/lake2.png" ||
            image == "./assets/images/houses/solarPanels.png"
        ) return false
        else return true
    }
}