//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
class ScenarioLayer
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        //
        // Create the static stuff...
        const foreground = Sprite_Create(TEST);
        foreground.y = GAME_DESIGN_HEIGHT - foreground.height;

        this.addChild(foreground);
    } // CTOR

    //--------------------------------------------------------------------------
    Update(dt)
    {
    } // Update
} // class ScenarioLayer
