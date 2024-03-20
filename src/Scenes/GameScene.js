
//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const GROUND_HEIGHT   = 130;
const GAME_HUD_HEIGHT = 130;

const CONTAINER_DESIGN_GAP_X  = 20;
const CONTAINER_DESIGN_HEIGHT = GAME_DESIGN_HEIGHT  - (GROUND_HEIGHT + GAME_HUD_HEIGHT);
const CONTAINER_DESIGN_WIDTH  = (GAME_DESIGN_WIDTH  - CONTAINER_DESIGN_GAP_X);

const GAME_START_LEVEL = 1;

const START_FALL_ANIMATION_DURATION =  1000 * ANIMATION_SPEED_MULTIPLIER;
const DESTROY_ANIMATION_DURATION    =   500 * ANIMATION_SPEED_MULTIPLIER;
const FALL_ANIMATION_DURATION       =   700 * ANIMATION_SPEED_MULTIPLIER;
const SLIDE_ANIMATION_DURATION      =   500 * ANIMATION_SPEED_MULTIPLIER;
const SCORE_ANIMATION_DURATION      =   800 * ANIMATION_SPEED_MULTIPLIER;

const START_FALL_ANIMATION_EASING = TWEEN.Easing.Cubic.In;
const DESTROY_ANIMATION_EASING    = TWEEN.Easing.Cubic.In;
const FALL_ANIMATION_EASING       = TWEEN.Easing.Back.InOut;
const SLIDE_ANIMATION_EASING      = TWEEN.Easing.Back.InOut;
const SCORE_ANIMATION_EASING      = TWEEN.Easing.Quintic.In;

const BRICK_TEXTURES = [
    BRICKS_1,
    BRICKS_2,
    BRICKS_3,
    BRICKS_4,
    BRICKS_5
];

const LEVEL_STR = "level";


