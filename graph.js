export class Graph {
    // defining vertex array and
    // adjacent list
    constructor(
        numOfVertices = 0, // to generate randomly
        verticesList = [], // [[x1, y1,], [x2, y2], ... [x3, y3]]
        verticesNames = [], // [ 'name1', 'name2', ...  'name3']
        edgesList = [], // [['name1', 'name2',], ['name2', 'name3'], ... ['name3', 'name2']]
        edgesNames = [], // [ 'name1', 'name2', ...  'name3']
        verticeObjectsList = [],
        edgeObjectsList = []
    ) {

        this.numOfVertices = numOfVertices;
        this.adjacentMap = new Map();
        this.verticesList = verticesList;
        this.verticesNames = verticesNames;
        this.edgesList = edgesList;
        this.edgesNames = edgesNames;
        this.nameForNextVertice = 0;
        this.nameForNextEdge = 0;
        this.verticesMap = new Map();
        this.edgesMap = new Map();
        this.verticeObjectsList = verticeObjectsList;
        this.edgeObjectsList = edgeObjectsList;

        // this.nameForNextVertice = this.checkVerticesListAndCreateVertices(
        //     this.verticesList,
        //     this.verticesMap,
        //     this.verticesNames,
        //     this.nameForNextVertice);
        // this.nameForNextEdge = this.checkEdgesListAndCreateEdges(
        //     this.edgesList,
        //     this.edgesMap,
        //     this.edgesNames,
        //     this.nameForNextEdge,
        //     this.verticesMap,
        //     this.adjacentMap);

        this.createVerticesFromObjects(this.verticeObjectsList, this.nameForNextVertice, this.verticesMap);
    }

    createVerticesFromObjects(verticeObjectsList, randName, verticesMap) {
        let grph = this;
        verticeObjectsList.forEach(function(item) {
            while(!item.name && verticesMap.has(item.name)) {
                item.name = item.name || item.name === 0 ? item.name : name++;
            }
            let vertice = grph.createVertice(item);
            verticesMap.set(item.name, vertice);
        })
        return verticesMap;
    }

    createEdgesFromObjects(edgeObjectsList) {

    }

    checkVerticesListAndCreateVertices(verticesList, verticesMap, verticesNames, name) {
        if(verticesList.length < 1) return name;
        let grph = this;
        verticesList.forEach(function(item, index) {
            // TODO: check for error prone
            let tmpName = verticesNames[index] || verticesNames[index] === 0 ? verticesNames[index] : name++;
            let vrtce = grph.createVertice({x: item[0], y: item[1], name: tmpName});
            verticesMap.set(tmpName, vrtce);
        })
        return name;
    }

    checkEdgesListAndCreateEdges(edgesList, edgesMap, edgesNames, name, verticesMap, adjacentMap) {
        if(edgesList.length < 1) return name;
        let grph = this;
        edgesList.forEach(function(item, index) {
            // TODO: check for error prone
            let tmpName = edgesNames[index] || edgesNames[index] === 0 ? edgesNames[index] : name++;
            let edge = grph.createEdgeFromTwoPointsAndAddPointsToAdjacentLists(item[0], item[1], adjacentMap, edgesMap, tmpName, verticesMap);//grph.createEdge(item, grph.countDistanceBetweenVertices(item[0], item[1], verticesMap));
            //edgesMap.set(tmpName, edge);
        })
        return name;
    }

    createVertice(params/*{
        x,
        y,
        name,
        type = 0,
        richness = 0,
        prosperity = 0,
        incomeToAddInNextTurn = 0,
        numOfWares = 0,
        defencePower = 0,
        reach = 0,
        isForVisualisation = true }*/) {

        return new Vertices(params/*
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
            isForVisualisation*/);
    }

    createEdge({vertices, name, length, protectionAmount = 0, level = 0, type = 0, isForVisualisation = true }) {
        return new Edge({vertices, name, length, protectionAmount, level, type, isForVisualisation});
    }

    fillMapWithAdjacentVertices(adjacentMap, verticeName, addedAdjacentList) {
        if(adjacentMap.has(verticeName)) {
            let tempListAdj = adjacentMap.get(verticeName).forEach(function (item) { addedAdjacentList.push(item); })
            adjacentMap.set(verticeName, tempListAdj);
        }
        adjacentMap.set(verticeName, addedAdjacentList);
        return adjacentMap;
    }

    createEdgeFromTwoPointsAndAddPointsToAdjacentLists(
        vertice1Name,
        vertice2Name,
        adjacentMap,
        edgesMap,
        nameForNextEdge,
        verticesMap,
        protectionAmount = 0,
        level = 0,
        type = 0,
        isForVisualisation = true) {
        // TODO: check distance
        let lngth = this.countDistanceBetweenVertices(vertice1Name, vertice2Name, verticesMap);
        if(lngth === -1 || lngth === 0) return adjacentMap;
        edgesMap.set(`from ${vertice1Name} to ${vertice2Name}`, this.createEdge({vertices:[vertice1Name, vertice2Name], name: nameForNextEdge, length:lngth, protectionAmount, level, type, isForVisualisation}));

        return this.fillMapWithAdjacentVertices(adjacentMap, vertice1Name, [vertice2Name]);
    }

    countDistanceBetweenVertices(vertice1Name, vertice2Name, verticesMap) {
        let distance = -1;
        let vertice1 = verticesMap.get(vertice1Name);
        let vertice2 = verticesMap.get(vertice2Name);
        if(!vertice1 || !vertice2) {
            return -1;
        }
        distance = Math.round(
            Math.pow(
                Math.pow(Math.abs(vertice1.x - vertice2.x), 2) + Math.pow(Math.abs(vertice1.y - vertice2.y), 2)
                ,( 1 / 2 ))
        );
        return distance;
    }

    getVerticeOrEdgeByName(name, map) {
        return map.get(name);
    }

    getAllVertices(verticesMap) {
        let vertices = [];
        for(let name of verticesMap.keys()) {
            let item = this.getVerticeOrEdgeByName(name, verticesMap);
            vertices.push(item/*{name: item.name, x: item.x, y: item.y}*/);
        }
        return vertices;
    }

    getAllEdges(edgesMap) {
        let edges = [];
        for(let name of edgesMap.keys()) {
            let item = this.getVerticeOrEdgeByName(name, edgesMap);
            edges.push(item);
        }
        return edges;
    }

    setReachIncome(vertice) {
        let tmp = this.adjacentMap.get(vertice.name).length + 1;
        vertice.setReachIncome(tmp);
    }

    setReachIncomeForAllVertices() {
        for(let vertice of this.adjacentMap.keys()) {
            this.setReachIncome(this.verticesMap.get(vertice));
        }
    }

    applyReachChangeForAllVertices() {
        for(let vertice of this.verticesMap.values()) {
            vertice.applyReachChange();
        }
    }

    save() {
        let save_obj = {};
        save_obj.objType = "Graph";

        for(let key in this) {
            if(typeof this[key] === "object" && !Array.isArray(this[key])) {
                save_obj[key] = [];
                let arrOfEntries = Array.from(this[key].entries());

                for(let innerKey = 0; innerKey < arrOfEntries.length; innerKey++) {
                    let value = arrOfEntries[innerKey][1];
                    if(value instanceof Edge || value instanceof Vertices) {
                        value = arrOfEntries[innerKey][1].save();
                    }
                    save_obj[key].push([arrOfEntries[innerKey][0], value]);
                }
            }
            else save_obj[key] = this[key];
        }
        return save_obj;
    }

    static load(paramsObj) {
        let graph = new Graph();
        if(typeof paramsObj === "string") paramsObj = JSON.parse(paramsObj);
        if(!paramsObj.objType && paramsObj.objType !== "Graph") {
            // console.log("Graph.load paramsObj", paramsObj);
            // console.log("Graph.load typeof paramsObj", typeof paramsObj);
            // console.log("Graph.load paramsObj.objType", paramsObj.objType);
            return -1;
        }

        for(let key in paramsObj) {
            // console.log("--------------------------------paramsObj---------------------------------");
            // console.log("key", key);
            // console.log("typeof paramsObj[key]", typeof paramsObj[key]);
            // console.log("paramsObj[key]", paramsObj[key]);
            // console.log("paramsObj[key][0]", paramsObj[key][0]);
            // console.log("Array.isArray(paramsObj[key]", Array.isArray(paramsObj[key]));
            // console.log("Array.isArray(paramsObj[key][0])", Array.isArray(paramsObj[key][0]));

            if(typeof paramsObj[key] === "object" && Array.isArray(paramsObj[key]) && paramsObj[key].at(0) && Array.isArray(paramsObj[key][0])) {
                // console.log("+++++++++++++++++++++++++++++++in if+++++++++++++++++++++++++++++++++++++++++++++++++");
                // console.log("graph[key]", graph[key]);
                // console.log("paramsObj[key][0][0]", paramsObj[key][0][0]);
                // console.log("paramsObj[key][0][1]", paramsObj[key][0][1]);
                // console.log("typeof paramsObj[key][0][1]", typeof paramsObj[key][0][1]);

                for(let i = 0; i < paramsObj[key].length; i++) {
                    let value = paramsObj[key][i][1];
                    if(value.objType && value.objType === "Vertice") value = Vertices.load(value);
                    if(value.objType && value.objType === "Edge") value = Edge.load(value);
                    graph[key].set(paramsObj[key][i][0], value);
                }
            }
            else graph[key] = paramsObj[key];
        }
        return graph;
    }


    // addVertex(v)
    // addEdge(v, w)

    // functions to be implemented
    // printGraph()

    // bfs(v)
    // dfs(v)
}

