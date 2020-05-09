const PLAYER_TEXTURES_NAMES = [
    "res/Player/brown.png",
    "res/Player/red.png",
    "res/Player/blue.png",
    "res/Player/green.png",
    "res/Player/grey.png",
]

const PLAYER_WALK_FRAMES  = [1, 2, 3, 4, 3, 2];
const PLAYER_FALL_FRAMES  = [11, 11, 13, 13, 13];
const PLAYER_STAND_FRAMES = [0];

const PLAYER_DIRECTION_RIGHT =  1;
const PLAYER_DIRECTION_LEFT  = -1;


class Player
    extends PIXI.Container
{
    constructor(width, height, type) {
        super();

        //
        // HouseKeeping.
        this.type             = type;
        this.textures         = [];
        this.animation_frames = null;

        this.SetType(type);

        //
        // Sprite.
        this.bg = new PIXI.Sprite(this._TextureFromFrame(PLAYER_STAND_FRAMES[0]));
        this.bg.width = width;
        this.bg.height = height;
        this.bg.anchor.set(0.5);
        this.addChild(this.bg);
    }

    _TextureFromFrame(index)
    {
        return this.textures[index];
    }

    SetDirection(dir)
    {
        this.bg.scale.set(dir,1);
    }

    StartWalkAnimation()
    {
        this.animation_frames = PLAYER_WALK_FRAMES;
        this.SetAnimationT(0);
    }

    StartStandAnimation()
    {
        this.animation_frames = PLAYER_STAND_FRAMES;
        this.SetAnimationT(0);
    }

    StartFallAnimation()
    {
        this.animation_frames = PLAYER_FALL_FRAMES;
        this.SetAnimationT(0);
    }

    SetAnimationT(t)
    {
        let i = Math_Int(t * (this.animation_frames.length -1));
        this.bg.texture = this._TextureFromFrame(this.animation_frames[i]);
    }

    SetType(type)
    {
        this.type = type;
        console.log("PLAYER TYOE IS: ", type);
        const texture_name = PLAYER_TEXTURES_NAMES[type];
        const base_texture = Texture_Get(texture_name);
        const PLAYER_FRAME_WIDTH  = 48;
        const PLAYER_FRAME_HEIGHT = 48;
        const PLAYER_FRAMES_ROWS  =  3;
        const PLAYER_FRAMES_COLS  =  6;
        const FRAME_GAP_X         = 27;
        const FRAME_GAP_Y         = 15;


        // @optimize...
        this.textures = [];
        for(let i = 0; i < PLAYER_FRAMES_ROWS; ++i) {
            for(let j = 0; j < PLAYER_FRAMES_COLS; ++j) {
                const x = (j * PLAYER_FRAME_WIDTH ) + (FRAME_GAP_X * j);
                const y = (i * PLAYER_FRAME_HEIGHT) + (FRAME_GAP_Y * i);

                const rect    = new PIXI.Rectangle(x, y, PLAYER_FRAME_WIDTH, PLAYER_FRAME_HEIGHT);
                const texture = new PIXI.Texture(base_texture, rect);

                this.textures.push(texture);
            }
        }

        if(this.bg) {
            this.SetStandFrame();
        }
    }

    SetWalkFrame(index)
    {
    }

    SetFallFrame()
    {
    }

    SetStandFrame()
    {
    }
}
