
function RGB(r, g, b )
{
    // @XXX(stdmatt): Is this the bitwise in javascript???
    let rr = r << 16 >>> 0;
    let gg = g <<  8 >>> 0;
    let bb = b <<  0 >>> 0;
    let ss = (rr | gg | bb) >>> 0;

    return ss;
}


const MENU_BACKGROUND_TEXTURE_NAME = "res/textures/test.png";
const CLOUD_BACKGROUND_TEXTURES_NAMES = [
    "res/textures/background/cloudLayerB1.png",
    "res/textures/background/cloudLayer1.png",
    "res/textures/background/hills.png",

]
const BACKGROUND_LAYER_0 = "res/textures/background/hills.png";


class ParalaxLayer
    extends PIXI.Container
{
    constructor(texture, fill_width)
    {
        super();

        this.sprites = [];

        const sprite =  new PIXI.Sprite(texture)
        this.addChild(sprite);
        this.sprites.push(sprite);

        let total_width = this.sprites[0].width;
        do {
            const sprite = new PIXI.Sprite(texture);
            sprite.x = total_width;
            total_width += sprite.width;

            this.addChild(sprite);
            this.sprites.push(sprite);
        } while(total_width < fill_width);
    }

    MoveParalax(speed, factor)
    {
        for(let i = this.sprites.length -1; i >= 0; --i) {
            const sprite = this.sprites[i];
            sprite.x += speed * factor;

            if(sprite.x + sprite.width < 0) {
                Array_PopFront(this.sprites);
                sprite.x = Array_GetBack(this.sprites).x + sprite.width;
                Array_PushBack(this.sprites, sprite);
            }
        }
    }
}


MENU_SCENE_PARALAX_SPEED = 50;

