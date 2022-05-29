export class Edge {

    constructor({vertices, name, length, protectionAmount, level, type = 0, isForVisualisation = true, bandwidth = 1, reach = 1}) {
        this.vertices = vertices; // ['name1', 'name2']
        this.name = name;

        this.type = type; // 0 - default type, 1 - hidden type
        this.length = length;
        this.protectionAmount = protectionAmount;
        this.level = level;
        this.isForVisualisation = isForVisualisation;
        this.bandwidth = bandwidth;
        this.reach = reach;
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
