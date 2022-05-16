export class Graph {
    // defining vertex array and
    // adjacent list
    constructor(
        numOfVertices, // to generate randomly
        minX, // starting coordinate
        minY,
        maxX,
        maxY,
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

    createVertice({
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
        isForVisualisation = true }) {

        return new Vertices(
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
            isForVisualisation);
    }

    createEdge({vertices, name, length, protectionAmount = 0, level = 0, type = 0, isForVisualisation = true }) {
        return new Edge({vertices, name, length, protectionAmount, level, type, isForVisualisation});
    }

    fillMapWithAdjacentVertices(map, verticeName, addedAdjacentList) {
        if(map.has(verticeName)) {
            let tempListAdj = map.get(verticeName).forEach(function (item) { addedAdjacentList.push(item); })
            map.set(verticeName, tempListAdj);
        }
        map.set(verticeName, addedAdjacentList);
        return map;
    }

    createEdgeFromTwoPointsAndAddPointsToAdjacentLists(
        vertice1Name,
        vertice2Name,
        adjacentList,
        edgesMap,
        nameForNextEdge,
        verticesMap,
        protectionAmount = 0,
        level = 0,
        type = 0,
        isForVisualisation = true) {
        // TODO: check distance
        let lngth = this.countDistanceBetweenVertices(vertice1Name, vertice2Name, verticesMap);
        if(lngth === -1) return adjacentList;
        edgesMap.set(`from ${vertice1Name} to ${vertice2Name}`, this.createEdge({vertices:[vertice1Name, vertice2Name], name: nameForNextEdge, length:lngth, protectionAmount, level, type, isForVisualisation}));

        return this.fillMapWithAdjacentVertices(adjacentList, vertice1Name, [vertice2Name]);
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


    // addVertex(v)
    // addEdge(v, w)

    // functions to be implemented
    // printGraph()

    // bfs(v)
    // dfs(v)
}

export class Vertices {

    constructor(
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
        isForVisualisation = true) {

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
        //this.isCapital = richness;
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

}