class MenuScene
    extends Base_Scene
{
    constructor()
    {
        super();
        //
        // Sky Layers...
        //
        this.background_layers = [];
        for(let i = 0; i < CLOUD_BACKGROUND_TEXTURES_NAMES.length; ++i) {
            const texture_name = CLOUD_BACKGROUND_TEXTURES_NAMES[i];
            const layer        = new ParalaxLayer(Texture_Get(texture_name, GAME_DESIGN_WIDTH));

            const prev_layer = (i == 0) ? null : this.background_layers[i-1];
            if(prev_layer) {
                layer.y = prev_layer.y + prev_layer.height * 0.7 - layer.height;
            } else {
                layer.y = GAME_DESIGN_HEIGHT - layer.height - 120;
            }
            this.background_layers.push(layer);
        }
        for(let i = this.background_layers.length -1; i >= 0; --i) {
            this.addChild(this.background_layers[i]);
        }
        //
        // Foreground Layer
        //
        const foreground = Sprite_Create(MENU_BACKGROUND_TEXTURE_NAME);
        foreground.y = GAME_DESIGN_HEIGHT - foreground.height;
        this.addChild(foreground);

        //
        // Buttons
        //
        this._CreateButtons();
    } // ctor

    Update(dt)
    {
        const speed = -(MENU_SCENE_PARALAX_SPEED * dt);
        for(let i = 0; i < this.background_layers.length; ++i) {
            const layer  = this.background_layers[i];
            const factor =  1 - (i / this.background_layers.length);
            layer.MoveParalax(speed, factor);
        }
    }
    OnEnter()
    {
        super.OnEnter();

        // this.play_button   .OnClick = this.GoPlay;
        // this.credits_button.OnClick = this.GoCredits;
        // this.sound_button  .OnClick = this.ToggleSound;
        // this.leaders_button.OnClick = this.GoLeaderboards;
        // this.more_button   .OnClick = this.GoMore;
    }


    _CreateButtons()
    {

        const BUTTON_BIG_WIDTH   = (GAME_DESIGN_WIDTH * 0.5);
        const BUTTON_GAP         = 10;
        const BUTTON_SMALL_WIDTH = BUTTON_BIG_WIDTH / 3 - BUTTON_GAP;
        const BUTTON_HEIGHT      = BUTTON_SMALL_WIDTH;

        const NINE_SLICE_SETTINGS = {
            left_width:    3,
            top_height:    3,
            right_width:   3,
            bottom_height: 5
        };
        const BIG_BUTTON_SIZE_SETTINGS = {
            width:  BUTTON_BIG_WIDTH,
            height: BUTTON_HEIGHT
        };
        const SMALL_BUTTON_SIZE_SETTINGS = {
            width:  BUTTON_SMALL_WIDTH,
            height: BUTTON_HEIGHT
        };
        const GREEN_TEXTURE_SETINGS = {
            normal:  Texture_Get(BUTTONS_TEXTURES_NAMES[0]),
            pressed: Texture_Get(BUTTONS_TEXTURES_NAMES[1]),
        };
        const ORANGE_TEXTURE_SETINGS = {
            normal:  Texture_Get(BUTTONS_TEXTURES_NAMES[2]),
            pressed: Texture_Get(BUTTONS_TEXTURES_NAMES[3]),
        };
        const YELLOW_TEXTURE_SETINGS = {
            normal:  Texture_Get(BUTTONS_TEXTURES_NAMES[4]),
            pressed: Texture_Get(BUTTONS_TEXTURES_NAMES[5]),
        };
        const BLUE_TEXTURE_SETINGS = {
            normal:  Texture_Get(BUTTONS_TEXTURES_NAMES[6]),
            pressed: Texture_Get(BUTTONS_TEXTURES_NAMES[7]),
        };

        // Play.
        this.play_button = new NineSliceButton(
            GREEN_TEXTURE_SETINGS,
            NINE_SLICE_SETTINGS,
            BIG_BUTTON_SIZE_SETTINGS
        );

        this.play_button.x = GAME_DESIGN_WIDTH  * 0.5;
        this.play_button.y = GAME_DESIGN_HEIGHT * 0.4;
        this.addChild(this.play_button);
        Update_Anchor(this.play_button, 0.5);

        // Credits
        this.credits_button = new NineSliceButton(
            BLUE_TEXTURE_SETINGS,
            NINE_SLICE_SETTINGS,
            BIG_BUTTON_SIZE_SETTINGS
        );
        this.credits_button.x = GAME_DESIGN_WIDTH  * 0.5;
        this.credits_button.y = this.play_button.y + BUTTON_HEIGHT + BUTTON_GAP;
        this.addChild(this.credits_button);
        Update_Anchor(this.credits_button, 0.5);

        // Sound - Left.
        this.sound_button = new NineSliceButton(
            YELLOW_TEXTURE_SETINGS,
            NINE_SLICE_SETTINGS,
            SMALL_BUTTON_SIZE_SETTINGS
        );
        this.sound_button.x = this.play_button.x - (BUTTON_BIG_WIDTH * 0.5) + (BUTTON_SMALL_WIDTH * 0.5);
        this.sound_button.y = this.credits_button.y + BUTTON_HEIGHT + BUTTON_GAP;
        this.addChild(this.sound_button);
        Update_Anchor(this.sound_button, 0.5);

        // Leaderboards - Center.
        this.leaders_button = new NineSliceButton(
            ORANGE_TEXTURE_SETINGS,
            NINE_SLICE_SETTINGS,
            SMALL_BUTTON_SIZE_SETTINGS
        );
        this.leaders_button.x = this.play_button.x;
        this.leaders_button.y = this.credits_button.y + BUTTON_HEIGHT + BUTTON_GAP;
        this.addChild(this.leaders_button);
        Update_Anchor(this.leaders_button, 0.5);

        // More - Right.
        this.more_button = new NineSliceButton(
            GREEN_TEXTURE_SETINGS,
            NINE_SLICE_SETTINGS,
            SMALL_BUTTON_SIZE_SETTINGS
        );
        this.more_button.x = this.play_button.x + (BUTTON_BIG_WIDTH * 0.5) - (BUTTON_SMALL_WIDTH * 0.5);
        this.more_button.y = this.credits_button.y + BUTTON_HEIGHT + BUTTON_GAP;
        this.addChild(this.more_button);
        Update_Anchor(this.more_button, 0.5);
    }

    GoPlay()
    {
        SCENE_MANAGER.SetScene(new GameScene());
    }

    GoCredits()
    {
        SCENE_MANAGER.SetScene(new CreditsScene());
    }

    ToggleSound()
    {
    }

    GoLeaderboards()
    {
        SCENE_MANAGER.SetScene(new LeaderboardsScene());
    }

    GoMore()
    {
        SCENE_MANAGER.SetScene(new MoreScene());
    }



} // class MenuScene
