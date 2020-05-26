//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const NINE_SLICE_BUTTON_PRESS_TINT  = 0xFF00FF;
const NINE_SLICE_BUTTON_HOVER_TINT  = 0xCCccCC;
const NINE_SLICE_BUTTON_NORMAL_TINT = 0xFFffFF;

//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
class NineSliceButton
    extends PIXI.NineSlicePlane
{
    //--------------------------------------------------------------------------
    constructor(texture_settings, slice_settings, size_settings)
    {
        const normal_texture = _GetTextureFromSettings(texture_settings, "normal");
        const hover_texture  = _GetTextureFromSettings(texture_settings, "hover" );
        const press_texture  = _GetTextureFromSettings(texture_settings, "press" );

        super(
            normal_texture,
            slice_settings.left_width,
            slice_settings.top_height,
            slice_settings.right_width,
            slice_settings.bottom_height
        );

        this.normal_texture = normal_texture;
        this.hover_texture  = hover_texture;
        this.press_texture  = press_texture;
        this.icon_sprite    = null;

        if(size_settings) {
            this.width  = size_settings.width;
            this.height = size_settings.height;
        }

        this.interactive = true;
        this.buttonMode  = true;
        this._SetupCallbacks();
    } // CTOR

    //--------------------------------------------------------------------------
    AddIcon(sprite)
    {
        Remove_From_Parent(this.icon_sprite);

        this.icon_sprite = sprite;
        this.addChild(this.icon_sprite);
        Update_Anchor(this.icon_sprite, 0.5);

        this.icon_sprite.x = this.width  * 0.5;
        this.icon_sprite.y = this.height * 0.5;
    } // AddIcon

    OnPointerDown(callback)
    {
        this.on("pointerdown", ()=> {
            if(this.parent.is_doing_fade_animation) {
                return;
            }
            callback()
        });
    } // OnPointerDown
    //--------------------------------------------------------------------------
    _SetupCallbacks()
    {
        this.mouseover = () => {
            if(this.hover_texture) {
                this.texture = this.hover_texture;
            } else {
                this._SetTint(this,      NINE_SLICE_BUTTON_HOVER_TINT);
                this._SetTint(this.icon, NINE_SLICE_BUTTON_HOVER_TINT);
            }
        }
        this.mouseout = () => {
            if(this.hover_texture) {
                this.texture = this.normal_texture;
            } else {
                this._SetTint(this,      NINE_SLICE_BUTTON_NORMAL_TINT);
                this._SetTint(this.icon, NINE_SLICE_BUTTON_NORMAL_TINT);
            }
        }

        this.mousedown = this.touchstart = () => {
            if(this.press_texture) {
                this.texture = this.press_texture;
            } else {
                this._SetTint(this,      NINE_SLICE_BUTTON_PRESS_TINT);
                this._SetTint(this.icon, NINE_SLICE_BUTTON_PRESS_TINT);
            }
        }
        this.mouseup = this.touchend= () => {
            if(this.press_texture) {
                this.texture = this.normal_texture;
            } else {
                this._SetTint(this,      NINE_SLICE_BUTTON_NORMAL_TINT);
                this._SetTint(this.icon, NINE_SLICE_BUTTON_NORMAL_TINT);
            }
        }
    } // _SetupCallbacks

    //--------------------------------------------------------------------------
    _SetTint(obj, color)
    {
        if(obj) {
            obj.tint = color;
        }
    } // _SetTint

} // NineSliceButton

//----------------------------------------------------------------------------//
// Helper Functions                                                           //
//----------------------------------------------------------------------------//
function _GetTextureFromSettings(settings, key)
{
    if(key in settings) {
        return Texture_Get(settings[key]);
    }
    return null;
}
