class BuilderView{

    protected _canvasHelper: CanvasHelper
    
    private _viewWidth: number = 300
    private _yPosLine1: number = 70

    public constructor(canvas: CanvasHelper){
        this._canvasHelper = canvas
    }

    public renderScreen(){

        this._canvasHelper.createRect(this._canvasHelper.getWidth()- this._viewWidth ,0 ,this._viewWidth, this._canvasHelper.getHeight(),'#736acc')
        this._canvasHelper.writeTextToCanvas('GEBOUWEN',48,(this._canvasHelper.getWidth() - this._viewWidth / 2), 40,)
        this._canvasHelper.moveTo(this._canvasHelper.getWidth() - this._viewWidth, this._yPosLine1)
        this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this._yPosLine1)
        this._canvasHelper.writeTextToCanvas('HUIS', 36,(this._canvasHelper.getWidth() - this._viewWidth + 10), 120, 'black', 'left')
        this._canvasHelper.writeTextToCanvas(`HEHE`,24,(this._canvasHelper.getWidth() - this._viewWidth + 10),155,'black', 'left')
        this._canvasHelper.writeImageToCanvas('./assets/images/houses/house.png', (this._canvasHelper.getWidth() - this._viewWidth + 150), 90, 128,102)
    }
}