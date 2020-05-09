
//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const GROUND_HEIGHT   = 130;
const GAME_HUD_HEIGHT = 0;

//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class FixedSizeContainer
    extends PIXI.Container
{
    _calculateBounds()
    {
    }
}

//------------------------------------------------------------------------------
class GameScene
    extends Base_Scene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        //
        // Housekeeping.
        this.bricks_cols        = 10;
        this.bricks_rows        = 14;
        this.brick_types_count  = 3;
        this.brick_types        = [];

        this.is_input_enabled   = true;
        this.current_score      = 0;

        //
        // Brick and container properties.
        this.container_max_height = GAME_DESIGN_HEIGHT - (GROUND_HEIGHT + GAME_HUD_HEIGHT);
        this.container_start_y    = GAME_DESIGN_HEIGHT - this.container_max_height;
        this.container_gap_x      = 20;
        this.brick_width        = ((GAME_DESIGN_WIDTH - this.container_gap_x) / this.bricks_cols);
        this.brick_height       = this.brick_width;


        //
        // Score HUD.
        this.score   = new UINumber("0");
        this.score.x = (GAME_DESIGN_WIDTH * 0.5) - (this.score.width * 0.5);
        this.score.y = 100;
        this.addChild(this.score);

        //
        // Bricks.
        this.bricks_grid     = null;
        this.brick_container = null;

        //
        // Animation.
        this.start_fall_tween_group = Tween_CreateBasic()
            .onComplete(()=> { this._OnStartFallEnded(); });
        this.destroy_tween_group = Tween_CreateGroup()
            .onComplete(()=>{ this._OnBricksDestroyEnded(); });
        this.fall_tween_group = Tween_CreateGroup()
            .onComplete(()=>{ this._OnBricksFallEnded(); });
        this.slide_tween_group = Tween_CreateGroup()
            .onComplete(()=>{ this._OnBricksSlideEnded(); });

        this._InitializeBricks();
    } // CTOR

    //--------------------------------------------------------------------------
    Update(dt)
    {
        super.Update(dt);

        this.start_fall_tween_group.update(dt);
        this.destroy_tween_group   .update(dt);
        this.fall_tween_group      .update(dt);
        this.slide_tween_group     .update(dt);
    } // Update

    //--------------------------------------------------------------------------
    _InitializeBricks()
    {
        // Make the list of bricks types random, so every time that we play
        // different bricks will appear.
        if(this.brick_types_count != BRICKS_TEXTURES_NAMES.length) {
            let unique_elements = new Set();
            while(unique_elements.size != this.brick_types_count) {
                unique_elements.add(Random_Int(0, BRICKS_TEXTURES_NAMES.length));
            }
            this.brick_types = [...unique_elements];
        }

        this.bricks_grid = Array_Create2D(
            this.bricks_rows,
            this.bricks_cols
        );

        this.brick_container   = new FixedSizeContainer();
        this.brick_container.width = 100;
        this.brick_container.height = 100;
        this.brick_container.x = (this.brick_width  * 0.5) + (this.container_gap_x * 0.5);
        this.brick_container.y = (this.brick_height * 0.5) + (this.container_start_y);
        this.addChild(this.brick_container);

        for(let i = 0; i < this.bricks_rows; ++i) {
            for(let j = 0; j < this.bricks_cols; ++j) {
                const type  = Random_Element(this.brick_types);
                const brick = new Brick(this.brick_width, this.brick_height, type);

                const pos_x = (this.brick_width  * j);
                const pos_y = (this.brick_height * i);
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

    _CreateStartFallBrickAnimation(brick, target_x, target_y)
    {
        const START_FALL_DURATION_MS = 1000;
        const scale     = (this.container_max_height - target_y) / this.container_max_height;
        const duration  = START_FALL_DURATION_MS * (scale);
        const delay_min = duration * 0.7;
        const delay_max = duration * 1.2;
        const start_y   = -200; // @XXX(stdmatt):

        brick.y = start_y
        brick.x = target_y;
        const tween = Tween_CreateBasic(duration)
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
            .easing(TWEEN.Easing.Cubic.In)
            .start();
    }

    _OnStartFallEnded()
    {

    }

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
        console.log(s);
    }

    //--------------------------------------------------------------------------
    _OnBrickClicked(brick)
    {
        if(!this.is_input_enabled) {
            return;
        }

        const brick_pos = brick.position;
        const coord_x = Math_Int((brick_pos.x + 0.5) / this.brick_width);
        const coord_y = Math_Int((brick_pos.y + 0.5) / this.brick_height);

        console.log("Brick clicked at: ", coord_x, coord_y);
        const matching_bricks = Algo_FloodFind(
            this.bricks_grid,                             // container
            coord_x, coord_y,                             // start coords
            (item) => {                          // predicate
                return item && item.type == brick.type;
            }
        );

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

            console.log("Matching brick to remove:", coord_y, coord_x)
            this.bricks_grid[coord_y][coord_x] = null;

            // Destroy Animation.
            this._CreateBrickDestroyAnimation(curr_brick);
        }

        // Points earned animation.
        const points = Math_Pow(matching_bricks.length -2, 2);
        this._CreateScoreAddAnimation(brick, points);
    } // _OnBrickClicked

    _CreateScoreAddAnimation(target_brick, points)
    {
        const number_ui = new UINumber(points);

        const brick_pos = target_brick.getGlobalPosition();
        const score_pos = this.score.getGlobalPosition  ();

        score_pos.x += (this.score.width - number_ui.width);

        const tween = Tween_CreateBasic(1000)
            .from({x: brick_pos.x, y: brick_pos.y})
            .to  ({x: score_pos.x, y: score_pos.y})
            .onUpdate((value)=>{
                number_ui.x = value.x;
                number_ui.y = value.y;

                const r = tween.getRatio();
                const m = Math_Sin(r * MATH_PI);
                number_ui.scale.set(1 + m);
            })
            .onComplete(()=>{
                number_ui.parent.removeChild(number_ui);

                this.current_score += points;
                this.score.SetNumberAnimated(this.current_score);
            })
            .easing(TWEEN.Easing.Quintic.In)
            .start();

        this.addChild(number_ui);
    }

    //--------------------------------------------------------------------------
    _CreateBrickDestroyAnimation(brick)
    {
        Tween_CreateBasic(500, this.destroy_tween_group)
            .from({a: brick.alpha})
            .to  ({a: 0          })
            .onUpdate((value)=>{
                brick.alpha = value.a;
            })
            .onComplete(()=>{
                brick.parent.removeChild(brick);
            })
            .start();
    } // _CreateBrickDestroyAnimation

    //--------------------------------------------------------------------------
    _CreateBrickFallAnimation(brick, target_y)
    {
        Tween_CreateBasic(500, this.fall_tween_group)
            .from({y: brick.y})
            .to({y: target_y})
            .onUpdate((value)=>{
                brick.y = value.y;
            })
            .start();
    } // _CreateBrickFallAnimation

    //--------------------------------------------------------------------------
    _CreateBrickSlideAnimation(brick, target_x)
    {
        Tween_CreateBasic(500, this.slide_tween_group)
            .from({x: brick.x})
            .to({x: target_x})
            .onUpdate((value)=>{
                brick.x = value.x;
            })
            .start();
    } //_CreateSlideAnimation


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

                    const target_y = (this.brick_height * i);
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
                console.log("swaping", j, k)
                any_sliding_bricks = true;
                // Swap
                for(let i = 0; i < this.bricks_rows; ++i) {
                    const swap_brick = this.bricks_grid[i][k];
                    this.bricks_grid[i][j] = swap_brick;
                    this.bricks_grid[i][k] = null;
                    if(swap_brick) {
                        const target_position = (j * this.brick_width);
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

    //--------------------------------------------------------------------------
    _OnBricksSlideEnded()
    {
        // Check end game.

        // Re-enable input.
        this.is_input_enabled = true;
    } // _OnBricksSlideEnded

} // class GameScene


