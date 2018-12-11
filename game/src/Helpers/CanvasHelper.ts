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

    }

    public getWidth() {

    }

    public getCenter() {

    }
}