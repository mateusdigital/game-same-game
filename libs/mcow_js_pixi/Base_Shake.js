//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : Base_Shake.js                                                 //
//  Project   : minesweeper                                                   //
//  Date      : Sep 02, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// Shake                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class Base_Shake
{
    //--------------------------------------------------------------------------
    constructor(duration, frequency)
    {
        this.currTime  = 0;
        this.maxTime   = duration;

        this.t         = 0;
        this.frequency = frequency;

        let sampleCount = (this.maxTime) * frequency;
        this.samples = [];

        for(let i = 0; i < sampleCount; ++i) {
            this.samples.push(Math.random() * 2 - 1);
        }

        this.isDone  = false;
        this.started = false;
    } // ctor

    //--------------------------------------------------------------------------
    Start()
    {
        this.currTime  = 0;
        this.t         = 0;
        this.isDone    = false;
        this.started   = true;
    } // reset

    //--------------------------------------------------------------------------
    Update(dt)
    {
        if(!this.started || this.isDone) {
            return;
        }

        this.currTime += dt;
        if(this.currTime > this.maxTime) {
            this.t       = 1.0;
            this.isDone  = true;
            this.started = false;
        }

        this.t = this.currTime / this.maxTime;
    } // Update

    //--------------------------------------------------------------------------
    value()
    {
        if(!this.started || this.isDone) {
            return 0;
        }

        let s = this.t * this.frequency;
        let s0 = Math.floor(s);
        let s1 = s0 + 1;

        let k = (this.maxTime - this.currTime) / this.maxTime;
        return (this.noise(s0) + (s - s0)*(this.noise(s1) - this.noise(s0))) * k;
    } // value

    //--------------------------------------------------------------------------
    noise(s)
    {
        if(s >= this.samples.length) return 0;
        return this.samples[s];
    } // noise
}; // class Shake
