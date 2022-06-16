export class MapCell {

    // 0 - grass
    // 1 - forest
    // 2 - hills
    // 3 - mountains
    // 4 - small river
    // 5 - river
    // 6 - swamp
    // 7 - lake
    // 8 - rocks
    // 9 - road[]
    //multipliers = [1, 2, , , , , , , ];
    currentMultiplier = 1;

    constructor({x, y, terrainTypes = [{type: 'grass', level: 0}], teleportToArrOfObjects = [], externalAddedTimeMul = 0, couldBePassed = true, verticeArr = []}) {
        this.x = x;
        this.y = y;
        this.terrainTypes = new Map();
        this.teleportToArrOfObjects = teleportToArrOfObjects;
        this.externalAddedTimeMul = externalAddedTimeMul;
        this.couldBePassed = couldBePassed;
        this.verticeArr = verticeArr;

        this.multipliersMap = new Map();
        this.multipliersMap.set('grass', [1]);
        this.multipliersMap.set('forest', [2, 3, 4]);
        this.multipliersMap.set('hills', [1.5]);
        this.multipliersMap.set('mountains', [2.5, 4, 15]);
        this.multipliersMap.set('river', [1.3, 10, 50]);
        this.multipliersMap.set('swamp', [3]);
        this.multipliersMap.set('lake', [50]);
        this.multipliersMap.set('rocks', [1.6]);
        this.multipliersMap.set('road', [0.8, 0.6, 0.5, 0.45, 0.42, 0.40, 0.38, 0.36]);
        this.multipliersMap.set('city', [0.3, 0.29, 0.28, 0.27, 0.26]);
        this.multipliersMap.set('village', [0.75, 0.55, 0.5, 0.45, 0.4]);

        this.currentMultiplier = this.setCurrentMultiplier(this.terrainTypes, this.multipliersMap, this.currentMultiplier);
        for (let type of terrainTypes) {
            this.terrainTypes.set(type.type, type.level);
        }
    }

    setCurrentMultiplier(terrainTypes, multipliersMap, currentMultiplier = 1) {
        currentMultiplier = 1;
        for(let type of terrainTypes.entries()) {
            if(type[1] !== +type[1]) break;
            let mul = multipliersMap.get(type[0]);
            currentMultiplier *= mul[Math.min(type[1], mul.length - 1)];
        }
        currentMultiplier = Math.max(currentMultiplier, 0.2);
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
        return 0;
    }

    deleteTerrainType(type) {
        if(!this.terrainTypes.has(type)) return -1;
        let current = this.terrainTypes.get(type);
        if(current.level > 0) current.level--;
        else this.terrainTypes.delete(type);
        this.currentMultiplier = this.setCurrentMultiplier(this.terrainTypes, this.multipliersMap, this.currentMultiplier);
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
}