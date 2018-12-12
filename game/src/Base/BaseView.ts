class BaseView {
    private static curScreen: string
    private _canvasHelper: CanvasHelper
    private _homeView: HomeView
    private _GameView: GameView
    private _StartView: StartView
    public constructor(canvas: HTMLCanvasElement){
        this._canvasHelper = new CanvasHelper(canvas)
        BaseView.changeScreen("home")
        this._StartView = new StartView(this._canvasHelper)
        this._homeView = new HomeView(this._canvasHelper)
        this._GameView = new GameView(this._canvasHelper)
        //this._homeView.homeScreen()
    }
    public render() {
        if (BaseView.getScreen() == "home") this._homeView.renderScreen()
        if (BaseView.getScreen() == "game") this._GameView.renderScreen()
        
    }

    public static changeScreen(screen: string) {
        this.curScreen = screen
    }
    public static getScreen(): string {
        return this.curScreen
    }
}