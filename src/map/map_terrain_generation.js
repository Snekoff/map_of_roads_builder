import {MapCell} from "./map_cell.js";

//TODO: make seed based generation
//TODO: use some kind of weights for random type generation for each empty cell

// 0 - plains
// 1 - forest
// 2 - hills
// 3 - mountains
// 4 - water
// 5 - rocks
// 6 - sand
// 7 - snow
// 8 - road[]

// at the start of generation there are even chances to each terrain
// but each new generated cell influences on adjacent empty cells
// so on next step chances are changed due to surroundings
// making possible to generate bioms

// further more there will be a direction of generating
// making possible to generate rivers and mountain spine
const terrain_influence_on_further_generation_spreadsheet = [
    [2,1,0.8,0.5,1,1,1,1,1],
    [1,2,1,0.5,1,0.5,0.1,1,1],
    [0.8,1,2,1.5,1,1,1,1,1],
    [0.5,0.5,1.5,2,2,1,0.5,1,0.3],
    [1,1,1,2,2,1,0.1,0.8,1],
    [1,0.5,1,1,1,2,1,0.5,0.3],
    [1,0.1,1,0.5,0.1,1,2,0.1,0.1],
    [1,1,1,1,0.8,0.5,0.1,1,1],
    [1,1,1,0.3,1,0.3,0.1,1,2]
]

const direction_terrain_modifier = 20;

// use random integer on this value twice to get X and Y modifier
// tripled chance to get [0, 0] to have single terrain items as often as long grid
const direction_possible_values = [0, 1, -1, 0, 0];

export class Generation_result_class {
    type;
    new_modifiers;
    direction_arr;

    constructor(type, mod_arr, direction_arr) {
        this.type = type;
        this.direction_arr = direction_arr;
        this.new_modifiers = mod_arr;
    }

    get() {
        return this;
    }
}

export function generate_using_adjacent_tiles(arr_of_types = []) {
    let chances_modifiers = make_arr_of_current_modifiers_from_adjacent_tiles_mod(arr_of_types);
    if(chances_modifiers.length === 0) return -1;
    // [1, 0.01, 2, 10, 0,05, 2, 10, 0,05]
    let cum_sum = chances_modifiers.map( function (cur, index, array) {
        if (index === 0) return cur;
        return array[index-1] + cur;
    });
    let rnd = (Math.random() * cum_sum[cum_sum.length - 1]).toFixed(3);
    let result_type = binary_search(cum_sum, rnd, 0, cum_sum.length - 1);
    let direction_pair = [direction_possible_values[Math.floor(Math.random() * direction_possible_values.length)], direction_possible_values[Math.floor(Math.random() * direction_possible_values.length)]]
    let result = new Generation_result_class(result_type, terrain_influence_on_further_generation_spreadsheet[result_type], direction_pair);
    return result;
}

function make_arr_of_current_modifiers_from_adjacent_tiles_mod (arr_of_types = []) {
    let result = [];
    let arr_of_arr_of_modifiers = [];
    for (let i =0; i++; i < arr_of_types.length) { // 8 adjacent tiles
        arr_of_arr_of_modifiers.push(terrain_influence_on_further_generation_spreadsheet[arr_of_types[i]]);
        for (let j =0; j++; j < arr_of_arr_of_modifiers[0].length) { // 8 types of terrain
            if(result.length < j) result.push(arr_of_arr_of_modifiers[i][j])
            else {
                result[j] *= arr_of_arr_of_modifiers[i][j];
            }
        }
    }
    return result;
}

function binary_search(arr, value, index_start, index_end) {
    if(value <= arr[index_start]) return index_start;
    if(value > arr[index_end - 1]) return index_end;
    let index_middle = Math.floor((index_end - index_start) / 2);
    if (value < arr[index_middle]) return binary_search(arr, value, index_start, index_middle);
    else return binary_search(arr, value, index_middle, index_end);
}

