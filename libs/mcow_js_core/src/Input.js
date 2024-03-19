//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Input.js                                                      //
//  Project   : mcow_js_core                                                  //
//  Date      : Feb 28, 2020                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2020                                                  //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//


//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const KEY_ARROW_LEFT  = 37;
const KEY_ARROW_UP    = 38;
const KEY_ARROW_RIGHT = 39;
const KEY_ARROW_DOWN  = 40;
//------------------------------------------------------------------------------
const KEY_BACKSPACE = 8;
const KEY_ESC       = 27;
const KEY_SPACE     = 32;
const KEY_ENTER     = 13;
//------------------------------------------------------------------------------
const KEY_0 = 48;
const KEY_1 = 49;
const KEY_2 = 50;
const KEY_3 = 51;
const KEY_4 = 52;
const KEY_5 = 53;
const KEY_6 = 54;
const KEY_7 = 55;
const KEY_8 = 56;
const KEY_9 = 57;
//------------------------------------------------------------------------------
const KEY_A = 65;
const KEY_B = 66;
const KEY_C = 67;
const KEY_D = 68;
const KEY_E = 69;
const KEY_F = 70;
const KEY_G = 71;
const KEY_H = 72;
const KEY_I = 73;
const KEY_J = 74;
const KEY_K = 75;
const KEY_L = 76;
const KEY_M = 77;
const KEY_N = 78;
const KEY_O = 79;
const KEY_P = 80;

//------------------------------------------------------------------------------
const MOUSE_BUTTON_INDEX_LEFT  = 0;
const MOUSE_BUTTON_INDEX_RIGHT = 2;


//----------------------------------------------------------------------------//
// Globals                                                                    //
//----------------------------------------------------------------------------//
let Mouse_X = 0;
let Mouse_Y = 0;
let Mouse_IsClicked      = false;
let Mouse_IsRightClicked = false;
let Mouse_IsDown         = false;
let Mouse_WheelY         = 0;

let Keyboard = [];

// @bug(stdmatt): Mouse_IsClicked never gets false after the mouse clicks
// first time. We need to find a way to make sure that the click remains
// only for the frame.

//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Input_InstallBasicMouseHandler(htmlElement)
{
    if(Utils_IsNullOrUndefined(htmlElement)) {
        htmlElement = window;
    }

    // Move
    htmlElement.addEventListener("mousemove", function(e) {
        var r = htmlElement.getBoundingClientRect();
        Mouse_X = (e.clientX - r.left) / (r.right  - r.left) * htmlElement.width;
        Mouse_Y = (e.clientY - r.top ) / (r.bottom - r.top ) * htmlElement.height;

        if(typeof(OnMouseMove) == "function") {
            OnMouseMove();
        }
    }, false);


    // Left Mouse Click
    htmlElement.addEventListener("click", event => {
        Mouse_IsClicked = true;
        if(typeof(OnMouseClick) == "function") {
            OnMouseClick();
        }
    });

    // Right Mouse Click
    htmlElement.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        Mouse_IsRightClicked = true;
        if(typeof(OnMouseRightClick) == "function") {
            OnMouseRightClick();
        }
    }, false);

    // Mouse Down
    htmlElement.addEventListener("mousedown", event => {
        Mouse_IsDown = true;
        if(typeof(OnMouseDown) == "function") {
            OnMouseDown();
        }
    });

    // Mouse Up
    htmlElement.addEventListener("mouseup", event => {
        Mouse_IsDown = false;
        if(typeof(OnMouseUp) == "function") {
            OnMouseUp();
        }
     });

     // Mouse Whell
     htmlElement.addEventListener("wheel", event => {
        // Mouse_WheelX += event.wheelDeltaX;
        Mouse_WheelY += event.wheelDeltaY;
        if(typeof(OnMouseWheel) == "function") {
            OnMouseWheel(event.wheelDeltaX, event.wheelDeltaY);
        }
     });
}

//------------------------------------------------------------------------------
function Input_InstallBasicKeyboardHandler(htmlElement)
{
    if(Utils_IsNullOrUndefined(htmlElement)) {
        htmlElement = window;
    }

    // Keydown.
    htmlElement.addEventListener('keydown', (event) => {
        Keyboard[event.keyCode] = true;
        if(typeof(OnKeyDown) == "function") {
            OnKeyDown(event);
        }
    });

    // Keyup.
    htmlElement.addEventListener('keyup', (event) => {
        Keyboard[event.keyCode] = false;
        if(typeof(OnKeyUp) == "function") {
            OnKeyUp(event);
        }
    });
}
