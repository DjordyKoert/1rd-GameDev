class ToolbarView {
    protected _screen: string = "homeScreen";
    protected CanvasHelper: CanvasHelper
    private _mouseHelper: MouseHelper
    private clicked: boolean
    private curTool: string
    private rendered: boolean
    public constructor(canvas: CanvasHelper) {
        this.CanvasHelper = canvas
        this.clicked = this.rendered = false
        this._mouseHelper = new MouseHelper()

    }
    public renderToolbar() {
        if (!this.rendered) {
            this.CanvasHelper.createRect(this.CanvasHelper.getWidth() * 0.2, this.CanvasHelper.getHeight() * 0.8, this.CanvasHelper.getWidth() * 0.6, this.CanvasHelper.getHeight() * 0.2)
            this.CanvasHelper.createRect(this.CanvasHelper.getWidth() * 0.21, this.CanvasHelper.getHeight() * 0.81, this.CanvasHelper.getWidth() * 0.1, this.CanvasHelper.getHeight() * 0.18, "red")
            this.rendered = true
        }
        this.setTool()
        console.log(this.curTool)
    }

    public setTool(): void {
        if (this._mouseHelper.getClick().click && !this.clicked) {
            if (this._mouseHelper.getClick().x >= this.CanvasHelper.getWidth() * 0.21 && this._mouseHelper.getClick().x <= (this.CanvasHelper.getWidth() * 0.21 + this.CanvasHelper.getWidth() * 0.1)) {
                if (this._mouseHelper.getClick().y >= this.CanvasHelper.getHeight() * 0.81 && this._mouseHelper.getClick().y <= (this.CanvasHelper.getHeight() * 0.81 + this.CanvasHelper.getHeight() * 0.18)) {
                    if (this.curTool == "axe") {this.clicked = true;this.curTool = undefined; return }
                    this.clicked = true
                    this.curTool = "axe"
                }
            }
        }
        if (!this._mouseHelper.getClick().click) this.clicked = false
    }

}