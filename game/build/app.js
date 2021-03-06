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
    writeWarning(warnMessage) {
        let warnCanvas = new CanvasHelper(document.getElementById("canvasOverlay"));
        let msgWidth = this._context.measureText(warnMessage).width;
        warnCanvas.createRect(warnCanvas.getCenter().X - msgWidth * 1.5, warnCanvas.getCenter().Y - 15, msgWidth * 3, 30, "black");
        warnCanvas.writeTextToCanvas(warnMessage, 30, warnCanvas.getCenter().X, warnCanvas.getCenter().Y, "red", "center");
        setTimeout(() => {
            warnCanvas.clear();
        }, 3000);
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
        App._screen = "start";
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
        if (App._wood >= wood && App._stone >= stone && App._gold >= gold) {
            App._wood -= wood;
            App._stone -= stone;
            App._gold -= gold;
            return true;
        }
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
        this._canvasHelperOverlay = new CanvasHelper(document.getElementById("canvasOverlay"));
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
    ClickCheck(xStart, xEnd, yStart, yEnd) {
        if (this.getClick().x >= xStart && this.getClick().x <= xEnd) {
            if (this.getClick().y >= yStart && this.getClick().y <= yEnd) {
                return true;
            }
        }
        return false;
    }
}
class GameView extends BaseView {
    constructor(canvas) {
        super(canvas);
        this._screen = "gameScreen";
        this.container = document.getElementById("container");
        this.canvasOverlay = document.getElementById("canvasOverlay");
        this._renderedBuilderView = false;
        this._clickedBuilderView = false;
        this._folded = true;
        this._mouseHelper = new MouseHelper();
        this._gridsRendered = false;
        this._xCoord = this._yCoord = 0;
        this._lines = 18;
        if (this._canvasHelper.getWidth() > this._canvasHelper.getHeight()) {
            this._sqSize = this._canvasHelper.getWidth() / this._lines;
        }
        else {
            this._sqSize = this._canvasHelper.getHeight() / this._lines;
        }
        this._tileImages = [
            "./assets/images/foliage/tree.png",
            "./assets/images/earth_textures/earth.png",
            "./assets/images/earth_textures/earth.png",
            "./assets/images/earth_textures/mountain.png",
            "./assets/images/water/lake[n].png",
        ];
        this._tileInfo = [{}];
        this._clickedToolbar = this._renderedToolbar = false;
        this._renderOverlay = true;
        this._curTool = "";
    }
    renderScreen() {
        if (!this._gridsRendered) {
            this.renderNewGrid();
            this.renderTutorial();
            setInterval(() => this.BuildingCheck(), 1000);
        }
        if (App._klimaat < 75 && App._klimaat > 50) {
            this.canvasOverlay.classList.remove("opacity_50");
            this.canvasOverlay.classList.add("opacity_25");
        }
        if (App._klimaat < 50 && App._klimaat > 25) {
            this.canvasOverlay.classList.remove("opacity_75");
            this.canvasOverlay.classList.remove("opacity_25");
            this.canvasOverlay.classList.add("opacity_50");
        }
        if (App._klimaat < 25) {
            this.canvasOverlay.classList.remove("opacity_50");
            this.canvasOverlay.classList.add("opacity_75");
        }
        this.renderOverlayToggle();
        this.renderBuilderView();
        if (this._renderOverlay) {
            this.renderToolbarView();
            this.renderUIView();
            this.nameBox();
            console.log(App._klimaat);
        }
        console.log(this._selectedBuilding);
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
    renderSingleGrid(xStart, xEnd, yStart, yEnd, imageSrc) {
        if (imageSrc == "./assets/images/houses/house.png") {
            this._canvasHelper.writeImageToCanvas("./assets/images/earth_textures/buildingEarth.png", xStart, yStart, xEnd - xStart, yEnd - yStart);
        }
        else {
            this._canvasHelper.writeImageToCanvas("./assets/images/earth_textures/earth.png", xStart, yStart, xEnd - xStart, yEnd - yStart);
        }
        this._canvasHelper.writeImageToCanvas(imageSrc, xStart, yStart, xEnd - xStart, yEnd - yStart);
    }
    renderNewGrid() {
        for (let line = 0; line < this._lines; line++) {
            this._canvasHelper.moveTo(0, this._yCoord);
            this._canvasHelper.lineTo(this._canvasHelper.getWidth(), this._yCoord);
            this._canvasHelper.moveTo(this._xCoord, 0);
            this._canvasHelper.lineTo(this._xCoord, this._canvasHelper.getHeight());
            for (let i = 0; i < this._lines; i++) {
                let imageSrc = this._tileImages[MathHelper.randomNumber(0, this._tileImages.length - 1)];
                imageSrc = imageSrc.replace("[n]", `${MathHelper.randomNumber(1, 2)}`);
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
                    App._klimaat -= 5;
                    App._wood += 10;
                }
            }
            if (this._curTool == "hammer") {
                document.body.style.cursor = "url('assets/cursors/Diamond_hammerChop.png'), auto";
                let filter = this._tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd);
                if (!filter)
                    return;
                if (filter.imageSrc == "./assets/images/houses/house.png" && App.ResourceCheck(0, 0, 4)) {
                    let n = this._tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd);
                    this._tileInfo[n].imageSrc = "./assets/images/earth_textures/earth.png";
                    this.renderOldGrid();
                    App._klimaat += 1;
                }
            }
            if (this._curTool == "pickaxe") {
                document.body.style.cursor = "url('assets/cursors/Diamond_PickaxeChop.png'), auto";
                let filter = this._tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd);
                if (!filter)
                    return;
                if (filter.imageSrc == "./assets/images/earth_textures/mountain.png" && App.ResourceCheck(0, 0, 20)) {
                    let n = this._tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd);
                    this._tileInfo[n].imageSrc = "./assets/images/earth_textures/earth.png";
                    this.renderOldGrid();
                    App._klimaat -= 2;
                    App._stone += 10;
                }
            }
            if (this._curTool == "bucket") {
                document.body.style.cursor = "url('assets/cursors/Iron_Bucket_Cursor_Blub.png'), auto";
                let filter = this._tileInfo.find(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd);
                if (!filter)
                    return;
                if ((filter.imageSrc == "./assets/images/water/lake1.png" || filter.imageSrc == "./assets/images/water/lake2.png") && App.ResourceCheck(0, 0, 15)) {
                    let n = this._tileInfo.findIndex(x => e.x >= x.xStart && e.x <= x.xEnd && e.y >= x.yStart && e.y <= x.yEnd);
                    this._tileInfo[n].imageSrc = "./assets/images/earth_textures/earth.png";
                    this.renderOldGrid();
                    App._klimaat += 1;
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
            if (this._curTool == "bucket") {
                document.body.style.cursor = "url('assets/cursors/Iron_Bucket_Cursor.png'), auto";
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
                this._canvasHelperOverlay.clear(this._canvasHelper.getWidth() - this._viewWidth, 0, this._canvasHelper.getWidth(), this._canvasHelper.getHeight());
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
                        this._renderOverlay = false;
                        this._selectedBuilding = "House";
                    }
                }
                if (this._mouseHelper.getClick().x > this._canvasHelper.getWidth() - this._viewWidth + 190 && this._mouseHelper.getClick().x < this._canvasHelper.getWidth() - this._viewWidth + 190 + 90) {
                    if (this._mouseHelper.getClick().y > 180 && this._mouseHelper.getClick().y < 180 + 64) {
                        this._clickedBuilderView = true;
                        this._selectedBuilding = "Fabriek";
                    }
                }
                if (this._mouseHelper.getClick().x > this._canvasHelper.getWidth() - this._viewWidth + 190 && this._mouseHelper.getClick().x < this._canvasHelper.getWidth() - this._viewWidth + 190 + 90) {
                    if (this._mouseHelper.getClick().y > 280 && this._mouseHelper.getClick().y < 280 + 64) {
                        this._clickedBuilderView = true;
                        this._selectedBuilding = "Houthakker";
                    }
                }
                if (this._mouseHelper.getClick().x > this._canvasHelper.getWidth() - this._viewWidth + 190 && this._mouseHelper.getClick().x < this._canvasHelper.getWidth() - this._viewWidth + 190 + 90) {
                    if (this._mouseHelper.getClick().y > 380 && this._mouseHelper.getClick().y < 380 + 64) {
                        this._clickedBuilderView = true;
                        this._selectedBuilding = "Mijnwerker";
                    }
                }
            }
            if (!this._mouseHelper.getClick().click && this._clickedBuilderView) {
                this._clickedBuilderView = false;
                this._canvasHelperOverlay.clear(this._canvasHelper.getWidth() - this._viewWidth, 0, this._canvasHelper.getWidth(), this._canvasHelper.getHeight());
                this._folded = true;
                this._renderedBuilderView = false;
                console.log('Image Released');
                let releasedTile = this._tileInfo.findIndex(x => x.xStart <= this._mouseHelper.getClick().x && x.xEnd >= this._mouseHelper.getClick().x && x.yStart <= this._mouseHelper.getClick().y && x.yEnd >= this._mouseHelper.getClick().y);
                if (!this.checkPlacement(this._tileInfo[releasedTile].imageSrc))
                    this._canvasHelperOverlay.writeWarning("verwijder eerst wat hier staat");
                else {
                    if (this._selectedBuilding == "House") {
                        if (App.ResourceCheck(40, 0, 0)) {
                            this._tileInfo[releasedTile].imageSrc = "./assets/images/houses/house.png";
                        }
                    }
                    else if (this._selectedBuilding == "Fabriek") {
                        if (App.ResourceCheck(40, 0, 0)) {
                            this._tileInfo[releasedTile].imageSrc = "./assets/images/houses/Fabriek1.png";
                        }
                    }
                    else if (this._selectedBuilding == "Houthakker") {
                        if (App.ResourceCheck(40, 0, 0)) {
                            this._tileInfo[releasedTile].imageSrc = "./assets/images/houses/lumberjack.png";
                        }
                    }
                    else if (this._selectedBuilding == "Mijnwerker") {
                        if (App.ResourceCheck(40, 0, 0)) {
                            this._tileInfo[releasedTile].imageSrc = "./assets/images/houses/miner.png";
                        }
                    }
                }
                this._renderOverlay = true;
                this.renderSingleGrid(this._tileInfo[releasedTile].xStart, this._tileInfo[releasedTile].xEnd, this._tileInfo[releasedTile].yStart, this._tileInfo[releasedTile].yEnd, this._tileInfo[releasedTile].imageSrc);
            }
        }
    }
    renderToolbarView() {
        if (!this._renderedToolbar) {
            this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() * 0.2, this._canvasHelperOverlay.getHeight() * 0.8, this._canvasHelperOverlay.getWidth() * 0.6, this._canvasHelperOverlay.getHeight() * 0.2);
            this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() * 0.21, this._canvasHelperOverlay.getHeight() * 0.81, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.18, "red");
            this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() * 0.32, this._canvasHelperOverlay.getHeight() * 0.81, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.18, "purple");
            this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() * 0.43, this._canvasHelperOverlay.getHeight() * 0.81, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.18, "yellow");
            this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() * 0.54, this._canvasHelperOverlay.getHeight() * 0.81, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.18, "blue");
            let DiamondAxe = new Image();
            let DiamondHammer = new Image();
            let DiamondPickaxe = new Image();
            let IronBucket = new Image();
            DiamondAxe.addEventListener('load', () => {
                this._canvasHelperOverlay._context.drawImage(DiamondAxe, this._canvasHelperOverlay.getWidth() * 0.21, this._canvasHelperOverlay.getHeight() * 0.81, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.18);
                this._canvasHelperOverlay._context.drawImage(DiamondHammer, this._canvasHelperOverlay.getWidth() * 0.3057, this._canvasHelperOverlay.getHeight() * 0.79, this._canvasHelperOverlay.getWidth() * 0.12, this._canvasHelperOverlay.getHeight() * 0.20);
                this._canvasHelperOverlay._context.drawImage(DiamondPickaxe, this._canvasHelperOverlay.getWidth() * 0.43, this._canvasHelperOverlay.getHeight() * 0.83, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.15);
                this._canvasHelperOverlay._context.drawImage(IronBucket, this._canvasHelperOverlay.getWidth() * 0.54, this._canvasHelperOverlay.getHeight() * 0.795, this._canvasHelperOverlay.getWidth() * 0.1, this._canvasHelperOverlay.getHeight() * 0.20);
            });
            DiamondAxe.src = "./assets/images/toolBar_textures/Diamond_Axe.png";
            DiamondHammer.src = "./assets/images/toolBar_textures/Diamond_Hammer.png";
            DiamondPickaxe.src = "./assets/images/toolBar_textures/Diamond_Pickaxe.png";
            IronBucket.src = "./assets/images/toolBar_textures/Iron_Bucket.png";
            this._renderedToolbar = true;
        }
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
            if (this._mouseHelper.getClick().x >= this._canvasHelper.getWidth() * 0.54 && this._mouseHelper.getClick().x <= (this._canvasHelper.getWidth() * 0.54 + this._canvasHelper.getWidth() * 0.1)) {
                if (this._mouseHelper.getClick().y >= this._canvasHelper.getHeight() * 0.81 && this._mouseHelper.getClick().y <= (this._canvasHelper.getHeight() * 0.81 + this._canvasHelper.getWidth() * 0.18)) {
                    if (this._curTool == "bucket") {
                        this._clickedToolbar = true;
                        this._curTool = undefined;
                        document.body.style.cursor = 'default';
                        return;
                    }
                    this._clickedToolbar = true;
                    document.body.style.cursor = "url('assets/cursors/Iron_Bucket_Cursor.png'), auto";
                    this._curTool = "bucket";
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
            this._canvasHelperOverlay._context.drawImage(imageUIBackground, 0, 0, 1650, 1080);
            this._canvasHelperOverlay._context.drawImage(imageWoodResource, 5, 2, 50, 50);
            this._canvasHelperOverlay._context.drawImage(imageStoneResource, 210, 2, 50, 50);
            this._canvasHelperOverlay._context.drawImage(imageGoldResource, 400, 2, 50, 50);
            this._canvasHelperOverlay._context.font = "40px Minecraft";
            this._canvasHelperOverlay._context.fillStyle = "#ff00ff";
            this._canvasHelperOverlay._context.fillText(`${App._wood}`, 130, 33);
            this._canvasHelperOverlay._context.fillText(`${App._stone}`, 340, 33);
            this._canvasHelperOverlay._context.fillText(`${App._gold}`, 530, 33);
            this._canvasHelperOverlay.loadingBar(-11, 53, 590, 15, App._klimaat, 100);
        });
        imageUIBackground.src = "./assets/images/backgrounds/UIBackground.png";
        imageWoodResource.src = "./assets/images/resources/woodResource.png";
        imageStoneResource.src = "./assets/images/resources/stoneResource.png";
        imageGoldResource.src = "./assets/images/resources/goldResource.png";
    }
    renderFoldedBuilderView() {
        this._canvasHelperOverlay.createRect(this._canvasHelper.getWidth() - this._viewWidth, 0, this._viewWidth, this._canvasHelper.getHeight(), 'green');
        this._canvasHelperOverlay.writeTextToCanvas('<--', 20, this._canvasHelperOverlay.getWidth() - 10, 10, 'black', 'right');
    }
    renderUnFoldedBuilderView() {
        let _yPosLine1 = 70;
        let _yPosLine2 = 155;
        let _yposLine3 = 250;
        this._canvasHelperOverlay.createRect(this._canvasHelperOverlay.getWidth() - this._viewWidth, 0, this._viewWidth, this._canvasHelperOverlay.getHeight(), 'green');
        this._canvasHelperOverlay.writeTextToCanvas('GEBOUWEN', 48, (this._canvasHelperOverlay.getWidth() - this._viewWidth / 2), 40);
        this._canvasHelperOverlay.makeLine(this._canvasHelperOverlay.getWidth() - this._viewWidth, _yPosLine1, this._canvasHelperOverlay.getWidth(), _yPosLine1);
        this._canvasHelperOverlay.writeTextToCanvas('HUIS', 36, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 100, undefined, 'left');
        this._canvasHelperOverlay.writeTextToCanvas(`HOUT: 40`, 24, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 135, undefined, 'left');
        this._canvasHelperOverlay.writeImageToCanvas('./assets/images/houses/house.png', (this._canvasHelperOverlay.getWidth() - this._viewWidth + 190), 80, 90, 64);
        this._canvasHelperOverlay.makeLine(this._canvasHelperOverlay.getWidth() - this._viewWidth, _yPosLine2, this._canvasHelperOverlay.getWidth(), _yPosLine2);
        this._canvasHelperOverlay.writeTextToCanvas('FABRIEK', 36, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 200, undefined, 'left');
        this._canvasHelperOverlay.writeTextToCanvas(`GOUD: 50`, 24, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 235, undefined, 'left');
        this._canvasHelperOverlay.writeImageToCanvas('./assets/images/houses/fabriek1.png', (this._canvasHelperOverlay.getWidth() - this._viewWidth + 190), 180, 90, 64);
        this._canvasHelperOverlay.writeTextToCanvas('HOUTHAKKER', 36, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 300, undefined, 'left');
        this._canvasHelperOverlay.writeTextToCanvas(`GOUD: 50`, 24, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 335, undefined, 'left');
        this._canvasHelperOverlay.writeImageToCanvas('./assets/images/houses/lumberjack.png', (this._canvasHelperOverlay.getWidth() - this._viewWidth + 190), 320, 90, 64);
        this._canvasHelperOverlay.writeTextToCanvas('MIJNWERKER', 36, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 400, undefined, 'left');
        this._canvasHelperOverlay.writeTextToCanvas(`GOUD: 50`, 24, (this._canvasHelperOverlay.getWidth() - this._viewWidth + 10), 435, undefined, 'left');
        this._canvasHelperOverlay.writeImageToCanvas('./assets/images/houses/miner.png', (this._canvasHelperOverlay.getWidth() - this._viewWidth + 190), 380, 90, 64);
        this._canvasHelperOverlay.makeLine(this._canvasHelperOverlay.getWidth() - this._viewWidth, _yPosLine2, this._canvasHelperOverlay.getWidth(), _yPosLine2);
        this._canvasHelperOverlay.makeLine(this._canvasHelperOverlay.getWidth() - this._viewWidth, _yPosLine2, this._canvasHelperOverlay.getWidth(), _yPosLine2);
    }
    renderOverlayToggle() {
        this._canvasHelperOverlay.writeImageToCanvas("./assets/images/toolBar_textures/eye.png", 0, this._canvasHelper.getHeight() - 40, 40, 40);
        if (this._mouseHelper.getClick().click && !this._clickedOverlayToggle) {
            if (this._mouseHelper.ClickCheck(0, 40, this._canvasHelper.getHeight() - 40, this._canvasHelper.getHeight())) {
                if (this._renderOverlay) {
                    this._renderOverlay = false;
                    this._clickedOverlayToggle = true;
                    this._canvasHelperOverlay.clear();
                    return;
                }
                this._clickedOverlayToggle = true;
                this._renderOverlay = true;
                this._renderedToolbar = false;
            }
        }
        if (!this._mouseHelper.getClick().click)
            this._clickedOverlayToggle = false;
    }
    BuildingCheck() {
        let Houses = this._tileInfo.filter(x => x.imageSrc == "./assets/images/houses/house.png");
        Houses.forEach(house => {
            App._gold += 1;
            let canvas = document.getElementById("canvasOverlay");
            canvas.style.backgroundImage = "../images/opacities/25percent.png";
        });
    }
    nameBox() {
        let nameBoxBackground = new Image();
        nameBoxBackground.addEventListener('load', () => {
            this._canvasHelperOverlay._context.drawImage(nameBoxBackground, this._canvasHelperOverlay.getWidth() / 2 - 215, 0);
            this._canvasHelperOverlay.writeTextToCanvas(App._name, 50, this._canvasHelperOverlay.getWidth() / 2, 30);
        });
        nameBoxBackground.src = "assets/images/backgrounds/nameBoxBackground.png";
    }
    renderTutorial() {
        this._canvasHelperOverlay.writeWarning(`Welkom ${App._name}`);
        setTimeout(() => {
            this._renderedToolbar = false;
            this._canvasHelperOverlay.writeWarning("Om je toolbar en resourcebalk aan/uit te zetten klik je op het oogje links onderin");
            setTimeout(() => { this._canvasHelperOverlay.writeWarning("Om gebouwen te plaatsen moet je ze SLEPEN"); this._renderedToolbar = false; setTimeout(() => { this._renderedToolbar = false; }, 3000); }, 3000);
        }, 3000);
    }
    checkPlacement(image) {
        if (image == "./assets/images/houses/house.png" ||
            image == "./assets/images/houses/lumberjack.png" ||
            image == "./assets/images/houses/fabriek1.png" ||
            image == "./assets/images/houses/house.png" ||
            image == "./assets/images/earth_textures/mountain.png" ||
            image == "./assets/images/earth_textures/water.png" ||
            image == "./assets/images/foliage/tree.png" ||
            image == "./assets/images/houses/miner.png" ||
            image == "./assets/images/houses/windMill.png" ||
            image == "./assets/images/water/lake1.png" ||
            image == "./assets/images/water/lake2.png" ||
            image == "./assets/images/houses/solarPanels.png")
            return false;
        else
            return true;
    }
}
class HomeView extends BaseView {
    constructor(canvas) {
        super(canvas);
        this._screen = "homeScreen";
        this._mouseHelper = new MouseHelper();
        this._gameView = new GameView(canvas);
        this._clicked = false;
        this._planetImageDimensions = [250, 250];
        this._planetList = "./assets/images/temporary_textures/homeScreen_planet2.png",
            this._planetXcoord = (this._canvasHelper.getWidth() / 2) - (this._planetImageDimensions[0] / 2);
        this._planetYcoord = (this._canvasHelper.getHeight() / 2) - (this._planetImageDimensions[1] / 2);
    }
    renderScreen() {
        if (!this._rendered) {
            this.drawPlanets();
            this.drawBackButton();
        }
        this._rendered = true;
        this.screenClick();
    }
    drawPlanets() {
        this._canvasHelper.writeImageToCanvas(this._planetList, this._planetXcoord, this._planetYcoord, this._planetImageDimensions[0], this._planetImageDimensions[1]);
        this._canvasHelper.writeTextToCanvas("Nieuwe Wereld", 50, this._planetXcoord + 250, this._planetYcoord + 540);
    }
    drawBackButton() {
        this._canvasHelper.createRect(0, 0, 152, 102, 'green');
        this._canvasHelper.createRect(0, 0, 150, 100);
        this._canvasHelper.writeTextToCanvas("TERUG", 30, 75, 50, "black");
    }
    screenClick() {
        if (this._mouseHelper.getClick().click && !this._clicked) {
            this._clicked = true;
        }
        if (!this._mouseHelper.getClick().click && this._clicked) {
            this._clicked = false;
            if (!this._clicked) {
                if (this._mouseHelper.getClick().x > this._planetXcoord && this._mouseHelper.getClick().x < this._planetXcoord + 500) {
                    if (this._mouseHelper.getClick().y > this._planetYcoord && this._mouseHelper.getClick().y < this._planetYcoord + 500) {
                        let person = prompt("Voer je naam in", "");
                        if (person == null || person == "") {
                            window.alert("voer eerst een naam in (maximaal 10 letters)");
                        }
                        else {
                            if (person.length > 10) {
                                window.alert("je naam mag maximaal 10 letters lang zijn");
                                return;
                            }
                            this._canvasHelper.clear();
                            App._screen = "game";
                            App._name = person;
                        }
                    }
                }
            }
        }
        if (this._clicked) {
            if (this._mouseHelper.getClick().x > 0 && this._mouseHelper.getClick().x < 150) {
                if (this._mouseHelper.getClick().y > 0 && this._mouseHelper.getClick().y < 100) {
                    this._canvasHelper.createRect(0, 0, 152, 102);
                    this._canvasHelper.writeTextToCanvas("TERUG", 30, 77, 52, "black");
                }
            }
        }
        if (!this._clicked) {
            if (this._mouseHelper.getClick().x > 0 && this._mouseHelper.getClick().x < 150) {
                if (this._mouseHelper.getClick().y > 0 && this._mouseHelper.getClick().y < 100) {
                    this._canvasHelper.clear();
                    this._rendered = false;
                    App._screen = 'start';
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
        this._gameName = 'PLANET MANAGER';
        this._homeView = new HomeView(canvas);
        this._buttonDimension = [225, 125];
    }
    renderScreen() {
        if (!this._rendered) {
            this.drawTitle();
            this.drawStartButton();
        }
        this._rendered = true;
        this.buttonClick();
    }
    drawTitle() {
        this._canvasHelper.writeTextToCanvas(this._gameName, 125, (this._canvasHelper.getWidth() / 2) + 2, 102, "black");
        this._canvasHelper.writeTextToCanvas(this._gameName, 125, (this._canvasHelper.getWidth() / 2), 100, "white");
    }
    drawStartButton() {
        this._canvasHelper.createRect((this._canvasHelper.getWidth() / 2) - (this._buttonDimension[0] / 2), (this._canvasHelper.getHeight() / 2) - (this._buttonDimension[1] / 2), this._buttonDimension[0] + 2, this._buttonDimension[1] + 2, "green");
        this._canvasHelper.createRect((this._canvasHelper.getWidth() / 2) - (this._buttonDimension[0] / 2), (this._canvasHelper.getHeight() / 2) - (this._buttonDimension[1] / 2), this._buttonDimension[0], this._buttonDimension[1]);
        this._canvasHelper.writeTextToCanvas("START SPEL", 30, this._canvasHelper.getWidth() / 2, this._canvasHelper.getHeight() / 2, "black");
    }
    buttonClick() {
        if (this._mouseHelper.getClick().click && !this._clicked) {
            this._clicked = true;
        }
        if (!this._mouseHelper.getClick().click && this._clicked) {
            this._clicked = false;
        }
        if (this._clicked) {
            if (this._mouseHelper.getClick().x > (this._canvasHelper.getWidth() / 2) - (this._buttonDimension[0] / 2) && this._mouseHelper.getClick().x < (this._canvasHelper.getWidth() / 2) + (this._buttonDimension[0] / 2)) {
                if (this._mouseHelper.getClick().y > (this._canvasHelper.getHeight() / 2) - (this._buttonDimension[1] / 2) && this._mouseHelper.getClick().y < (this._canvasHelper.getHeight() / 2) + (this._buttonDimension[1] / 2)) {
                    this._canvasHelper.clear((this._canvasHelper.getWidth() / 2) - (this._buttonDimension[0] / 2) - 2, (this._canvasHelper.getHeight() / 2) - (this._buttonDimension[1] / 2) - 2, this._buttonDimension[0] + 4, this._buttonDimension[1] + 4);
                    this._canvasHelper.createRect((this._canvasHelper.getWidth() / 2) - (this._buttonDimension[0] / 2) + 2, (this._canvasHelper.getHeight() / 2) - (this._buttonDimension[1] / 2) + 2, this._buttonDimension[0], this._buttonDimension[1]);
                    this._canvasHelper.writeTextToCanvas("START SPEL", 30, (this._canvasHelper.getWidth() / 2) + 2, (this._canvasHelper.getHeight() / 2) + 2, "black");
                }
            }
        }
        if (!this._clicked) {
            if (this._mouseHelper.getClick().x > (this._canvasHelper.getWidth() / 2) - (this._buttonDimension[0] / 2) && this._mouseHelper.getClick().x < (this._canvasHelper.getWidth() / 2) + (this._buttonDimension[0] / 2)) {
                if (this._mouseHelper.getClick().y > (this._canvasHelper.getHeight() / 2) - (this._buttonDimension[1] / 2) && this._mouseHelper.getClick().y < (this._canvasHelper.getHeight() / 2) + (this._buttonDimension[1] / 2)) {
                    this._canvasHelper.clear();
                    this._rendered = false;
                    App._screen = "home";
                }
            }
        }
    }
}
//# sourceMappingURL=app.js.map