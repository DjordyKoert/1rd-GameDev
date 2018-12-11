class GameView {
    protected _screen: string = "gameScreen";
    protected CanvasHelper: CanvasHelper
    private xCoord: number
    private yCoord: number
    private lines: number
    private sqSize: number
    private tileImages: Array<string>

    public constructor(canvas: CanvasHelper) {
        this.CanvasHelper = canvas
        this.xCoord = this.yCoord = 0
        this.lines = 50
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
        this.renderGrid()
    }
    public renderScreen() {
    }
    public renderGrid() {
        for (let line = 0; line < this.lines; line++) {
            this.CanvasHelper.moveTo(0, this.yCoord)
            this.CanvasHelper.lineTo(this.CanvasHelper.getWidth(), this.yCoord)
            this.CanvasHelper.moveTo(this.xCoord, 0)
            this.CanvasHelper.lineTo(this.xCoord, this.CanvasHelper.getHeight())
            //this.CanvasHelper.createRect(this.xCoord, 0, this.sqSize, this.sqSize)
            for (let i = 0; i < this.lines; i++) {
                this.CanvasHelper.writeImageToCanvas(this.tileImages[MathHelper.randomNumber(0, this.tileImages.length - 1)], this.xCoord, this.sqSize * i, this.sqSize, this.sqSize)
            }

            this.xCoord += this.sqSize
            this.yCoord += this.sqSize
        }
    }
}