//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class GameScene
    extends AnimatedScene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        //
        // Housekeeping.
        this.balance            = Data_Get("res/data/balance.json");
        this.bricks_cols        = null;
        this.bricks_rows        = null;
        this.brick_types_count  = null;
        this.brick_types        = [];
        this.bricks_grid        = null;
        this.brick_container    = null;
        this.is_input_enabled   = false;
        this.current_score      = 0;
        this.current_level      = GAME_START_LEVEL;

        //
        // User Interface
        //   Buttons
        this.back_button = null;
        //   Score HUD.
        this.level_text            = null;
        this.score_number_particle = null;
        this.score_number_particle = null;

        //
        // Animation.
        this.start_fall_tween_group = Tween_CreateGroup()
            .onComplete(()=> { this._OnStartFallEnded(); });
        this.destroy_tween_group = Tween_CreateGroup()
            .onComplete(()=>{ this._OnBricksDestroyEnded(); });
        this.fall_tween_group = Tween_CreateGroup()
            .onComplete(()=>{ this._OnBricksFallEnded(); });
        this.slide_tween_group = Tween_CreateGroup()
            .onComplete(()=>{ this._OnBricksSlideEnded(); });

        //
        // Init
        this._InitializeUI       ();
        this._InitializeLevelData();
        this._InitializeContainer();
    } // CTOR

    //--------------------------------------------------------------------------
    GoBack()
    {
        this.RunOnExit(new MenuScene());
    } // GoBack

    //--------------------------------------------------------------------------
    GoScene(scene)
    {
        this.RunOnExit(scene);
    } // GoScene

    //--------------------------------------------------------------------------
    OnFinishedEnterAnimation()
    {
        super.OnFinishedEnterAnimation();
        this._InitializeBricks   ();
    } // OnFinishedEnterAnimation

    //--------------------------------------------------------------------------
    Update(dt)
    {
        super.Update(dt);
        // Objects.
        this.score_number         .Update(dt);
        this.score_number_particle.Update(dt);

        // Animation Tweens.
        this.start_fall_tween_group.update(dt);
        this.destroy_tween_group   .update(dt);
        this.fall_tween_group      .update(dt);
        this.slide_tween_group     .update(dt);
    } // Update

    //------------------------------------------------------------------------//
    // Initialize                                                             //
    //------------------------------------------------------------------------//
    _InitializeUI()
    {
        // Level Text.
        this.level_text = new Text(String_Join(" ", LEVEL_STR, this.current_level), SMALL_FONT_DEF.size);

        Center_Anchor(this.level_text);
        this.level_text.x = GAME_DESIGN_WIDTH * 0.5;
        this.level_text.y = (GAME_HUD_HEIGHT * 0.1) + this.level_text.height * 0.8;

        // Score Particle.
        this.score_number_particle = new ScoreNumberParticle();

        // Score Number.
        this.score_number = new ScoreNumber("0", SCORE_HUD_DIGITS_COUNT)

        Center_Anchor(this.score_number);
        this.score_number.x = (GAME_DESIGN_WIDTH * 0.5);
        this.score_number.y = this.level_text.y + this.level_text.height * 0.5 + this.score_number.height * 0.5 + BUTTON_GAP * 0.5;

        // Back Button.
        this.back_button = CreateBackButton(()=>{ this.GoBack(); });

        Add_To_Parent(
            this,
            this.back_button,
            this.score_number_particle,
            this.level_text,
            this.score_number
        );
    }
    //--------------------------------------------------------------------------
    _InitializeLevelData()
    {
        const level_data = this.balance[this.current_level.toString()];

        this.level_text.text = String_Join(" ", LEVEL_STR, this.current_level);
        this.level_text.tint = Random_Element(LEVEL_TEXT_COLORS);

        this.bricks_rows       = level_data["Height"];
        this.bricks_cols       = level_data["Width"];
        this.brick_types_count = level_data["Colours"];

        console.log(
            "Rows: ", this.bricks_rows,
            " Cols: ", this.bricks_cols,
            " Types: ", this.brick_types_count
        );
    } // _InitializeLevelData

    //--------------------------------------------------------------------------
    _InitializeContainer()
    {
        this.brick_width = Math_Min(
            (CONTAINER_DESIGN_WIDTH  / this.bricks_cols),
            (CONTAINER_DESIGN_HEIGHT / this.bricks_rows)
        );
        this.brick_height = this.brick_width;

        const actual_container_width  = (this.brick_width  * this.bricks_cols);
        const actual_container_height = (this.brick_height * this.bricks_rows);

        Remove_From_Parent(this.brick_container);
        this.brick_container = new FixedSizeContainer(
            actual_container_width,
            actual_container_height
        );

        this.brick_container.x = (GAME_DESIGN_WIDTH * 0.5) - (actual_container_width * 0.5)
        this.brick_container.y = GAME_DESIGN_HEIGHT - actual_container_height - GROUND_HEIGHT;
        this.addChild(this.brick_container);
    } // _InitializeContainer

    //--------------------------------------------------------------------------
    _InitializeBricks()
    {
        // Make the list of bricks types random, so every time that we play
        // different bricks will appear.
        if(this.brick_types_count != BRICK_TEXTURES.length) {
            let unique_elements = new Set();
            while(unique_elements.size != this.brick_types_count) {
                unique_elements.add(Random_Int(0, BRICK_TEXTURES.length));
            }
            this.brick_types = [...unique_elements];
        }

        this.bricks_grid = Array_Create2D(
            this.bricks_rows,
            this.bricks_cols
        );

        for(let i = 0; i < this.bricks_rows; ++i) {
            for(let j = 0; j < this.bricks_cols; ++j) {
                const type  = Random_Element(this.brick_types);
                const brick = new Brick(this.brick_width, this.brick_height, type);

                const pos_x = (this.brick_width  * j) + this.brick_width  * 0.5;
                const pos_y = (this.brick_height * i) + this.brick_height * 0.5;
                this._CreateStartFallBrickAnimation(brick, pos_x, pos_y);

                this.bricks_grid[i][j] = brick;
                this.brick_container.addChild(brick);

                brick.interactive = true;
                brick.buttonMode  = true;
                brick.on("pointerdown", ()=>{
                    this._OnBrickClicked(brick);
                });
            }
        }

        this.brick_container.calculateBounds();
    } // _InitializeBricks


    //------------------------------------------------------------------------//
    // Brick Start Fall                                                       //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    _CreateStartFallBrickAnimation(brick, target_x, target_y)
    {
        const brick_height      = this.brick_height;
        const container_start_y = this.brick_container.y;
        const container_height  = this.bricks_rows * brick_height;

        const scale     = Math_Map(target_y, 0, container_height, 1.2, 0.6);
        const duration  = START_FALL_ANIMATION_DURATION * (scale);
        const delay_min = duration * 0.8;
        const delay_max = duration * 1.2;
        const start_y   = -container_start_y - (brick_height * 0.5);

        brick.y = start_y;
        brick.x = target_x;

        Tween_CreateBasic(duration, this.start_fall_tween_group)
            .from({x: target_x, y: start_y})
            .to  ({x: target_x, y: target_y})
            .onUpdate((value)=>{
                brick.x = value.x;
                brick.y = value.y;
            })
            .onComplete(()=>{
                brick.x = target_x;
                brick.y = target_y;
            })
            .delay(Random_Int(delay_min, delay_max))
            .easing(START_FALL_ANIMATION_EASING)
            .start();
    } // _CreateStartFallBrickAnimation

    //--------------------------------------------------------------------------
    _OnStartFallEnded()
    {
        this.is_input_enabled = true;
    } // _OnStartFallEnded


    //------------------------------------------------------------------------//
    // Brick Destroy                                                          //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    _OnBrickClicked(brick)
    {
        if(!this.is_input_enabled) {
            // console.log("Input disabled...");
            return;
        }

        const matching_bricks = this._FindMatchingBricks(brick);
        if(matching_bricks.length < 2) {
            return;
        }

        this.is_input_enabled = false;
        for(let i = 0; i < matching_bricks.length; ++i) {
            const curr_brick = matching_bricks[i];
            // Remove from the grid.
            const curr_brick_pos =  curr_brick.position;
            const coord_x = Math_Int((curr_brick_pos.x + 0.5) / this.brick_width);
            const coord_y = Math_Int((curr_brick_pos.y + 0.5) / this.brick_height);

            // console.log("Matching brick to remove:", coord_y, coord_x)
            this.bricks_grid[coord_y][coord_x] = null;

            // Destroy Animation.
            this._CreateBrickDestroyAnimation(curr_brick);
        }

        // Points earned animation.
        const points = this._CalculatePointsEarned(matching_bricks.length);
        // @NOTICE(stdmatt): When we applied the scale to the stage
        // the globalPosition became crazy...
        const x = brick.position.x + brick.parent.position.x;
        const y = brick.position.y + brick.parent.position.y;

        this._CreateScoreAddAnimation(x, y, points);
    } // _OnBrickClicked

    //--------------------------------------------------------------------------
    _CreateBrickDestroyAnimation(brick)
    {
        Tween_CreateBasic(DESTROY_ANIMATION_DURATION, this.destroy_tween_group)
            .from({a: brick.alpha})
            .to  ({a: 0          })
            .onUpdate((value)=>{
                brick.alpha = value.a;
            })
            .onComplete(()=>{
                brick.parent.removeChild(brick);
            })
            .easing(DESTROY_ANIMATION_EASING)
            .start();
    } // _CreateBrickDestroyAnimation

    //--------------------------------------------------------------------------
    _OnBricksDestroyEnded()
    {
        let any_falling_bricks = false;
        for(let j = 0; j < this.bricks_cols; ++j) {
            for(let i = this.bricks_rows -1; i > 0; --i) {
                const curr_brick  = this.bricks_grid[i][j];
                if(curr_brick) {
                    continue;
                }
                // We found an empty slot...
                // Let's try to find the nearest brick on this column
                let above_brick = null;
                for(let k = i-1; k >= 0; --k) {
                    above_brick = this.bricks_grid[k][j];
                    if(!above_brick) {
                        continue;
                    }

                    // Make that above brick be placed into the current
                    // position, this makes the brick "fall"
                    this.bricks_grid[i][j] = above_brick;
                    this.bricks_grid[k][j] = null;

                    const target_y = (this.brick_height * i) + this.brick_height * 0.5;
                    this._CreateBrickFallAnimation(above_brick, target_y);

                    any_falling_bricks = true;
                    break;
                }
            }
        }

        if(!any_falling_bricks) {
            this._OnBricksFallEnded();
        }
    } // _OnBricksDestroyEnded


    //------------------------------------------------------------------------//
    // Brick Fall                                                             //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    _CreateBrickFallAnimation(brick, target_y)
    {
        Tween_CreateBasic(FALL_ANIMATION_DURATION, this.fall_tween_group)
            .from({y: brick.y})
            .to({y: target_y})
            .onUpdate((value)=>{
                brick.y = value.y;
            })
            .onComplete(()=>{
                brick.y = target_y;
            })
            .easing(FALL_ANIMATION_EASING)
            .start();
    } // _CreateBrickFallAnimation

    //--------------------------------------------------------------------------
    _OnBricksFallEnded()
    {
        let any_sliding_bricks = false;
        const bottom_row = (this.bricks_rows -1);
        for(let j = 0; j < this.bricks_cols -1; ++j) {
            const brick = this.bricks_grid[bottom_row][j];
            if(brick) {
                continue;
            }

            // Find swap position
            for(let k = (j + 1); k < this.bricks_cols; ++k) {
                if(!this.bricks_grid[bottom_row][k]) {
                    continue;
                }
                // console.log("swaping", j, k)
                any_sliding_bricks = true;
                // Swap
                for(let i = 0; i < this.bricks_rows; ++i) {
                    const swap_brick = this.bricks_grid[i][k];
                    this.bricks_grid[i][j] = swap_brick;
                    this.bricks_grid[i][k] = null;
                    if(swap_brick) {
                        const target_position = (j * this.brick_width) + (this.brick_width * 0.5);
                        this._CreateBrickSlideAnimation(swap_brick, target_position);
                    }
                }

                this._print();
                break;
            }
        }

        this._print();
        if(!any_sliding_bricks) {
            this._OnBricksSlideEnded();
        }
    } // _OnBricksFallEnded


    //------------------------------------------------------------------------//
    // Brick Slide                                                            //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    _CreateBrickSlideAnimation(brick, target_x)
    {
        Tween_CreateBasic(SLIDE_ANIMATION_DURATION, this.slide_tween_group)
            .from({x: brick.x})
            .to({x: target_x})
            .onUpdate((value)=>{
                brick.x = value.x;
            })
            .onComplete(()=>{
                brick.x = target_x;
            })
            .easing(SLIDE_ANIMATION_EASING)
            .start();
    } //_CreateSlideAnimation

    //--------------------------------------------------------------------------
    _OnBricksSlideEnded()
    {
        //
        // Check end game.
        let end_game = true;
        let defeat   = false;

        for(let i = 0; i < this.bricks_rows; ++i) {
            if(!end_game) {
                break;
            }
            for(let j = 0; j < this.bricks_cols; ++j) {
                const brick = this.bricks_grid[i][j];
                if(!brick) {
                    continue;
                }

                const matching_bricks = this._FindMatchingBricks(brick);
                if(matching_bricks.length >= 2) {
                    end_game = false;
                    break;
                } else {
                    defeat = true;
                }
            }
        }

        if(!end_game) {
            // Re-enable input.
            this.is_input_enabled = true;
            return;
        }

        if(!defeat) {
            ++this.current_level;

            this._InitializeLevelData();
            this._InitializeContainer();
            this._InitializeBricks   ();
            return;
        }

        //
        // Set the best and last score...
        GameSettings_Set(SETTINGS_KEY_HAS_SCORE, true);
        GameSettings_Set(SETTINGS_KEY_LAST_SCORE, this.current_score);

        const old_best_score = GameSettings_Get(SETTINGS_KEY_BEST_SCORE, 0);
        const new_best_score = Math_Max(old_best_score, this.current_score);
        GameSettings_Set(SETTINGS_KEY_BEST_SCORE, new_best_score);

        this.GoScene(new MenuScene());
    } // _OnBricksSlideEnded


    //------------------------------------------------------------------------//
    // Score                                                                  //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    _CreateScoreAddAnimation(spawn_x, spawn_y, points)
    {
        const number_ui           = new ScoreNumber(points, 0);
        const target_digit_pos    = this.score_number.position.clone();
        const target_particle_pos = this.score_number.position.clone();
        const score_number_hw     = this.score_number.width * 0.5;

        target_digit_pos   .x += (score_number_hw) - (number_ui.width * 0.5);
        target_particle_pos.x += Random_Int(-score_number_hw, +score_number_hw);

        const tween = Tween_CreateBasic(SCORE_ANIMATION_DURATION)
            .from({x: spawn_x,            y: spawn_y           })
            .to  ({x: target_digit_pos.x, y: target_digit_pos.y})
            .onUpdate((value)=>{
                number_ui.x = value.x;
                number_ui.y = value.y;

                const r = tween.getRatio();
                const m = Math_Sin(r * MATH_PI);
                number_ui.scale.set(1 + m);
            })
            .onComplete(()=>{
                number_ui.parent.removeChild(number_ui);
                const half_way_callback = () => {
                    // Animate Particles.
                    this.score_number_particle.x = target_particle_pos.x;
                    this.score_number_particle.y = target_particle_pos.y;
                    this.score_number_particle.Play();
                }
                // Animate Score.
                this.current_score += points;
                this.score_number.SetNumberAnimated(
                    this.current_score,
                    half_way_callback
                );
            })
            .easing(SCORE_ANIMATION_EASING)
            .start();

        this.addChild(number_ui);
    } // _CreateScoreAddAnimation

    _CalculatePointsEarned(bricks_count)
    {
        return Math_Pow(bricks_count -2, 2);
    }


    //------------------------------------------------------------------------//
    // Game Logic                                                             //
    //------------------------------------------------------------------------//
    _FindMatchingBricks(brick)
    {
        const brick_pos = brick.position;
        const coord_x = Math_Int((brick_pos.x + 0.5) / this.brick_width);
        const coord_y = Math_Int((brick_pos.y + 0.5) / this.brick_height);

        // console.log("Brick clicked at: ", coord_x, coord_y);
        const matching_bricks = Algo_FloodFind(
            this.bricks_grid,                             // container
            coord_x, coord_y,                             // start coords
            (item) => {                          // predicate
                return item && item.type == brick.type;
            }
        );

        return matching_bricks;
    } // _FindMatchingBricks


    //------------------------------------------------------------------------//
    // Debug                                                                  //
    //------------------------------------------------------------------------//
    _print()
    {
        let s = "";
        for(let i = 0; i < this.bricks_rows; ++i) {
            for(let j = 0; j < this.bricks_cols; ++j) {
                if(this.bricks_grid[i][j]) {
                    s += " " + this.bricks_grid[i][j].type;
                }
                else {
                    s += " .";
                }
            }
            s += "\n"
        }
        // console.log(s);
    }
} // class GameScene
