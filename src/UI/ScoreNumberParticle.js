//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const SCORE_NUMBER_PARTICLE_DATA_NAME = "res/particles/score.json";
const SCORE_NUMBER_PARTICLE_TEXTURES = [
    PARTICLES_EMOTE_HEART,
    PARTICLES_EMOTE_HEARTS,
    PARTICLES_EMOTE_STAR,
    PARTICLES_EMOTE_STARS
];

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
        for(let i = 0; i < SCORE_NUMBER_PARTICLE_TEXTURES.length; ++i) {
            textures.push(Texture_Get(SCORE_NUMBER_PARTICLE_TEXTURES[i]));
        }

        this.emitter = new PIXI.particles.Emitter(this, textures, data);
        this.emitter.emit = false;
    } // _CreateEmitter
} // class ScoreNumberParticle
