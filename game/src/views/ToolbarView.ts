class ToolbarView {
    protected _screen: string = "homeScreen";
    protected CanvasHelper: CanvasHelper
    private _mouseHelper: MouseHelper
    private clicked: boolean
    private static curTool: string
    private rendered: boolean
    public constructor(canvas: CanvasHelper) {
        this.CanvasHelper = canvas
        this.clicked = this.rendered = false
        this._mouseHelper = new MouseHelper()
        ToolbarView.setTool(undefined)
    }
    public renderToolbar() {
        this.CanvasHelper.createRect(this.CanvasHelper.getWidth() * 0.2, this.CanvasHelper.getHeight() * 0.8, this.CanvasHelper.getWidth() * 0.6, this.CanvasHelper.getHeight() * 0.2)
        this.CanvasHelper.createRect(this.CanvasHelper.getWidth() * 0.21, this.CanvasHelper.getHeight() * 0.81, this.CanvasHelper.getWidth() * 0.1, this.CanvasHelper.getHeight() * 0.18, "red")
        this.rendered = true

        this.toolBarClick()
    }

    public toolBarClick(): void {
        if (this._mouseHelper.getClick().click && !this.clicked) {
            if (this._mouseHelper.getClick().x >= this.CanvasHelper.getWidth() * 0.21 && this._mouseHelper.getClick().x <= (this.CanvasHelper.getWidth() * 0.21 + this.CanvasHelper.getWidth() * 0.1)) {
                if (this._mouseHelper.getClick().y >= this.CanvasHelper.getHeight() * 0.81 && this._mouseHelper.getClick().y <= (this.CanvasHelper.getHeight() * 0.81 + this.CanvasHelper.getHeight() * 0.18)) {
                    if (ToolbarView.getTool() == "axe") { this.clicked = true; ToolbarView.setTool(undefined); return }
                    this.clicked = true
                    ToolbarView.setTool("axe")
                }
            }
        }
        if (!this._mouseHelper.getClick().click) this.clicked = false
    }
    public static setTool(tool: string) {
        this.curTool = tool
    }
    public static getTool(): string {
        return this.curTool
    }
}