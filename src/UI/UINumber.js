class UINumber
    extends PIXI.Container
{
    constructor(value)
    {
        super();

        this.sprites = [];

        const value_str = value.toString();
        for(let i = 0; i < value_str.length; ++i) {
            const digit = value_str[i];
            const sprite = Sprite_Create(NUMBERS_TEXTURES_NAMES[parseInt(digit)]);
            sprite.anchor.set(0.5);
            sprite.x = this.width;
            this.sprites.push(sprite);
            this.addChild(sprite);
        }
    }

    SetNumberAnimated(value)
    {
        const value_str = value.toString();
        for(let i = 0; i < value_str.length; ++i) {

            const digit = value_str[i];
            // this.sprites[i].texture = Texture_Get(NUMBERS_TEXTURES_NAMES[parseInt(digit)]);
        }
    }
}
