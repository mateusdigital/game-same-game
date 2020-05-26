//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
class MenuScene
    extends AnimatedScene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        //
        // Housekeeping
        this.has_scores = GameSettings_Get(SETTINGS_KEY_HAS_SCORE, false);

        //
        // Scenario
        this.sky      = new SkyBackground();
        this.scenario = new ScenarioLayer();

        this.addChild(this.sky);
        this.addChild(this.scenario);

        this.logo = Sprite_Create(LOGO);
        Center_Anchor(this.logo);
        this.logo.x = GAME_DESIGN_WIDTH  * 0.5;
        this.logo.y = GAME_DESIGN_HEIGHT * 0.2;

        this.addChild(this.logo);

        //
        // Buttons
        this.play_button    = null;
        this.credits_button = null;
        this.sound_button   = null;
        this.leaders_button = null;
        this.more_button    = null;

        this._CreateButtons  ();
        this._UpdateSoundIcon();

        //
        // Scores
        this.last_score = null;
        this.best_score = null;

        if(this.has_scores) {
            this._CreateScores();
        }
    } // CTOR

    //--------------------------------------------------------------------------
    Update(dt)
    {
        this.sky     .Update(dt);
        this.scenario.Update(dt);
    } // Update

    //------------------------------------------------------------------------//
    // Initialize                                                             //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    _CreateScores()
    {
        if(!this.has_scores) {
            return;
        }

        const last_score = GameSettings_Get(SETTINGS_KEY_LAST_SCORE, 0);
        const best_score = GameSettings_Get(SETTINGS_KEY_BEST_SCORE, 0);

        this.last_score = new ScoreNumber(last_score, SCORE_HUD_DIGITS_COUNT);
        this.best_score = new ScoreNumber(best_score, SCORE_HUD_DIGITS_COUNT);

        this.best_score.x = GAME_DESIGN_WIDTH  * 0.5;
        this.best_score.y = this.play_button.y - BUTTON_HEIGHT * 0.5 - BUTTON_GAP - this.best_score.height * 0.5
        this.addChild(this.best_score);

        this.last_score.x = GAME_DESIGN_WIDTH  * 0.5;
        this.last_score.y = this.best_score.y - this.best_score.height - BUTTON_GAP;
        this.addChild(this.last_score);
    } // _CreateScores

    //--------------------------------------------------------------------------
    _CreateButtons()
    {
        //
        // Play.
        this.play_button = new NineSliceButton(
            GREEN_TEXTURE_SETTINGS,
            NINE_SLICE_SETTINGS,
            BIG_BUTTON_SIZE_SETTINGS
        );

        const play_button_y = this.has_scores
            ? PLAY_BUTTON_WITH_SCORES_Y
            : PLAY_BUTTON_NO_SCORES_Y;

        this.play_button.x = GAME_DESIGN_WIDTH * 0.5;
        this.play_button.y = play_button_y;
        this.play_button.OnPointerDown(()=> { this.GoPlay() });
        this.play_button.AddIcon(Sprite_Create(BUTTONS_ICON_PLAY));

        this.addChild(this.play_button);
        Update_Anchor(this.play_button, 0.5);

        //
        // Credits
        this.credits_button = new NineSliceButton(
            BLUE_TEXTURE_SETTINGS,
            NINE_SLICE_SETTINGS,
            BIG_BUTTON_SIZE_SETTINGS
        );

        this.credits_button.x = this.play_button.x;
        this.credits_button.y = this.play_button.y + BUTTON_HEIGHT + BUTTON_GAP;
        this.credits_button.OnPointerDown(()=> { this.GoCredits() });
        this.credits_button.AddIcon(Sprite_Create(BUTTONS_ICON_CREDITS));

        this.addChild(this.credits_button);
        Update_Anchor(this.credits_button, 0.5);

        //
        // Sound - Left.
        this.sound_button = new NineSliceButton(
            YELLOW_TEXTURE_SETTINGS,
            NINE_SLICE_SETTINGS,
            SMALL_BUTTON_SIZE_SETTINGS,
        );

        this.sound_button.x = this.play_button.x - (BUTTON_BIG_WIDTH * 0.5) + (BUTTON_SMALL_WIDTH * 0.5);
        this.sound_button.y = this.credits_button.y + BUTTON_HEIGHT + BUTTON_GAP;
        this.sound_button.OnPointerDown(()=> { this.ToggleSound() });
        this.sound_button.AddIcon(Sprite_Create(BUTTONS_ICON_MUSIC_ON));
        this.addChild(this.sound_button);
        Update_Anchor(this.sound_button, 0.5);

        //
        // Leaderboards - Center.
        this.leaders_button = new NineSliceButton(
            ORANGE_TEXTURE_SETTINGS,
            NINE_SLICE_SETTINGS,
            SMALL_BUTTON_SIZE_SETTINGS,
        );

        this.leaders_button.x = this.play_button.x;
        this.leaders_button.y = this.credits_button.y + BUTTON_HEIGHT + BUTTON_GAP;
        this.leaders_button.OnPointerDown(()=> { this.GoLeaderboards() });
        this.leaders_button.AddIcon(Sprite_Create(BUTTONS_ICON_LEADERBOARDS));
        this.addChild(this.leaders_button);
        Update_Anchor(this.leaders_button, 0.5);

        //
        // More - Right.
        this.more_button = new NineSliceButton(
            GREEN_TEXTURE_SETTINGS,
            NINE_SLICE_SETTINGS,
            SMALL_BUTTON_SIZE_SETTINGS,
        );
        this.more_button.x = this.play_button.x + (BUTTON_BIG_WIDTH * 0.5) - (BUTTON_SMALL_WIDTH * 0.5);
        this.more_button.y = this.credits_button.y + BUTTON_HEIGHT + BUTTON_GAP;
        this.more_button.OnPointerDown(()=> { this.GoMore() });
        this.more_button.AddIcon(Sprite_Create(BUTTONS_ICON_PLUS));
        this.addChild(this.more_button);
        Update_Anchor(this.more_button, 0.5);
    } // _CreateButtons


    //------------------------------------------------------------------------//
    // Menu Button Callbacks                                                  //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    GoPlay()
    {
        this.RunOnExit(new GameScene())
        // SCENE_MANAGER.SetScene(new GameScene());
    }

    //--------------------------------------------------------------------------
    GoCredits()
    {
        SCENE_MANAGER.SetScene(new CreditsScene());
    }

    //--------------------------------------------------------------------------
    ToggleSound()
    {
        const sound_on = GameSettings_Get(SETTINGS_KEY_SOUND_ENABLED, true);
        GameSettings_Set(SETTINGS_KEY_SOUND_ENABLED, !sound_on);
        this._UpdateSoundIcon();
    }

    //--------------------------------------------------------------------------
    GoLeaderboards()
    {
        this.RunOnExit(new LeaderboardsScene(LEADERBOARD_SCENE_MODE_VIEW));
    }

    //--------------------------------------------------------------------------
    GoMore()
    {
        SCENE_MANAGER.SetScene(new MoreScene());
    }

    //------------------------------------------------------------------------//
    // Helper Methods                                                         //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    _UpdateSoundIcon()
    {
        const sound_on     = GameSettings_Get(SETTINGS_KEY_SOUND_ENABLED, true);
        const texture_name = (sound_on)
            ? BUTTONS_ICON_MUSIC_ON
            : BUTTONS_ICON_MUSIC_OFF;

        console.log(texture_name);
        this.sound_button.icon_sprite.texture = Texture_Get(texture_name);
    } // _UpdateSoundIcon
} // class MenuScene
