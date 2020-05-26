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
function RemoveFromParent(obj)
{
    if(obj && obj.parent) {
        obj.parent.removeChild(obj);
    }
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
