import {MapCell} from "./map_cell.js";

//TODO: make seed based generation
//TODO: use some kind of weights for random type generation for each empty cell

// 0 - plains  #61eb34
// 1 - forest  #237d06
// 2 - hills  #75966b
// 3 - mountains  #babad6
// 4 - water  #5a5aed
// 5 - rocks  #bababf
// 6 - sand  #d9cb36
// 7 - snow  #faf9eb
// 8 - road[]  #f0a83c

// at the start of generation there are even chances to each terrain
// but each new generated cell influences on adjacent empty cells
// so on next step chances are changed due to surroundings
// making possible to generate bioms

// further more there will be a direction of generating
// making possible to generate rivers and mountain spine
const Terrain_influence_on_further_generation_spreadsheet = [
    [2  ,1  ,0.8,0.5,1  ,1  ,1  ,1  ,1  ],
    [1  ,2  ,1  ,0.5,1  ,0.5,0.2,1  ,1  ],
    [0.8,1  ,3.4,1.5,1  ,1  ,1  ,1  ,1  ],
    [0.5,0.5,1.5,1.5,1.5,1  ,0.5,1  ,0.3],
    [1  ,1  ,1  ,1.5,2  ,1  ,0.2,0.8,1  ],
    [1  ,0.5,1  ,1  ,1  ,2  ,1  ,0.5,0.3],
    [1  ,0.2,1  ,0.5,0.2,1  ,5  ,0.1,0.1],
    [1  ,1  ,1  ,1  ,0.8,0.5,0.1,1  ,1  ],
    [1  ,1  ,1  ,0.3,1  ,0.3,0.1,1  ,2  ]
]

const Terrain_boost = [1, 1, 0.6, 1, 0.8, 0.8, 0.55, 0.7, 1]

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

    getType() {
        return this.type;
    }
}

export function generate_using_adjacent_tiles(arr_of_types = []) {
    if(!arr_of_types || arr_of_types.length === 0) arr_of_types = [4];


    let chances_modifiers = make_arr_of_current_modifiers_from_adjacent_tiles_mod(arr_of_types);
    if(chances_modifiers.length === 0) {
        console.log("map generation1 arr_of_types = ", arr_of_types, "chances_modifiers = ", chances_modifiers);
        return -1;
    }
    // [1, 0.01, 2, 10, 0,05, 2, 10, 0.05, 1]
    let cum_sum = chances_modifiers
    if (cum_sum.length > 8) {
        cum_sum.splice(8);
    }
    // [1, 0.01, 2, 10, 0,05, 2, 10, 0.05] excluded roads from generation
    // right order is important!
    for(let i = 1; i < cum_sum.length; i++) {
        cum_sum[i] += +cum_sum[i-1];
        cum_sum[i] = +cum_sum[i].toFixed(3);
    }
    // [1, 1.01, 3.01, 13.01, 13.06, 15.06, 25.06, 25.11]

    cum_sum.unshift(0); // added first element for correct binary rnd type search
    // [0, 1, 1.01, 3.01, 13.01, 13.06, 15.06, 25.06, 25.11]

    let rnd = (Math.random() * cum_sum[cum_sum.length - 1]).toFixed(3);
    //console.log("map generation cum_sum = ", cum_sum, "rnd = ", rnd);

    let result_type = binary_search(cum_sum, rnd, 0, cum_sum.length - 1);
    let direction_pair = [direction_possible_values[Math.floor(Math.random() * direction_possible_values.length)], direction_possible_values[Math.floor(Math.random() * direction_possible_values.length)]]
    let result = new Generation_result_class(result_type, Terrain_influence_on_further_generation_spreadsheet[result_type]  , direction_pair);
    //console.log("result = ", result);
    return result;
}

function make_arr_of_current_modifiers_from_adjacent_tiles_mod (arr_of_types = []) {
    let result = [];
    let arr_of_arr_of_modifiers = [];

    for (let i = 0; i < arr_of_types.length; i++) { // 8 adjacent tiles

        arr_of_arr_of_modifiers.push(Terrain_influence_on_further_generation_spreadsheet[arr_of_types[i]]);
        for (let j =0; j < arr_of_arr_of_modifiers[0].length; j++) { // 8 types of terrain

            if(result.length <= j) result.push(arr_of_arr_of_modifiers[i][j])
            else {
                result[j] = +(result[j] * arr_of_arr_of_modifiers[i][j] * Terrain_boost[j]).toFixed(3);
                //if(j >= 8) console.log("map generation1 result arr = ", result, "arr_of_types[i] = ", arr_of_types[i], "Terrain_influence_on_further_generation_spreadsheet[arr_of_types[i]] = ", Terrain_influence_on_further_generation_spreadsheet[arr_of_types[i]])
            }

        }
    }
    return result;
}

function binary_search(arr, value, index_start, index_end) {
    if(+value <= +arr[index_start + 1]) return index_start;
    if(+value > +arr[index_end - 1]) return index_end - 1;
    //if(index_end - index_start <= 2) return index_start;

    let index_middle = index_start + Math.floor((index_end - index_start) / 2);
    if (+value < +arr[index_middle]) return binary_search(arr, value, index_start, index_middle);
    else return binary_search(arr, value, index_middle, index_end);
}

