export class Epoch {
    priceForRoadLevel = [[0, 0.01, 0.15, 0.25, 0.30, 0.45, 0.50, 0.8], [0, 0.5, 0.9]];
    bandwidthForRoadLevel = [[1, 3, 5, 7, 9, 12, 15, 25], [1, 2, 10]];
    costToLevelUpByType = [
        [[1000], [100], [500], [5], [1000]],
        [[10000], [1000], [5000], [500], [10000]]
    ]
    priceForCamp = [[2500], [750]];
    maxComfortableRoadLengthWithoutPlacesToStop = [[100], [750]];

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

    getPriceForCamp() {
        return this.priceForCamp[this.epoch_index];
    }

    getCostToLevelUpByType() {
        return this.costToLevelUpByType[this.epoch_index];
    }

    getMaxComfortableRoadLength() {
        return this.maxComfortableRoadLengthWithoutPlacesToStop[this.epoch_index];
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