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
        const big_font   = 45;
        const small_font = 28;
        const gap        = 20;


        const msgs = [
            [
                { text: "This little game", font: big_font, gap: 0, color: TEXT_COLOR_YELLOW },
                { text: "was made with",    font: big_font, gap: 0, color: TEXT_COLOR_YELLOW },
                { text: "a lot of love!",   font: big_font, gap: 5, color: TEXT_COLOR_YELLOW },

            ],

            [
                { text: "A big thanks to:", font: small_font * 0.8, gap: gap * 0.8, color: TEXT_COLOR_WHITE_LIGHT},

                { text: "Kenney",                   font: big_font,    gap: 0,   color: TEXT_COLOR_WHITE_LIGHT },
                { text: "for the amazing artwork",  font: small_font,  gap: gap, color: TEXT_COLOR_WHITE_DARK  },

                { text: "PIXIJS",                      font: big_font,    gap: 0,   color: TEXT_COLOR_WHITE_LIGHT },
                { text: "this framework is fantastic", font: small_font,  gap: gap, color: TEXT_COLOR_WHITE_DARK  },

                { text: "Sasha",                           font: big_font,    gap: 0,   color: TEXT_COLOR_WHITE_LIGHT },
                { text: "all the fun is on her balancing", font: small_font,  gap: gap, color: TEXT_COLOR_WHITE_DARK  },

                { text: "Maezinha e Pingo",              font: big_font,   gap: 0,   color: TEXT_COLOR_WHITE_LIGHT },
                { text: "Saudade nunca se vai, apenas",  font: small_font, gap: 0,   color: TEXT_COLOR_WHITE_DARK  },
                { text: "aprendemos a conviver com ela", font: small_font, gap: gap, color: TEXT_COLOR_WHITE_DARK  },
            ],

            [
                { text: "Dedicated to all",         font: big_font,   gap: 0,   color: TEXT_COLOR_YELLOW     },
                { text: "people that suffered",     font: big_font,   gap: 0,   color: TEXT_COLOR_YELLOW     },
                { text: "with covid-19",            font: big_font,   gap: 0,   color: TEXT_COLOR_YELLOW     },
                { text: "Feel strong, stay safe!",  font: small_font, gap: gap, color: TEXT_COLOR_WHITE_DARK },
            ],

            [
                { text: "STDMATT MMXX",           font: big_font  , color: TEXT_COLOR_WHITE_LIGHT  },
                { text: "gplv3 - hack, share it", font: small_font, color: TEXT_COLOR_WHITE_DARK }
            ]
        ];

        let y = this.back_button.y + this.back_button.height * 0.5 * this.back_button.scale.x;
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
            }

            y += 22;
        }
    }

} // class CreditsScene
