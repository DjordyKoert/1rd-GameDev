class MouseHelper {

    private mDown: boolean
    private mX: number
    private mY: number

    constructor() {
        window.addEventListener("mousemove", this.mouseMove)
        window.addEventListener("mousedown", this.mouseDown)
        window.addEventListener("mouseup", this.mouseUp)
    }

    public mouseMove = (event: MouseEvent) => {
        return { mouseX: event.x, mouseY: event.y }
    }

    private mouseDown = (event: MouseEvent) => {
        this.mDown = true
        this.mX = event.x
        this.mY = event.y
    }

    private mouseUp = (event: MouseEvent) => {
        this.mDown = false
        this.mX = event.x
        this.mY = event.y
    }

    public getClick(): {click: boolean, x: number, y: number} {

        return {click: this.mDown, x: this.mX, y: this.mY}
    }

    public ClickCheck(xStart: number, xEnd: number, yStart: number, yEnd: number): boolean {
        if (this.getClick().x >= xStart && this.getClick().x <= xEnd) {
            if (this.getClick().y >= yStart && this.getClick().y <= yEnd) {
                return true;
            }
        }
        return false;
    }

}