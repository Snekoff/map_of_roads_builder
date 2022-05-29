const maxIntValueForProperty = 1000000;

export class Vertice {

    constructor({
                    x,
                    y,
                    name,
                    type,
                    richness,
                    prosperity,
                    incomeToAddInNextTurn,
                    numOfWares,
                    defencePower,
                    reach,
                    isForVisualisation = true,
                    reachChange = 0,
                    reachIncome = 1,
                }
        ) {

        this.x = x;
        this.y = y;
        this.isForVisualisation = isForVisualisation;
        this.name = name;

        // 0 - city
        // 1 - village
        // 2 - fort
        // 3 - camp
        // 4 - criminal camp
        this.type = type;
        this.richness = richness;
        this.prosperity = prosperity;
        this.incomeToAddInNextTurn = incomeToAddInNextTurn;
        this.numOfWares = numOfWares;
        //this.resources = resources;
        //this.resourcesNeeded = resourcesNeeded;
        this.defencePower = defencePower;
        this.reach = reach;
        this.reachChange = reachChange;
        this.reachIncome = reachIncome;
        if(this.type === 1 || this.type === 3 || this.type === 4) this.reachIncome = 0;
        if(this.type === 1 || this.type === 4) this.incomeToAddInNextTurn = 0;
        //this.isCapital = false;
    }

    changeType(newType) {
        this.type = newType;
    }

    changeRichness(richnessToAdd) {
        /*console.log('------------------------------------------------------------------------------------------------------------------');
        console.log('this.name', this.name);
        console.log('this.richness', this.richness);
        console.log('richnessToAdd', richnessToAdd);*/
        // todo add loans system
        this.richness += richnessToAdd;
    }

    changeProsperity(newProsperity) {
        this.type = newProsperity;
    }

    changeIncomeToAddInNextTurn(addIncomeToAddInNextTurn, isDefault = false) {
        if(isDefault && (this.type === 1 || this.type === 3 || this.type === 4)) addIncomeToAddInNextTurn = 0.04;
        this.incomeToAddInNextTurn += addIncomeToAddInNextTurn;
    }

    changeNumOfWares(newNumOfWares) {
        this.type = Math.max(newNumOfWares, 0);
    }

    changeDefencePower(newDefencePower) {
        this.type = Math.max(newDefencePower, 0);
    }

    changeReach(newReach) {
        this.type = Math.max(newReach, 0);
    }

    getByVariableName(name) {
        if (!this.hasOwnProperty(name)) {
            return `Field ${name} is not present in obj`;
        }
        return this[name];
    }

    setReachIncome(value, isDefault = false) {
        if(!value && typeof value !== "number") return NaN;
        if(isDefault && (this.type === 1 || this.type === 3 || this.type === 4)) value /= 10;
        this.reachIncome += value;
    }

    setReachChange(addedValue) {
        if(!addedValue && typeof addedValue !== "number") return NaN;
        this.reachChange += addedValue;
    }

    applyReachChange() {
        this.reachChange += this.reachIncome;
        this.reach += this.reachChange;
        if(this.reach > maxIntValueForProperty) this.reach = maxIntValueForProperty;
        if(this.reach < 0) this.reach = 0;
        this.reachChange = 0;
    }

    applyIncomeChange() {
        this.richness += this.incomeToAddInNextTurn;
        this.richness = +(this.richness).toFixed(3);
        if(this.richness > maxIntValueForProperty) this.richness = maxIntValueForProperty;
        this.incomeToAddInNextTurn = 0;
    }

    save() {
        let save_obj = {};
        save_obj.objType = "Vertice";

        for(let key in this) {
            save_obj[key] = this[key];
        }
        return save_obj;
    }

    static load(params) {
        if(!params.objType && params.objType !== "Vertice") return -1;
        return new Vertice(params);
    }

}
