class BuilderView{

    protected _canvasHelper: CanvasHelper
    
    private _viewWidth: number = 300
    private _yPosLine1: number = 70
    private _yPosLine2: number = 155

    

    public constructor(canvas: CanvasHelper){
        this._canvasHelper = canvas
    }

    public renderScreen(){

        this._canvasHelper.createRect(this._canvasHelper.getWidth()- this._viewWidth ,0 ,this._viewWidth, this._canvasHelper.getHeight(),'#736acc')
        this._canvasHelper.writeTextToCanvas('GEBOUWEN',48,(this._canvasHelper.getWidth() - this._viewWidth / 2), 40,)
        this._canvasHelper.moveTo(this._canvasHelper.getWidth() - this._viewWidth, this._yPosLine1)
        this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this._yPosLine1)
        this._canvasHelper.writeTextToCanvas('HUIS', 36,(this._canvasHelper.getWidth() - this._viewWidth + 10), 100, 'black', 'left')
        this._canvasHelper.writeTextToCanvas(`Muns: 50`,24,(this._canvasHelper.getWidth() - this._viewWidth + 10),135,'black', 'left')
        this._canvasHelper.writeImageToCanvas('./assets/images/houses/house.png', (this._canvasHelper.getWidth() - this._viewWidth + 150), 90, 128,102)
        this._canvasHelper.moveTo(this._canvasHelper.getWidth() - this._viewWidth, this._yPosLine2)
        this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this._yPosLine2)
    }
}