class Scenario
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        this.scenario_layer = new ScenarioLayer();
        this.sky            = new SkyBackground();

        Add_To_Parent(this, this.sky, this.scenario_layer);
    } // CTOR

    //--------------------------------------------------------------------------
    SetParent(parent)
    {
        Remove_From_Parent(this);

        this.zIndex = -1;
        Add_To_Parent(parent, this);
    }

    //--------------------------------------------------------------------------
    Update(dt)
    {
        this.scenario_layer.Update(dt);
        this.sky           .Update(dt);
    } // Update
} // class Scenario


let SCENARIO = null;

//------------------------------------------------------------------------------
function
Scenario_Init()
{
    if(!SCENARIO) {
        SCENARIO = new Scenario();
    }
}
