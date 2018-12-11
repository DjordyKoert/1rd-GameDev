class GameView {
    protected _screen: string = "gameScreen";
    protected CanvasHelper: CanvasHelper
    private xCoord: number
    private yCoord: number
    private lines: number
    private sqSize: number

    public constructor(canvas: CanvasHelper) {
        this.CanvasHelper = canvas
        this.xCoord = 0
        this.yCoord = 0
        this.lines = 10
        this.sqSize = this.CanvasHelper.getWidth() / this.lines
        this.renderGrid()
    }
    public renderScreen() {
    }
    public renderGrid() {
        for (let line = 0; line < this.lines; line++) {
            console.log(this.xCoord, this.yCoord, line)
            this.CanvasHelper.moveTo(0, this.yCoord)
            this.CanvasHelper.lineTo(this.CanvasHelper.getWidth(), this.yCoord)
            this.CanvasHelper.moveTo(this.xCoord, 0)
            this.CanvasHelper.lineTo(this.xCoord, this.CanvasHelper.getHeight())
            this.xCoord += this.sqSize
            this.yCoord += this.sqSize
        }
    }
}