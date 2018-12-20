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
    makeLine(beginXpos, beginYpos, endXpos, endYpos) {
        this.moveTo(beginXpos, beginYpos);
        this.lineTo(endXpos, endYpos);
    }
    moveTo(xPos, yPos) {
        this._context.moveTo(xPos, yPos);
    }
    lineTo(xPos, yPos) {
        this._context.beginPath();
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
        App._screen = "game";
    }
    gameLoop() {
        if (App._screen == "start")
            this._startView.renderScreen();
        if (App._screen == "home")
            this._homeView.renderScreen();
        if (App._screen == "game")
            this._gameView.renderScreen();
    }
    static ResourceCheck(wood, stone, gold) {
        if (App._wood >= wood && App._stone >= stone && App._gold >= gold)
            return true;
        else
            return false;
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
        this._mouseHelper = new MouseHelper();
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
        super(canvas);
        this._screen = "gameScreen";
        this._renderedBuilderView = false;
        this._clickedBuilderView = false;
        this._folded = true;
        this._renderedtoolbarIcons = false;
        this._mouseHelper = new MouseHelper();
        this._gridsRendered = false;
        this._xCoord = this._yCoord = 0;
        this._lines = 20;
        if (this._canvasHelper.getWidth() > this._canvasHelper.getHeight()) {
            this._sqSize = this._canvasHelper.getWidth() / this._lines;
        }
        else {
            this._sqSize = this._canvasHelper.getHeight() / this._lines;
        }
        this._tileImages = [
            "./assets/images/foliage/tree.png",
            "./assets/images/earth_textures/earth.png",
            "./assets/images/earth_textures/mountain.png",
            "./assets/images/water/lake1.png",
            "./assets/images/water/lake2.png"
        ];
        this._tileInfo = [{}];
        this._clickedToolbar = this._renderedToolBar = false;
    }
    renderScreen() {
        console.log(this._curTool);
        if (!this._gridsRendered)
            this.renderNewGrid();
        this.renderBuilderView();
        this.renderToolbarView();
        this.renderUIView();
    }
    renderOldGrid() {
        this._xCoord = 0;
        this._yCoord = 0;
        for (let line = 0; line < this._lines; line++) {
            this._canvasHelper.moveTo(0, this._yCoord);
            this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this._yCoord);
            this._canvasHelper.moveTo(this._xCoord, 0);
            this._canvasHelper.lineTo(this._xCoord, this._canvasHelper.getHeight());
        }
        this._tileInfo.forEach(tile => {
            if (tile.imageSrc == "./assets/images/houses/house.png") {
                this._canvasHelper.writeImageToCanvas("./assets/images/earth_textures/buildingEarth.png", tile.xStart, tile.yStart, tile.xEnd - tile.xStart, tile.yEnd - tile.yStart);
            }
            else {
                this._canvasHelper.writeImageToCanvas("./assets/images/earth_textures/earth.png", tile.xStart, tile.yStart, tile.xEnd - tile.xStart, tile.yEnd - tile.yStart);
            }
            this._canvasHelper.writeImageToCanvas(tile.imageSrc, tile.xStart, tile.yStart, tile.xEnd - tile.xStart, tile.yEnd - tile.yStart);
        });
    }
    renderNewGrid() {
        for (let line = 0; line < this._lines; line++) {
            this._canvasHelper.moveTo(0, this._yCoord);
            this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this._yCoord);
            this._canvasHelper.moveTo(this._xCoord, 0);
            this._canvasHelper.lineTo(this._xCoord, this._canvasHelper.getHeight());
            for (let i = 0; i < this._lines; i++) {
                let imageSrc = this._tileImages[MathHelper.randomNumber(0, this._tileImages.length - 1)];
                this._canvasHelper.writeImageToCanvas("./assets/images/earth_textures/earth.png", this._xCoord, this._sqSize * i, this._sqSize, this._sqSize);
                this._canvasHelper.writeImageToCanvas(imageSrc, this._xCoord, this._sqSize * i, this._sqSize, this._sqSize);
                let vr = { xStart: this._xCoord, xEnd: this._xCoord + this._sqSize, yStart: this._sqSize * i, yEnd: (this._sqSize * i) + this._sqSize, imageSrc: imageSrc };
                this._tileInfo.push(vr);
            }
            this._xCoord += this._sqSize;
            this._yCoord += this._sqSize;
        }
        this._tileInfo = this._tileInfo.filter(x => x.xStart <= this._canvasHelper.getWidth() && x.yStart <= this._canvasHelper.getHeight());
        let allHouses = this._tileInfo.filter(x => x.imageSrc == this._tileImages[1]);
        allHouses.forEach(() => {
            App._klimaat += 1;
        });
        window.addEventListener("mousedown", e => {
            if (this._curTool == "axe") {
                document.body.style.cursor = "url('assets/cursors/Diamond_axeChop.png'), auto";
                let filter = this._tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd);
                if (!filter)
                    return;
                if (filter.imageSrc == "./assets/images/foliage/tree.png") {
                    let n = this._tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd);
                    this._tileInfo[n].imageSrc = "./assets/images/earth_textures/earth.png";
                    this.renderOldGrid();
                    App._gold += 15;
                    App._klimaat -= 1;
                    App._wood += 10;
                }
            }
            if (this._curTool == "hammer" && App.ResourceCheck(0, 0, 4)) {
                document.body.style.cursor = "url('assets/cursors/Diamond_hammerChop.png'), auto";
                let filter = this._tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd);
                if (!filter)
                    return;
                if (filter.imageSrc == "./assets/images/houses/house.png") {
                    let n = this._tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd);
                    this._tileInfo[n].imageSrc = "./assets/images/earth_textures/earth.png";
                    this.renderOldGrid();
                    App._gold -= 5;
                    App._klimaat += 1;
                }
            }
            if (this._curTool == "pickaxe" && App.ResourceCheck(0, 0, 10)) {
                document.body.style.cursor = "url('assets/cursors/Diamond_PickaxeChop.png'), auto";
                let filter = this._tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd);
                if (!filter)
                    return;
                if (filter.imageSrc == "./assets/images/earth_textures/mountain.png") {
                    let n = this._tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd);
                    this._tileInfo[n].imageSrc = "./assets/images/earth_textures/earth.png";
                    this.renderOldGrid();
                    App._gold -= 10;
                    App._klimaat -= 1;
                    App._stone += 5;
                }
            }
        });
        window.addEventListener("mouseup", e => {
            if (this._curTool == "axe") {
                document.body.style.cursor = "url('assets/cursors/Diamond_axe.png'), auto";
            }
            if (this._curTool == "pickaxe") {
                document.body.style.cursor = "url('assets/cursors/Diamond_pickaxe.png'), auto";
            }
            if (this._curTool == "hammer") {
                document.body.style.cursor = "url('assets/cursors/Diamond_hammer.png'), auto";
            }
        });
        this._gridsRendered = true;
    }
    renderBuilderView() {
        if (this._folded) {
            this._viewWidth = 50;
            this.renderFoldedBuilderView();
            this._renderedBuilderView = true;
            if (this._mouseHelper.getClick().click && !this._clickedBuilderView) {
                if (this._mouseHelper.getClick().x > this._canvasHelper.getWidth() - this._viewWidth && this._mouseHelper.getClick().x < this._canvasHelper.getWidth()) {
                    if (this._mouseHelper.getClick().y > 0 && this._mouseHelper.getClick().y < 20) {
                        this._clickedBuilderView = true;
                    }
                }
            }
            if (!this._mouseHelper.getClick().click && this._clickedBuilderView) {
                this._clickedBuilderView = false;
                this._canvasHelper.clear(this._canvasHelper.getWidth() - this._viewWidth, 0, this._canvasHelper.getWidth(), this._canvasHelper.getHeight());
                this._folded = false;
                this._renderedBuilderView = false;
            }
        }
        if (!this._folded) {
            this._viewWidth = 300;
            if (!this._renderedBuilderView) {
                this.renderUnFoldedBuilderView();
                this._renderedBuilderView = true;
            }
            if (this._mouseHelper.getClick().click && !this._clickedBuilderView) {
                if (this._mouseHelper.getClick().x > this._canvasHelper.getWidth() - this._viewWidth + 190 && this._mouseHelper.getClick().x < this._canvasHelper.getWidth() - this._viewWidth + 190 + 90) {
                    if (this._mouseHelper.getClick().y > 80 && this._mouseHelper.getClick().y < 80 + 64) {
                        this._clickedBuilderView = true;
                    }
                }
            }
            if (!this._mouseHelper.getClick().click && this._clickedBuilderView) {
                this._clickedBuilderView = false;
                this._canvasHelper.clear(this._canvasHelper.getWidth() - this._viewWidth, 0, this._canvasHelper.getWidth(), this._canvasHelper.getHeight());
                this._folded = true;
                this._renderedBuilderView = false;
                console.log('Image Released');
                let releasedTile = this._tileInfo.findIndex(x => x.xStart <= this._mouseHelper.getClick().x && x.xEnd >= this._mouseHelper.getClick().x && x.yStart <= this._mouseHelper.getClick().y && x.yEnd >= this._mouseHelper.getClick().y);
                if (this._tileInfo[releasedTile].imageSrc == "./assets/images/foliage/tree.png")
                    console.log("nee");
                else {
                    this._tileInfo[releasedTile].imageSrc = "./assets/images/houses/house.png";
                }
                this.renderOldGrid();
            }
        }
    }
    renderToolbarView() {
        this._canvasHelper.createRect(this._canvasHelper.getWidth() * 0.2, this._canvasHelper.getHeight() * 0.8, this._canvasHelper.getWidth() * 0.6, this._canvasHelper.getHeight() * 0.2);
        this._canvasHelper.createRect(this._canvasHelper.getWidth() * 0.21, this._canvasHelper.getHeight() * 0.81, this._canvasHelper.getWidth() * 0.1, this._canvasHelper.getHeight() * 0.18, "red");
        this._canvasHelper.createRect(this._canvasHelper.getWidth() * 0.32, this._canvasHelper.getHeight() * 0.81, this._canvasHelper.getWidth() * 0.1, this._canvasHelper.getHeight() * 0.18, "blue");
        this._canvasHelper.createRect(this._canvasHelper.getWidth() * 0.43, this._canvasHelper.getHeight() * 0.81, this._canvasHelper.getWidth() * 0.1, this._canvasHelper.getHeight() * 0.18, "yellow");
        let DiamondAxe = new Image();
        let DiamondHammer = new Image();
        let DiamondPickaxe = new Image();
        DiamondAxe.addEventListener('load', () => {
            this._canvasHelper._context.drawImage(DiamondAxe, this._canvasHelper.getWidth() * 0.21, this._canvasHelper.getHeight() * 0.81, this._canvasHelper.getWidth() * 0.1, this._canvasHelper.getHeight() * 0.18);
            this._canvasHelper._context.drawImage(DiamondHammer, this._canvasHelper.getWidth() * 0.3057, this._canvasHelper.getHeight() * 0.79, this._canvasHelper.getWidth() * 0.12, this._canvasHelper.getHeight() * 0.20);
            this._canvasHelper._context.drawImage(DiamondPickaxe, this._canvasHelper.getWidth() * 0.43, this._canvasHelper.getHeight() * 0.83, this._canvasHelper.getWidth() * 0.1, this._canvasHelper.getHeight() * 0.15);
        });
        DiamondAxe.src = "./assets/images/toolBar_textures/Diamond_Axe.png";
        DiamondHammer.src = "./assets/images/toolBar_textures/Diamond_Hammer.png";
        DiamondPickaxe.src = "./assets/images/toolBar_textures/Diamond_Pickaxe.png";
        this.toolBarClick();
    }
    toolBarClick() {
        if (this._mouseHelper.getClick().click && !this._clickedToolbar) {
            if (this._mouseHelper.getClick().x >= this._canvasHelper.getWidth() * 0.21 && this._mouseHelper.getClick().x <= (this._canvasHelper.getWidth() * 0.21 + this._canvasHelper.getWidth() * 0.1)) {
                if (this._mouseHelper.getClick().y >= this._canvasHelper.getHeight() * 0.81 && this._mouseHelper.getClick().y <= (this._canvasHelper.getHeight() * 0.81 + this._canvasHelper.getHeight() * 0.18)) {
                    if (this._curTool == "axe") {
                        this._clickedToolbar = true;
                        this._curTool = undefined;
                        document.body.style.cursor = 'default';
                        return;
                    }
                    this._clickedToolbar = true;
                    document.body.style.cursor = "url('assets/cursors/Diamond_axe.png'), auto";
                    this._curTool = "axe";
                }
            }
            if (this._mouseHelper.getClick().x >= this._canvasHelper.getWidth() * 0.32 && this._mouseHelper.getClick().x <= (this._canvasHelper.getWidth() * 0.32 + this._canvasHelper.getWidth() * 0.1)) {
                if (this._mouseHelper.getClick().y >= this._canvasHelper.getHeight() * 0.81 && this._mouseHelper.getClick().y <= (this._canvasHelper.getHeight() * 0.81 + this._canvasHelper.getWidth() * 0.18)) {
                    if (this._curTool == "hammer") {
                        this._clickedToolbar = true;
                        this._curTool = undefined;
                        document.body.style.cursor = 'default';
                        return;
                    }
                    this._clickedToolbar = true;
                    document.body.style.cursor = "url('assets/cursors/Diamond_hammer.png'), auto";
                    this._curTool = "hammer";
                }
            }
            if (this._mouseHelper.getClick().x >= this._canvasHelper.getWidth() * 0.43 && this._mouseHelper.getClick().x <= (this._canvasHelper.getWidth() * 0.43 + this._canvasHelper.getWidth() * 0.1)) {
                if (this._mouseHelper.getClick().y >= this._canvasHelper.getHeight() * 0.81 && this._mouseHelper.getClick().y <= (this._canvasHelper.getHeight() * 0.81 + this._canvasHelper.getWidth() * 0.18)) {
                    if (this._curTool == "pickaxe") {
                        this._clickedToolbar = true;
                        this._curTool = undefined;
                        document.body.style.cursor = 'default';
                        return;
                    }
                    this._clickedToolbar = true;
                    document.body.style.cursor = "url('assets/cursors/Diamond_Pickaxe.png'), auto";
                    this._curTool = "pickaxe";
                }
            }
        }
        if (!this._mouseHelper.getClick().click)
            this._clickedToolbar = false;
    }
    renderUIView() {
        let imageUIBackground = new Image();
        let imageWoodResource = new Image();
        let imageStoneResource = new Image();
        let imageGoldResource = new Image();
        imageUIBackground.addEventListener('load', () => {
            this._canvasHelper._context.drawImage(imageUIBackground, 0, 0, 1650, 1080);
            this._canvasHelper._context.drawImage(imageWoodResource, 5, 2, 50, 50);
            this._canvasHelper._context.drawImage(imageStoneResource, 210, 2, 50, 50);
            this._canvasHelper._context.drawImage(imageGoldResource, 400, 2, 50, 50);
            this._canvasHelper._context.font = "40px Minecraft";
            this._canvasHelper._context.fillStyle = "#ff00ff";
            this._canvasHelper._context.fillText(`${App._wood}`, 130, 33);
            this._canvasHelper._context.fillText(`${App._stone}`, 340, 33);
            this._canvasHelper._context.fillText(`${App._gold}`, 530, 33);
            this._canvasHelper.loadingBar(-11, 53, 590, 15, App._klimaat, 100);
        });
        imageUIBackground.src = "./assets/images/backgrounds/UIBackground.png";
        imageWoodResource.src = "./assets/images/resources/woodResource.png";
        imageStoneResource.src = "./assets/images/resources/stoneResource.png";
        imageGoldResource.src = "./assets/images/resources/goldResource.png";
    }
    renderFoldedBuilderView() {
        this._canvasHelper.createRect(this._canvasHelper.getWidth() - this._viewWidth, 0, this._viewWidth, this._canvasHelper.getHeight(), 'green');
        this._canvasHelper.writeTextToCanvas('<--', 20, this._canvasHelper.getWidth() - 10, 10, 'black', 'right');
    }
    renderUnFoldedBuilderView() {
        let _yPosLine1 = 70;
        let _yPosLine2 = 155;
        let _yposLine3 = 250;
        this._canvasHelper.createRect(this._canvasHelper.getWidth() - this._viewWidth, 0, this._viewWidth, this._canvasHelper.getHeight(), 'green');
        this._canvasHelper.writeTextToCanvas('GEBOUWEN', 48, (this._canvasHelper.getWidth() - this._viewWidth / 2), 40);
        this._canvasHelper.makeLine(this._canvasHelper.getWidth() - this._viewWidth, _yPosLine1, this._canvasHelper.getWidth(), _yPosLine1);
        this._canvasHelper.writeTextToCanvas('HUIS', 36, (this._canvasHelper.getWidth() - this._viewWidth + 10), 100, undefined, 'left');
        this._canvasHelper.writeTextToCanvas(`GOUD: 50`, 24, (this._canvasHelper.getWidth() - this._viewWidth + 10), 135, undefined, 'left');
        this._canvasHelper.writeImageToCanvas('./assets/images/houses/house.png', (this._canvasHelper.getWidth() - this._viewWidth + 190), 80, 90, 64);
        this._canvasHelper.makeLine(this._canvasHelper.getWidth() - this._viewWidth, _yPosLine2, this._canvasHelper.getWidth(), _yPosLine2);
        this._canvasHelper.writeTextToCanvas('FABRIEK', 36, (this._canvasHelper.getWidth() - this._viewWidth + 10), 200, undefined, 'left');
        this._canvasHelper.writeTextToCanvas(`GOUD: 50`, 24, (this._canvasHelper.getWidth() - this._viewWidth + 10), 235, undefined, 'left');
        this._canvasHelper.writeImageToCanvas('./assets/images/houses/fabriek1.png', (this._canvasHelper.getWidth() - this._viewWidth + 190), 180, 90, 64);
        this._canvasHelper.writeTextToCanvas('LUMBERJACK', 36, (this._canvasHelper.getWidth() - this._viewWidth + 10), 300, undefined, 'left');
        this._canvasHelper.writeTextToCanvas(`GOUD: 50`, 24, (this._canvasHelper.getWidth() - this._viewWidth + 10), 335, undefined, 'left');
        this._canvasHelper.writeImageToCanvas('./assets/images/houses/lumberjack.png', (this._canvasHelper.getWidth() - this._viewWidth + 190), 320, 90, 64);
        this._canvasHelper.writeTextToCanvas('Miner', 36, (this._canvasHelper.getWidth() - this._viewWidth + 10), 400, undefined, 'left');
        this._canvasHelper.writeTextToCanvas(`GOUD: 50`, 24, (this._canvasHelper.getWidth() - this._viewWidth + 10), 435, undefined, 'left');
        this._canvasHelper.writeImageToCanvas('./assets/images/houses/miner.png', (this._canvasHelper.getWidth() - this._viewWidth + 190), 380, 90, 64);
        this._canvasHelper.makeLine(this._canvasHelper.getWidth() - this._viewWidth, _yPosLine2, this._canvasHelper.getWidth(), _yPosLine2);
        this._canvasHelper.makeLine(this._canvasHelper.getWidth() - this._viewWidth, _yPosLine2, this._canvasHelper.getWidth(), _yPosLine2);
    }
}
class HomeView extends BaseView {
    constructor(canvas) {
        super(canvas);
        this._screen = "homeScreen";
        this._rendered = false;
        this.MouseHelper = new MouseHelper();
        this._gameView = new GameView(canvas);
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
        console.log("home rendered");
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
                        let person = prompt("Please enter your name", "");
                        if (person == null || person == "") {
                            window.alert("voer eerst een naam in");
                        }
                        else {
                            this._canvasHelper.clear();
                            App._screen = "game";
                        }
                    }
                }
            }
        }
    }
}
class StartView extends BaseView {
    constructor(canvas) {
        super(canvas);
        this._rendered = false;
        this._clicked = false;
        this._homeView = new HomeView(canvas);
    }
    renderScreen() {
        this.drawTitle();
        this.drawStartButton();
        this.buttonClick();
        console.log("start");
    }
    drawTitle() {
        this._canvasHelper.writeTextToCanvas("SAMPLE TEXT", 50, (this._canvasHelper.getWidth() / 2), 100, "white");
    }
    drawStartButton() {
        this._canvasHelper.createRect((this._canvasHelper.getWidth() / 2) - 150, (this._canvasHelper.getHeight() / 2) - 100, 300, 200);
        this._canvasHelper.writeTextToCanvas("START SPEL", 30, this._canvasHelper.getWidth() / 2, this._canvasHelper.getHeight() / 2, "black");
    }
    buttonClick() {
        if (this._mouseHelper.getClick().click && !this._clicked) {
            this._clicked = true;
        }
        if (!this._mouseHelper.getClick().click && this._clicked) {
            this._clicked = false;
            console.log(this._clicked);
            if (this._mouseHelper.getClick().x > (this._canvasHelper.getWidth() / 2) - 150 && this._mouseHelper.getClick().x < (this._canvasHelper.getWidth() / 2) + 150) {
                if (this._mouseHelper.getClick().y > (this._canvasHelper.getHeight() / 2) - 100 && this._mouseHelper.getClick().y < (this._canvasHelper.getHeight() / 2) + 100) {
                    this._canvasHelper.clear();
                    App._screen = "home";
                }
            }
        }
    }
}
//# sourceMappingURL=app.js.map