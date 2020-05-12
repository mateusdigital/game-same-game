//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
class ScoreNumberParticle
    extends PIXI.Container
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();
        this._CreateEmitter();
    } // CTOR

    //--------------------------------------------------------------------------
    Update(dt)
    {
        this.emitter.update(dt);
    } // Update


    //--------------------------------------------------------------------------
    Play()
    {
        this.emitter.playOnce(()=>{
            this.emitter.emit = false;
        });
    } // Play

    //--------------------------------------------------------------------------
    _CreateEmitter()
    {
        const data   = Data_Get(SCORE_NUMBER_PARTICLE_DATA_NAME);
        let textures = [];
        for(let i = 0; i < SCORE_PARTICLES.length; ++i) {
            textures.push(Texture_Get(SCORE_PARTICLES[i]));
        }

        this.emitter = new PIXI.particles.Emitter(this, textures, data);
        this.emitter.emit = false;
    } // _CreateEmitter
} // class ScoreNumberParticle
