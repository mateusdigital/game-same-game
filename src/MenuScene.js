class UIButton
    extends PIXI.Container
{
    constructor(color, width, height)
    {
        super()

        //
        //
        var bg = Sprite_White(width, height);
        bg.tint = color;
        bg.x = 0;
        bg.y = 0;
        bg.alpha = 0.5;
        bg.anchor.set(0.5);

        //
        //
        bg.interactive = true;
        bg.buttonMode  = true;
        bg.on("pointerdown", ()=>{ this._OnPointerDown(); });

        this.OnClick = null;
        this.addChild(bg);
    }

    _OnPointerDown()
    {
        if(this.OnClick) {
            this.OnClick();
        }
    }

    Set(f) {
        this.OnClick = f;
        console.log(this.OnClick);
    }
}

function RGB(r, g, b )
{
    // @XXX(stdmatt): Is this the bitwise in javascript???
    let rr = r << 16 >>> 0;
    let gg = g <<  8 >>> 0;
    let bb = b <<  0 >>> 0;
    let ss = (rr | gg | bb) >>> 0;

    return ss;
}

class MenuScene
    extends Base_Scene
{
    constructor()
    {
        super();
        const BUTTON_BIG_WIDTH   = (GAME_DESIGN_WIDTH * 0.5);
        const BUTTON_GAP         = 10;
        const BUTTON_SMALL_WIDTH = BUTTON_BIG_WIDTH / 3 - BUTTON_GAP;
        const BUTTON_HEIGHT      = BUTTON_SMALL_WIDTH;

        // Play.
        this.play_button = new UIButton(RGB(255, 0, 255), BUTTON_BIG_WIDTH, BUTTON_HEIGHT);
        this.play_button.x = (GAME_DESIGN_WIDTH * 0.5);
        this.play_button.y = (GAME_DESIGN_HEIGHT * 0.5);
        this.addChild(this.play_button);

        // Credits.
        this.credits_button = new UIButton(RGB(255, 0, 0), BUTTON_BIG_WIDTH, BUTTON_HEIGHT);
        this.credits_button.x = (GAME_DESIGN_WIDTH * 0.5);
        this.credits_button.y = this.play_button.y + BUTTON_HEIGHT + BUTTON_GAP;
        this.addChild(this.credits_button);

        // Sound - Left.
        this.sound_button = new UIButton(RGB(0, 255, 0), BUTTON_SMALL_WIDTH, BUTTON_HEIGHT);
        this.sound_button.x = this.play_button.x - (BUTTON_BIG_WIDTH * 0.5) + (BUTTON_SMALL_WIDTH * 0.5);
        this.sound_button.y = this.credits_button.y + BUTTON_HEIGHT + BUTTON_GAP;
        this.addChild(this.sound_button);

        // Leaderboards - Center.
        this.leaders_button = new UIButton(RGB(0, 0, 255), BUTTON_SMALL_WIDTH, BUTTON_HEIGHT);
        this.leaders_button.x = this.play_button.x;
        this.leaders_button.y = this.credits_button.y + BUTTON_HEIGHT + BUTTON_GAP;
        this.addChild(this.leaders_button);

        // More - Right.
        this.more_button = new UIButton(RGB(0, 255, 255), BUTTON_SMALL_WIDTH, BUTTON_HEIGHT);
        this.more_button.x = this.play_button.x + (BUTTON_BIG_WIDTH * 0.5) - (BUTTON_SMALL_WIDTH * 0.5);
        this.more_button.y = this.credits_button.y + BUTTON_HEIGHT + BUTTON_GAP;

        this.addChild(this.more_button);
    } // ctor

    OnEnter()
    {
        super.OnEnter();

        this.play_button   .OnClick = this.GoPlay;
        this.credits_button.OnClick = this.GoCredits;
        this.sound_button  .OnClick = this.ToggleSound;
        this.leaders_button.OnClick = this.GoLeaderboards;
        this.more_button   .OnClick = this.GoMore;
    }

    GoPlay()
    {
        SCENE_MANAGER.SetScene(new GameScene());
    }

    GoCredits()
    {
        SCENE_MANAGER.SetScene(new CreditsScene());
    }

    ToggleSound()
    {
    }

    GoLeaderboards()
    {
        SCENE_MANAGER.SetScene(new LeaderboardsScene());
    }

    GoMore()
    {
        SCENE_MANAGER.SetScene(new MoreScene());
    }



} // class MenuScene