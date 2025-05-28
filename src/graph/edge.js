export class Edge {

    constructor({vertices, name, length,
                    id, protectionAmount, level,
                    route = [], type = 0, isForVisualisation = true,
                    bandwidth = 1, richness = 1, mapLogic, isLoaded = false, isEitherWay = false}) {
        this.vertices = vertices; // ['name1', 'name2']
        this.name = name;
        this.id = id;

        this.type = type; // 0 - default type, 1 - hidden type
        this.length = Math.round(length * 100 ) / 100;
        this.protectionAmount = Math.round(protectionAmount * 100 ) / 100;
        this.level = level;
        this.isForVisualisation = isForVisualisation;
        this.bandwidth = bandwidth;
        //this.reach = Math.round(reach * 100 ) / 100;
        this.richness = Math.round(richness * 100 ) / 100;
        this.route = route;
        this.isEitherWay = isEitherWay;

        if(!isLoaded) this.updateLength(route, mapLogic);
    }

    updateLength(route, mapLogic) {
        // length calculated through objects of route cells
        this.routeMultipliers = [];
        for (let r = 0; r < route.length; r++) {
            if(!mapLogic.coordsGridArr[route[r][0]]) return -1;
            if(!mapLogic.coordsGridArr[route[r][0]][route[r][1]]) return -1;
            let cell = mapLogic.coordsGridArr[route[r][0]][route[r][1]];
            this.routeMultipliers.push(cell.currentMultiplierObj.mul);
        }
        this.length = Math.round(this.routeMultipliers.reduce((sum, item) => sum + item, 0) * mapLogic.blockSize * 100) / 100;
    }

    save() {
        let save_obj = {};
        save_obj.objType = "Edge";
        for(let key in this) {
            if(Array.isArray(this[key])) {
                save_obj[key] = [];
                this[key].forEach(item => save_obj[key].push(item));
                continue;
            }
            save_obj[key] = this[key];
        }
        return save_obj;
    }

    static load(params) {
        if(!params.objType && params.objType !== "Edge") return -1;
        params.isLoaded = true;
        return new Edge(params);
    }

}
