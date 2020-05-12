
const _game_settings_dict = {};
function GameSettings_Init()
{
}

function GameSettings_Set(key, value)
{
    _game_settings_dict[key] = value;
}

function GameSettings_Get(key, default_value)
{
    if(key in _game_settings_dict) {
        return _game_settings_dict[key];
    }
    return default_value;
}
