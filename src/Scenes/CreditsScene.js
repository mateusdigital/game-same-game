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
        const back_button = CreateBackButton(()=>{
            this.RunOnExit(new MenuScene());
        });
        this.addChild(back_button);

        //
        // Msgs
        this.msgs = [];
    } // CTOR


    //--------------------------------------------------------------------------
    OnFinishedEnterAnimation()
    {
        super.OnFinishedEnterAnimation();
        this._StartAnimation          ();
    } // OnFinishedEnterAnimation


    //--------------------------------------------------------------------------
    _StartAnimation()
    {
        const big_font   = 45;
        const small_font = 25;

        const msgs = [
            [
                { text: "This little game", font: big_font },
                { text: "was made with"              },
                { text: "a lot of love!"             },
            ],

            [
                { text: "A big thanks to:", font: 20, gap: 15 },

                { text: "Kenney",                   font: big_font            },
                { text: "for the amazing artwork",  font: small_font, gap: 20 },

                { text: "PIXIJS",                      font: big_font            },
                { text: "this framework is fantastic", font: small_font, gap: 20 },

                { text: "Sasha",                           font: big_font            },
                { text: "all the fun is on her balancing", font: small_font, gap: 20 },

                { text: "Maezinha e Pingo",              font: big_font            },
                { text: "Saudade nunca se vai, apenas",  font: small_font          },
                { text: "aprendemos a conviver com ela", font: small_font, gap: 20 },
            ],

            [
                { text: "Dedicated to all",     font: big_font},
                { text: "people that suffered"                                         },
                { text: "with covid-19"                                         },
                { text: "Feel strong, stay safe!" ,   font: small_font          },
            ],

            [
                { text: "STDMATT MMXX",           font: big_font },
                { text: "gplv3 - hack, share it", font: small_font        }
            ]
        ];

        let y = 50;
        let curr_font_size = 0;

        for(let i = 0; i < msgs.length; ++i) {
            for(let j = 0; j < msgs[i].length; ++j) {
                const item = msgs[i][j];
                const msg  = item.text;
                let   gap  = 0;

                if(item.font) {
                    curr_font_size = item.font;
                }
                if(item.gap) {
                   gap = item.gap;
                }

                const text = new Text(msg, curr_font_size);

                Update_Anchor(text, 0.5, 0);
                text.position.x = CONTAINER_DESIGN_WIDTH * 0.5;
                text.position.y = y;

                y += (text.height + gap);
                Add_To_Parent(this, text);
            }

            y += 30;
        }
    }

} // class CreditsScene
