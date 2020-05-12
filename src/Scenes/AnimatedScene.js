class AnimatedScene
    extends Base_Scene
{
    OnEnter()
    {
        super.OnEnter();

        this.focus = new PIXI.Sprite(Texture_Get("res/textures/ola.png"))

        const curr_radius   = 0;
        const target_radius = this.focus.height * (GAME_DESIGN_HEIGHT / this.focus.height) * 1.2;

        this.focus.width  = curr_radius;
        this.focus.height = curr_radius;
        this.focus.x      = GAME_DESIGN_WIDTH  * 0.5;
        this.focus.y      = GAME_DESIGN_HEIGHT * 0.5;
        this.focus.anchor.set(0.5);

        this.mask = this.focus;
        this.parent.addChild(this.focus);

        Tween_CreateBasic(1000)
            .from({r: curr_radius  })
            .to  ({r: target_radius})
            .onUpdate((value)=>{
                if(value.r < 0) {
                    value.r = 0
                }
                this.focus.width  = value.r;
                this.focus.height = value.r;
                console.log(value.r);
            })
            .easing(TWEEN.Easing.Exponential.In)
            .onComplete(()=>{
                this.mask = null;
                this.focus.parent.removeChild(this.focus);
                this.OnFinishedEnterAnimation()
            })
            .start();
    }
    ChangeSceneTo(scene) {
        this.RunOnExit(scene);
    }

    RunOnExit(scene)
    {
        super.OnExit();
        this.focus = new PIXI.Sprite(Texture_Get("res/textures/ola.png"))

        const target_radius = 0;
        const curr_radius= this.focus.height * (GAME_DESIGN_HEIGHT / this.focus.height) * 1.2;

        this.focus.width  = curr_radius;
        this.focus.height = curr_radius;
        this.focus.x      = GAME_DESIGN_WIDTH  * 0.5;
        this.focus.y      = GAME_DESIGN_HEIGHT * 0.5;
        this.focus.anchor.set(0.5);

        this.mask = this.focus;
        this.parent.addChild(this.focus);

        Tween_CreateBasic(1000)
            .from({r: curr_radius  })
            .to  ({r: target_radius})
            .onUpdate((value)=>{
                if(value.r < 0) {
                    value.r = 0
                }
                this.focus.width  = value.r;
                this.focus.height = value.r;
                console.log(value.r);
            })
            .easing(TWEEN.Easing.Exponential.Out)
            .onComplete(()=>{
                this.mask = null;
                this.focus.parent.removeChild(this.focus);
                SCENE_MANAGER.SetScene(scene);
            })
            .start();
    }

    OnFinishedEnterAnimation() {

    }
}
