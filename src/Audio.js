class _Base_Audio_Data
{
    constructor(allow_parallel)
    {
        this.items            = {};
        this.finished_loading = false;
        this.allow_parallel   = false;

        this.playing_items = [];
    }
}
const AUDIO_TYPE_MUSIC  = "music";
const AUDIO_TYPE_EFFECT = "effect";

class Base_Audio
{
    constructor()
    {
        this.data = []
        this.data[AUDIO_TYPE_MUSIC]  =  new _Base_Audio_Data(false),
        this.data[AUDIO_TYPE_EFFECT] =  new _Base_Audio_Data(true )

    }

    // Preload
    _Preload(type, callback, filenames)
    {
        const data = this.data[type];
        data.finished_loading = false;

        RES_LoadResources((loader, resources) => {
            data.finished_loading = true;
            callback();
        }, filenames);
    }

    _Play(type, filename) {
        PIXI.sound.play(filename);
    }

    _Stop(type, filename)
    {
        const data = this.data[type];
        const instance = data.playing_items[filename];
    }



    PreloadMusic(cb, ...filenames) { this._Preload(AUDIO_TYPE_MUSIC, cb, filenames); }
    PlayMusic   (filename)     { this._Play   (AUDIO_TYPE_MUSIC, filename  ); }
    StopMusic   (filename)     { this._Stop   (AUDIO_TYPE_MUSIC, filename  ); }

    PreloadEffect(cb, ...filenames) { this._Preload(AUDIO_TYPE_EFFECT, cb, filenames); }
    PlayEffect   (filename)     { this._Play   (AUDIO_TYPE_EFFECT, filename  ); }
    StopEffect   (filename)     { this._Stop   (AUDIO_TYPE_EFFECT, filename  ); }
}

const AUDIO_MANAGER = new Base_Audio();
