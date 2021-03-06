class CanvasHelper {

    private _canvas: HTMLCanvasElement;
    public _context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
    }

    /**
     * Writes text to the canvas
     * @param text The text written to the canvas
     * @param fontSize The font size of the text
     * @param xPos The X Position of the text
     * @param yPos The Y Position of the tect
     * @param color The color of the text
     * @param alignment The alignment of the text
     * @param textBaseLine The baseline of the text
     */
    public writeTextToCanvas(text: string, fontSize: number, xPos: number, yPos: number, color: string = "white", alignment: CanvasTextAlign = "center", textBaseLine: any = 'middle') {
        this._context.font = `${fontSize}px Minecraft`;
        this._context.fillStyle = color;
        this._context.textAlign = alignment;
        this._context.textBaseline = textBaseLine;
        this._context.fillText(text, xPos, yPos);
    }

    /**
     * Writes an image to the canvas
     * @param Src The image link
     * @param xPos The X position of the image
     * @param yPos The Y position of the image
     */
    public writeImageToCanvas(Src: string, xPos: number, yPos: number, imgWidth: number, imgHeight: number): boolean {
        let image = new Image();
        // add the listener so the waiting will not affect the change
        image.addEventListener('load', () => {
            //this.d_context.clip();
            this._context.drawImage(image, xPos, yPos, imgWidth, imgHeight);
        });

        // load the source in the image.
        image.src = Src;
        return true
    }
    /**
     * Clears screen
     */
    public clear(
        xpos: number = 0,
        ypos: number = 0,
        width: number = this._canvas.width,
        height: number = this._canvas.height
    ): void {
        //clear the screen
        this._context.clearRect(xpos, ypos, width, height)
    }

    /**
     * returns the canvas height
     */
    public getHeight(): number {
        return this._canvas.height;
    }

    /**
     * returns the canvas width
     */
    public getWidth(): number {
        return this._canvas.width;
    }

    /**
     * returns an object with X and Y coordinates
     */
    public getCenter(): { X: number, Y: number } {
        return { X: this._canvas.width / 2, Y: this._canvas.height / 2 };
    }


    /**
     * Creates a Rectangle
     * @param xPos The start position of the X coordinate of the rectangle
     * @param yPos The start position of the Y coordinate of the rectangle
     * @param width The width of the rectangle
     * @param height The height of the rectangle
     * @param color The color of the rectangle -- DEFAULT WHITE
     */
    public createRect(xPos: number, yPos: number, width: number, height: number, color: string = "white") {
        this._context.fillStyle = color;
        this._context.fillRect(xPos, yPos, width, height);
    }

    /**
     * Makes a clickable button
     * @param rectXPos Start X position of the button
     * @param rectYPos start Y position of the button
     * @param rectWidth button's width
     * @param rectHeight button's height
     * @param text Displayed text
     * @param fontSize fontsize of the displayed text
     * @param rectColor color of the button -- DEFAULTED TO WHITE
     * @param textColor color for the text -- DEFAULTED TO BLACK
     * @param alignment alignment of the text -- DEFAULTED TO CENTER
     */
    public writeButtonToCanvas(
        rectXPos: number,
        rectYPos: number,
        rectWidth: number,
        rectHeight: number,

        text: string,
        fontSize: number,
        rectColor: string = "white",
        textColor: string = "black",
        textAlignment: CanvasTextAlign = "center",
    ) {
        this.createRect(rectXPos, rectYPos, rectWidth, rectHeight, rectColor)
        this.writeTextToCanvas(text, fontSize, rectXPos + (rectWidth / 2), rectYPos + (rectHeight / 2), textColor, textAlignment)
        window.addEventListener("click", (event) => {
            console.log(event.x, event.y)
            if (event.x > rectXPos && event.x < rectXPos + rectWidth) {
                if (event.y > rectYPos && event.y < rectYPos + rectHeight) {
                    alert('button pressed')
                    // TODO changeScreen
                }
            }
        })


    }
    public loadingBar(
        rectXPos: number,
        rectYPos: number,
        rectWidth: number,
        rectHeight: number,
        value: number,
        maxNumber: number,

        barProgress: string = "green",
        barLeft: string = "red",
    ): void {
        if (value > maxNumber) return
        //Red bar
        this.createRect(rectXPos + 10, rectYPos + 10, rectWidth, rectHeight, barLeft)
        //Green bar
        this.createRect(rectXPos + 10, rectYPos + 10, rectWidth * (value / maxNumber), rectHeight, barProgress)

    }
    /**
     * Makes a black line
     * @param beginXpos Begin X coordinate of the line
     * @param beginYpos begin Y coordinate of the line
     * @param endXpos end X coordinate of the line
     * @param endYpos end Y coordinate of the line
     */
    public makeLine(
        beginXpos: number,
        beginYpos: number,
        endXpos: number,
        endYpos: number): void {
        this.moveTo(beginXpos, beginYpos)
        this.lineTo(endXpos, endYpos)
    }

    public moveTo(xPos: number, yPos: number): void {
        this._context.moveTo(xPos, yPos)
    }

    public lineTo(xPos: number, yPos: number): void {
        this._context.beginPath()
        this._context.lineTo(xPos, yPos)
        this._context.stroke()
    }

    public writeWarning(warnMessage: string) {
        let warnCanvas = new CanvasHelper(<HTMLCanvasElement>document.getElementById("canvasOverlay"))
        let msgWidth = this._context.measureText(warnMessage).width
        warnCanvas.createRect(warnCanvas.getCenter().X - msgWidth * 1.5, warnCanvas.getCenter().Y- 15, msgWidth * 3, 30, "black")
        warnCanvas.writeTextToCanvas(warnMessage, 30, warnCanvas.getCenter().X, warnCanvas.getCenter().Y, "red", "center")
        setTimeout(() => {
            warnCanvas.clear()
        }, 3000)
    }
}
