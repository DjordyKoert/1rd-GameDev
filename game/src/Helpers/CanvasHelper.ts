class CanvasHelper {

    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
    }
    public writeTextToCanvas(Text: string, fontSize: number, xPos: number, yPos: number, Color: string = "white", Alignment: CanvasTextAlign = "center") {
        this._context.font = `${fontSize}px Minecraft`;
        this._context.fillStyle = Color;
        this._context.textAlign = Alignment;
        this._context.fillText(Text, xPos, yPos);
    }

    public writeImageToCanvas(Src: string, xPos: number, yPos: number) {
        let image = new Image();
        // add the listener so the waiting will not affect the change
        image.addEventListener('load', () => {
            //this.d_context.clip();
            this._context.drawImage(image, xPos, yPos);
        });

        // load the source in the image.
        image.src = Src;
    }

    public clear(): void {
        //clear the screen
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height)
    }

    public getHeight(): number {
        return this._canvas.height;
    }

    public getWidth(): number {
        return this._canvas.width;
    }

    public getCenter(): { X: number, Y: number } {
        return { X: this._canvas.width / 2, Y: this._canvas.height / 2};
    }

    public createRect(xPos: number, yPos: number, width: number, height: number, color: string = "white") {
        this._context.fillStyle = color;
        this._context.fillRect(xPos, yPos, width, height);
    }
}