//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const SKY_BACKGROUND_PARALLAX_SPEED          = 50;
const SKY_BACKGROUND_GROUND_HEIGHT           = 120;
const SKY_BACKGROUND_LAYER_OFFSET_MULTIPLIER = 0.7;
const SKY_BACKGROUND_BACKGROUND_COLOR        = 0xCFEFFC;

const SKY_BACKGROUND_TEXTURES = [
    BACKGROUND_CLOUD_0,
    BACKGROUND_CLOUD_1,
    BACKGROUND_CLOUD_2
];


//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
class SkyBackground
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        //
        // Background color
        const bg = Sprite_White(GAME_DESIGN_WIDTH, GAME_DESIGN_HEIGHT);
        bg.tint = SKY_BACKGROUND_BACKGROUND_COLOR;
        this.addChild(bg);

        // Background Parallax
        this.background_layers = [];
        this._CreateParallaxLayers();
    } // CTOR

    //--------------------------------------------------------------------------
    Update(dt)
    {
        const speed = -(SKY_BACKGROUND_PARALLAX_SPEED * dt);
        for(let i = 0; i < this.background_layers.length; ++i) {
            const layer  = this.background_layers[i];
            const factor = 1 - (i / this.background_layers.length);

            layer.MoveParallax(speed, factor);
        }
    } // Update

    //--------------------------------------------------------------------------
    _CreateParallaxLayers()
    {
        for(let i = 0; i < SKY_BACKGROUND_TEXTURES.length; ++i) {
            const texture_name = SKY_BACKGROUND_TEXTURES[i];
            const layer        = new ParallaxLayer(Texture_Get(texture_name, GAME_DESIGN_WIDTH));

            const prev_layer = (i == 0) ? null : this.background_layers[i-1];
            if(prev_layer) {
                layer.y = prev_layer.y + (prev_layer.height * SKY_BACKGROUND_LAYER_OFFSET_MULTIPLIER) - layer.height;
            } else {
                layer.y = GAME_DESIGN_HEIGHT - layer.height - SKY_BACKGROUND_GROUND_HEIGHT;
            }
            this.background_layers.push(layer);
        }

        // Add inverted...
        for(let i = this.background_layers.length -1; i >= 0; --i) {
            this.addChild(this.background_layers[i]);
        }
    } // _CreateParallaxLayers
} // class SkyBackground
