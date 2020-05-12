

const LEADERBOARD_SCENE_MODE_VIEW  = 0;
const LEADERBOARD_SCENE_MODE_ENTER = 1;

class LeaderboardsScene
    extends AnimatedScene
{
    constructor(scene_mode)
    {
        super();
        //
        // Scenario
        this.sky      = new SkyBackground();
        this.scenario = new ScenarioLayer();
        this.addChild(this.sky);
        this.addChild(this.scenario);

        //
        // Buttons
        this.back_button = new NineSliceButton(
            ORANGE_TEXTURE_SETTINGS,
            NINE_SLICE_SETTINGS,
            BIG_BUTTON_SIZE_SETTINGS,
        );
        Update_Anchor(this.back_button, 0.5);

        this.back_button.scale.set(0.7);
        this.back_button.x = GAME_DESIGN_WIDTH  * 0.5;
        this.back_button.y = GAME_DESIGN_HEIGHT * 0.8;
        this.back_button.on("pointerdown", ()=> { this.GoBack() });
        this.back_button.AddIcon(Sprite_Create(BUTTON_ICON_NAME_BACK));
        this.addChild(this.back_button);


        this.scene_mode = scene_mode;
        this._leaderboard_data = LeaderboardsUtils_GetData();

        let curr_y = 150;
        const font_family = "ARCO Typography";
        const LEADERBOARDS_TITLE_FONT_SIZE = 82;
        const title_text =  new Base_BMPText("LEADERBOARDS", font_family, LEADERBOARDS_TITLE_FONT_SIZE);
        Update_Anchor(title_text, 0.5);
        title_text.x = GAME_DESIGN_WIDTH  * 0.5;
        title_text.y = GAME_DESIGN_HEIGHT * 0.1;
        this.addChild(title_text);

        const max_scale = 1.1;
        const min_scale = 0.7;
        const data_len  = this._leaderboard_data.length;
        const entry_font_size = 46;


        for(let i = 0; i < data_len; ++i) {
            const entry = this._leaderboard_data[i];


            let name_str = entry.name;
            if(name_str.length > 10) {
                name_str = name_str.substring(0, 10)
            }

            const pos_str = String_Cat("#", FillDigits(i+1, 2));
            const score_str = FillDigits(entry.score);


            const curr_scale     = Math_Map(i, 0, data_len, max_scale, min_scale);
            const curr_font_size = entry_font_size * curr_scale;


            const pos_text   = new Base_BMPText(pos_str,   font_family, 30 * curr_scale);
            const name_text  = new Base_BMPText(name_str,  font_family, curr_font_size);
            const score_text = new Base_BMPText(score_str, font_family, 40 * curr_scale);

            score_text.alpha = 0;
            name_text .alpha = 0;
            pos_text  .alpha = 0;

            Tween_CreateBasic(300).onUpdate((v)=>{
                score_text.alpha = v.value;
                name_text .alpha = v.value;
                pos_text  .alpha = v.value;
            }).delay(100 * i).start()

            // Update_Anchor(pos_text,  0.0, 0.5);
            // Update_Anchor(name_text,  0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000, 0.5);
            // Update_Anchor(score_text, 0.5, 0.5);
            curr_y += name_text.height + 20;

            Update_Anchor(pos_text,   0, 0.5);
            Update_Anchor(score_text, 1, 0.5);
            Update_Anchor(name_text,   0.0, 0.5);
            pos_text.x = title_text.x - (title_text.width * 0.5) + 5
            pos_text.y = curr_y + 3 * curr_scale; //TWEaK


            score_text.x = title_text.x + (title_text.width * 0.5) -5;
            score_text.y = curr_y;
            const a = (pos_text.x + pos_text.width + 10)
            const b = (score_text.x - score_text.width * 0.5);
            name_text.x = 88;
            name_text.y = curr_y;


            this.addChild(pos_text);
            this.addChild(name_text);
            this.addChild(score_text);
        }
    }
}
