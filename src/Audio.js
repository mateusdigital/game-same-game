//----------------------------------------------------------------------------//
//                       __      __                  __   __                  //
//               .-----.|  |_.--|  |.--------.---.-.|  |_|  |_                //
//               |__ --||   _|  _  ||        |  _  ||   _|   _|               //
//               |_____||____|_____||__|__|__|___._||____|____|               //
//                                                                            //
//  File      : AudioPlayer.js                                                //
//  Project   : columns                                                       //
//  Date      : Nov 05, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

const EFFECT_VOLUME = 20;

//----------------------------------------------------------------------------//
// Audio Player                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class AudioPlayer
{
    //--------------------------------------------------------------------------
    constructor()
    {
        this.loaded  = false;
        this.enabled = false;
        this.isMuted = false;

        this.sounds     = [];

        this.soundName  = null;
        this.effectName = null;

        this.preloadCount = 0;
    } // ctor

    //--------------------------------------------------------------------------
    PreloadSounds(loadCallback, ...args)
    {
        const sounds_to_preload = pw_Array_MakeFlat(args);
        this.preloadCount += sounds_to_preload.length;
        this.loaded        = false;

        for(let i = 0; i < sounds_to_preload.length; ++i) {
            const name = sounds_to_preload[i];

            PIXI.sound.Sound.from({
                url     : name,
                preload : true,
                loaded  : (err, sound) => {
                    if(err != null) {
                        debugger;
                    }
                    this.sounds[name] = sound;
                    if(--this.preloadCount == 0) {
                        this.loaded = true;
                        loadCallback();
                    }
                }
            });
        }
    } // PreloadSounds

    //--------------------------------------------------------------------------
    PlayEffect(name)
    {
        const playing_effect = this.sounds[this.effectName];
        if(playing_effect) {
            playing_effect.stop();
        }


        const effect_to_play = this.sounds[name];
        if(!effect_to_play) {
            dlog("[ERROR] AudioPlayer - Failed to play effect", name);
            return;
        }

        this.effectName = name;
        effect_to_play.volume = EFFECT_VOLUME
        effect_to_play.play(()=>{
            this.effectName = null;
        });
    } // PlayEffect

    //--------------------------------------------------------------------------
    Play(name, restartIfPlaying)
    {
        const sound_to_play = this.sounds[name];
        if(!sound_to_play) {
            dlog("[ERROR] AudioPlayer - Failed to play music", name);
            return;
        }

        const playing_sound = this.sounds[this.soundName];
        const end_callback  = ()=>{
            this.Play(name, true);
        }

        if(this.soundName != name) {
            if(playing_sound) {
                playing_sound.stop();
            }
            sound_to_play.play(end_callback);
        } else if(restartIfPlaying) {
            playing_sound.stop();
            sound_to_play.play(end_callback);
        }

        this.soundName = name;
    } // Play

    //--------------------------------------------------------------------------
    SetSpeed(speed)
    {
        console.log("-------", speed);
        const playing_sound = this.sounds[this.soundName];
        if(playing_sound) {
            playing_sound.speed = speed;
        }
    }

    //--------------------------------------------------------------------------
    ToggleMute()
    {
        this.isMuted = !this.isMuted;
        PIXI.sound.toggleMuteAll();
    } // ToggleMute


    //--------------------------------------------------------------------------
    PlayRandomButtonEffect()
    {
        const value = Random_Element(SOUND_BUTTONS);
        this.PlayEffect(value);
    }

} // AudioPlayer


const AUDIO_MANAGER = new AudioPlayer();
