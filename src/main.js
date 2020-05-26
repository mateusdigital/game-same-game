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
        BRICKS_TEXTURES_NAMES,
        NUMBERS_TEXTURES_NAMES,
        "res/textures/untitled.png",
        BUTTONS_TEXTURES_NAMES,
        BUTTONS_ICONS_TEXTURES_NAMES,
        MENU_BACKGROUND_TEXTURE_NAME,
        CLOUD_BACKGROUND_TEXTURES_NAMES,
        SCORE_PARTICLES,
        "res/emitter.json",
        "res/textures/ola.png",
        "res/fonts/main.fnt"
    );

    Texture_SetBasePath("res");
}


//------------------------------------------------------------------------------
function
Setup()
{
    GameSettings_Init     ();
    LeaderboardsUtils_Init();

    const params     = new URLSearchParams(location.search);
    const scene_name = params.get("scene");

    if(scene_name == "menu") {
        SCENE_MANAGER.SetScene(new MenuScene());
    } else if(scene_name == "game") {
        SCENE_MANAGER.SetScene(new GameScene());
    } else if(scene_name == "leaderboards") {
        SCENE_MANAGER.SetScene(new LeaderboardsScene());
    } else {
        SCENE_MANAGER.SetScene(new MenuScene());
    }

    Application_Start(GameLoop);
    Input_InstallBasicMouseHandler(g_App.view);
}

//------------------------------------------------------------------------------
function
GameLoop()
{
}


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
