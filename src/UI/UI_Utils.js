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
