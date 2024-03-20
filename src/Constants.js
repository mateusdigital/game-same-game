//----------------------------------------------------------------------------//
// Others                                                                     //
//----------------------------------------------------------------------------//
const GAME_DEBUG = true;

//----------------------------------------------------------------------------//
// Random                                                                     //
//----------------------------------------------------------------------------//
const GAME_SEED = (GAME_DEBUG) ? 4 : null;

//----------------------------------------------------------------------------//
// Animation / Timing                                                         //
//----------------------------------------------------------------------------//
const ANIMATION_SPEED_MULTIPLIER = 1;

//----------------------------------------------------------------------------//
// Game Settings                                                              //
//----------------------------------------------------------------------------//
const SETTINGS_KEY_HAS_SCORE     = "menu_scene_has_scores";
const SETTINGS_KEY_SOUND_ENABLED = "sound_enabled";
const SETTINGS_KEY_BEST_SCORE    = "best_score";
const SETTINGS_KEY_LAST_SCORE    = "last_score";

//----------------------------------------------------------------------------//
// MUSIC                                                                      //
//----------------------------------------------------------------------------//
const MUSIC_BACKGROUND = "res/audio/life-of-riley-by-kevin-macleod-from-filmmusic-io.mp3";
const SOUND_BUTTONS = [
  "res/audio/MI_SFX 10.wav",
  "res/audio/MI_SFX 29.wav",
  "res/audio/MI_SFX 30.wav",
  "res/audio/MI_SFX 32.wav",
]

const MUSIC_TO_LOAD = [
  MUSIC_BACKGROUND
]

const SOUNDS_TO_LOAD = SOUND_BUTTONS;