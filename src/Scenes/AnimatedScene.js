const ANIMATED_SCENE_CLOSE_DOWN_ANIMATION_DURATION = 1000 * ANIMATION_SPEED_MULTIPLIER;
const ANIMATED_SCENE_OPEN_UP_ANIMATION_DURATION    = 1000 * ANIMATION_SPEED_MULTIPLIER;

const ANIMATED_SCENE_CLOSE_DOWN_ANIMATION_EASING = TWEEN.Easing.Exponential.In;
const ANIMATED_SCENE_OPEN_UP_ANIMATION_EASING    = TWEEN.Easing.Exponential.Out;

class AnimatedScene
    extends Base_Scene
{
    //--------------------------------------------------------------------------
    OnEnter()
    {
        super.OnEnter();
        this._CreateAnimationWithCallback(true, ()=>{
            this.OnFinishedEnterAnimation()
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
        this.focus = new PIXI.Sprite(Texture_Get("res/textures/ola.png"))

        const focus_radius = this.focus.height * (GAME_DESIGN_HEIGHT / this.focus.height) * 1.2;
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

        const tween = Tween_CreateBasic(anim_time)
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
                RemoveFromParent(this.focus);
                this.mask = null;

                callback();
            })
            .start();

        return tween;
    } // _CreateAnimationWithCallback
} // AnimatedScene
