class FixedSizeContainer
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor(width, height) {
        super();

        this.bg = Sprite_White(width, height);
        this.bg.alpha = 0;
        this.bg.tint = 0xff00ff
        this.addChild(this.bg);
    }

    //--------------------------------------------------------------------------
    _calculateBounds()
    {
    }
}
