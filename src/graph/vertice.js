import {Epoch} from "./epoch.js";
import {MapLogic} from "../map/map_logic.js";
import {Edge} from "./edge.js";

const maxIntValueForProperty = 1000000;

export class Vertice {

    reachIncomeMulArrOfArr = [
        [1, (1 / 10), 1, (1 / 10), (1 / 10)],
        [1.2, (1 / 9), 1.2, (1 / 9), (1 / 9)],
        [1.4, (1 / 8), 1.4, (1 / 8), (1 / 8)],
        [1.6, (1 / 7), 1.6, (1 / 7), (1 / 7)],
        [2, (1 / 5), 2, (1 / 5), (1 / 5)]
    ];
    incomeToAddInNextTurnMulArrOfArr = [
        [1, (1 / 10), 1, (1 / 3), (1 / 10)],
        [1.2, (1 / 9), 1.2, (1 / 2), (1 / 9)],
        [1.4, (1 / 8), 1.4, 1, (1 / 8)],
        [1.6, (1 / 7), 1.6, 1.2, (1 / 7)],
        [2, (1 / 5), 2, 1.6, (1 / 5)]
    ];

    constructor({
                    x,
                    y,
                    name,
                    type,
                    id,
                    richness = 0,
                    prosperity = 0,
                    incomeToAddInNextTurn = 0,
                    numOfWares = 0,
                    defencePower = 0,
                    reach = 0,
                    isForVisualisation = true,
                    reachChange = 0,
                    reachIncome = 1,
                    level = 0,
                    adjacentVerticesAndRoadLengthToThem = 0
                }
    ) {

        this.x = x;
        this.y = y;
        this.isForVisualisation = isForVisualisation;
        this.name = name;
        this.id = id;

        // 0 - city
        // 1 - village
        // 2 - fort
        // 3 - camp
        // 4 - criminal camp
        this.typeNames = ["city", "village", "fort", "camp", "criminal camp"];
        this.type = type;
        this.richness = Math.round(richness * 100) / 100;
        this.prosperity = Math.round(prosperity * 100) / 100;
        this.incomeToAddInNextTurn = Math.round(incomeToAddInNextTurn * 100) / 100;
        this.numOfWares = numOfWares;
        //this.resources = resources;
        //this.resourcesNeeded = resourcesNeeded;
        this.defencePower = Math.round(defencePower * 100) / 100;
        this.reach = reach;
        this.reachChange = Math.round(reachChange * 100) / 100;
        this.reachIncome = Math.round(reachIncome * 100) / 100;

        //this.reachIncome *= this.reachIncomeMulArr[this.type];
        //this.incomeToAddInNextTurn *= this.incomeToAddInNextTurnMulArr[this.type];
        this.level = level;
        //this.isCapital = false;

        this.adjacentVerticesAndRoadLengthToThem = new Map();
        if(adjacentVerticesAndRoadLengthToThem !== 0) {
            for (let item of adjacentVerticesAndRoadLengthToThem) {
                this.adjacentVerticesAndRoadLengthToThem.set(item[0], item[1]);
            }
        }

        this.cumulativeCosts = 0;
    }

    changeType(newType) {
        this.type = newType;
        this.changeName(this.type);
    }

    changeName(type) {
        if (type !== 0 && type !== 1) return -1;
        let newName = "new " + this.typeNames[type];
        let tmp = this.name.toString().lastIndexOf(" ");
        if(tmp < 0) tmp = this.name.toString().length - 3;
        tmp = this.name.toString().slice(Math.max(tmp, 0));
        this.name = newName + " " + tmp;
        // console.log('------------------------------------------------');
        // console.log('name', this.name);
    }

    checkIfEnoughRichnessToLevelUp(epoch) {
        // village and camp could level up in city
        if (this.level >= 4 && this.type !== 1 && this.type !== 3) return false;
        let price = epoch.getCostToLevelUpByType()[this.type];
        return this.richness >= price;
    }

