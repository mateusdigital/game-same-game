//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : Input.js                                                      //
//  Project   : columns                                                       //
//  Date      : Sep 25, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//



//----------------------------------------------------------------------------//
// Private Vars                                                               //
//----------------------------------------------------------------------------//
let __PrevKeyboard = [];
let __Keyboard     = [];

let _Keyboard_Listeners           = []; // Objects that have OnKeyUp / OnKeyDown
let _Keyboard_Listeners_Callbacks = []; // Functions with signature of (code, isDown)


//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Install_MouseHandlers()
{
    g_App.stage.on("mousemove", (e)=>{
        if(typeof(MouseMove) == "function") {
            MouseMove(e.data);
        }
    });

    g_App.stage.on("pointerdown", (e)=>{
        if(e.data.button == MOUSE_BUTTON_INDEX_LEFT) {
            if(typeof(MouseClick) == "function") {
                MouseClick(e.data);
            }
        } else {
            if(typeof(MouseRightClick) == "function") {
                MouseRightClick(e.data);
            }
        }
    });

    g_App.view.addEventListener('contextmenu', (e) => {
        e.preventDefault();
  	});
}

//------------------------------------------------------------------------------
function Install_KeyboardHandlers()
{
    window.addEventListener(
        "keydown",
        (e) => {
            // e.preventDefault();
            __PrevKeyboard[e.keyCode] = __Keyboard[e.keyCode];
            __Keyboard    [e.keyCode] = true;

            if(typeof(KeyboardDown) == "function") {
                KeyboardDown(e);
            }

            for(let i = 0; i < _Keyboard_Listeners.length; ++i) {
                _Keyboard_Listeners[i].OnKeyDown(e.keyCode);
            }
            for(let i = 0; i < _Keyboard_Listeners_Callbacks.length; ++i) {
                _Keyboard_Listeners_Callbacks[i](e.keyCode, true);
            }
        },
        false
    );

    window.addEventListener(
        "keyup",
        (e) => {
            // e.preventDefault();
            __PrevKeyboard[e.keyCode] = __Keyboard[e.keyCode];
            __Keyboard    [e.keyCode] = false;

            if(typeof(KeyboardUp) == "function") {
                KeyboardUp(e);
            }

            for(let i = 0; i < _Keyboard_Listeners.length; ++i) {
                _Keyboard_Listeners[i].OnKeyUp(e.keyCode);
            }
            for(let i = 0; i < _Keyboard_Listeners_Callbacks.length; ++i) {
                _Keyboard_Listeners_Callbacks[i](e.keyCode, false);
            }
        },
        false
    );
}

//------------------------------------------------------------------------------
function Input_AddKeyboardListener(listener)
{
    _Keyboard_Listeners.push(listener);
}

//------------------------------------------------------------------------------
function Input_RemoveKeyboardListener(listener)
{
    Array_RemoveIf(_Keyboard_Listeners, (l)=>{
        return l == listener;
    })
}

// @XXX(stdmatt): Find a way to reliable remove from the list...
function Input_AddKeyboardListenerCallback(callback)
{
    _Keyboard_Listeners_Callbacks.push(callback);
}

//------------------------------------------------------------------------------
function Input_Update()
{
    // @XXX(stdmatt): Cheesy... how to make the events based input
    // be available all the frames????
    for(let i = 0; i < __Keyboard.length; ++i) {
        __PrevKeyboard[i] = __Keyboard[i];
    }
}

//------------------------------------------------------------------------------
function IsKeyDown(keyCode)
{
    return __Keyboard[keyCode] == true;
}

//------------------------------------------------------------------------------
function IsKeyUp(keyCode)
{
    return __Keyboard[keyCode] == false;
}

//------------------------------------------------------------------------------
function IsKeyPress(...keyCodes)
{
    for(let i = 0; i < keyCodes.length; ++i) {
        const key_code = keyCodes[i];
        const pressed  = __Keyboard    [key_code] == true
                      && __PrevKeyboard[key_code] == false;
        if(pressed) {
            return true;
        }
    }

    return false;
}
