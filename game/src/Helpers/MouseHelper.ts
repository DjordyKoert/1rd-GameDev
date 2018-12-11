class MouseHelper {

    constructor() {
        window.addEventListener("mousemove", this.mouseMove)
        window.addEventListener("mousedown", this.mouseDown)
        window.addEventListener("mouseup", this.mouseUp)
    }

    public mouseMove = (event: MouseEvent) => {
        return { mouseX: event.x, mouseY: event.y }
    }

    public mouseDown = (event: MouseEvent) => {
        return { mouseX: event.x, mouseY: event.y }
    }

    public mouseUp = (event: MouseEvent) => {
        return { mouseX: event.x, mouseY: event.y }
    }

}