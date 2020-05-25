//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const LEADERBOARD_URL       = "localhost";
const LEADERBOARD_PORT      = 5000;
const LEADERBOARD_END_POINT = "leaderboards"


//----------------------------------------------------------------------------//
// Private Vars                                                               //
//----------------------------------------------------------------------------//
let _leaderboard_url  = null;
let _curr_leaderboard = null;
let _already_updating = false;


//----------------------------------------------------------------------------//
// Public Functions                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function LeaderboardsUtils_Init()
{
    _leaderboard_url = String_Cat(
        "http://", LEADERBOARD_URL,
        ":",       LEADERBOARD_PORT,
        "/",       LEADERBOARD_END_POINT
    );

    LeaderboardsUtils_FetchFromServer();
}

//------------------------------------------------------------------------------
function LeaderboardsUtils_FetchFromServer(callback, errorCallback)
{
    if(_already_updating) {
        return;
    }

    _already_updating = true;
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        _already_updating = false;
        if(http.readyState === XMLHttpRequest.DONE) {
            const status = http.status;
            if (status == 200) {
                _curr_leaderboard = JSON.parse(http.responseText);
                if(callback) {
                    callback();
                }
            } else {
                if(errorCallback) {
                    errorCallback();
                }
            }
        }
    }

    http.open("GET", _leaderboard_url);
    http.send();
}

//------------------------------------------------------------------------------
function LeaderboardsUtils_GetData()
{
    return _curr_leaderboard;
}

//------------------------------------------------------------------------------
function LeaderboardsUtils_IsOnLeaderboard(score)
{
    if(!_curr_leaderboard) {
        return false;
    }
    const last_entry = Array_GetBack(_leaderboard_url);
    if(last_entry.score >= score) {
        return false;
    }

    return true;
}
