class ScoreNumber
    extends PIXI.Container
{
    constructor(value, digits_count)
    {
        super();

        this.sprites      = [];
        this.digits_count = digits_count;

        const value_str = this._FillDigits(value);
        for(let i = 0; i < value_str.length; ++i) {
            const digit  = value_str[i];
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
            const digit  = value_str   [value_str.length    - (i + 1)];
            const sprite = this.sprites[this.sprites.length - (i + 1)];


            Tween_CreateBasic(500)
                .from({s: 1})
                .to  ({s: 0})
                .yoyo(true)
                .repeat(1)
                .onUpdate((value)=>{
                    sprite.scale.set(value.s);
                })
                .easing(TWEEN.Easing.Back.In)
                .onRepeat(()=>{
                    sprite.texture = Texture_Get(NUMBERS_TEXTURES_NAMES[parseInt(digit)]);
                })
                .start();
        }
    }

    _FillDigits(value)
    {
        let value_str = value.toString();
        if(value_str.length < this.digits_count) {
            value_str = "0".repeat(this.digits_count - value_str.length) + value_str;
        }
        return value_str;
    }
}
