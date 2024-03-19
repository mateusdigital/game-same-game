//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Timer.js                                                      //
//  Project   : vector_typers                                                 //
//  Date      : Sep 01, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Timer                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class Base_Timer
{
    constructor(duration)
    {
        this.current  = 0;
        this.duration = duration;
        this.ratio    = 0;

        this.started = false;
        this.isDone  = false;
    } // ctor

    Start()
    {
        this.current = 0;
        this.ratio   = 0;

        this.started = true;
        this.isDone  = false;
    } // Update

    Update(dt)
    {
        if(!this.started || this.isDone) {
            return;
        }

        this.current += dt;
        if(this.current >= this.duration) {
            this.current = this.duration;
            this.isDone  = true;
        }

        this.ratio = this.current / this.duration;
    } // Update

}; // class Timer
