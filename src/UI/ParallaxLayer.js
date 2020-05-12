//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
class ParallaxLayer
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor(texture, fill_width)
    {
        super();
        this.sprites = [];

        this._InitializeSprites(texture, fill_width);
    } // CTOR

    //--------------------------------------------------------------------------
    MoveParallax(speed, factor)
    {
        for(let i = this.sprites.length -1; i >= 0; --i) {
            const sprite = this.sprites[i];
            sprite.x += speed * factor;

            if(sprite.x + sprite.width < 0) {
                Array_PopFront(this.sprites);
                sprite.x = Array_GetBack(this.sprites).x + sprite.width;
                Array_PushBack(this.sprites, sprite);
            }
        }
    } // MoveParallax

    //--------------------------------------------------------------------------
    _InitializeSprites(texture, fill_width)
    {
        const sprite = new PIXI.Sprite(texture)
        this.addChild(sprite);
        this.sprites.push(sprite);

        let total_width = this.sprites[0].width;
        do {
            const sprite = new PIXI.Sprite(texture);

            sprite.x     = total_width;
            total_width += sprite.width;

            this.addChild(sprite);
            this.sprites.push(sprite);
        } while(total_width < fill_width);
    } // _InitializeSprites
} // ParallaxLayer
