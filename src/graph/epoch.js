export class Epoch {
    priceForRoadLevel = [[0, 3, 5, 7, 10], [0, 5, 25]];
    bandwidthForRoadLevel = [[1, 3, 5, 7, 10], [1, 2, 10]];
    costToLevelUpByType = [
        [[1000], [100], [500], [50], [1000]],
        [[10000], [1000], [5000], [500], [10000]]
    ]

    constructor(epoch_index) {
        this.epoch_index = epoch_index;
        this.comfortableBandwidth = this.bandwidthForRoadLevel[epoch_index][Math.floor((this.bandwidthForRoadLevel[epoch_index].length - 1) / 2 )]
    }

    getPriceForRoad() {
        return this.priceForRoadLevel[this.epoch_index];
    }

    getBandwidthForRoad() {
        return this.bandwidthForRoadLevel[this.epoch_index];
    }

    getComfortableBandwidth() {
        return this.comfortableBandwidth;
    }

    getCostToLevelUpByType() {
        return this.costToLevelUpByType[this.epoch_index];
    }

    save() {
        let save_obj = {};
        save_obj.objType = "Epoch";
        // for(let key in this) {
        //     save_obj[key] = this[key];
        // }
        save_obj.epoch_index = this.epoch_index;
        return save_obj;
    }

    static load(params) {
        if(!params.objType && params.objType !== "Epoch") return -1;
        return new Epoch(params.epoch_index);
    }

}