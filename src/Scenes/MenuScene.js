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
        // Logo
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

        this.play_button_ui_anchor = this.logo;

        this._CreateScores   ();
        this._CreateButtons  ();
        this._UpdateSoundIcon();
    } // CTOR


    //------------------------------------------------------------------------//
    // Initialize                                                             //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    _CreateScores()
    {
        if(!this.has_scores) {
            return;
        }

        let last_value = GameSettings_Get(SETTINGS_KEY_LAST_SCORE, 0);
        let best_value = GameSettings_Get(SETTINGS_KEY_BEST_SCORE, 0);
        last_value = FillDigits(last_value);
        best_value = FillDigits(best_value);

        const label_font_size = SMALL_FONT_DEF.size;
        const value_font_size = MEDIUM_FONT_DEF.size;

        const best_text  = new Text("best",     label_font_size);
        const best_score = new Text(best_value, value_font_size);
        const last_text  = new Text("last",     label_font_size);
        const last_score = new Text(last_value, value_font_size);

        Center_Anchor(best_text);
        best_text.x = (GAME_DESIGN_WIDTH * 0.5);
        best_text.y = this.logo.y + (this.logo.height * 0.5) + (best_text.height * 0.5) + BUTTON_GAP * 2;

        Center_Anchor(best_score);
        best_score.x = best_text.x;
        best_score.y = best_text.y + best_text.height * 0.5 + best_score.height * 0.5 + BUTTON_GAP * 0.5;

        Center_Anchor(last_text);
        last_text.x = best_score.x;
        last_text.y = best_score.y + best_score.height;

        Center_Anchor(last_score);
        last_score.x = last_text.x;
        last_score.y = last_text.y + last_text.height * 0.5 + last_score.height * 0.5 + BUTTON_GAP * 0.5;

        this.addChild(best_text);
        this.addChild(best_score);
        this.addChild(last_text);
        this.addChild(last_score);

        this.play_button_ui_anchor = last_score;
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

        Center_Anchor(this.play_button);
        this.play_button.x = GAME_DESIGN_WIDTH * 0.5;
        const play_button_gap = (this.has_scores) ? BUTTON_GAP * 2 : BUTTON_GAP * 6;
        this.play_button.y = (
            this.play_button_ui_anchor.y            +
            this.play_button_ui_anchor.height * 0.5 +
            this.play_button.height           * 0.5
        ) + play_button_gap;

        this.play_button.OnPointerDown(()=> { this.GoPlay() });
        this.play_button.AddIcon(Sprite_Create(BUTTONS_ICON_PLAY));
        this.addChild(this.play_button);

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
    }

    //--------------------------------------------------------------------------
    GoCredits()
    {
        this.RunOnExit(new CreditsScene())
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
        const win = window.open("https://stdmatt.com/games.html", '_blank');
        win.focus();
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

        this.sound_button.icon_sprite.texture = Texture_Get(texture_name);
    } // _UpdateSoundIcon
} // class MenuScene
