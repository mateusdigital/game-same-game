//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
class CreditsScene
    extends AnimatedScene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        // Button
        this.back_button = CreateBackButton(()=>{
            this.RunOnExit(new MenuScene());
        });
        this.addChild(this.back_button);

        //
        // Msgs
        this._StartAnimation();
    } // CTOR

    //--------------------------------------------------------------------------
    _StartAnimation()
    {
        const big_font   = 40;
        const med_font   = 25;
        const small_font = 25;
        const gap        = 35;

        const header = TEXT_COLOR_WHITE_LIGHT;
        const sub    = TEXT_COLOR_YELLOW;

        const msgs = [
            [
                { text: "This little game", font: big_font, gap: 0, color: header },
                { text: "was made with",    font: big_font, gap: 0, color: header },
                { text: "a lot of love!",   font: big_font, gap: 40, color: header },
            ],

            [
                { text: "It was made in 2020 while ",   font: med_font,   gap: 0,  color: header },
                { text: "I was in Belarus",             font: med_font,   gap: 0,  color: header },
                { text: "during the covid-19 pandemic", font: med_font,   gap: 0, color: header },
                { text: "and finished in 2024",         font: med_font,   gap: 0,  color: header },
                { text: "while I'm in Brasil!",         font: med_font,   gap: 40,  color: header },
            ],

            [
                { text: "With all my love",              font: small_font * 0.9, gap: 10, color: TEXT_COLOR_ORANGE},
                { text: "to Marla",                      font: big_font,         gap: 0,  color: header},
                { text: "Maezinha e Pingo",              font: big_font,         gap: 10,   color: header },

                { text: "Saudade nunca se vai, apenas",  font: small_font,       gap: 0,   color: sub    },
                { text: "aprendemos a conviver com ela", font: small_font,       gap: 40, color: sub    },
            ],

            [
                { text: "mateus.digital 2024",           font: big_font  , color: TEXT_COLOR_WHITE_DARK},
                { text: "gplv3 - hack, share it", font: small_font, color: TEXT_COLOR_WHITE_DARK, gap: 100}
            ],

            [
                { text: "Check here info about licenses!!", font: small_font, color: TEXT_COLOR_BLUE, is_link: true},
            ],
        ];

        let y = this.back_button.y + this.back_button.height * 1 * this.back_button.scale.x + 20;
        let curr_font_size = 0;

        for(let i = 0; i < msgs.length; ++i) {
            for(let j = 0; j < msgs[i].length; ++j) {
                const item   = msgs[i][j];
                const msg    = item.text;
                let   _gap   = 2;
                let   _color = 0xFFFFFF;

                if(item.font) {
                    curr_font_size = item.font;
                }
                if(item.gap) {
                   _gap += item.gap;
                }
                if(item.color) {
                    _color = item.color;
                }

                const text = new Text(msg, curr_font_size, _color);

                Update_Anchor(text, 0.5, 0);
                text.position.x = CONTAINER_DESIGN_WIDTH * 0.5;
                text.position.y = y;
                text.tint       = _color;

                y += (text.height + _gap);
                Add_To_Parent(this, text);

                // This is the copy right button
                if(item.is_link) {
                    text.interactive = true;
                    text.buttonMode  = true;
                    text.on("pointerdown", ()=>{
                        const win = window.open("./thanks_to.html", '_blank');
                        win.focus();
                    });
                }
            }

            y += 22;
        }
    }

} // class CreditsScene