export class Vertices {

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
        //this.isCapital = false;
    }

    changeType(newType) {
        this.type = newType;
    }

    changeRichness(newRichness) {
        this.type = newRichness;
    }

    changeProsperity(newProsperity) {
        this.type = newProsperity;
    }

    changeIncomeToAddInNextTurn(newIncomeToAddInNextTurn) {
        this.type = newIncomeToAddInNextTurn;
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

    setReachIncome(value) {
        if(!value && typeof value !== "number") return NaN;
        this.reachIncome = value;
    }

    setReachChange(addedValue) {
        if(!addedValue && typeof addedValue !== "number") return NaN;
        this.reachChange += addedValue;
    }

    applyReachChange() {
        this.reachChange += this.reachIncome;
        this.reach += this.reachChange;
        if(this.reach < 0) this.reach = 0;
        this.reachChange = 0;
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
        return new Vertices(params);
    }

}

export class Edge {

    constructor({vertices, name, length, protectionAmount, level, type = 0, isForVisualisation = true}) {
        this.vertices = vertices; // ['name1', 'name2']
        this.name = name;

        this.type = type; // 0 - default type, 1 - hidden type
        this.length = length;
        this.protectionAmount = protectionAmount;
        this.level = level;
        this.isForVisualisation = isForVisualisation;

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
