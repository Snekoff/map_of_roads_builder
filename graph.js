import {Vertice} from "./vertice.js";
import {Edge} from "./edge.js";
import {Epoch} from "./epoch.js";


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
        edgeObjectsList = [],
        epoch_index = 0
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
        this.epoch = new Epoch(epoch_index);

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

        return new Vertice(params/*
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
        let vrtc1 = this.verticesMap.get(vertices[0]);
        let vrtc2 = this.verticesMap.get(vertices[1]);
        let reach = Math.min(vrtc1.reach, vrtc2.reach);
        return new Edge({vertices, name, length, protectionAmount, level, type, isForVisualisation, bandwidth:this.epoch.getPriceForRoad()[level], reach});
    }

    fillMapWithAdjacentVertices(adjacentMap, verticeName, addedAdjacentList) {
        if(adjacentMap.has(verticeName)) {
            let tempListAdj = adjacentMap.get(verticeName).forEach(function (item) { addedAdjacentList.push(item); })
            adjacentMap.set(verticeName, addedAdjacentList);
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
        isCheckNeeded= true,
        isForVisualisation = true) {
        let length = this.countDistanceBetweenVertices(vertice1Name, vertice2Name, verticesMap);
        let checkResult = 0;

        let prevLevel;
        let isEdgeThere = edgesMap.has(`from ${vertice1Name} to ${vertice2Name}`);
        if(isEdgeThere) prevLevel = edgesMap.get(`from ${vertice1Name} to ${vertice2Name}`).level;
        if(prevLevel && prevLevel >= level) return -1;

        if (isCheckNeeded) checkResult = this.checkAndSubtractMoneyOnBuildingIfNeeded(vertice1Name, vertice2Name, verticesMap, length, false, this.epoch, level, prevLevel);
        if(checkResult === -1) return -1;

        if(isEdgeThere) {
            let edge = edgesMap.get(`from ${vertice1Name} to ${vertice2Name}`);
            edge.level = level;
            let rech = this.verticesMap.get(vertice1Name).reach;
            edge.reach = rech;
        }
        else {
            edgesMap.set(`from ${vertice1Name} to ${vertice2Name}`, this.createEdge({vertices:[vertice1Name, vertice2Name], name: nameForNextEdge, length, protectionAmount, level, type, isForVisualisation}));
            this.fillMapWithAdjacentVertices(adjacentMap, vertice1Name, [vertice2Name]);
        }
        return 0;
    }


    countDistanceBetweenVertices(vertice1Name, vertice2Name, verticesMap) {
        // TODO: check distance
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

    checkAndSubtractMoneyOnBuildingIfNeeded(vertice1Name, vertice2Name, verticesMap, length, isCheck, epoch = {priceForRoadLevel: 3}, roadLevel = 0, prevLevel = 0) {
        let vertice1 = verticesMap.get(vertice1Name);
        let vertice2 = verticesMap.get(vertice2Name);
        if( !vertice1 || !vertice2 ) return -1;
        if( length <= 0 ) return -1;
        let priceForRoadLevelNeg = -1 * epoch.priceForRoadLevel;
        let priceForRoadLevel = epoch.getPriceForRoad()[roadLevel] - epoch.getPriceForRoad()[prevLevel];
        // console.log('name1',vertice1Name);
        // console.log('name2',vertice2Name);
        // console.log('length',length);
        // console.log('vertice1',vertice1);
        // console.log('vertice2',vertice2);
        let type1 = vertice1.type;
        let type2 = vertice2.type;
        let richness1 = vertice1.richness;
        let richness2 = vertice2.richness;
        let reach1 = vertice1.reach;
        let reach2 = vertice2.reach;
        let checkResult = -1;
        let mul1 = 0.0, mul2 = 0.0;
        if (type1 === 0 || type1 === 2) {
            if (type2 === 0 && reach1 + reach2 >= length && richness1 + richness2 >= priceForRoadLevel) {
                checkResult = 0;
                mul1 = 1 / 2;
                mul2 = 1 / 2;
            }
            if (type2 === 1 && reach1 >= length && richness1 >= priceForRoadLevel) {
                checkResult = 0;
                mul1 = 1;
                mul2 = 0;
            }
            if (type2 === 2 && reach1 + reach2 >= length && richness1 + richness2 >= priceForRoadLevel) {
                checkResult = 0;
                mul1 = 1 / 2;
                mul2 = 1 / 2;
            }
            if (type2 === 3 && reach1 >= length && richness1 >= priceForRoadLevel) {
                checkResult = 0;
                mul1 = 1;
                mul2 = 0;
            }
            if (type2 === 4) {
                checkResult = -1;

            }
        }
        if (type1 === 1) {
            if (type2 === 0 && reach1 + reach2 >= length && richness1 >= priceForRoadLevel) {
                checkResult = 0;
                mul1 = 1;
                mul2 = 0;
            }
            if (type2 === 1 && reach1 >= length && richness1 >= priceForRoadLevel) {
                checkResult = 0;
                mul1 = 1;
                mul2 = 0;
            }
            if (type2 === 2 && reach1 + reach2 >= length && richness1 >= priceForRoadLevel) {
                checkResult = 0;
                mul1 = 1;
                mul2 = 0;
            }
            if (type2 === 3) {
                checkResult = -1;

            }
            if (type2 === 4) {
                checkResult = -1;

            }
        }
        // if(type1 === 2) {
        //     if(type2 === 0 ) {
        //         return 0;
        //     }
        //     if(type2 === 1 ) {
        //         return 0;
        //     }
        //     if(type2 === 2 ) {
        //         return 0;
        //     }
        //     if(type2 === 3 ) {
        //         return 0;
        //     }
        //     if(type2 === 4) {
        //         return -1;
        //     }
        // }
        if (type1 === 3) {
            if (type2 === 0 && reach1 + reach2 >= length && richness1 + richness2 >= priceForRoadLevel) {
                checkResult = 0;
                mul1 = 1 / 2;
                mul2 = 1 / 2;
            }
            if (type2 === 1 && reach1 >= length) {
                checkResult = 0;
                mul1 = 0;
                mul2 = 0;
            }
            if (type2 === 2 && reach1 + reach2 >= length && richness1 + richness2 >= priceForRoadLevel) {
                checkResult = 0;
                mul1 = 1 / 2;
                mul2 = 1 / 2;
            }
            if (type2 === 3 && reach1 >= length) {
                checkResult = 0;
                mul1 = 0;
                mul2 = 0;
            }
            if (type2 === 4) {
                checkResult = -1;

            }
        }
        if (type1 === 4) {
            if (type2 === 0 && reach1 >= length && richness1 >= 2 * priceForRoadLevel / 3) {
                checkResult = 0;
                mul1 = 2 / 3;
                mul2 = 0;
            }
            if (type2 === 1 && reach1 >= length && richness1 >= 2 * priceForRoadLevel / 3) {
                checkResult = 0;
                mul1 = 2 / 3;
                mul2 = 0;
            }
            if (type2 === 2 && reach1 + reach2 >= length) {
                checkResult = -1;

            }
            if (type2 === 3 && reach1 >= length) {
                checkResult = -1;

            }
            if (type2 === 4 && reach1 + reach2 >= length && richness1 + richness2 >= 2 * priceForRoadLevel / 3) {
                checkResult = 0;
                mul1 = 1 / 3;
                mul2 = 1 / 3;
            }
        }

         if (!isCheck) {
            //if (checkResult === -1) return -1;
            vertice1.changeRichness(-1 * priceForRoadLevel * mul1);
            vertice2.changeRichness(-1 * priceForRoadLevel * mul2);
        }
        return checkResult;
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

    setReachIncome(vertice, epoch, valueFromRoad, roadLevel) {
        let base = 1;
        //let adjMapLngth = this.adjacentMap.get(vertice.name).length;
        let roadModifier = 1/1000 * epoch.bandwidthForRoadLevel[epoch.epoch_index][roadLevel] / epoch.getComfortableBandwidth();
        let roadAddedReach = valueFromRoad * roadModifier;

        vertice.setReachIncome(base + roadAddedReach/*adjMapLngth * roadModifier*/, true);
    }

    setReachIncomeForAllVertices() {
        for(let vertice of this.adjacentMap.keys()) {
            let arr = this.adjacentMap.get(vertice);
            for (let i = 0; i < arr.length; i++) {
                let edge = this.edgesMap.get(`from ${vertice} to ${arr[i]}`);
                if(!edge.isForVisualisation) continue;
                let roadReach = edge.reach;
                let roadLevel = edge.level;
                this.setReachIncome(this.verticesMap.get(vertice), this.epoch, roadReach, roadLevel);
            }
        }
    }

    applyReachChangeForAllVertices() {
        for(let vertice of this.verticesMap.values()) {
            vertice.applyReachChange();
        }
    }

    setIncomeChange(vertice, epoch, valueFromRoad, roadLevel) {
        //let tmp = this.adjacentMap.get(vertice.name).length / 3;
        let base = 1;
        let roadModifier = 1/30000 * epoch.bandwidthForRoadLevel[epoch.epoch_index][roadLevel] / epoch.getComfortableBandwidth();
        let roadAddedReach = valueFromRoad * roadModifier;

        vertice.changeIncomeToAddInNextTurn(base + roadAddedReach/*adjMapLngth * roadModifier*/, true);
    }

    setIncomeChangeForAllVertices() {
        for(let vertice of this.adjacentMap.keys()) {
            let arr = this.adjacentMap.get(vertice);
            for (let i = 0; i < arr.length; i++) {
                let edge = this.edgesMap.get(`from ${vertice} to ${arr[i]}`);
                if(!edge.isForVisualisation) continue;
                let roadReach = edge.reach;
                let roadLevel = edge.level;
                this.setIncomeChange(this.verticesMap.get(vertice), this.epoch, roadReach, roadLevel);
            }
        }
        // let tmp = this.adjacentMap.keys();
        // for(let vertice of this.adjacentMap.keys()) {
        //     this.setIncomeChange(this.verticesMap.get(vertice));
        // }
    }

    applyIncomeChangeForAllVertices() {
        for(let vertice of this.verticesMap.values()) {
            vertice.applyIncomeChange();
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
                    if(value instanceof Edge || value instanceof Vertice || value instanceof Epoch) {
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
                    if(value.objType && value.objType === "Vertice") value = Vertice.load(value);
                    if(value.objType && value.objType === "Edge") value = Edge.load(value);
                    if(value.objType && value.objType === "Epoch") value = Epoch.load(value);
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
