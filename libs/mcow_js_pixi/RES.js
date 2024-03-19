//----------------------------------------------------------------------------//
// Pixi Aliases                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const PIXI_LOADER     = PIXI.Loader.shared;;
const PIXI_LOADER_RES = PIXI.Loader.shared.resources;


//------------------------------------------------------------------------------
function RES_LoadResources(callback, ...args)
{
    let expanded_args = [];
    for(let i = 0; i < args.length; ++i) {
        const curr_arg = args[i];
        if(Array.isArray(curr_arg)) {
            expanded_args = expanded_args.concat(curr_arg);
        } else {
            expanded_args.push(curr_arg);
        }
    }

    PIXI_LOADER.add(expanded_args).load(callback);

    // PIXI_LOADER.onProgress.add((_, r) => {console.log(r.name, "onProgress" )});
    // PIXI_LOADER.onError   .add((_, r) => {console.log(r.name, "onError"    )});
    // PIXI_LOADER.onLoad    .add((_, r) => {console.log(r.name, "onLoad"     )});
    // PIXI_LOADER.onComplete.add((_, r) => {console.log(r.name, "onComplete" )});
}

//----------------------------------------------------------------------------//
// Textures                                                                   //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
let __Texture_Base_Path = "";

//------------------------------------------------------------------------------
function Texture_SetBasePath(path)
{
    __Texture_Base_Path = path;
}

//------------------------------------------------------------------------------
function Texture_Get(name)
{
    const resource = PIXI_LOADER_RES[name];
    if(!resource) {
        console.log("Can't find texture - Name:(", name, ")");
        debugger;
    }

    return resource.texture;
}

function Data_Get(name)
{
    const resource = PIXI_LOADER_RES[name];
    if(!resource) {
        console.log("Can't find data - Name:(", name, ")");
        debugger;
    }

    return resource.data;
}

//----------------------------------------------------------------------------//
// Fonts                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// @notice(stdmatt): Pretty sure that we can do better with:
//    https://pixijs.download/dev/docs/PIXI.loaders.Loader.html
async function
Font_Load(fontFace, path)
{
    let font_face = new FontFace(
        fontFace,
        "url(" + path + ")"
    );

    await font_face.load();
    document.fonts.add(font_face);
}


//----------------------------------------------------------------------------//
// Sprite                                                                     //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Sprite_Create(textureName)
{
    return new PIXI.Sprite(Texture_Get(textureName));
}

//------------------------------------------------------------------------------
function Sprite_White(width, height)
{
    const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    if(width && height) {
        sprite.width  = width;
        sprite.height = height;
    }

    return sprite;
}
