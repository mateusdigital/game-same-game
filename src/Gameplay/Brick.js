//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
class Brick
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor(width, height, type)
    {
        super();

        //
        // HouseKeeping
        this.type = type;

        //
        // Sprite.
        this.bg        = Sprite_Create(BRICK_TEXTURES[type]);
        this.bg.width  = width;
        this.bg.height = height;

        Update_Anchor(this.bg, 0.5);
        this.addChild(this.bg);
    } // CTOR
} // class Brick
