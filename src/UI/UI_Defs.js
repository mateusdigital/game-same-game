//----------------------------------------------------------------------------//
// Game Size / Resolution                                                     //
//----------------------------------------------------------------------------//
const TILE_COUNT_X       = 20;
const TILE_COUNT_Y       = 35;
const TILE_WIDTH         = 31;
const TILE_HEIGHT        = 31;
const GAME_DESIGN_WIDTH  = TILE_WIDTH  * TILE_COUNT_X;
const GAME_DESIGN_HEIGHT = TILE_HEIGHT * TILE_COUNT_Y;

const SCORE_HUD_DIGITS_COUNT = 8;


//----------------------------------------------------------------------------//
// Fonts                                                                      //
//----------------------------------------------------------------------------//
const BIG_FONT_DEF    = { size : 80, family: "big_font"    };
const MEDIUM_FONT_DEF = { size : 50, family: "medium_font" };
const SMALL_FONT_DEF  = { size : 30, family: "small_font"  };

const FONT_DEFS = [
    BIG_FONT_DEF,
    MEDIUM_FONT_DEF,
    SMALL_FONT_DEF
];

const FONT_FILE_NAMES = [
    "res/fonts/big_font.fnt",
    "res/fonts/medium_font.fnt",
    "res/fonts/small_font.fnt",
];

const TEXT_COLOR_WHITE_DARK  = 0xE4E0CD;
const TEXT_COLOR_WHITE_LIGHT = 0xFFFCF0;
const TEXT_COLOR_YELLOW      = 0xFFDB49;
const TEXT_COLOR_BLUE        = 0x1EA7E1;
const TEXT_COLOR_ORGANGE     = 0xE86A17;
const TEXT_COLOR_GREEN       = 0x73CD4B;

const LEVEL_TEXT_COLORS = [
    TEXT_COLOR_YELLOW,
    TEXT_COLOR_BLUE,
    TEXT_COLOR_ORGANGE,
    TEXT_COLOR_GREEN
];


//----------------------------------------------------------------------------//
// Buttons                                                                    //
//----------------------------------------------------------------------------//
const BUTTON_BIG_WIDTH   = (GAME_DESIGN_WIDTH * 0.5);
const BUTTON_GAP         = 10;
const BUTTON_SMALL_WIDTH = BUTTON_BIG_WIDTH / 2 - BUTTON_GAP * 0.5;
const BUTTON_HEIGHT      = BUTTON_BIG_WIDTH / 3 - BUTTON_GAP;
const BUTTON_BACK_WIDTH  = BUTTON_HEIGHT;


//
// Nine Slice Settings
//
const NINE_SLICE_SETTINGS = {
    left_width:    3,
    top_height:    3,
    right_width:   3,
    bottom_height: 5
};

//
// Size Settings
//
const BIG_BUTTON_SIZE_SETTINGS = {
    width:  BUTTON_BIG_WIDTH,
    height: BUTTON_HEIGHT
};
const SMALL_BUTTON_SIZE_SETTINGS = {
    width:  BUTTON_SMALL_WIDTH,
    height: BUTTON_HEIGHT
};
const BACK_BUTTON_SIZE_SETTINGS = {
    width:  BUTTON_BACK_WIDTH,
    height: BUTTON_HEIGHT
};

//
// Textures Settings
//
const GREEN_TEXTURE_SETTINGS = {
    normal: BUTTONS_BOX_GREEN,
    press:  BUTTONS_BOX_GREEN_PRESSED
};
const ORANGE_TEXTURE_SETTINGS = {
    normal: BUTTONS_BOX_RED,
    press:  BUTTONS_BOX_RED_PRESSED
};
const YELLOW_TEXTURE_SETTINGS = {
    normal: BUTTONS_BOX_YELLOW,
    press:  BUTTONS_BOX_YELLOW_PRESSED
};
const BLUE_TEXTURE_SETTINGS = {
    normal: BUTTONS_BOX_BLUE,
    press:  BUTTONS_BOX_BLUE_PRESSED
};

//
// Position Settings
//
const PLAY_BUTTON_WITH_SCORES_Y = GAME_DESIGN_HEIGHT * 0.47;
const PLAY_BUTTON_NO_SCORES_Y   = GAME_DESIGN_HEIGHT * 0.42;
