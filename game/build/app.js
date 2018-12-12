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
        return true;
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
    loadingBar(rectXPos, rectYPos, rectWidth, rectHeight, value, maxNumber, barProgress = "green", barLeft = "red") {
        this.createRect(rectXPos + 10, rectYPos + 10, rectWidth, rectHeight, barLeft);
        this.createRect(rectXPos + 10, rectYPos + 10, rectWidth * (value / maxNumber), rectHeight, barProgress);
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
        BaseView.changeScreen("home");
        App._klimaat = 0;
        App._gold = 0;
        App._wood = 0;
        App._stone = 0;
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
        BaseView.changeScreen("home");
        this._StartView = new StartView(this._canvasHelper);
        this._homeView = new HomeView(this._canvasHelper);
        this._GameView = new GameView(this._canvasHelper);
    }
    render() {
        if (BaseView.getScreen() == "home")
            this._homeView.renderScreen();
        if (BaseView.getScreen() == "game")
            this._GameView.renderScreen();
    }
    static changeScreen(screen) {
        this.curScreen = screen;
    }
    static getScreen() {
        return this.curScreen;
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
        this._viewWidth = 300;
        this._yPosLine1 = 70;
        this._yPosLine2 = 155;
        this._rendered = false;
        this._clicked = false;
        this._canvasHelper = canvas;
        this._mouseHelper = new MouseHelper;
    }
    renderScreen() {
        console.log('rendered!');
        if (!this._rendered) {
            this._canvasHelper.createRect(this._canvasHelper.getWidth() - this._viewWidth, 0, this._viewWidth, this._canvasHelper.getHeight(), 'green');
            this._canvasHelper.writeTextToCanvas('GEBOUWEN', 48, (this._canvasHelper.getWidth() - this._viewWidth / 2), 40);
            this._canvasHelper.moveTo(this._canvasHelper.getWidth() - this._viewWidth, this._yPosLine1);
            this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this._yPosLine1);
            this._canvasHelper.writeTextToCanvas('HUIS', 36, (this._canvasHelper.getWidth() - this._viewWidth + 10), 100, undefined, 'left');
            this._canvasHelper.writeTextToCanvas(`DOEKOE: 50`, 24, (this._canvasHelper.getWidth() - this._viewWidth + 10), 135, undefined, 'left');
            this._canvasHelper.writeImageToCanvas('./assets/images/houses/house.png', (this._canvasHelper.getWidth() - this._viewWidth + 190), 80, 90, 64);
            this._canvasHelper.moveTo(this._canvasHelper.getWidth() - this._viewWidth, this._yPosLine2);
            this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this._yPosLine2);
            this._rendered = true;
        }
        if (this._mouseHelper.getClick().click && !this._clicked) {
            if (this._mouseHelper.getClick().x > this._canvasHelper.getWidth() - this._viewWidth + 190 && this._mouseHelper.getClick().x < this._canvasHelper.getWidth() - this._viewWidth + 190 + 90) {
                if (this._mouseHelper.getClick().y > 80 && this._mouseHelper.getClick().y < 80 + 64) {
                    console.log('clicked');
                    if (this._mouseHelper.getClick().click == true) {
                        console.log('pressed');
                        this._canvasHelper.writeImageToCanvas('./assets/images/houses/house.png', this._mouseHelper.getClick().x, this._mouseHelper.getClick().x, 90, 64);
                    }
                }
            }
            console.log(this._mouseHelper.getClick());
            this._clicked = true;
        }
        if (this._clicked) {
            this._canvasHelper.writeImageToCanvas('./assets/images/houses/house.png', this._mouseHelper.getClick().x, this._mouseHelper.getClick().x, 90, 64);
        }
        if (!this._mouseHelper.getClick().click) {
            this._clicked = false;
        }
    }
}
class GameView {
    constructor(canvas) {
        this._screen = "gameScreen";
        this.CanvasHelper = canvas;
        this._mouseHelper = new MouseHelper();
        this._BuilderView = new BuilderView(canvas);
        this._UIView = new UIView(canvas);
        this._ToolbarView = new ToolbarView(canvas);
        this.gridsRendered = false;
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
        if (!this.gridsRendered) {
            this.renderGrid();
            this.gridsRendered = true;
        }
        this._ToolbarView.renderToolbar();
        this._UIView.renderScreen();
        this.CanvasHelper.loadingBar(400, 300, 100, 20, App._klimaat, 100);
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
        this.tileInfo = this.tileInfo.filter(x => x.xStart <= this.CanvasHelper.getWidth() && x.yStart <= this.CanvasHelper.getHeight());
        let allHouses = this.tileInfo.filter(x => x.imageSrc == this.tileImages[1]);
        allHouses.forEach(() => {
            App._klimaat += 1;
        });
        window.addEventListener("mousedown", e => {
            if (ToolbarView.getTool() == "axe") {
                let filter = this.tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd);
                if (!filter)
                    return;
                if (filter.imageSrc == "./assets/images/houses/house.png") {
                    this.CanvasHelper.writeImageToCanvas(this.tileImages[0], filter.xStart, filter.yStart, filter.xEnd - filter.xStart, filter.yEnd - filter.yStart);
                    let n = this.tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd);
                    this.tileInfo.splice(n, 1);
                    let vr = { xStart: filter.xStart, xEnd: filter.xEnd - filter.xStart + this.sqSize, yStart: filter.yStart, yEnd: filter.yEnd - filter.yStart, imageSrc: this.tileImages[0] };
                    this.tileInfo.push(vr);
                    App._gold += 6;
                    App._klimaat -= 1;
                }
            }
        });
    }
}
class ToolbarView {
    constructor(canvas) {
        this._screen = "homeScreen";
        this.CanvasHelper = canvas;
        this.clicked = this.rendered = false;
        this._mouseHelper = new MouseHelper();
        ToolbarView.setTool(undefined);
    }
    renderToolbar() {
        this.CanvasHelper.createRect(this.CanvasHelper.getWidth() * 0.2, this.CanvasHelper.getHeight() * 0.8, this.CanvasHelper.getWidth() * 0.6, this.CanvasHelper.getHeight() * 0.2);
        this.CanvasHelper.createRect(this.CanvasHelper.getWidth() * 0.21, this.CanvasHelper.getHeight() * 0.81, this.CanvasHelper.getWidth() * 0.1, this.CanvasHelper.getHeight() * 0.18, "red");
        this.rendered = true;
        this.toolBarClick();
    }
    toolBarClick() {
        if (this._mouseHelper.getClick().click && !this.clicked) {
            if (this._mouseHelper.getClick().x >= this.CanvasHelper.getWidth() * 0.21 && this._mouseHelper.getClick().x <= (this.CanvasHelper.getWidth() * 0.21 + this.CanvasHelper.getWidth() * 0.1)) {
                if (this._mouseHelper.getClick().y >= this.CanvasHelper.getHeight() * 0.81 && this._mouseHelper.getClick().y <= (this.CanvasHelper.getHeight() * 0.81 + this.CanvasHelper.getHeight() * 0.18)) {
                    if (ToolbarView.getTool() == "axe") {
                        this.clicked = true;
                        ToolbarView.setTool(undefined);
                        return;
                    }
                    this.clicked = true;
                    ToolbarView.setTool("axe");
                }
            }
        }
        if (!this._mouseHelper.getClick().click)
            this.clicked = false;
    }
    static setTool(tool) {
        this.curTool = tool;
    }
    static getTool() {
        return this.curTool;
    }
}
class UIView {
    constructor(canvas) {
        this._screen = "homeScreen";
        this.CanvasHelper = canvas;
    }
    renderScreen() {
        let image = new Image();
        let image2 = new Image();
        let image3 = new Image();
        let image4 = new Image();
        image.addEventListener('load', () => {
            this.CanvasHelper._context.drawImage(image, 0, 0, 1650, 1080);
            this.CanvasHelper._context.drawImage(image2, 5, 2, 50, 50);
            this.CanvasHelper._context.drawImage(image3, 210, 2, 50, 50);
            this.CanvasHelper._context.drawImage(image4, 400, 2, 50, 50);
            this.CanvasHelper._context.font = "40px Minecraft";
            this.CanvasHelper._context.fillStyle = "#ff00ff";
            this.CanvasHelper._context.fillText(`${App._gold}`, 80, 46);
        });
        image.src = "./assets/images/backgrounds/UIBackground.png";
        image2.src = "./assets/images/resources/woodResource.png";
        image3.src = "./assets/images/resources/stoneResource.png";
        image4.src = "./assets/images/resources/goldResource.png";
    }
}
class HomeView {
    constructor(canvas) {
        this._screen = "homeScreen";
        this._rendered = false;
        this.CanvasHelper = canvas;
        this.MouseHelper = new MouseHelper();
        this._gameView = new GameView(canvas);
        this.clicked = false;
        this.planetList = [
            "./assets/images/temporary_textures/homeScreen_planet2.png",
            "./assets/images/temporary_textures/homeScreen_planet2.png",
            "./assets/images/temporary_textures/homeScreen_planet2.png",
        ];
        this.planetXCoords = [
            this.CanvasHelper.getWidth() / 6 - 150,
            this.CanvasHelper.getWidth() / 2 - 150,
            this.CanvasHelper.getWidth() / 1.25 - 150,
        ];
        this.planetYCoords = [
            300,
            400,
            200
        ];
    }
    renderScreen() {
        if (!this._rendered) {
            const maxPlanets = 3;
            for (let i = 0; i < maxPlanets; i++) {
                this.CanvasHelper.writeImageToCanvas(this.planetList[i], this.planetXCoords[i], this.planetYCoords[i], 300, 300);
                this.CanvasHelper.writeTextToCanvas("new world", 30, this.planetXCoords[i] + 150, this.planetYCoords[i] + 310);
            }
            this.CanvasHelper.writeButtonToCanvas(0, 0, 150, 100, "BACK", 30);
            this._rendered = true;
        }
        for (let i = 0; i < this.planetList.length; i++) {
            if (this.MouseHelper.getClick().click && !this.clicked) {
                if (this.MouseHelper.getClick().x > this.planetXCoords[i] && this.MouseHelper.getClick().x < this.planetXCoords[i] + 300) {
                    if (this.MouseHelper.getClick().y > this.planetYCoords[i] && this.MouseHelper.getClick().y < this.planetYCoords[i] + 300) {
                        const nameWindow = window.prompt("Voer hier de naam van je planeet in", "");
                        if (nameWindow == "") {
                            this.renderScreen();
                        }
                        else {
                            this.clicked = true;
                            this.CanvasHelper.clear();
                            BaseView.changeScreen("game");
                        }
                    }
                }
            }
        }
    }
}
class StartView {
    constructor(canvas) {
        this.CanvasHelper = canvas;
    }
    renderScreen() {
        this.CanvasHelper.writeButtonToCanvas(200, 200, 200, 200, "START GAME", 50);
    }
}
//# sourceMappingURL=app.js.map