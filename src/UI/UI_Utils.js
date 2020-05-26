//-----------------------------------------------------------------------------
// @XXX(stdmatt): Should move to lib...
function Update_Anchor(obj, x, y)
{
    if(Utils_IsNullOrUndefined(y)) {
        y = x;
    }

    if(obj.anchor) {
        obj.anchor.set(x, y);
    } else {
        obj.pivot.set(
            x * obj.width / obj.scale.x,
            y * obj.height / obj.scale.y
        )
    }
}

function Center_Anchor(obj)
{
    Update_Anchor(obj, 0.5, 0.5);
}


function Debug_Tint(...args)
{
    for(let i = 0; i < args.length; ++i) {
        args[i].tint = 0xff00ff;
    }
}


// @TODO(stdmatt): We should be able to get a float with the scale that
// applied to both sides make the game fits on the window...
const GAME_WINDOW_PORTRAIT  = 0;
const GAME_WINDOW_LANDSCAPE = 1;

function
Calculate_Window_Scale(window_mode, design_width, design_height)
{
    const parent_width  = window.innerWidth;
    const parent_height = window.innerHeight;

    const width_ratio  = (parent_width  / design_width);
    const height_ratio = (parent_height / design_height);

    return Math_Min(width_ratio, height_ratio);
}

function Tween_Scale(obj, time, target_scale)
{
    return Tween_CreateBasic(time)
        .from({s: obj.scale.x})
        .to({s: target_scale})
        .onUpdate((v)=>{
            obj.scale.set(v.s);
        });
}


//-----------------------------------------------------------------------------
// @XXX(stdmatt): Should move to lib...
function
Remove_From_Parent(obj)
{
    if(obj && obj.parent) {
        obj.parent.removeChild(obj);
    }
}

function
CreateBackButton(callback)
{
    const back_button = new NineSliceButton(
        ORANGE_TEXTURE_SETTINGS,
        NINE_SLICE_SETTINGS,
        SMALL_BUTTON_SIZE_SETTINGS,
    );

    Center_Anchor(back_button);

    back_button.scale.set(0.6);
    back_button.x = (back_button.width  * 0.5);
    back_button.y = (back_button.height * 0.5);
    back_button.OnPointerDown(()=> { callback() });
    back_button.AddIcon(Sprite_Create(BUTTONS_ICON_ARROW_LEFT));

    return back_button;
}

//-----------------------------------------------------------------------------
function FillDigits(value, digits_count = SCORE_HUD_DIGITS_COUNT)
{
    let value_str = value.toString();
    if(value_str.length < digits_count) {
        value_str = "0".repeat(digits_count - value_str.length) + value_str;
    }
    return value_str;
} // _FillDigits
