//------------------------------------------------------------------------------
function
PreInit()
{
    const container = document.getElementById("canvas_container");
    Application_Create(
        container,
        GAME_DESIGN_WIDTH,
        GAME_DESIGN_HEIGHT,
        GAME_SEED
    );

    window.onresize = function(event) {
        ResizeGame();
    };

    ResizeGame();
}

//------------------------------------------------------------------------------
function
PreLoad()
{
    RES_LoadResources(Setup,
        "res/data/balance.json",
        SCORE_NUMBER_PARTICLE_DATA_NAME,
        TEXTURES_TO_LOAD,
        FONT_FILE_NAMES
    );
}


//------------------------------------------------------------------------------
function
Setup()
{
    GameSettings_Init();

    const params     = new URLSearchParams(location.search);
    const scene_name = params.get("scene");

    Scenario_Init();
    if(scene_name == "menu") {
        SCENE_MANAGER.SetScene(new MenuScene());
    } else if(scene_name == "game") {
        SCENE_MANAGER.SetScene(new GameScene());
    } else if(scene_name == "leaderboards") {
        SCENE_MANAGER.SetScene(new LeaderboardsScene());
    } else if(scene_name == "credits") {
        SCENE_MANAGER.SetScene(new CreditsScene());
    } else {
        SCENE_MANAGER.SetScene(new MenuScene());
    }

    AUDIO_MANAGER.PreloadSounds(
        ()=> {
            AUDIO_MANAGER.Play(MUSIC_BACKGROUND, true);
            const sound_on = GameSettings_Get(SETTINGS_KEY_SOUND_ENABLED, true);
            if(!sound_on) {
                AUDIO_MANAGER.ToggleMute();
            }
        },
        SOUNDS_TO_LOAD, MUSIC_TO_LOAD
    );

    Application_Start(GameLoop);
    Input_InstallBasicMouseHandler(g_App.view);
}

//------------------------------------------------------------------------------
function
GameLoop()
{
    SCENARIO.Update(Application_Delta_Time);
}

//------------------------------------------------------------------------------
function
ResizeGame()
{
    const container = document.getElementById("canvas_container");

    const parent_width  = window.innerWidth;
    const parent_height = window.innerHeight;

    const computed_style = window.getComputedStyle(container);

    const top    = parseFloat(computed_style.paddingTop);
    const right  = parseFloat(computed_style.paddingRight);
    const bottom = parseFloat(computed_style.paddingBottom);
    const left   = parseFloat(computed_style.paddingLeft);

    const width_ratio  = (parent_width - (left + right)) / GAME_DESIGN_WIDTH;
    const height_ratio = (parent_height- (top + bottom)) / GAME_DESIGN_HEIGHT;

    const scale = Math_Min(width_ratio, height_ratio);

    g_App.stage.scale.set(scale, scale);
    g_App.renderer.resize(
        GAME_DESIGN_WIDTH  * scale,
        GAME_DESIGN_HEIGHT * scale
    );
}

//----------------------------------------------------------------------------//
// Entry Point                                                                //
//----------------------------------------------------------------------------//
PreInit();
PreLoad();
