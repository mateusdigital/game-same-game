//----------------------------------------------------------------------------//
// Private Vars                                                               //
//----------------------------------------------------------------------------//
let _storage = null;


//----------------------------------------------------------------------------//
// Public Functions                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function GameSettings_Init()
{
    // @notice(stdmatt): Maybe in future we might want to put that in
    // the indexed db or some other way...
    _storage = localStorage;
    if(!_storage) {
        console.log("Can't store data on this browser...");
    }
}

//------------------------------------------------------------------------------
function GameSettings_Set(key, value)
{
    if(_storage) {
        _storage.setItem(key, value);
    }
}

//------------------------------------------------------------------------------
function GameSettings_Get(key, default_value)
{
    if(_storage) {
        const value = _storage.getItem(key);
        if(value) {
            switch(typeof(default_value)) {
                case "number":  return Number(value); break;
                case "boolean": return value == "true"; break;
            }
        }
        return default_value;
    }
}
