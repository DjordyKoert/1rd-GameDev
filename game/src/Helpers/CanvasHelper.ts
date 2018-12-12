class CanvasHelper {

    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;

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
    public writeTextToCanvas(text: string, fontSize: number, xPos: number, yPos: number, color: string = "black", alignment: CanvasTextAlign = "center", textBaseLine: any = 'middle') {
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
    public writeImageToCanvas(image: CanvasImageSource,
        aXpos: number,
        aYpos: number,
        imgWidth: number = null,
        imgHeight: number = null,
    ): CanvasImageSource {
        // save the current state
        this._context.save();
        // move the origin to the desired location
        this._context.translate(aXpos, aYpos);
        // draw
        if (imgWidth != null && imgHeight != null) {
            this._context.drawImage(image, imgWidth, imgHeight);
        }
        else if (imgWidth != null) {
            this._context.drawImage(image, imgWidth, -image.height / 2);
        }
        else if (imgHeight != null) {
            this._context.drawImage(image, -image.width / 2, imgHeight);
        } else {
            this._context.drawImage(image, -image.width / 2, -image.height / 2);
        }
        // reset to saved state
        this._context.restore();
        return image;
    }
    /**
     * Clears screen
     */
    public clear(): void {
        //clear the screen
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height)
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
    ) {
        //Red bar
        this.createRect(rectXPos + 10, rectYPos + 10, rectWidth, rectHeight, barLeft)
        //Green bar
        this.createRect(rectXPos + 10, rectYPos + 10, rectWidth * (value / maxNumber), rectHeight, barProgress)

    }

    public moveTo(xPos: number, yPos: number): void {
        this._context.moveTo(xPos, yPos)
    }
    public lineTo(xPos: number, yPos: number): void {
        this._context.lineTo(xPos, yPos)
        this._context.stroke()
    }
}