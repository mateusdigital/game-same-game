

//------------------------------------------------------------------------------
function PreInit()
{
    Application_Create(GAME_DESIGN_WIDTH, GAME_DESIGN_HEIGHT, GAME_SEED);
}

//------------------------------------------------------------------------------
function PreLoad()
{
    RES_LoadResources(Setup,
        BRICKS_TEXTURES_NAMES,
        NUMBERS_TEXTURES_NAMES,
        "res/textures/untitled.png",
        BUTTONS_TEXTURES_NAMES,
        MENU_BACKGROUND_TEXTURE_NAME,
        CLOUD_BACKGROUND_TEXTURES_NAMES,
    );

    Texture_SetBasePath("res");
}


//------------------------------------------------------------------------------
function Setup()
{
    SCENE_MANAGER.SetScene(new GameScene());
    // SCENE_MANAGER.SetScene(new MenuScene());
    Application_Start(GameLoop);
    Input_InstallBasicMouseHandler(g_App.view   )
}

//------------------------------------------------------------------------------
function GameLoop()
{
}

//----------------------------------------------------------------------------//
// Entry Point                                                                //
//----------------------------------------------------------------------------//
PreInit();
PreLoad();
