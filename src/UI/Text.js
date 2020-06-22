class Text
    extends Base_BMPText
{
    constructor(str, size)
    {
        let best_font_def = null;
        let best_size     = null;
        for(let i = 0; i < FONT_DEFS.length; ++i) {
            const font_def = FONT_DEFS[i];
            const curr_size = font_def.size;
            const diff_size = Math_Abs(curr_size - size);

            if(!best_font_def || diff_size < best_size) {

                best_size     = diff_size;
                best_font_def = font_def;

                console.log("Size:", size, "Diff:", diff_size, best_font_def.size, best_font_def.family)
            }
        }
        super(str.toLowerCase(), best_font_def.family, best_font_def.size);
    }
}
