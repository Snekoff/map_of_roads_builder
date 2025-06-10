import {Epoch} from "../graph/epoch.js";
import {Edge} from "../graph/edge.js";
import {Vertice} from "../graph/vertice.js";

const min_terrain_difficulty_mul = 0.2;

let multipliersMap = new Map();
//Five levels for each terrain. There are more levels for roads.
multipliersMap.set('plains', [1, 1, 1, 1, 1]);
multipliersMap.set('forest', [2, 3, 4, 5, 6]);
multipliersMap.set('hills', [1.5, 3, 3, 3, 3]);
multipliersMap.set('mountains', [2.5, 4, 15, 50, 100]);
multipliersMap.set('water', [10, 50, 50, 50, 50]);
multipliersMap.set('rocks', [1.5, 3, 3, 3, 3]);
multipliersMap.set('sand', [1.8, 4, 4, 4, 4]);
multipliersMap.set('snow', [2, 5, 8, 8, 8]);
multipliersMap.set('road', [0.8, 0.6, 0.5, 0.45, 0.42, 0.40, 0.38, 0.36]);
multipliersMap.set('city', [0.5, 0.45, 0.40, 0.35, 0.30]);
multipliersMap.set('village', [0.75, 0.55, 0.5, 0.45, 0.4]);
multipliersMap.set('fort', [0.75, 0.55, 0.5, 0.45, 0.4]);
multipliersMap.set('camp', [0.95, 0.85, 0.75, 0.74, 0.73]);
multipliersMap.set('criminal camp', [50, 150, 999, 999, 999]);

