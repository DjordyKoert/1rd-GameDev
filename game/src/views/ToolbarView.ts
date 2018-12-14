/// <reference path="./GameView.ts" />
class ToolbarView extends GameView{
    protected _screen: string = "homeScreen";
    private clicked: boolean
    private static curTool: string
    private rendered: boolean
    public constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        this.clicked = this.rendered = false
        
        ToolbarView.setTool(undefined)
    }
    public renderToolbar() {
        this._canvasHelper.createRect(this._canvasHelper.getWidth() * 0.2, this._canvasHelper.getHeight() * 0.8, this._canvasHelper.getWidth() * 0.6, this._canvasHelper.getHeight() * 0.2)
        this._canvasHelper.createRect(this._canvasHelper.getWidth() * 0.21, this._canvasHelper.getHeight() * 0.81, this._canvasHelper.getWidth() * 0.1, this._canvasHelper.getHeight() * 0.18, "red")
        this.rendered = true

        this.toolBarClick()
    }

    public toolBarClick(): void {
        if (this._mouseHelper.getClick().click && !this.clicked) {
            if (this._mouseHelper.getClick().x >= this._canvasHelper.getWidth() * 0.21 && this._mouseHelper.getClick().x <= (this._canvasHelper.getWidth() * 0.21 + this._canvasHelper.getWidth() * 0.1)) {
                if (this._mouseHelper.getClick().y >= this._canvasHelper.getHeight() * 0.81 && this._mouseHelper.getClick().y <= (this._canvasHelper.getHeight() * 0.81 + this._canvasHelper.getHeight() * 0.18)) {
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