const NINE_SLICE_BUTTON_PRESS_TINT  = 0xFF00FF;
const NINE_SLICE_BUTTON_HOVER_TINT  = 0xCCccCC;
const NINE_SLICE_BUTTON_NORMAL_TINT = 0xFFffFF;

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

class NineSliceButton
    extends PIXI.NineSlicePlane
{
    //--------------------------------------------------------------------------
    constructor(texture_settings, slice_settings, size_settings, icon_settings)
    {
        super(
            texture_settings.normal,
            slice_settings.left_width,
            slice_settings.top_height,
            slice_settings.right_width,
            slice_settings.bottom_height
        );
        this.texture_settings = texture_settings;
        this.slice_settings   = slice_settings;
        this.icon_settings    = icon_settings;
        this.icon             = null;

        if(size_settings) {
            this.width  = size_settings.width;
            this.height = size_settings.height;
        }

        if(icon_settings) {
            this.icon = new PIXI.Sprite(icon_settings["normal"]);
            this.addChild(this.icon);

            Update_Anchor(this.icon, 0.5);
            this.icon.x = this.width * 0.5;
            this.icon.y = this.height * 0.5
        }

        this.interactive = true;
        this.buttonMode  = true;

        this._SetupCallbacks();
    } // CTOR

    _SetTint(obj, color)
    {
        if(obj) {
            obj.tint = color;
        }
    }
    //--------------------------------------------------------------------------
    _SetupCallbacks()
    {
        this.mouseover = () => {
            if(this.texture_settings["hover"]) {
                this.texture =  this.texture_settings["hover"];
            } else {
                this._SetTint(this,      NINE_SLICE_BUTTON_HOVER_TINT);
                this._SetTint(this.icon, NINE_SLICE_BUTTON_HOVER_TINT);
            }
        }
        this.mouseout = () => {
            if(this.texture_settings["hover"]) {
                this.texture = this.texture_settings.normal;
            } else {
                this._SetTint(this,      NINE_SLICE_BUTTON_NORMAL_TINT);
                this._SetTint(this.icon, NINE_SLICE_BUTTON_NORMAL_TINT);
            }
        }

        this.mousedown = this.touchstart = () => {
            if(this.texture_settings["pressed"]) {
                this.texture =  this.texture_settings["pressed"];
            } else {
                this._SetTint(this,      NINE_SLICE_BUTTON_PRESS_TINT);
                this._SetTint(this.icon, NINE_SLICE_BUTTON_PRESS_TINT);
            }
        }
        this.mouseup = this.touchend= () => {
            if(this.texture_settings["pressed"]) {
                this.texture =  this.texture_settings.normal
            } else {
                this._SetTint(this,      NINE_SLICE_BUTTON_NORMAL_TINT);
                this._SetTint(this.icon, NINE_SLICE_BUTTON_NORMAL_TINT);
            }
        }
    } // _SetupCallbacks
} // NineSliceButton
