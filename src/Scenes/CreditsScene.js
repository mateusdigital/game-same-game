//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const CREDITS_SCENE_TEXTURES = [
    CREDITS_MSG_1,
    CREDITS_MSG_2,
    CREDITS_MSG_3,
    CREDITS_MSG_4,
    CREDITS_MSG_5,
    CREDITS_MSG_6,
    CREDITS_MSG_7,
    CREDITS_MSG_8,
    CREDITS_MSG_9,
    CREDITS_MSG_10,
    CREDITS_MSG_11,
    CREDITS_MSG_12,
    CREDITS_MSG_13,
    CREDITS_MSG_14,
];

//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
class CreditsScene
    extends AnimatedScene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        //
        // Scenario
        this.sky      = new SkyBackground();
        this.scenario = new ScenarioLayer();

        this.addChild(this.sky);
        this.addChild(this.scenario);

        // Button
        const back_button = CreateBackButton(()=>{
            this.RunOnExit(new MenuScene());
        });
        this.addChild(back_button);

        //
        // Msgs
        this.msgs = [];
        for(let i = 0; i < CREDITS_SCENE_TEXTURES.length; ++i) {
            const sprite = Sprite_Create(CREDITS_SCENE_TEXTURES[i]);
            this.msgs.push(sprite);
        }
    } // CTOR


    //--------------------------------------------------------------------------
    OnFinishedEnterAnimation()
    {
        super.OnFinishedEnterAnimation();
        this._StartAnimation();
    } // OnFinishedEnterAnimation

    //--------------------------------------------------------------------------
    Update(dt)
    {
        this.sky     .Update(dt);
        this.scenario.Update(dt);
    } // Update

    _StartAnimation()
    {
        Center_Anchor(this.msgs[0]);
        this.addChild(this.msgs[0]);
        this.msgs[0].x = GAME_DESIGN_WIDTH  * 0.5;
        this.msgs[0].y = GAME_DESIGN_HEIGHT * 0.1;
        this.msgs[0].scale.set(0);

        Tween_Scale(this.msgs[0], 500, 1.0).onComplete(()=>{
            this._StartThanksAnimation()
        }).start();
    }

    _StartThanksAnimation()
    {
        let curr_index = 2;
        const prepare_anim = ()=> {
            let target_y = this.msgs[curr_index -1].y
                         + this.msgs[curr_index -1].height * 0.5
                         + this.msgs[curr_index   ].height * 0.5
                         + 5;

            if(curr_index == 2) {
                target_y += 15;
            } else if(curr_index % 2 == 0) {
                target_y += 25;
            }

            Center_Anchor(this.msgs[curr_index]);
            this.addChild(this.msgs[curr_index]);
            this.msgs[curr_index].x = GAME_DESIGN_WIDTH * 0.5;
            this.msgs[curr_index].y = target_y;
            this.msgs[curr_index].scale.set(0);
        }

        const tween = Tween_CreateBasic(500)
            .repeat(7)
            .onRepeat(()=>{
                ++curr_index;
                prepare_anim();
            })
            .onStart(()=>{
                prepare_anim();
            })
            .onUpdate((v)=>{
                this.msgs[curr_index].scale.set(v.value);
            })
            .onComplete(()=>{
                this._StartForPeopleAnimation();
            })

        //
        Center_Anchor(this.msgs[1]);
        this.addChild(this.msgs[1]);
        this.msgs[1].x = GAME_DESIGN_WIDTH  * 0.5;
        this.msgs[1].y = this.msgs[0].y + this.msgs[0].height;
        this.msgs[1].scale.set(0);

        Tween_Scale(this.msgs[1], 500, 1.0).onComplete(()=>{
            tween.start();
        }).start();
    }

    _StartForPeopleAnimation()
    {
        // Main
        Center_Anchor(this.msgs[10]);
        this.addChild(this.msgs[10]);
        this.msgs[10].x = GAME_DESIGN_WIDTH  * 0.5;
        this.msgs[10].y = this.msgs[9].y + this.msgs[9].height * 0.5 + this.msgs[10].height * 0.5 + 50;
        this.msgs[10].scale.set(0);

        Tween_Scale(this.msgs[10], 500, 1.0).onComplete(()=>{
            // Detail
            Center_Anchor(this.msgs[11]);
            this.addChild(this.msgs[11]);
            this.msgs[11].x = GAME_DESIGN_WIDTH * 0.5;
            this.msgs[11].y = this.msgs[10].y + this.msgs[10].height * 0.5 + this.msgs[11].height * 0.5 + 5;
            this.msgs[11].scale.set(0);

            Tween_Scale(this.msgs[11], 500, 1.0).onComplete(()=>{
                this._StartSTDMATTAnimation();
            }).start();
        }).start();
    }

    _StartSTDMATTAnimation()
    {
        // Main
        Center_Anchor(this.msgs[12]);
        this.addChild(this.msgs[12]);
        this.msgs[12].x = GAME_DESIGN_WIDTH  * 0.5;
        this.msgs[12].y = this.msgs[11].y + this.msgs[11].height * 0.5 + this.msgs[12].height * 0.5 + 50;
        this.msgs[12].scale.set(0);

        Tween_Scale(this.msgs[12], 500, 1.0).onComplete(()=>{
            // Detail
            Center_Anchor(this.msgs[13]);
            this.addChild(this.msgs[13]);
            this.msgs[13].x = GAME_DESIGN_WIDTH * 0.5;
            this.msgs[13].y = this.msgs[12].y + this.msgs[12].height * 0.5 + this.msgs[13].height * 0.5 + 5;
            this.msgs[13].scale.set(0);

            Tween_Scale(this.msgs[13], 500, 1.0).onComplete(()=>{
            }).start();
        }).start();
    }
} // class CreditsScene
