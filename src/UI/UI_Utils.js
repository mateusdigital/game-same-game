function Update_Anchor(obj, x, y)
{
    if(!y) {
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

function RemoveFromParent(obj)
{
    if(obj && obj.parent) {
        obj.parent.removeChild(obj);
    }
}
