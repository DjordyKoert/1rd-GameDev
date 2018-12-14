class UIView extends BaseView{
    protected _screen: string = "homeScreen";
    protected CanvasHelper: CanvasHelper
    public constructor(canvas: HTMLCanvasElement) {
        super(canvas, "UI")

    }

    public renderScreen() {
         
        // this.CanvasHelper.writeImageToCanvas("./assets/images/backgrounds/UIBackground.png", 0, 0, 1650, 1080)
        // this.CanvasHelper.writeTextToCanvas(`${App.getGold()}`, 50, 100, 30, "white", "center") 
        // this.CanvasHelper.writeImageToCanvas("./assets/images/resources/woodResource.png", 5, 2, 50, 50)
        // this.CanvasHelper.writeImageToCanvas("./assets/images/resources/stoneResource.png", 210, 2, 50, 50)
        // this.CanvasHelper.writeImageToCanvas("./assets/images/resources/goldResource.png", 400, 2, 50, 50)
        // //this.CanvasHelper.writeTextToCanvas(`${App.getGold()}`, 50, 100, 30, "white", "center")  
        let image = new Image();
        let image2 = new Image();
        let image3 = new Image();
        let image4 = new Image();
        // add the listener so the waiting will not affect the change
        image.addEventListener('load', () => {
            this.CanvasHelper._context.drawImage(image, 0, 0, 1650, 1080);
            this.CanvasHelper._context.drawImage(image2, 5, 2, 50, 50);
            this.CanvasHelper._context.drawImage(image3, 210, 2, 50, 50);
            this.CanvasHelper._context.drawImage(image4, 400, 2, 50, 50);

            //this.d_context.clip();
            this.CanvasHelper._context.font = "40px Minecraft";
            this.CanvasHelper._context.fillStyle = "#ff00ff";
            this.CanvasHelper._context.fillText(`${App._gold}`, 80, 33)
            this.CanvasHelper._context.fillText(`${App._stone}`, 290, 33)
            this.CanvasHelper._context.fillText(`${App._gold}`, 480, 33)
        });
        image.src = "./assets/images/backgrounds/UIBackground.png"
        image2.src = "./assets/images/resources/woodResource.png"
        image3.src = "./assets/images/resources/stoneResource.png"
        image4.src = "./assets/images/resources/goldResource.png"
    }
}