    levelUp(epoch) {
        // village and camp could level up in city
        this.changeRichness(-1 * epoch.getCostToLevelUpByType()[this.type])
        this.level++;
        if (this.level > 4 && this.type === 1 ) {
            this.level = 0;
            this.changeType(0);
            return 1;
        }
        if (this.level > 4 && this.type === 3) {
            this.level = 0;
            this.changeType(1);
            return 1;
        }
        if(this.level > 5) this.level = 5;
        return this.level;
    }

    changeRichness(richnessToAdd) {
        if (!richnessToAdd && typeof richnessToAdd !== "number") return NaN;
        // todo add loans system
        this.richness += Math.round(richnessToAdd * 100) / 100;
    }

    cumulateCosts(valueToAdd) {
        this.cumulativeCosts += valueToAdd;
    }

    applyCumulativeCosts(wasRoadBuilt = true) {
        if (wasRoadBuilt) {
            this.changeRichness(this.cumulativeCosts);
        }
        this.cumulativeCosts = 0;
    }

    changeProsperity(newProsperity) {
        this.type = newProsperity;
    }

    changeIncomeToAddInNextTurn(addIncomeToAddInNextTurn, isGivenByRoads = false) {
        if (!addIncomeToAddInNextTurn && typeof addIncomeToAddInNextTurn !== "number") return NaN;
        if (isGivenByRoads) addIncomeToAddInNextTurn *= this.incomeToAddInNextTurnMulArrOfArr[this.level][this.type];
        this.incomeToAddInNextTurn += Math.round(addIncomeToAddInNextTurn * 100) / 100;
    }

    changeNumOfWares(newNumOfWares) {
        this.numOfWares = Math.max(newNumOfWares, 0);
    }

    changeDefencePower(newDefencePower) {
        this.defencePower = Math.max(newDefencePower, 0);
    }

    getVariableByName(name) {
        if (!this.hasOwnProperty(name)) {
            return `Field ${name} is not present in obj`;
        }
        return this[name];
    }

    setReachIncome(value, isGivenByRoads = false) {
        if (!value && typeof value !== "number") return NaN;
        if (isGivenByRoads) value *= this.reachIncomeMulArrOfArr[this.level][this.type];
        this.reachIncome += Math.round(value * 100) / 100;
    }

    setReachChange(addedValue) {
        if (!addedValue && typeof addedValue !== "number") return NaN;
        this.reachChange += Math.round(addedValue * 100) / 100;
    }

    applyReachChange() {
        this.reachChange += Math.round(this.reachIncome * 100) / 100;
        this.reach += Math.round(this.reachChange * 100) / 100;
        if (this.reach > maxIntValueForProperty) this.reach = maxIntValueForProperty - 1;
        if (this.reach < 0) this.reach = 0;
        this.reachChange = 0;
        return 0;
    }

    applyIncomeChange(epoch) {
        this.richness += Math.round(this.incomeToAddInNextTurn * 100) / 100;
        this.richness = Math.round(this.richness * 1000) / 1000;
        if (this.richness > maxIntValueForProperty) this.richness = maxIntValueForProperty - 1;
        this.incomeToAddInNextTurn = 0;
        if (this.checkIfEnoughRichnessToLevelUp(epoch)) return this.levelUp(epoch);
        return 0;
    }

    save() {
        let save_obj = {};
        save_obj.objType = "Vertice";

        for (let key in this) {
            if (typeof this[key] === "object" && !Array.isArray(this[key])) {
                save_obj[key] = [];
                let arrOfEntries = Array.from(this[key].entries());

                for (let innerKey = 0; innerKey < arrOfEntries.length; innerKey++) {
                    let value = arrOfEntries[innerKey][1];
                    save_obj[key].push([arrOfEntries[innerKey][0], value]);
                }
            }
            else {
                save_obj[key] = this[key];
            }
        }
        /*console.log("Vertice saved here");
        console.log(save_obj);
        console.log("Vertice save end here");*/
        return save_obj;
    }

    static load(params) {
        if (!params.objType && params.objType !== "Vertice") return -1;
        return new Vertice(params);
    }

}
