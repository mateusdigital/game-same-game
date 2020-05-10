
const BUTTON_BIG_WIDTH   = (GAME_DESIGN_WIDTH * 0.5);
const BUTTON_GAP         = 10;
const BUTTON_SMALL_WIDTH = BUTTON_BIG_WIDTH / 3 - BUTTON_GAP;
const BUTTON_HEIGHT      = BUTTON_SMALL_WIDTH;

//----------------------------------------------------------------------------//
// Types                                                                     //
//----------------------------------------------------------------------------//
class MenuScene
    extends Base_Scene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();
        //
        // Sky Layers...
        this.sky = new SkyBackground();
        this.addChild(this.sky);

        //
        // Foreground Layer
        const foreground = Sprite_Create(MENU_BACKGROUND_TEXTURE_NAME);
        foreground.y = GAME_DESIGN_HEIGHT - foreground.height;
        this.addChild(foreground);

        //
        // Buttons
        this.play_button    = null;
        this.credits_button = null;
        this.sound_button   = null;
        this.leaders_button = null;
        this.more_button    = null;

        this._CreateButtons();


        // Scores
        this.last_score = new ScoreNumber(0, 5);
        this.best_score = new ScoreNumber(0, 5);

        this.best_score.bg.tint = 0xff00ff;
        this.best_score.bg.alpha = 0.3;
        this.best_score.x = GAME_DESIGN_WIDTH  * 0.5;
        this.best_score.y = this.play_button.y - BUTTON_HEIGHT * 0.5 - BUTTON_GAP - this.best_score.height * 0.5
        this.addChild(this.best_score);

        this.last_score.bg.tint = 0x0000FF;
        this.last_score.bg.alpha = 0.3;
        this.last_score.x = GAME_DESIGN_WIDTH  * 0.5;
        this.last_score.y = this.best_score.y - this.best_score.height - BUTTON_GAP;
        this.addChild(this.last_score);

    } // CTOR

    //--------------------------------------------------------------------------
    Update(dt)
    {
        this.sky.Update(dt);
    } // Update

    //--------------------------------------------------------------------------
    _CreateButtons()
    {

        const NINE_SLICE_SETTINGS = {
            left_width:    3,
            top_height:    3,
            right_width:   3,
            bottom_height: 5
        };
        const BIG_BUTTON_SIZE_SETTINGS = {
            width:  BUTTON_BIG_WIDTH,
            height: BUTTON_HEIGHT
        };
        const SMALL_BUTTON_SIZE_SETTINGS = {
            width:  BUTTON_SMALL_WIDTH,
            height: BUTTON_HEIGHT
        };
        const GREEN_TEXTURE_SETINGS = {
            normal:  Texture_Get(BUTTONS_TEXTURES_NAMES[0]),
            pressed: Texture_Get(BUTTONS_TEXTURES_NAMES[1]),
        };
        const ORANGE_TEXTURE_SETINGS = {
            normal:  Texture_Get(BUTTONS_TEXTURES_NAMES[2]),
            pressed: Texture_Get(BUTTONS_TEXTURES_NAMES[3]),
        };
        const YELLOW_TEXTURE_SETINGS = {
            normal:  Texture_Get(BUTTONS_TEXTURES_NAMES[4]),
            pressed: Texture_Get(BUTTONS_TEXTURES_NAMES[5]),
        };
        const BLUE_TEXTURE_SETINGS = {
            normal:  Texture_Get(BUTTONS_TEXTURES_NAMES[6]),
            pressed: Texture_Get(BUTTONS_TEXTURES_NAMES[7]),
        };

        //
        // Play.
        this.play_button = new NineSliceButton(
            GREEN_TEXTURE_SETINGS,
            NINE_SLICE_SETTINGS,
            BIG_BUTTON_SIZE_SETTINGS
        );

        this.play_button.x = GAME_DESIGN_WIDTH  * 0.5;
        this.play_button.y = GAME_DESIGN_HEIGHT * 0.40;
        this.play_button.on("pointerdown", ()=> { this.GoPlay() });

        this.addChild(this.play_button);
        Update_Anchor(this.play_button, 0.5);

        //
        // Credits
        this.credits_button = new NineSliceButton(
            BLUE_TEXTURE_SETINGS,
            NINE_SLICE_SETTINGS,
            BIG_BUTTON_SIZE_SETTINGS
        );

        this.credits_button.x = GAME_DESIGN_WIDTH  * 0.5;
        this.credits_button.y = this.play_button.y + BUTTON_HEIGHT + BUTTON_GAP;
        this.credits_button.on("pointerdown", ()=> { this.GoCredits() });

        this.addChild(this.credits_button);
        Update_Anchor(this.credits_button, 0.5);

        //
        // Sound - Left.
        this.sound_button = new NineSliceButton(
            YELLOW_TEXTURE_SETINGS,
            NINE_SLICE_SETTINGS,
            SMALL_BUTTON_SIZE_SETTINGS
        );

        this.sound_button.x = this.play_button.x - (BUTTON_BIG_WIDTH * 0.5) + (BUTTON_SMALL_WIDTH * 0.5);
        this.sound_button.y = this.credits_button.y + BUTTON_HEIGHT + BUTTON_GAP;
        this.sound_button.on("pointerdown", ()=> { this.ToggleSound() });

        this.addChild(this.sound_button);
        Update_Anchor(this.sound_button, 0.5);

        //
        // Leaderboards - Center.
        this.leaders_button = new NineSliceButton(
            ORANGE_TEXTURE_SETINGS,
            NINE_SLICE_SETTINGS,
            SMALL_BUTTON_SIZE_SETTINGS
        );

        this.leaders_button.x = this.play_button.x;
        this.leaders_button.y = this.credits_button.y + BUTTON_HEIGHT + BUTTON_GAP;
        this.leaders_button.on("pointerdown", ()=> { this.GoLeaderboards() });

        this.addChild(this.leaders_button);
        Update_Anchor(this.leaders_button, 0.5);

        //
        // More - Right.
        this.more_button = new NineSliceButton(
            GREEN_TEXTURE_SETINGS,
            NINE_SLICE_SETTINGS,
            SMALL_BUTTON_SIZE_SETTINGS
        );
        this.more_button.x = this.play_button.x + (BUTTON_BIG_WIDTH * 0.5) - (BUTTON_SMALL_WIDTH * 0.5);
        this.more_button.y = this.credits_button.y + BUTTON_HEIGHT + BUTTON_GAP;
        this.more_button.on("pointerdown", ()=> { this.GoMore() });

        this.addChild(this.more_button);
        Update_Anchor(this.more_button, 0.5);
    } // _CreateButtons

    //--------------------------------------------------------------------------
    GoPlay()
    {
        SCENE_MANAGER.SetScene(new GameScene());
    }

    //--------------------------------------------------------------------------
    GoCredits()
    {
        SCENE_MANAGER.SetScene(new CreditsScene());
    }

    //--------------------------------------------------------------------------
    ToggleSound()
    {
    }

    //--------------------------------------------------------------------------
    GoLeaderboards()
    {
        SCENE_MANAGER.SetScene(new LeaderboardsScene());
    }

    //--------------------------------------------------------------------------
    GoMore()
    {
        SCENE_MANAGER.SetScene(new MoreScene());
    }
} // class MenuScene
