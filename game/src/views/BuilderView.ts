/// <reference path="./GameView.ts" />
class BuilderView extends GameView{
    private _viewWidth: number
    private _yPosLine1: number = 70
    private _yPosLine2: number = 155
    private _rendered: boolean = false
    private _clicked: boolean = false
    public _folded: boolean = true

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas)
    }

    public renderScreen() {
        if (this._folded) {
            this._viewWidth = 50
            if (!this._rendered) {
                this._canvasHelper.createRect(this._canvasHelper.getWidth() - this._viewWidth, 0, this._viewWidth, this._canvasHelper.getHeight(), 'green')
                this._canvasHelper.writeTextToCanvas('<--', 20, this._canvasHelper.getWidth() - 10, 10, 'black', 'right')
                this._rendered = true
            }

            if (this._mouseHelper.getClick().click && !this._clicked) {
                if (this._mouseHelper.getClick().x > this._canvasHelper.getWidth() - this._viewWidth && this._mouseHelper.getClick().x < this._canvasHelper.getWidth()) {
                    if (this._mouseHelper.getClick().y > 0 && this._mouseHelper.getClick().y < 20) {
                        this._clicked = true
                    }
                }
            }
            if (!this._mouseHelper.getClick().click && this._clicked) {
                this._clicked = false
                this._canvasHelper.clear(this._canvasHelper.getWidth() - this._viewWidth, 0, this._canvasHelper.getWidth(), this._canvasHelper.getHeight())
                this._folded = false
                this._rendered = false
            }
        }
        if (!this._folded) {
            this._viewWidth = 300
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
                        console.log('image clicked')
                        this._clicked = true

                    }
                }
            }
            if (!this._mouseHelper.getClick().click && this._clicked) {
                this._clicked = false
                this._canvasHelper.writeImageToCanvas('./assets/images/houses/house.png', this._mouseHelper.getClick().x - 45, this._mouseHelper.getClick().y - 32, 90, 64)
                this._canvasHelper.clear(this._canvasHelper.getWidth() - this._viewWidth, 0, this._canvasHelper.getWidth(), this._canvasHelper.getHeight())
                this._folded = true
                this._rendered = false
                console.log('Image Released')
            }
        }
    }
}
