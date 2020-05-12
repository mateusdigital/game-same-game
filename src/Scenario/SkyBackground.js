
//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const SKY_BACKGROUND_PARALLAX_SPEED = 50;
const SKY_BACKGROUND_GROUND_HEIGHT  = 120;
const SKY_BACKGROUND_LAYER_OFFSET_MULTIPLIER = 0.7;

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
        bg.tint = 0xCFEFFC
        this.addChild(bg);

        //
        // Background Parallax
        this.background_layers = [];
        for(let i = 0; i < CLOUD_BACKGROUND_TEXTURES_NAMES.length; ++i) {
            const texture_name = CLOUD_BACKGROUND_TEXTURES_NAMES[i];
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
    } // CTOR

    //--------------------------------------------------------------------------
    Update(dt)
    {
        const speed = -(SKY_BACKGROUND_PARALLAX_SPEED * dt);
        for(let i = 0; i < this.background_layers.length; ++i) {
            const layer  = this.background_layers[i];
            const factor = 1 - (i / this.background_layers.length);
            layer.MoveParalax(speed, factor);
        }
    } // Update
} // class SkyBackground
