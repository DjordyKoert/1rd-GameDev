class CanvasHelper {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
    }
    writeTextToCanvas(Text, fontSize, xPos, yPos, Color = "white", Alignment = "center") {
        this._context.font = `${fontSize}px Minecraft`;
        this._context.fillStyle = Color;
        this._context.textAlign = Alignment;
        this._context.fillText(Text, xPos, yPos);
    }
    writeImageToCanvas(Src, xPos, yPos) {
        let image = new Image();
        image.addEventListener('load', () => {
            this._context.drawImage(image, xPos, yPos);
        });
        image.src = Src;
    }
    clear() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
    getHeight() {
        return this._canvas.height;
    }
    getWidth() {
        return this._canvas.width;
    }
    getCenter() {
        return { X: this._canvas.width / 2, Y: this._canvas.height / 2 };
    }
    createRect(xPos, yPos, width, height, color = "white") {
        this._context.fillStyle = color;
        this._context.fillRect(xPos, yPos, width, height);
    }
}
class App {
    constructor(canvasElem) {
        this._canvas = new BaseView(canvasElem);
        this._gold = 0;
        this._wood = 0;
    }
    gameLoop() {
    }
}
let init = function () {
    const Game = new App(document.getElementById('canvas'));
    window.setInterval(() => Game.gameLoop(), 1000 / 60);
};
window.addEventListener('load', init);
class BaseView {
    constructor(canvas) {
        this._canvasHelper = new CanvasHelper(canvas);
    }
}
class MouseHelper {
    constructor() {
        this.mouseMove = (event) => {
            return { mouseX: event.x, mouseY: event.y };
        };
        this.mouseDown = (event) => {
            return { mouseX: event.x, mouseY: event.y };
        };
        this.mouseUp = (event) => {
            return { mouseX: event.x, mouseY: event.y };
        };
        window.addEventListener("mousemove", this.mouseMove);
        window.addEventListener("mousedown", this.mouseDown);
        window.addEventListener("mouseup", this.mouseUp);
    }
}
class BuilderView extends BaseView {
    constructor(canvas) {
        super(canvas);
    }
}
class HomeView extends BaseView {
    constructor(screen, ctx, canvas) {
        super(canvas);
        this._screen = "homeScreen";
        this._screen = screen;
        this._context = ctx;
        this.CanvasHelper = new CanvasHelper(canvas);
        this.homeScreen();
    }
    homeScreen() {
        this.CanvasHelper.writeTextToCanvas("BACK", 24, 20, 20);
        this.CanvasHelper.createRect(0, 0, 150, 100);
    }
}
class StartView extends BaseView {
    constructor(screen, ctx, canvas) {
        super(canvas);
        this._screen = "homeScreen";
        this._screen = screen;
        this._context = ctx;
        this.CanvasHelper = new CanvasHelper(canvas);
    }
    homeScreen() {
        this.CanvasHelper.writeTextToCanvas("PLAY", 24, 100, 100);
        this._context.fillStyle = "#ffeda0";
        this._context.fillRect(0, 0, 150, 100);
    }
}
//# sourceMappingURL=app.js.map