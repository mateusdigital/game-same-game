//------------------------------------------------------------------------------
function
PreInit()
{
    Application_Create(
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

    AUDIO_MANAGER.PreloadMusic(
        ()=> {
            console.log("Loaded");
            AUDIO_MANAGER.PlayMusic("res/audio/life-of-riley-by-kevin-macleod-from-filmmusic-io.mp3");
        },
        [
            "res/audio/life-of-riley-by-kevin-macleod-from-filmmusic-io.mp3"
        ]
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
    const scale = Calculate_Window_Scale(
        GAME_WINDOW_PORTRAIT,
        GAME_DESIGN_WIDTH,
        GAME_DESIGN_HEIGHT
    );

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
