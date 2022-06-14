export class Edge {

    constructor({vertices, name, length, id, protectionAmount, level, route = [], type = 0, isForVisualisation = true, bandwidth = 1, richness = 1}) {
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
    }

    save() {
        let save_obj = {};
        save_obj.objType = "Edge";
        for(let key in this) {
            save_obj[key] = this[key];
        }
        return save_obj;
    }

    static load(params) {
        if(!params.objType && params.objType !== "Edge") return -1;
        return new Edge(params);
    }

}
