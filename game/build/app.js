class CanvasHelper {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
    }
    writeTextToCanvas(text, fontSize, xPos, yPos, color = "white", alignment = "center", textBaseLine = 'middle') {
        this._context.font = `${fontSize}px Minecraft`;
        this._context.fillStyle = color;
        this._context.textAlign = alignment;
        this._context.textBaseline = textBaseLine;
        this._context.fillText(text, xPos, yPos);
    }
    writeImageToCanvas(Src, xPos, yPos, imgWidth, imgHeight) {
        let image = new Image();
        image.addEventListener('load', () => {
            this._context.drawImage(image, xPos, yPos, imgWidth, imgHeight);
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
    writeButtonToCanvas(rectXPos, rectYPos, rectWidth, rectHeight, text, fontSize, rectColor = "white", textColor = "black", textAlignment = "center") {
        this.createRect(rectXPos, rectYPos, rectWidth, rectHeight, rectColor);
        this.writeTextToCanvas(text, fontSize, rectXPos + (rectWidth / 2), rectYPos + (rectHeight / 2), textColor, textAlignment);
        window.addEventListener("click", (event) => {
            console.log(event.x, event.y);
            if (event.x > rectXPos && event.x < rectXPos + rectWidth) {
                if (event.y > rectYPos && event.y < rectYPos + rectHeight) {
                    alert('button pressed');
                }
            }
        });
    }
    moveTo(xPos, yPos) {
        this._context.moveTo(xPos, yPos);
    }
    lineTo(xPos, yPos) {
        this._context.lineTo(xPos, yPos);
        this._context.stroke();
    }
}
class App {
    constructor(canvasElem) {
        this._canvas = new BaseView(canvasElem);
        this._gold = 0;
        this._wood = 0;
    }
    gameLoop() {
        this._canvas.render();
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
        this._homeView = new HomeView(this._canvasHelper);
        this._BuilderView = new BuilderView(this._canvasHelper);
        this._GameView = new GameView(this._canvasHelper);
    }
    render() {
        this._homeView.renderScreen();
    }
}
class MathHelper {
    static randomNumber(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}
class MouseHelper {
    constructor() {
        this.mouseMove = (event) => {
            return { mouseX: event.x, mouseY: event.y };
        };
        this.mouseDown = (event) => {
            this.mDown = true;
            this.mX = event.x;
            this.mY = event.y;
        };
        this.mouseUp = (event) => {
            this.mDown = false;
            this.mX = event.x;
            this.mY = event.y;
        };
        window.addEventListener("mousemove", this.mouseMove);
        window.addEventListener("mousedown", this.mouseDown);
        window.addEventListener("mouseup", this.mouseUp);
    }
    getClick() {
        return { click: this.mDown, x: this.mX, y: this.mY };
    }
}
class BuilderView {
    constructor(canvas) {
        this.CanvasHelper = canvas;
    }
}
class GameView {
    constructor(canvas) {
        this._screen = "gameScreen";
        this.CanvasHelper = canvas;
        this.xCoord = this.yCoord = 0;
        this.lines = 10;
        if (this.CanvasHelper.getWidth() > this.CanvasHelper.getHeight()) {
            this.sqSize = this.CanvasHelper.getWidth() / this.lines;
        }
        else {
            this.sqSize = this.CanvasHelper.getHeight() / this.lines;
        }
        this.tileImages = [
            "./assets/images/earth_textures/grass.png",
            "./assets/images/houses/house.png",
        ];
        this.tileInfo = [{}];
    }
    renderScreen() {
    }
    renderGrid() {
        for (let line = 0; line < this.lines; line++) {
            this.CanvasHelper.moveTo(0, this.yCoord);
            this.CanvasHelper.lineTo(this.CanvasHelper.getWidth(), this.yCoord);
            this.CanvasHelper.moveTo(this.xCoord, 0);
            this.CanvasHelper.lineTo(this.xCoord, this.CanvasHelper.getHeight());
            for (let i = 0; i < this.lines; i++) {
                let imageSrc = this.tileImages[MathHelper.randomNumber(0, this.tileImages.length - 1)];
                this.CanvasHelper.writeImageToCanvas(imageSrc, this.xCoord, this.sqSize * i, this.sqSize, this.sqSize);
                let vr = { xStart: this.xCoord, xEnd: this.xCoord + this.sqSize, yStart: this.sqSize * i, yEnd: (this.sqSize * i) + this.sqSize, imageSrc: imageSrc };
                this.tileInfo.push(vr);
            }
            this.xCoord += this.sqSize;
            this.yCoord += this.sqSize;
        }
        console.log(this.tileInfo);
    }
}
class HomeView {
    constructor(canvas) {
        this._screen = "homeScreen";
        this.CanvasHelper = canvas;
    }
    renderScreen() {
        this.CanvasHelper.writeImageToCanvas("./assets/images/temporary_textures/homeScreen_planet.png", 250, 300, 300, 300);
        this.CanvasHelper.writeImageToCanvas("./assets/images/temporary_textures/homeScreen_planet.png", 750, 400, 300, 300);
        this.CanvasHelper.writeImageToCanvas("./assets/images/temporary_textures/homeScreen_planet.png", 1250, 200, 300, 300);
        this.CanvasHelper.writeButtonToCanvas(0, 0, 150, 100, "BACK", 20);
        this.CanvasHelper.writeButtonToCanvas(275, 325, 250, 250, "", 0, "transparent");
        this.CanvasHelper.writeButtonToCanvas(775, 425, 250, 250, "", 0, "transparent");
        this.CanvasHelper.writeButtonToCanvas(1275, 225, 250, 250, "", 0, "transparent");
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
    renderScreen() {
        this.CanvasHelper.writeButtonToCanvas(200, 200, 200, 200, "START GAME", 50);
    }
}
//# sourceMappingURL=app.js.map