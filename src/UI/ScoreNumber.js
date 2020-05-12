//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const BUBBLE_ANIMATION_DURATION = 500 * ANIMATION_SPEED_MULTIPLIER;
const BUBBLE_ANIMATION_EASING   = TWEEN.Easing.Back.In;

//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
class ScoreNumber
    extends FixedSizeContainer
{
    //--------------------------------------------------------------------------
    constructor(value, digits_count)
    {
        super(0, 0)

        this.sprites            = [];
        this.digits_count       = digits_count;
        this.curr_value         = FillDigits(value);

        this.bubble_tween_group = Tween_CreateGroup()
            // @NOTICE(stdmatt): I think that's better that numbers to be
            // slightly not aligned than the disturbing visual artifact of
            // of trying to align them...
            // .onComplete(()=>{
            //     // this._FixDigitsAlignment()
            // });
        this.bubble_tween_half_way_callback = null;

        this._CreateSprites     ();
        this._FixDigitsAlignment();
    } // CTOR

    //--------------------------------------------------------------------------
    Update(dt)
    {
        this.bubble_tween_group.update(dt);
    } // Update


    //--------------------------------------------------------------------------
    SetNumberAnimated(value, half_way_callback)
    {
        // This will be called when the number has finished
        // scaled down and is about to start to scale up again.
        this.bubble_tween_half_way_callback = half_way_callback;

        const value_str = FillDigits(value);
        for(let i = 0; i < value_str.length; ++i) {
            if(value_str[i] == this.curr_value[i]) {
                continue;
            }
            const digit  = value_str   [i];
            const sprite = this.sprites[i];
            this._CreateBubbleAnimation(sprite, digit);
        }
    } // SetNumberAnimated

    //--------------------------------------------------------------------------
    _CreateBubbleAnimation(sprite, digit)
    {
        Tween_CreateBasic(BUBBLE_ANIMATION_DURATION, this.bubble_tween_group)
            .from({s: 1})
            .to  ({s: 0})
            .yoyo(true)
            .repeat(1)
            .onUpdate((value)=>{
                sprite.scale.set(value.s);
            })
            .easing(BUBBLE_ANIMATION_EASING)
            .onRepeat(()=>{
                sprite.texture = Texture_Get(NUMBERS_TEXTURES_NAMES[parseInt(digit)]);
                if(this.bubble_tween_half_way_callback) {
                    this.bubble_tween_half_way_callback();
                    this.bubble_tween_half_way_callback = null;
                }
            })
            .start();
    } // _CreateBubbleAnimation

    //--------------------------------------------------------------------------
    _CreateSprites()
    {
        for(let i = 0; i < this.curr_value.length; ++i) {
            const digit  = this.curr_value[i];
            const sprite = Sprite_Create(NUMBERS_TEXTURES_NAMES[parseInt(digit)]);
            this.sprites.push(sprite);
            this.addChild(sprite);
        }
    } // _CreateSprites

    //--------------------------------------------------------------------------
    _FixDigitsAlignment()
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
    } // _FixDigitsAlignment
} // ScoreNumber
