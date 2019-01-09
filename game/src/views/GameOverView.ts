class GameOverView extends BaseView {
    protected _canvasHelper: CanvasHelper
    private _gameOver: boolean
    private _clicked: boolean = false;
    private _buttonDimension: Array<number>
    

    public constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        this._gameOver = false
        this._buttonDimension = [225, 125]

        
    }




    public renderScreen() {
        
        var total = (App._gold+App._stone+App._wood)
        var totalScore = ((App._gold+App._stone+App._wood)/App._timer);
        
        if (!this._gameOver) {
            this._canvasHelper.clear()
            this._canvasHelperOverlay.clear()
            this._canvasWarning.clear()
            this._canvasHelper.writeTextToCanvas(App._name, 60, this._canvasHelper.getCenter().X, this._canvasHelper.getCenter().Y /5 - 20, "white", "center")
            this._canvasHelper.writeTextToCanvas(`Je eind score:`, 50, this._canvasHelper.getCenter().X, this._canvasHelper.getCenter().Y /5 + 60, "white", "center")
            this._canvasHelper.writeTextToCanvas(`Goud: ${App._gold}`, 40, this._canvasHelper.getCenter().X, this._canvasHelper.getCenter().Y /5 + 120, "white", "center")
            this._canvasHelper.writeTextToCanvas(`Steen: ${App._stone}`, 40, this._canvasHelper.getCenter().X, this._canvasHelper.getCenter().Y /5 + 180, "white", "center")
            this._canvasHelper.writeTextToCanvas(`Hout: ${App._wood}`, 40, this._canvasHelper.getCenter().X, this._canvasHelper.getCenter().Y /5 + 240, "white", "center")
            this._canvasHelper.writeTextToCanvas(`Totaal: ${total} `, 40, this._canvasHelper.getCenter().X, this._canvasHelper.getCenter().Y /5 + 300, "white", "center")
            this._canvasHelper.writeTextToCanvas(`tijd: ${App._timer} seconden `, 40, this._canvasHelper.getCenter().X, this._canvasHelper.getCenter().Y /5 + 360, "white", "center")
            this._canvasHelper.writeTextToCanvas(`Score = totaal / tijd: ${totalScore.toFixed(1)} `, 40, this._canvasHelper.getCenter().X, this._canvasHelper.getCenter().Y /5 + 420, "white", "center")
            this._canvasHelper.writeTextToCanvas(`Klik op f5 om te restarten`, 40, this._canvasHelper.getCenter().X, this._canvasHelper.getCenter().Y /5 + 480, "white", "center")
            this._gameOver = true
        }
    }
}