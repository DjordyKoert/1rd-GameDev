class BuilderView {

    protected _canvasHelper: CanvasHelper
    protected _mouseHelper: MouseHelper

    private _viewWidth: number = 300
    private _yPosLine1: number = 70
    private _yPosLine2: number = 155
    private _rendered: boolean = false
    private _clicked: boolean = false

    public constructor(canvas: CanvasHelper) {
        this._canvasHelper = canvas
        this._mouseHelper = new MouseHelper



    }

    public renderScreen() {
        console.log('rendered!')
        if (!this._rendered) {
            this._canvasHelper.createRect(this._canvasHelper.getWidth() - this._viewWidth, 0, this._viewWidth, this._canvasHelper.getHeight(), 'green')
            this._canvasHelper.writeTextToCanvas('GEBOUWEN', 48, (this._canvasHelper.getWidth() - this._viewWidth / 2), 40)
            this._canvasHelper.moveTo(this._canvasHelper.getWidth() - this._viewWidth, this._yPosLine1)
            this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this._yPosLine1)
            this._canvasHelper.writeTextToCanvas('HUIS', 36, (this._canvasHelper.getWidth() - this._viewWidth + 10), 100, undefined, 'left')
            this._canvasHelper.writeTextToCanvas(`DOEKOE: 50`, 24, (this._canvasHelper.getWidth() - this._viewWidth + 10), 135, undefined, 'left')
            this._canvasHelper.writeImageToCanvas('./assets/images/houses/house.png', (this._canvasHelper.getWidth() - this._viewWidth + 190), 80, 90, 64)
            this._canvasHelper.moveTo(this._canvasHelper.getWidth() - this._viewWidth, this._yPosLine2)
            this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this._yPosLine2)
            this._rendered = true
        }

        if (this._mouseHelper.getClick().click && !this._clicked) {
            if (this._mouseHelper.getClick().x > this._canvasHelper.getWidth() - this._viewWidth + 190 && this._mouseHelper.getClick().x < this._canvasHelper.getWidth() - this._viewWidth + 190 + 90) {
                if (this._mouseHelper.getClick().y > 80 && this._mouseHelper.getClick().y < 80 + 64) {
                    console.log('clicked')
                    if (this._mouseHelper.getClick().click == true) {
                        console.log('pressed')
                        this._canvasHelper.writeImageToCanvas('./assets/images/houses/house.png',this._mouseHelper.getClick().x,this._mouseHelper.getClick().x,90,64)
                        

                    }


                }

            }
            console.log(this._mouseHelper.getClick())
            this._clicked = true
        }
        if (this._clicked) {
            this._canvasHelper.writeImageToCanvas('./assets/images/houses/house.png',this._mouseHelper.getClick().x,this._mouseHelper.getClick().x,90,64)
        }
        if (!this._mouseHelper.getClick().click) {
            this._clicked = false
        }
    }
}