let typeNames = ["city", "village", "fort", "camp", "criminal camp"]

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

    constructor({x, y, terrainTypes = [{type: 'plains', level: 0}], teleportToArrOfObjects = [], externalAddedTimeMul = 0, couldBePassed = true, verticeArr = []}, currentMultiplier = 1) {
        this.objType = "Map Cell";
        this.x = x;
        this.y = y;
        this.terrainTypes = new Map();
        this.teleportToArrOfObjects = teleportToArrOfObjects;
        this.externalAddedTimeMul = externalAddedTimeMul;
        this.couldBePassed = couldBePassed;
        this.verticeArr = verticeArr;

        let terrainTypes_0;
        if(terrainTypes instanceof Map) {
            for(let type_0 of terrainTypes.entries()) {
                if(!terrainTypes_0) terrainTypes_0 = type_0[0];
                this.terrainTypes.set(type_0[0], type_0[1]);
            }
        } else if(terrainTypes[0] instanceof Object)  {
            terrainTypes_0 = terrainTypes[0].type;
            for (let type of terrainTypes) {
                this.terrainTypes.set(type.type, type.level);
            }
        }
        else {
            terrainTypes_0 = terrainTypes[0] && terrainTypes[0][0] ? terrainTypes[0][0]: "plains";
            for (let type of terrainTypes) {
                this.terrainTypes.set(type[0], type[1]);
            }
        }
        this.type = terrainTypes_0

        if(currentMultiplier === 1) this.currentMultiplier = this.setCurrentMultiplier(this.terrainTypes, multipliersMap);
        else this.currentMultiplier = currentMultiplier;
        this.currentMultiplierObj = { mul: this.currentMultiplier }
    }

    setCurrentMultiplier(terrainTypes, multipliersMap, currentMultiplier = 1) {
        // if currentMultiplier is set then it will be used as an external modifier,
        // while currentMultiplier not set, then it will be calculated only from types
        for(let type of terrainTypes.entries()) {
            if(type[1] !== +type[1]) break;
            if(multipliersMap.get(type[0]) === undefined) {
                console.log("multipliersMap type[0] = ", type[0], "type[1] = ", type[1]);
                console.log("terrainTypes = ", terrainTypes, "x =", this.x, "y =", this.y);
            }
            let mul = multipliersMap.get(type[0]);
            currentMultiplier *= mul[Math.min(type[1], mul.length - 1)];
        }
        currentMultiplier = Math.round(Math.max(currentMultiplier, min_terrain_difficulty_mul) * 100) / 100;
        return currentMultiplier;
    }

    addTerrainType(value) {

        if(this.terrainTypes.has(value.type)) {
            let maxLvl = multipliersMap.get(value.type).length - 1;
            let current = this.terrainTypes.get(value.type);
            let newLevel = Math.max(Math.min(value.level, maxLvl), +current);
            this.terrainTypes.set(value.type, newLevel);
            this.currentMultiplier = this.setCurrentMultiplier(this.terrainTypes, multipliersMap);
            return 0;
        }
        this.terrainTypes.set(value.type, value.level);
        this.currentMultiplier = this.setCurrentMultiplier(this.terrainTypes, multipliersMap);
        this.currentMultiplierObj = { mul: this.currentMultiplier }
        return 0;
    }

    deleteTerrainType(type) {
        if(!this.terrainTypes.has(type)) return -1;
        let current = this.terrainTypes.get(type);
        this.terrainTypes.delete(type);
        this.currentMultiplier = this.setCurrentMultiplier(this.terrainTypes, multipliersMap);
        this.currentMultiplierObj = { mul: this.currentMultiplier }
        return 0;
    }

    updateLevelAndType(type, newType, level) {
        let typeStr = typeNames[type];
        let newTypeStr = typeNames[newType];
        if(!this.terrainTypes.has(typeStr)) {
            console.log("Map cell updateLevelAndType error");
            console.log("cell ", this);
            console.log("type ", typeStr);
            console.log("newType ", newTypeStr);
            console.log("level ", level);
            return -1;
        }
        this.terrainTypes.delete(typeStr);
        this.terrainTypes.set(newTypeStr, level);
        this.currentMultiplier = this.setCurrentMultiplier(this.terrainTypes, multipliersMap);
        this.currentMultiplierObj = { mul: this.currentMultiplier }
        return 0;
    }

    addTypeAndLevel(newTypeId, level) {
        let types = ["plains", "forest", "hills", "mountains", "water", "rocks", "sand", "snow", "road",
            "city", "village", "fort", "camp", "criminal camp"];
        let newTypeStr = types[newTypeId];
        console.log("Map cell AddTypeAndLevel newTypeStr = ", newTypeStr, "level = ", level, ", newTypeId =", newTypeId);
        if(!this.terrainTypes.has(this.type)) {
            this.type = newTypeStr;
        }
        this.terrainTypes.set(newTypeStr, level);
        this.currentMultiplier = this.setCurrentMultiplier(this.terrainTypes, multipliersMap);
        this.currentMultiplierObj = { mul: this.currentMultiplier }
        return 0;
    }

    delType(newTypeId) {
        let types = ["plains", "forest", "hills", "mountains", "water", "rocks", "sand", "snow", "road",
            "city", "village", "fort", "camp", "criminal camp"];
        let newTypeStr = types[newTypeId];

        this.terrainTypes.delete(newTypeStr);
        if(this.terrainTypes.size === 0) {
            this.currentMultiplier = 1;
            this.currentMultiplierObj = { mul: this.currentMultiplier }
            return 0
        }
        if(!this.terrainTypes.has(this.type)) {
            //this.type = this.terrainTypes.keys()[0];
            for (let type1 of this.terrainTypes.keys()) {
                this.type = type1;
                break;
            }
        }
        if(newTypeId > 8) {
            this.verticeArr.splice(0, 1);
        }

        this.currentMultiplier = this.setCurrentMultiplier(this.terrainTypes, multipliersMap);
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
        if(this.verticeArr.indexOf(value) !== -1) return -1;
        this.verticeArr.push(value);
        return 0;
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
            //if(paramsObj[key].length === 0) continue;
            
            if (Array.isArray(paramsObj[key]) && paramsObj[key].at(0)) {
                params[key] = new Map();
                for (let i = 0; i < paramsObj[key].length; i++) {
                    let value = paramsObj[key][i][1];
                    if(value === undefined) {
                        /*console.log("Map cell load error");
                        console.log("paramsObj", paramsObj);
                        console.log("key", key);
                        console.log("i", i);
                        console.log("paramsObj[key][i]", paramsObj[key][i]);*/
                        params[key] = [];
                        params[key].push(paramsObj[key][i]);
                    } else {
                        params[key].set(paramsObj[key][i][0], value);
                    }
                }
            }
            else params[key] = paramsObj[key];
        }
        //console.log("Map cell paramsObj", params);
        return new MapCell(params);
    }
}