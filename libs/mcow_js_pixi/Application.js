//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
APPLICATION_MAX_DELTA_TIME = 1/30;

//----------------------------------------------------------------------------//
// Variables                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
let g_App = null;

let Application_Total_Time  = 0;
let Application_Delta_Time  = 0;


//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Application_Create(container, width, height, seed=null)
{
    g_App = new PIXI.Application({
        width  : width,
        height : height
    });

    container.appendChild(g_App.view);
    if((typeof _MCOW_HACK_PIXI_PARTICLES_INIT) == "function") {
        _MCOW_HACK_PIXI_PARTICLES_INIT(PIXI);
    }
    Application_Tween_Group = Tween_CreateGroup();
    Random_Seed(seed);
}

function Application_Start(gameLoopCallback)
{
    g_App.ticker.add(
        delta => {
            dt = g_App.ticker.deltaMS / 1000;
            if(dt > APPLICATION_MAX_DELTA_TIME) {
                dt = APPLICATION_MAX_DELTA_TIME;
            }

            Application_Delta_Time  = dt;
            Application_Total_Time += dt;

            gameLoopCallback(dt);

            SCENE_MANAGER.Update(dt);
            Tween_Update(dt);
            Input_Update();
        }
    );
}
