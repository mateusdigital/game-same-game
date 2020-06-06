//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const LEADERBOARD_SCENE_MODE_VIEW  = 0;
const LEADERBOARD_SCENE_MODE_ENTER = 1;

//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
class LeaderboardsScene
    extends AnimatedScene
{

    //--------------------------------------------------------------------------
    constructor(scene_mode)
    {
        super();

        //
        // Housekeeping
        this.scene_mode        = scene_mode;
        this._leaderboard_data = null;

        //
        // UI
        this.title_text             = null;
        this.back_button            = null;
        this.data_fetch_status_text = null;
        this.leaderboard_entries    = null;

        this._CreateStaticUI();

        //
        // Animations
        this.data_fetch_bubble_tween = null;
    } // CTOR

    //--------------------------------------------------------------------------
    _OnLeaderboardFetched()
    {
        //
        // Stop the Fetching Animation.
        this.data_fetch_bubble_tween.stop();
        this.data_fetch_bubble_tween = null;

        Tween_Scale(this.data_fetch_status_text, 500, 0)
            .onComplete(()=>{
                Remove_From_Parent(this.data_fetch_status_text);
            })
            .start();

        // Start the Entries animation
        this._leaderboard_data = LeaderboardsUtils_GetData();
        this._CreateLeaderboardUI();
    } // _OnLeaderboardFetched

    //--------------------------------------------------------------------------
    _OnLeaderboardFetchError()
    {
       this.data_fetch_bubble_tween.stop();
       this.data_fetch_bubble_tween = null;

       Tween_Scale(this.data_fetch_status_text, 500, 1).start();
       this.data_fetch_status_text.text = "Sorry, failed to fetch...";
    } // _OnLeaderboardFetchError

    //--------------------------------------------------------------------------
    OnFinishedEnterAnimation()
    {
        this.data_fetch_bubble_tween = Tween_CreateBasic(1000)
            .onUpdate((v)=>{
                const scale = Math_Map(v.value, 0, 1, 0.9, 1.1);
                this.data_fetch_status_text.scale.set(scale);
            })
            .yoyo(true)
            .repeat(Infinity)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .start();


        LeaderboardsUtils_FetchFromServer(
            ()=>{ this._OnLeaderboardFetched   () },
            ()=>{ this._OnLeaderboardFetchError() }
        );
    } // _OnFinishedEnterAnimation

    //--------------------------------------------------------------------------
    _CreateStaticUI()
    {
        //
        // Back Button.
        this.back_button = CreateBackButton(()=>{
            this.RunOnExit(new MenuScene());
        });
        this.addChild(this.back_button);

        //
        // Title.
        this.title_text = Sprite_Create(LEADERBOARDS);
        Center_Anchor(this.title_text);

        this.title_text.x = GAME_DESIGN_WIDTH  * 0.5;
        this.title_text.y = GAME_DESIGN_HEIGHT * 0.11;
        this.addChild(this.title_text);

        //
        // Data Fetch Status.
        this.data_fetch_status_text = new Base_BMPText(
            "Fetching leaderboards...",
            MEDIUM_FONT_NAME,
            MEDIUM_FONT_SIZE
        );
        Center_Anchor(this.data_fetch_status_text);
        Debug_Tint(this.data_fetch_status_text);

        this.data_fetch_status_text.x = GAME_DESIGN_WIDTH  * 0.5;
        this.data_fetch_status_text.y = GAME_DESIGN_HEIGHT * 0.5;
        this.data_fetch_status_text.scale.set(0);
        this.addChild(this.data_fetch_status_text);
    } // _CreateStaticUI

    //--------------------------------------------------------------------------
    _CreateLeaderboardUI()
    {
        const MAX_CHARS_NAME     = 10;
        const MAX_ENTRIES_COUNT  = 10;
        const POSITION_DIGITS    = 2;
        const ENTRY_FONT_NAME    = BIG_FONT_NAME;
        const POSITION_FONT_SIZE = 30;
        const NAME_FONT_SIZE     = 41;
        const SCORE_FONT_SIZE    = 32;

        const ENTRY_MAX_SCALE = 1.0;
        const ENTRY_MIN_SCALE = 0.8;

        let curr_y = this.title_text.y + (this.title_text.height * 0.5);
        const entries_count = Math_Min(
            MAX_ENTRIES_COUNT,
            this._leaderboard_data.length
        );
        for(let i = 0; i < entries_count; ++i) {
            // Get the data.
            const entry     = this._leaderboard_data[i];
            const name_str  = entry.name.substr(0, MAX_CHARS_NAME);
            const pos_str   = String_Cat("#", FillDigits(i+1, POSITION_DIGITS));
            const score_str = FillDigits(entry.score);

            // Build the BMP Texts.
            const curr_scale = Math_Map(
                i,
                0, MAX_ENTRIES_COUNT,
                ENTRY_MAX_SCALE, ENTRY_MIN_SCALE
            );

            const pos_text   = new Base_BMPText(pos_str,   ENTRY_FONT_NAME, POSITION_FONT_SIZE * curr_scale);
            const name_text  = new Base_BMPText(name_str,  ENTRY_FONT_NAME, NAME_FONT_SIZE     * curr_scale);
            const score_text = new Base_BMPText(score_str, ENTRY_FONT_NAME, SCORE_FONT_SIZE    * curr_scale);
            Debug_Tint(pos_text, name_text, score_text);
            this.addChild(pos_text);
            this.addChild(name_text);
            this.addChild(score_text);

            // Setup the positioning.
            curr_y += name_text.height + 20;

            Update_Anchor(pos_text,   0, 0.5);
            Update_Anchor(score_text, 1, 0.5);
            Update_Anchor(name_text,  0, 0.5);

            pos_text.x = this.title_text.x - (this.title_text.width * 0.5);
            pos_text.y = curr_y + 3 * curr_scale; //TWEaK

            score_text.x = this.title_text.x + (this.title_text.width * 0.5);
            score_text.y = curr_y;

            name_text.x = 88; // XXX(stdmatt): Remove magic...
            name_text.y = curr_y;

            // Setup the Animation.
            score_text.alpha = 0;
            name_text .alpha = 0;
            pos_text  .alpha = 0;

            Tween_CreateBasic(300)
                .onUpdate((v)=>{
                    score_text.alpha = v.value;
                    name_text .alpha = v.value;
                    pos_text  .alpha = v.value;
                })
                .delay(100 * i)
                .start();
        }
    } // _CreateLeaderboardUI
} // class LeaderboardsScene
