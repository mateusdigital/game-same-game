const NUMBERS_TEXTURES_NAMES = [
    "res/textures/numbers/0.png",
    "res/textures/numbers/1.png",
    "res/textures/numbers/2.png",
    "res/textures/numbers/3.png",
    "res/textures/numbers/4.png",
    "res/textures/numbers/5.png",
    "res/textures/numbers/6.png",
    "res/textures/numbers/7.png",
    "res/textures/numbers/8.png",
    "res/textures/numbers/9.png",
];

class UINumber
    extends PIXI.Container
{
    constructor(value)
    {
        super();

        this.sprites = [];

        const value_str = value.toString();
        for(let i = 0; i < value_str.length; ++i) {
            const digit = value_str[i];
            const sprite = Sprite_Create(NUMBERS_TEXTURES_NAMES[parseInt(digit)]);
            sprite.anchor.set(0.5);
            sprite.x = this.width;
            this.sprites.push(sprite);
            this.addChild(sprite);
        }
    }

    SetNumberAnimated(value)
    {
        const value_str = value.toString();
        for(let i = 0; i < value_str.length; ++i) {

            const digit = value_str[i];
            // this.sprites[i].texture = Texture_Get(NUMBERS_TEXTURES_NAMES[parseInt(digit)]);
        }
    }
}


class GameScene
    extends Base_Scene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        //
        // Housekeeping
        this.container_gap_x    = 26;
        this.container_start_y  = TILE_HEIGHT * 2 - 49;
        this.bricks_cols        = 10;
        this.bricks_rows        = 14;
        this.brick_width        = ((GAME_DESIGN_WIDTH - this.container_gap_x)/ this.bricks_cols);
        this.brick_height       = this.brick_width;
        this.brick_types_count  = 3;
        this.brick_types        = [];
        this.is_input_enabled   = true;
        this.current_score      = 0;

        //
        let t = Sprite_Create("res/textures/untitled.png");
        this.addChild(t);

        //
        this.score = new UINumber("0");
        this.score.x = (TILE_WIDTH  * 6) - (this.score.width  * 0.5);
        this.score.y = (TILE_HEIGHT * 1) - (this.score.height * 0.5) - 10;
        this.addChild(this.score);

        //
        // Bricks.
        this.bricks_grid     = null;
        this.brick_container = null;

        //
        // Animation
        this.destroy_tween_group = Tween_CreateGroup()
            .onComplete(()=>{ this._OnBricksDestroyEnded(); });
        this.fall_tween_group = Tween_CreateGroup()
            .onComplete(()=>{ this._OnBricksFallEnded(); });
        this.slide_tween_group = Tween_CreateGroup()
            .onComplete(()=>{ this._OnBricksSlideEnded(); });

        // this._InitializeBricks();
    } // CTOR

    //--------------------------------------------------------------------------
    Update(dt)
    {
        super.Update(dt);

        this.destroy_tween_group.update(dt);
        this.fall_tween_group   .update(dt);
        this.slide_tween_group  .update(dt);

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

        this.brick_container   = new PIXI.Container();
        this.brick_container.x = (this.brick_width  * 0.5) + (this.container_gap_x * 0.5);
        this.brick_container.y = (this.brick_height * 0.5) + (this.container_start_y);
        this.addChild(this.brick_container);

        for(let i = 0; i < this.bricks_rows; ++i) {
            for(let j = 0; j < this.bricks_cols; ++j) {
                const type  = Random_Element(this.brick_types);
                const brick = new Brick(this.brick_width, this.brick_height, type);

                brick.x = (this.brick_width  * j);
                brick.y = (this.brick_height * i);

                this.bricks_grid[i][j] = brick;
                this.brick_container.addChild(brick);

                brick.interactive = true;
                brick.buttonMode  = true;
                brick.on("pointerdown", ()=>{
                    this._OnBrickClicked(brick);
                });
            }
        }
    } // _InitializeBricks

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

function Algo_FloodFind(container, start_x, start_y,  predicate)
{
    const XY     = (x, y)  => { return {x:x, y:y}     };
    const COPY   = (xy)    => { return XY(xy.x, xy.y) };
    const GET    = (c, xy) => { return c[xy.y][xy.x]  };
    const VISITED = (c, xy) => { return Array_Contains(c, (_xy)=>{
        let b = _xy.x == xy.x && _xy.y == xy.y
        return b;
    })};

    let result  = [];
    let queue   = [XY(start_x, start_y)];
    let visited = [];

    while(queue.length != 0) {
        let coord    = Array_PopFront(queue);
        let matching = [];

        if(VISITED(visited, coord)) {
            continue;
        }
        visited.push(coord);

        const item = GET(container, coord);
        if(!predicate(item)) {
            continue;
        }
        result.push(item);

        // Search left...
        for(let left_coord = XY(coord.x -1, coord.y);
            left_coord.x >= 0;
            --left_coord.x)
        {
            const item = GET(container, left_coord);
            if(!predicate(item)) {
                break;
            }
            matching.push(COPY(left_coord));
        }
        // Search right...
        for(let right_coord = XY(coord.x + 1, coord.y);
            right_coord.x < container[right_coord.y].length;
            ++right_coord.x)
        {
            const item = GET(container, right_coord);
            if(!predicate(item)) {
                break;
            }
            matching.push(COPY(right_coord));
        }
        // Search top...
        for(let top_coord = XY(coord.x, coord.y -1);
            top_coord.y >= 0;
            --top_coord.y)
        {
            const item = GET(container, top_coord);
            if(!predicate(item)) {
                break;
            }
            matching.push(COPY(top_coord));
        }
        // Search bottom...
        for(let bottom_coord = XY(coord.x, coord.y +1);
            bottom_coord.y < container.length;
            ++bottom_coord.y)
        {
            const item = GET(container, bottom_coord);
            if(!predicate(item)) {
                break;
            }
            matching.push(COPY(bottom_coord));
        }

        for(let i = 0; i < matching.length; ++i) {
            const match_coord = matching[i]
            const match_item  = GET(container, match_coord);

            queue .push(match_coord);
        }
    }

    return result;
}
