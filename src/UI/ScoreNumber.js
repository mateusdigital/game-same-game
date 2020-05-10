class ScoreNumber
    extends FixedSizeContainer
{
    //--------------------------------------------------------------------------
    constructor(value, digits_count)
    {
        super(0, 0)

        let a = this.width;

        this.sprites      = [];
        this.digits_count = digits_count;
        this.curr_value   = this._FillDigits(value)
        this.bubble_tween_group = Tween_CreateGroup()
            .onComplete(()=>{

                console.log("FINED")
                this._FixDigits()
            });

        this._CreateSprites();
        this._FixDigits    ();
        this._CreateEmitter();
    } // CTOR

    _FixDigits()
    {
        let curr_width = 0;
        for(let i = 0; i < this.sprites.length; ++i) {
            const sprite = this.sprites[i];
            sprite.anchor.set(0.5);

            sprite.x = curr_width + (sprite.width * 0.5);
            sprite.y = (sprite.height * 0.5);

            curr_width += sprite.width;
        }

        this.bg.width  = curr_width;
        this.bg.height = this.sprites[0].height;

        Update_Anchor(this, 0.5);
    }
    _CreateSprites()
    {
        for(let i = 0; i < this.curr_value.length; ++i) {
            const digit  = this.curr_value[i];
            const sprite = Sprite_Create(NUMBERS_TEXTURES_NAMES[parseInt(digit)]);
            this.sprites.push(sprite);
            this.addChild(sprite);
        }
    }

    //--------------------------------------------------------------------------
    Update(dt)
    {
        this.bubble_tween_group.update(dt);
    }


    //--------------------------------------------------------------------------
    SetNumberAnimated(value)
    {
        const value_str = this._FillDigits(value);
        let min_x = +Infinity;
        let max_x = -Infinity;
        for(let i = 0; i < value_str.length; ++i) {
            if(value_str[i] == this.curr_value[i]) {
                continue;
            }
            const digit  = value_str   [i];
            const sprite = this.sprites[i];

            min_x = Math_Min(min_x, sprite.x);
            max_x = Math_Max(max_x, sprite.y);
            this._CreateBubbleAnimation(sprite, digit);
        }

        // const emmit_x = (max_x - min_x) * 0.5;
        // const emmit_y = this.sprites[0].y;
        // this.emitter.updateSpawnPos(emmit_x, emmit_y);
    } // SetNumberAnimated

    //--------------------------------------------------------------------------
    _CreateBubbleAnimation(sprite, digit)
    {
        Tween_CreateBasic(500, this.bubble_tween_group)
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
    } // _CreateBubbleAnimation

    //--------------------------------------------------------------------------
    _FillDigits(value)
    {
        let value_str = value.toString();
        if(value_str.length < this.digits_count) {
            value_str = "0".repeat(this.digits_count - value_str.length) + value_str;
        }
        return value_str;
    } // _FillDigits



   _CreateEmitter()
   {
       let pc = new PIXI.Container();
       this.addChild(pc);

       const resource = PIXI_LOADER_RES["res/emitter.json"];
       const data     = resource.data;
       let textures   = [];

       for(let i = 0; i < SCORE_PARTICLES.length; ++i) {

           textures.push(Texture_Get(SCORE_PARTICLES[i]));
       }
       this.emitter = new PIXI.particles.Emitter(pc, textures, data);
   }
} // ScoreNumber
