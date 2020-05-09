const TILE_COUNT_X       = 8;
const TILE_COUNT_Y       = 12;
const TILE_WIDTH         = 70;
const TILE_HEIGHT        = 70;
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
        "res/textures/untitled.png"
    );

    Texture_SetBasePath("res");
}


//------------------------------------------------------------------------------
function Setup()
{
    SCENE_MANAGER.SetScene(new GameScene());
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
