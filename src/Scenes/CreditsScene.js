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
        this.msgs = [];
        this._StartAnimation          ();
    } // CTOR


    //--------------------------------------------------------------------------
    OnFinishedEnterAnimation()
    {
        super.OnFinishedEnterAnimation();
    } // OnFinishedEnterAnimation


    //--------------------------------------------------------------------------
    _StartAnimation()
    {
        const big_font   = 45;
        const small_font = 28;
        const gap        = 20;

        const msgs = [
            [
                { text: "This little game", font: big_font },
                { text: "was made with",    font: big_font },
                { text: "a lot of love!",   font: big_font, gap: 5},

            ],

            [
                { text: "A big thanks to:", font: small_font * 0.8, gap: gap * 0.8 },

                { text: "Kenney",                   font: big_font              },
                { text: "for the amazing artwork",  font: small_font,  gap: gap },

                { text: "PIXIJS",                      font: big_font              },
                { text: "this framework is fantastic", font: small_font,  gap: gap },

                { text: "Sasha",                           font: big_font              },
                { text: "all the fun is on her balancing", font: small_font,  gap: gap },

                { text: "Maezinha e Pingo",              font: big_font              },
                { text: "Saudade nunca se vai, apenas",  font: small_font            },
                { text: "aprendemos a conviver com ela", font: small_font,  gap: gap },
            ],

            [
                { text: "Dedicated to all",         font: big_font   },
                { text: "people that suffered",     font: big_font   },
                { text: "with covid-19",            font: big_font   },
                { text: "Feel strong, stay safe!",  font: small_font,  gap: gap },
            ],

            [
                { text: "STDMATT MMXX",           font: big_font    },
                { text: "gplv3 - hack, share it", font: small_font  }
            ]
        ];

        let y = this.back_button.y;
        let curr_font_size = 0;

        for(let i = 0; i < msgs.length; ++i) {
            for(let j = 0; j < msgs[i].length; ++j) {
                const item = msgs[i][j];
                const msg  = item.text;
                let   g    = 2;

                if(item.font) {
                    curr_font_size = item.font;
                }
                if(item.gap) {
                   g += item.gap;
                }

                const text = new Text(msg, curr_font_size);

                Update_Anchor(text, 0.5, 0);
                text.position.x = CONTAINER_DESIGN_WIDTH * 0.5;
                text.position.y = y;

                y += (text.height + g);
                Add_To_Parent(this, text);
            }

            y += 30;
        }
    }

} // class CreditsScene
