//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const ANIMATED_SCENE_CLOSE_DOWN_ANIMATION_DURATION = 800 * ANIMATION_SPEED_MULTIPLIER;
const ANIMATED_SCENE_OPEN_UP_ANIMATION_DURATION    = 800 * ANIMATION_SPEED_MULTIPLIER;

const ANIMATED_SCENE_CLOSE_DOWN_ANIMATION_EASING = TWEEN.Easing.Exponential.In;
const ANIMATED_SCENE_OPEN_UP_ANIMATION_EASING    = TWEEN.Easing.Exponential.Out;

const ANIMATED_SCENE_SHAPES = [
    FADE_SHAPE_5,
]

//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
class AnimatedScene
    extends Base_Scene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();
        this.is_doing_fade_animation = false;
        this.sortableChildren        = true;
    } // CTOR

    //--------------------------------------------------------------------------
    OnEnter()
    {
        super.OnEnter();
        SCENARIO.SetParent(this);
        this._CreateAnimationWithCallback(true, ()=>{
            this.OnFinishedEnterAnimation();
        })
    } // OnEnter

    //--------------------------------------------------------------------------
    RunOnExit(scene)
    {
        super.OnExit();
        this._CreateAnimationWithCallback(false, ()=>{
            SCENE_MANAGER.SetScene(scene);
        })
    } // RunOnExit

    //--------------------------------------------------------------------------
    OnFinishedEnterAnimation()
    {
        // Should be overridden...
    } // OnFinishedEnterAnimation

    //--------------------------------------------------------------------------
    _CreateAnimationWithCallback(is_opening_up, callback)
    {
        this.is_doing_fade_animation = true;

        const fade_shape = Random_Element(ANIMATED_SCENE_SHAPES);
        this.focus = new PIXI.Sprite(Texture_Get(fade_shape));

        // @XXX(stdmatt): This value is to make the thing goes TOTALLY out of
        // the screen, otherwise it keeps a little bit inside...
        const XXX_MAGIC = 1.15;

        const focus_radius  = this.focus.height * (GAME_DESIGN_HEIGHT / this.focus.height) * XXX_MAGIC;
        const curr_radius   = (is_opening_up) ? 0 : focus_radius;
        const target_radius = (is_opening_up) ? focus_radius : 0;

        this.focus.width  = curr_radius;
        this.focus.height = curr_radius;
        this.focus.x      = GAME_DESIGN_WIDTH  * 0.5;
        this.focus.y      = GAME_DESIGN_HEIGHT * 0.5;
        Update_Anchor(this.focus, 0.5);

        this.mask = this.focus;
        this.parent.addChild(this.focus);

        const anim_time = (is_opening_up)
            ? ANIMATED_SCENE_OPEN_UP_ANIMATION_DURATION
            : ANIMATED_SCENE_CLOSE_DOWN_ANIMATION_DURATION;

        const anim_ease = (is_opening_up)
            ? ANIMATED_SCENE_OPEN_UP_ANIMATION_EASING
            : ANIMATED_SCENE_CLOSE_DOWN_ANIMATION_EASING;

        Tween_CreateBasic(anim_time)
            .from({r: curr_radius  })
            .to  ({r: target_radius})
            .onUpdate((value)=>{
                if(value.r < 0) {
                    value.r = 0;
                }
                this.focus.width  = value.r;
                this.focus.height = value.r;
            })
            .easing(anim_ease)
            .onComplete(()=>{
                Remove_From_Parent(this.focus);
                this.mask = null;

                this.is_doing_fade_animation = false;
                callback();
            })
            .start();
    } // _CreateAnimationWithCallback
} // AnimatedScene
