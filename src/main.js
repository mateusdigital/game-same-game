const TILE_COUNT_X       = 20;
const TILE_COUNT_Y       = 35;
const TILE_WIDTH         = 31;
const TILE_HEIGHT        = 31;
const GAME_DESIGN_WIDTH  = TILE_WIDTH  * TILE_COUNT_X;
const GAME_DESIGN_HEIGHT = TILE_HEIGHT * TILE_COUNT_Y;
const GAME_SEED          = 4;


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
    // SCENE_MANAGER.SetScene(new GameScene());
    SCENE_MANAGER.SetScene(new MenuScene());
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
