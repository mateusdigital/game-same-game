// const BRICKS_TEXTURES_NAMES = [
//     "res/textures/bricks/1.png",
//     "res/textures/bricks/2.png",
//     "res/textures/bricks/3.png",
//     "res/textures/bricks/4.png",
//     "res/textures/bricks/5.png",
//     "res/textures/bricks/6.png",
//     "res/textures/bricks/7.png",
//     "res/textures/bricks/8.png",
// ];


class Brick
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor(width, height, type)
    {
        super();

        //
        // HouseKeeping.a
        this.type = type;

        //
        // Sprite.
        this.bg        = Sprite_Create(BRICKS_TEXTURES_NAMES[type]);
        this.bg.width  = width;
        this.bg.height = height;
        // this.alpha     = 0.3;
        this.bg.anchor.set(0.5);
        this.addChild(this.bg);
    } // CTOR
} // class Brick
