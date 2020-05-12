//----------------------------------------------------------------------------//
// Private Vars                                                               //
//----------------------------------------------------------------------------//
const _game_settings_dict = {};


//----------------------------------------------------------------------------//
// Public Functions                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function GameSettings_Init()
{
    // @TODO(stdmatt): Load from storage
}

//------------------------------------------------------------------------------
function GameSettings_Set(key, value)
{
    // @TODO(stdmatt): Save to Storage
    _game_settings_dict[key] = value;
}

//------------------------------------------------------------------------------
function GameSettings_Get(key, default_value)
{
    if(key in _game_settings_dict) {
        return _game_settings_dict[key];
    }
    return default_value;
}
