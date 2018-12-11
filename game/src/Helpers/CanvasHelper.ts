class CanvasHelper {

    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;

    constructor(canvas:HTMLCanvasElement) {
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
    }
    public writeTextToCanvas() {

    }
    
    public writeImageToCanvas(): void {

    }

    public clear(): void {
        //clear the screen
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height)
    }

    public getHeight() {
        return this._canvas.height;
    }

    public getWidth() {
        return this._canvas.width;
    }

    public getCenter() {
        return this._canvas.width / this._canvas.height;
    }

    public createRect() {
    this._context.fillStyle="#FF0000";
    this._context.fillRect(20,20,150,100);    
    }
}