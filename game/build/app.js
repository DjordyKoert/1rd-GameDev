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
    clear(xpos = 0, ypos = 0, width = this._canvas.width, height = this._canvas.height) {
        this._context.clearRect(xpos, ypos, width, height);
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
        this._homeView = new HomeView(canvasElem);
        this._startView = new StartView(canvasElem);
        this._gameView = new GameView(canvasElem);
        App._klimaat = 0;
        App._gold = 0;
        App._wood = 0;
        App._stone = 0;
    }
    gameLoop() {
        console.log(this._startView.curScreen);
    }
}
let init = function () {
    const Game = new App(document.getElementById('canvas'));
    window.setInterval(() => Game.gameLoop(), 1000 / 60);
};
window.addEventListener('load', init);
class BaseView {
    constructor(canvas, screen) {
        this._canvasHelper = new CanvasHelper(canvas);
        this.curScreen = screen;
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
class GameView extends BaseView {
    constructor(canvas) {
        super(canvas, "game");
        this._screen = "gameScreen";
        this._mouseHelper = new MouseHelper();
        this.gridsRendered = false;
        this.xCoord = this.yCoord = 0;
        this.lines = 10;
        if (this._canvasHelper.getWidth() > this._canvasHelper.getHeight()) {
            this.sqSize = this._canvasHelper.getWidth() / this.lines;
        }
        else {
            this.sqSize = this._canvasHelper.getHeight() / this.lines;
        }
        this.tileImages = [
            "./assets/images/foliage/tree.png",
            "./assets/images/houses/house.png",
            null,
        ];
        this.tileInfo = [{}];
        this.renderScreen();
    }
    renderScreen() {
        this.renderGrid();
    }
    renderGrid() {
        this._canvasHelper._context.beginPath();
        if (this.gridsRendered) {
            this.xCoord = 0;
            this.yCoord = 0;
            for (let line = 0; line < this.lines; line++) {
                this._canvasHelper.moveTo(0, this.yCoord);
                this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this.yCoord);
                this._canvasHelper.moveTo(this.xCoord, 0);
                this._canvasHelper.lineTo(this.xCoord, this._canvasHelper.getHeight());
                this.tileInfo.forEach(tile => {
                    this._canvasHelper.writeImageToCanvas(tile.imageSrc, tile.xStart, tile.yStart, tile.xEnd - tile.xStart, tile.yEnd - tile.yStart);
                });
            }
        }
        else {
            for (let line = 0; line < this.lines; line++) {
                this._canvasHelper.moveTo(0, this.yCoord);
                this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this.yCoord);
                this._canvasHelper.moveTo(this.xCoord, 0);
                this._canvasHelper.lineTo(this.xCoord, this._canvasHelper.getHeight());
                for (let i = 0; i < this.lines; i++) {
                    let imageSrc = this.tileImages[MathHelper.randomNumber(0, this.tileImages.length - 1)];
                    this._canvasHelper.writeImageToCanvas("./assets/images/earth_textures/earth.png", this.xCoord, this.sqSize * i, this.sqSize, this.sqSize);
                    this._canvasHelper.writeImageToCanvas(imageSrc, this.xCoord, this.sqSize * i, this.sqSize, this.sqSize);
                    let vr = { xStart: this.xCoord, xEnd: this.xCoord + this.sqSize, yStart: this.sqSize * i, yEnd: (this.sqSize * i) + this.sqSize, imageSrc: imageSrc };
                    this.tileInfo.push(vr);
                }
                this.xCoord += this.sqSize;
                this.yCoord += this.sqSize;
            }
            this.tileInfo = this.tileInfo.filter(x => x.xStart <= this._canvasHelper.getWidth() && x.yStart <= this._canvasHelper.getHeight());
            let allHouses = this.tileInfo.filter(x => x.imageSrc == this.tileImages[1]);
            allHouses.forEach(() => {
                App._klimaat += 1;
            });
            window.addEventListener("mousedown", e => {
                if (ToolbarView.getTool() == "axe") {
                    let filter = this.tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd);
                    if (!filter)
                        return;
                    if (filter.imageSrc == "./assets/images/foliage/tree.png") {
                        this._canvasHelper.writeImageToCanvas(this.tileInfo[0], filter.xStart, filter.yStart, filter.xEnd - filter.xStart, filter.yEnd - filter.yStart);
                        let n = this.tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd);
                        this.tileInfo.splice(n, 1);
                        let vr = { xStart: filter.xStart, xEnd: filter.xEnd - filter.xStart, yStart: filter.yStart, yEnd: filter.yEnd - filter.yStart, imageSrc: this.tileImages[0] };
                        this.tileInfo.push(vr);
                        App._gold += 6;
                        App._klimaat -= 1;
                    }
                }
            });
            window.addEventListener("keypress", press => {
                if (press.key == " ") {
                }
            });
            this.gridsRendered = true;
        }
    }
}
class BuilderView extends GameView {
    constructor(canvas) {
        super(canvas);
        this._yPosLine1 = 70;
        this._yPosLine2 = 155;
        this._rendered = false;
        this._clicked = false;
        this._folded = true;
    }
    renderScreen() {
        if (this._folded) {
            this._viewWidth = 50;
            if (!this._rendered) {
                this._canvasHelper.createRect(this._canvasHelper.getWidth() - this._viewWidth, 0, this._viewWidth, this._canvasHelper.getHeight(), 'green');
                this._canvasHelper.writeTextToCanvas('<--', 20, this._canvasHelper.getWidth() - 10, 10, 'black', 'right');
                this._rendered = true;
            }
            if (this._mouseHelper.getClick().click && !this._clicked) {
                if (this._mouseHelper.getClick().x > this._canvasHelper.getWidth() - this._viewWidth && this._mouseHelper.getClick().x < this._canvasHelper.getWidth()) {
                    if (this._mouseHelper.getClick().y > 0 && this._mouseHelper.getClick().y < 20) {
                        this._clicked = true;
                    }
                }
            }
            if (!this._mouseHelper.getClick().click && this._clicked) {
                this._clicked = false;
                this._canvasHelper.clear(this._canvasHelper.getWidth() - this._viewWidth, 0, this._canvasHelper.getWidth(), this._canvasHelper.getHeight());
                this._folded = false;
                this._rendered = false;
            }
        }
        if (!this._folded) {
            this._viewWidth = 300;
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
                        console.log('image clicked');
                        this._clicked = true;
                    }
                }
            }
            if (!this._mouseHelper.getClick().click && this._clicked) {
                this._clicked = false;
                this._canvasHelper.writeImageToCanvas('./assets/images/houses/house.png', this._mouseHelper.getClick().x - 45, this._mouseHelper.getClick().y - 32, 90, 64);
                this._canvasHelper.clear(this._canvasHelper.getWidth() - this._viewWidth, 0, this._canvasHelper.getWidth(), this._canvasHelper.getHeight());
                this._folded = true;
                this._rendered = false;
                console.log('Image Released');
            }
        }
    }
}
class ToolbarView extends GameView {
    constructor(canvas) {
        super(canvas);
        this._screen = "homeScreen";
        this.clicked = this.rendered = false;
        ToolbarView.setTool(undefined);
    }
    renderToolbar() {
        this._canvasHelper.createRect(this._canvasHelper.getWidth() * 0.2, this._canvasHelper.getHeight() * 0.8, this._canvasHelper.getWidth() * 0.6, this._canvasHelper.getHeight() * 0.2);
        this._canvasHelper.createRect(this._canvasHelper.getWidth() * 0.21, this._canvasHelper.getHeight() * 0.81, this._canvasHelper.getWidth() * 0.1, this._canvasHelper.getHeight() * 0.18, "red");
        this.rendered = true;
        this.toolBarClick();
    }
    toolBarClick() {
        if (this._mouseHelper.getClick().click && !this.clicked) {
            if (this._mouseHelper.getClick().x >= this._canvasHelper.getWidth() * 0.21 && this._mouseHelper.getClick().x <= (this._canvasHelper.getWidth() * 0.21 + this._canvasHelper.getWidth() * 0.1)) {
                if (this._mouseHelper.getClick().y >= this._canvasHelper.getHeight() * 0.81 && this._mouseHelper.getClick().y <= (this._canvasHelper.getHeight() * 0.81 + this._canvasHelper.getHeight() * 0.18)) {
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
class UIView extends BaseView {
    constructor(canvas) {
        super(canvas, "UI");
        this._screen = "homeScreen";
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
            this.CanvasHelper._context.fillText(`${App._gold}`, 80, 33);
            this.CanvasHelper._context.fillText(`${App._stone}`, 290, 33);
            this.CanvasHelper._context.fillText(`${App._gold}`, 480, 33);
        });
        image.src = "./assets/images/backgrounds/UIBackground.png";
        image2.src = "./assets/images/resources/woodResource.png";
        image3.src = "./assets/images/resources/stoneResource.png";
        image4.src = "./assets/images/resources/goldResource.png";
    }
}
class HomeView extends BaseView {
    constructor(canvas) {
        super(canvas, "home");
        this._screen = "homeScreen";
        this._rendered = false;
        this.MouseHelper = new MouseHelper();
        this.clicked = false;
        this.planetList = [
            "./assets/images/temporary_textures/homeScreen_planet2.png",
            "./assets/images/temporary_textures/homeScreen_planet2.png",
            "./assets/images/temporary_textures/homeScreen_planet2.png",
        ];
        this.planetXCoords = [
            this._canvasHelper.getWidth() / 6 - 150,
            this._canvasHelper.getWidth() / 2 - 150,
            this._canvasHelper.getWidth() / 1.25 - 150,
        ];
        this.planetYCoords = [
            300,
            400,
            200
        ];
    }
    renderScreen() {
        this.drawPlanets();
        this.drawBackButton();
        this.screenClick();
    }
    drawPlanets() {
        const maxPlanets = 3;
        for (let i = 0; i < maxPlanets; i++) {
            this._canvasHelper.writeImageToCanvas(this.planetList[i], this.planetXCoords[i], this.planetYCoords[i], 300, 300);
            this._canvasHelper.writeTextToCanvas("new world", 30, this.planetXCoords[i] + 150, this.planetYCoords[i] + 310);
        }
    }
    drawBackButton() {
        this._canvasHelper.createRect(0, 0, 150, 100);
        this._canvasHelper.writeTextToCanvas("BACK", 30, 75, 50, "black");
        if (this.MouseHelper.getClick().x > 0 && this.MouseHelper.getClick().x < 150) {
            if (this.MouseHelper.getClick().y > 0 && this.MouseHelper.getClick().y < 100) {
                this.curScreen = "start";
                this._canvasHelper.clear();
            }
        }
    }
    screenClick() {
        if (this.MouseHelper.getClick().click && !this.clicked) {
            this.clicked = true;
        }
        if (!this.MouseHelper.getClick().click && this.clicked) {
            this.clicked = false;
            for (let i = 0; i < this.planetList.length; i++) {
                console.log(this.clicked);
                if (this.MouseHelper.getClick().x > this.planetXCoords[i] && this.MouseHelper.getClick().x < this.planetXCoords[i] + 300) {
                    if (this.MouseHelper.getClick().y > this.planetYCoords[i] && this.MouseHelper.getClick().y < this.planetYCoords[i] + 300) {
                        var person = prompt("Please enter your name", "");
                        if (person == null || person == "") {
                            window.alert("voer eerst een naam in");
                        }
                        else {
                            this._canvasHelper._context.clearRect(0, 0, this._canvasHelper.getWidth(), this._canvasHelper.getHeight());
                            this._gameView.renderScreen();
                        }
                    }
                }
            }
        }
    }
}
class StartView extends BaseView {
    constructor(canvas) {
        super(canvas, "start");
        this._rendered = false;
        this._clicked = false;
        this._mouseHelper = new MouseHelper();
    }
    renderScreen() {
        this.CanvasHelper.clear();
        this.CanvasHelper.writeTextToCanvas("SAMPLE TEXT", 50, (this.CanvasHelper.getWidth() / 2), 100, "white");
        this.CanvasHelper.createRect((this.CanvasHelper.getWidth() / 2) - 150, (this.CanvasHelper.getHeight() / 2) - 100, 300, 200);
        this.CanvasHelper.writeTextToCanvas("START SPEL", 30, this.CanvasHelper.getWidth() / 2, this.CanvasHelper.getHeight() / 2, "black");
        if (this._mouseHelper.getClick().click && !this._clicked) {
            if (this._mouseHelper.getClick().x > (this.CanvasHelper.getWidth() / 2) - 150 && this._mouseHelper.getClick().x < (this.CanvasHelper.getWidth() / 2) + 150) {
                if (this._mouseHelper.getClick().y > (this.CanvasHelper.getHeight() / 2) - 100 && this._mouseHelper.getClick().y < (this.CanvasHelper.getHeight() / 2) + 100) {
                    this._clicked = true;
                    console.log("b");
                }
            }
        }
        if (!this._mouseHelper.getClick().click && this._clicked) {
            console.log("a");
            this._clicked = false;
            this.CanvasHelper.clear();
            this.curScreen = "home";
            event.preventDefault();
        }
        this.CanvasHelper.createRect((this.CanvasHelper.getWidth() / 2) - 150, (this.CanvasHelper.getHeight() / 2) + 500, 300, 200);
    }
}
//# sourceMappingURL=app.js.map