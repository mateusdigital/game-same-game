const BUTTON_BIG_WIDTH   = (GAME_DESIGN_WIDTH * 0.5);
const BUTTON_GAP         = 10;
const BUTTON_SMALL_WIDTH = BUTTON_BIG_WIDTH / 3 - BUTTON_GAP;
const BUTTON_HEIGHT      = BUTTON_SMALL_WIDTH;

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


//
// Textures Settings
//
const GREEN_TEXTURE_SETTINGS = {
    normal: BUTTONS_TEXTURES_NAMES[0],
    press:  BUTTONS_TEXTURES_NAMES[1],
};
const ORANGE_TEXTURE_SETTINGS = {
    normal: BUTTONS_TEXTURES_NAMES[2],
    press:  BUTTONS_TEXTURES_NAMES[3],
};
const YELLOW_TEXTURE_SETTINGS = {
    normal: BUTTONS_TEXTURES_NAMES[4],
    press:  BUTTONS_TEXTURES_NAMES[5],
};
const BLUE_TEXTURE_SETTINGS = {
    normal: BUTTONS_TEXTURES_NAMES[6],
    press:  BUTTONS_TEXTURES_NAMES[7],
};

//
// Position Settings
//
const PLAY_BUTTON_WITH_SCORES_Y = GAME_DESIGN_HEIGHT * 0.4;
const PLAY_BUTTON_NO_SCORES_Y   = GAME_DESIGN_HEIGHT * 0.4;
