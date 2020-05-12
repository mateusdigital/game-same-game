
class ScenarioLayer
    extends PIXI.Container
{
    constructor()
    {
        super();

        const foreground = Sprite_Create(MENU_BACKGROUND_TEXTURE_NAME);
        foreground.y = GAME_DESIGN_HEIGHT - foreground.height;
        this.addChild(foreground);
    }
}
