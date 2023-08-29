import {Epoch} from "../graph/epoch.js";
import {Edge} from "../graph/edge.js";
import {Vertice} from "../graph/vertice.js";

const min_terrain_difficulty_mul = 0.2;

export class MapCell {

    // 0 - plains
    // 1 - forest
    // 2 - hills
    // 3 - mountains
    // 4 - water
    // 5 - rocks
    // 6 - sand
    // 7 - snow
    // 8 - road[]
    //multipliers = [1, 2, , , , , , , ];
    currentMultiplier = 1;

    constructor({x, y, terrainTypes = [{type: 'plains', level: 0}], teleportToArrOfObjects = [], externalAddedTimeMul = 0, couldBePassed = true, verticeArr = []}) {
        this.objType = "Map Cell";
        this.x = x;
        this.y = y;
        this.terrainTypes = new Map();
        this.teleportToArrOfObjects = teleportToArrOfObjects;
        this.externalAddedTimeMul = externalAddedTimeMul;
        this.couldBePassed = couldBePassed;
        this.verticeArr = verticeArr;

        this.type = terrainTypes[0].type

        this.multipliersMap = new Map();
        this.multipliersMap.set('plains', [1]);
        this.multipliersMap.set('forest', [2, 3, 4]);
        this.multipliersMap.set('hills', [1.5]);
        this.multipliersMap.set('mountains', [2.5, 4, 15]);
        this.multipliersMap.set('water', [2, 10, 50]);
        this.multipliersMap.set('rocks', [1.5]);
        this.multipliersMap.set('sand', [1.8]);
        this.multipliersMap.set('snow', [2, 5, 8]);
        this.multipliersMap.set('road', [0.8, 0.6, 0.5, 0.45, 0.42, 0.40, 0.38, 0.36]);
        this.multipliersMap.set('city', [0.5, 0.45, 0.40, 0.35, 0.30]);
        this.multipliersMap.set('village', [0.75, 0.55, 0.5, 0.45, 0.4]);
        this.multipliersMap.set('fort', [0.75, 0.55, 0.5, 0.45, 0.4]);
        this.multipliersMap.set('camp', [0.95, 0.85, 0.75, 0.74, 0.73]);
        this.multipliersMap.set('criminal camp', [50, 150, 999, 999, 999]);

        this.currentMultiplier = this.setCurrentMultiplier(this.terrainTypes, this.multipliersMap, this.currentMultiplier);
        for (let type of terrainTypes) {
            this.terrainTypes.set(type.type, type.level);
        }
        this.currentMultiplierObj = { mul: this.currentMultiplier }
    }

    setCurrentMultiplier(terrainTypes, multipliersMap, currentMultiplier = 1) {
        currentMultiplier = 1;
        for(let type of terrainTypes.entries()) {
            if(type[1] !== +type[1]) break;
            let mul = multipliersMap.get(type[0]);
            currentMultiplier *= mul[Math.min(type[1], mul.length - 1)];
        }
        currentMultiplier = Math.max(currentMultiplier, min_terrain_difficulty_mul);
        return currentMultiplier;
    }

    addTerrainType(value) {

        if(this.terrainTypes.has(value.type)) {
            let maxLvl = this.multipliersMap.get(value.type).length - 1;
            let current = this.terrainTypes.get(value.type);
            let newLevel = Math.max(Math.min(value.level, maxLvl), +current);
            this.terrainTypes.set(value.type, newLevel);
            this.currentMultiplier = this.setCurrentMultiplier(this.terrainTypes, this.multipliersMap, this.currentMultiplier);
            return 0;
        }
        this.terrainTypes.set(value.type, value.level);
        this.currentMultiplier = this.setCurrentMultiplier(this.terrainTypes, this.multipliersMap, this.currentMultiplier);
        this.currentMultiplierObj = { mul: this.currentMultiplier }
        return 0;
    }

    deleteTerrainType(type) {
        if(!this.terrainTypes.has(type)) return -1;
        let current = this.terrainTypes.get(type);
        if(current.level > 0) current.level--;
        else this.terrainTypes.delete(type);
        this.currentMultiplier = this.setCurrentMultiplier(this.terrainTypes, this.multipliersMap, this.currentMultiplier);
        this.currentMultiplierObj = { mul: this.currentMultiplier }
        return 0;
    }

    setTeleportToArrOfObjects(value) {
        this.teleportToArrOfObjects = value;
    }

    setExternalAddedTimeMul(value) {
        this.externalAddedTimeMul = value;
    }

    setCouldBePassed(value) {
        this.couldBePassed = value;
    }

    setVerticeArr(value) {
        this.verticeArr = value;
    }

    addVerticeArr(value) {
        this.verticeArr.push(value);
    }

    setPriceForTravelingAndFromIfLessThanCurrent(value, from) {
        if(this.priceForTraveling > value) return -1;
        this.priceForTraveling = value;
        this.from = from;
        return 0;
    }

    save() {
        let save_obj = {};
        save_obj.objType = "Map Cell";
        for(let key in this) {
            // save Map object as array of [[key, value], ...]
            //console.log("key", key);
            if(key === "multipliersMap") continue;
            if (typeof this[key] === "object" && !Array.isArray(this[key]) && this[key].mul === undefined) {
                save_obj[key] = [];
                let arrOfEntries = Array.from(this[key].entries());

                for (let innerKey = 0; innerKey < arrOfEntries.length; innerKey++) {
                    let value = arrOfEntries[innerKey][1];
                    save_obj[key].push([arrOfEntries[innerKey][0], value]);
                }
                continue;
            }
            /*if(Array.isArray(this[key])) {
                save_obj[key] = [];
                this[key].forEach(item => save_obj[key].push(item));
                continue;
            }*/
            save_obj[key] = this[key];
        }

        /*console.log("Map cell save");
        console.log("save_obj", save_obj);*/
        return save_obj;
    }

    static load(paramsObj) {
        let params = {};
        if (typeof paramsObj === "string") paramsObj = JSON.parse(paramsObj);
        if(!paramsObj.objType && paramsObj.objType !== "Map Cell") return -1;

        for (let key in paramsObj) {
            if(paramsObj[key].length === 0) continue;
            
            if (Array.isArray(paramsObj[key]) && paramsObj[key].at(0)) {
                params[key] = new Map();
                for (let i = 0; i < paramsObj[key].length; i++) {
                    let value = paramsObj[key][i][1];
                    if(value === undefined) {
                        console.log("Map cell load error");
                        console.log("paramsObj", paramsObj);
                        console.log("key", key);
                        console.log("i", i);
                        console.log("paramsObj[key][i]", paramsObj[key][i]);
                    }


                    params[key].set(paramsObj[key][i][0], value);
                }
            }
            else params[key] = paramsObj[key];
        }
        console.log("Map cell load");
        console.log("params", params);
        return new MapCell(params);
    }
}