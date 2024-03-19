//----------------------------------------------------------------------------//
// Base_BMPText                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class Base_BMPText
    extends PIXI.BitmapText
{
    //--------------------------------------------------------------------------
    constructor(str, family, size, fill = 0xFFffFF, weight = "normal", spacing = 0)
    {
        const name = String_Cat(size, "px", " ", family);
        console.log(name);
        super(str.toString(), {font: name});
        this.tint = fill;
    } // ctor
}; // class Base_BMPText
