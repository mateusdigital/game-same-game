//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Window.js                                                     //
//  Project   : mcow_js_core                                                  //
//  Date      : Mar 14, 2020                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2020                                                  //
//                                                                            //
//  Description :                                                             //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const _WINDOW_RESIZE_TIMEOUT_DURATION = 250;


//----------------------------------------------------------------------------//
// Variables                                                                  //
//----------------------------------------------------------------------------//
let _Window_ResizeHandlers          = new Set();
let _Window_ResizeTimeoutId         = null;
let _Window_ResizeCallbackInstalled = false;


//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Window_AddResizeHandler(handler)
{
    if(!_Window_ResizeCallbackInstalled) {
       // @todo(stdmatt): Check why with addEventListener the events are not
       // getting propagated...
       // window.addEventListener("resize",
        window.onresize = ()=>{
            clearTimeout(_Window_ResizeTimeoutId);
            _Window_ResizeTimeoutId = setTimeout(()=>{
                for(let curr_handler of _Window_ResizeHandlers) {
                    if(typeof(curr_handler) == "function") {
                        curr_handler();
                    } else {
                        curr_handler.OnWindowResize();
                    }
                }
            }, _WINDOW_RESIZE_TIMEOUT_DURATION);
        }
        _Window_ResizeCallbackInstalled = true;
    }

    _Window_ResizeHandlers.add(handler);
}

//------------------------------------------------------------------------------
function Window_RemoveResizeHandler(handler)
{
    _Window_ResizeHandlers.delete(handler);
}
