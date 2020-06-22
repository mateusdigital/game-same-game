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

        this.digits    = [];
        this.curr_value = FillDigits(value, digits_count);

        this.bubble_tween_group = Tween_CreateGroup()
            // @NOTICE(stdmatt): I think that's better that numbers to be
            // slightly not aligned than the disturbing visual artifact of
            // of trying to align them...
            // .onComplete(()=>{
            //     // this._FixDigitsAlignment()
            // });
        this.bubble_tween_half_way_callback = null;

        this._CreateDigits      ();
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
            const digit_value = value_str  [i];
            const digit_text  = this.digits[i];

            this._CreateBubbleAnimation(digit_text, digit_value);
        }
    } // SetNumberAnimated

    //--------------------------------------------------------------------------
    _CreateBubbleAnimation(digit_text, digit_value)
    {
        Tween_CreateBasic(BUBBLE_ANIMATION_DURATION, this.bubble_tween_group)
            .from({s: 1})
            .to  ({s: 0})
            .yoyo(true)
            .repeat(1)
            .onUpdate((value)=>{
                digit_text.scale.set(value.s);
            })
            .easing(BUBBLE_ANIMATION_EASING)
            .onRepeat(()=>{
                digit_text.text = digit_value.toString();
                if(this.bubble_tween_half_way_callback) {
                    this.bubble_tween_half_way_callback();
                    this.bubble_tween_half_way_callback = null;
                }
            })
            .start();
    } // _CreateBubbleAnimation

    //--------------------------------------------------------------------------
    _CreateDigits()
    {
        for(let i = 0; i < this.curr_value.length; ++i) {
            const digit_value = this.curr_value[i];
            const digit_text  = this._CreateDigit(digit_value);

            this.digits.push(digit_text);
            this.addChild(digit_text);
        }
    } // _CreateDigits

    _CreateDigit(digit)
    {
        var text = new Text(digit, MEDIUM_FONT_DEF.size);
        return text;
    }

    //--------------------------------------------------------------------------
    _FixDigitsAlignment()
    {
        let curr_width = 0;
        for(let i = 0; i < this.digits.length; ++i) {
            const item = this.digits[i];
            item.anchor.set(0.5);

            item.x = curr_width + (item.width * 0.5);
            item.y = (item.height * 0.5);

            curr_width += item.width;
        }

        this.bg.width  = curr_width;
        this.bg.height = this.digits[0].height;

        Update_Anchor(this, 0.5);
    } // _FixDigitsAlignment
} // ScoreNumber
