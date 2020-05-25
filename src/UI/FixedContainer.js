// @XXX(stdmatt): This is HACK as hell, but I couldn't find a way to make
// the default PIXI containers to be a exact size...
//
// The way that this works is by overriding the _calculateBounds method...
// I guess..

//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
class FixedSizeContainer
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor(width, height) {
        super();

        this.bg = Sprite_White(width, height);
        this.bg.alpha = 0;
        this.bg.tint  = 0xff00ff
        this.addChild(this.bg);
    }

    //--------------------------------------------------------------------------
    _calculateBounds()
    {
    } // _calculateBounds
} // FixedSizeContainer
