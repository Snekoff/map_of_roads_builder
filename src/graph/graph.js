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
        this.idForNextVertice = 0;
        this.nameForNextEdge = 0;
        this.idForNextEdge = 0;
        this.verticesMap = new Map();
        this.edgesMap = new Map();
        this.verticeObjectsList = verticeObjectsList;
        this.edgeObjectsList = edgeObjectsList;
        this.epoch = new Epoch(epoch_index);
        this.doCitiesLayerNeedARefresh = false;

        this.nameForNextVertice = this.checkVerticesListAndCreateVertices(
            this.verticesList,
            this.verticesMap,
            this.verticesNames,
            this.nameForNextVertice);
        // this.nameForNextEdge = this.checkEdgesListAndCreateEdges(
        //     this.edgesList,
        //     this.edgesMap,
        //     this.edgesNames,
        //     this.nameForNextEdge,
        //     this.verticesMap,
        //     this.adjacentMap);

        this.createVerticesFromObjects(this.verticeObjectsList, this.verticesMap);
    }

    checkVerticesListAndCreateVertices(verticesList, verticesMap, verticesNames, name) {
        if(verticesList.length < 1) return name;
        let grph = this;
        verticesList.forEach(function(item, index) {
            let tmpName = verticesNames[index] || verticesNames[index] === 0 ? verticesNames[index] : name++;
            let vrtce = grph.createVertice({x: Math.round(item[0]), y: Math.round(item[1]), name: tmpName, id: this.idForNextVertice++, type: Math.round(item[2])});
            verticesMap.set(tmpName, vrtce);
        })
        return name;
    }

    createVerticesFromObjects(verticeObjectsList, verticesMap) {
        let grph = this;
        verticeObjectsList.forEach(function(item) {
            while(!item.name || verticesMap.has(item.name)) {
                item.name = item.name === 0 ? item.name : this.nameForNextEdge++;
            }
            item.id = grph.idForNextVertice++;
            let vertice = grph.createVertice(item);
            verticesMap.set(item.id, vertice);
        })
        return verticesMap;
    }

    createVertice(params) {
        return new Vertice(params);
    }

    createEdge({vertices, name, length, protectionAmount = 0, level = 0, type = 0, isForVisualisation = true }) {
        let vrtc1 = this.verticesMap.get(vertices[0]);
        let vrtc2 = this.verticesMap.get(vertices[1]);
        let reach = Math.min(vrtc1.reach, vrtc2.reach);
        let id = this.idForNextEdge++;
        return new Edge({vertices, name, length, id, protectionAmount, level, type, isForVisualisation, bandwidth:this.epoch.getBandwidthForRoad()[level], reach});
    }

    fillMapWithAdjacentVertices(adjacentMap, verticeId, addedAdjacentList) {
        if(adjacentMap.has(verticeId)) {
            let tempListAdj = adjacentMap.get(verticeId).forEach(function (item) { addedAdjacentList.push(item); })
            adjacentMap.set(verticeId, addedAdjacentList);
        }
        adjacentMap.set(verticeId, addedAdjacentList);
        return adjacentMap;
    }

    createEdgeFromTwoPointsAndAddPointsToAdjacentLists(
        vertice1Id,
        vertice2Id,
        adjacentMap,
        edgesMap,
        nameForNextEdge,
        verticesMap,
        protectionAmount = 0,
        level = 0,
        type = 0,
        isCheckNeeded= true,
        isForVisualisation = true) {
        let length = this.countDistanceBetweenVertices(vertice1Id, vertice2Id, verticesMap);
        let checkResult = 0;

        let {prevLevel, isEdgeThere} = this.getCurrentLevelAndIsEdgeThere(edgesMap, vertice1Id, vertice2Id);
        if(prevLevel && prevLevel >= level) return -1;

        if (isCheckNeeded) checkResult = this.checkAndSubtractMoneyOnBuildingIfNeeded(vertice1Id, vertice2Id, verticesMap, length, false, this.epoch, level, prevLevel);
        if(checkResult === -1) return -1;

        if(isEdgeThere) {
            this.upgradeEdgeLevelAndReach(edgesMap, vertice1Id, vertice2Id, level);
        }
        else {
            edgesMap.set(`from ${vertice1Id} to ${vertice2Id}`, this.createEdge({vertices:[vertice1Id, vertice2Id], name: nameForNextEdge, length, protectionAmount, level, type, isForVisualisation}));
            this.fillMapWithAdjacentVertices(adjacentMap, vertice1Id, [vertice2Id]);
        }
        return 0;
    }


    getCurrentLevelAndIsEdgeThere(edgesMap, vertice1Id, vertice2Id) {
        let prevLevel;
        let isEdgeThere = edgesMap.has(`from ${vertice1Id} to ${vertice2Id}`);
        if (isEdgeThere) prevLevel = edgesMap.get(`from ${vertice1Id} to ${vertice2Id}`).level;
        return {prevLevel, isEdgeThere};
    }

    upgradeEdgeLevelAndReach(edgesMap, vertice1Id, vertice2Id, level) {
        let edge = edgesMap.get(`from ${vertice1Id} to ${vertice2Id}`);
        edge.level = level;
        let rech1 = this.verticesMap.get(vertice1Id).reach;
        let rech2 = this.verticesMap.get(vertice1Id).reach;
        edge.reach = Math.min(rech1, rech2);
    }

    countDistanceBetweenVertices(vertice1Id, vertice2Id, verticesMap) {
        let distance = -1;
        let vertice1 = verticesMap.get(vertice1Id);
        let vertice2 = verticesMap.get(vertice2Id);
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

    checkAndSubtractMoneyOnBuildingIfNeeded(vertice1Id, vertice2Id, verticesMap, length, isCheck, epoch = {priceForRoadLevel: 3}, roadLevel = 0, prevLevel = 0) {
        // if(!isCheck) {
        //     console.log("vertice1Id", vertice1Id);
        //     console.log("vertice2Id", vertice2Id);
        //     console.log("roadLevel", roadLevel);
        //     console.log("prevLevel", prevLevel);
        // }
        let vertice1 = verticesMap.get(vertice1Id);
        let vertice2 = verticesMap.get(vertice2Id);
        if( !vertice1 || !vertice2 ) return -1;
        if( length <= 0 ) return -1;
        let priceForRoadLevel = epoch.getPriceForRoad()[roadLevel] - epoch.getPriceForRoad()[prevLevel];
        // console.log('name1',vertice1Id);
        // console.log('name2',vertice2Id);
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

        if(type1 === 4 || type2 === 4) {
            console.log('------------------------0000000000000000000000000000000000000');
            console.log('vertice1Id',vertice1Id);
            console.log('vertice2Id',vertice2Id);
            console.log('vertice1.name',vertice1.name);
            console.log('vertice2.name',vertice2.name);
            console.log('length',length);

        }

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
            vertice1.changeRichness(-1 * priceForRoadLevel * mul1, this.epoch);
            vertice2.changeRichness(-1 * priceForRoadLevel * mul2, this.epoch);
        }
        return checkResult;
    }

    getVerticeOrEdgeByName(id, map) {
        return map.get(id);
    }

    getAllVertices(verticesMap) {
        let vertices = [];
        for(let id of verticesMap.keys()) {
            let item = this.getVerticeOrEdgeByName(id, verticesMap);
            vertices.push(item/*{id: item.id, x: item.x, y: item.y}*/);
        }
        return vertices;
    }

    getAllEdges(edgesMap) {
        let edges = [];
        for(let id of edgesMap.keys()) {
            let item = this.getVerticeOrEdgeByName(id, edgesMap);
            edges.push(item);
        }
        return edges;
    }

    setReachIncome(vertice, epoch, valueFromRoad, roadLevel) {
        let base = 1;
        //let adjMapLngth = this.adjacentMap.get(vertice.id).length;
        let roadModifier = 1/1000 * epoch.getBandwidthForRoad()[roadLevel] / epoch.getComfortableBandwidth();
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
        //let tmp = this.adjacentMap.get(vertice.id).length / 3;
        let base = 0.01;
        let roadModifier = 1/30000 * epoch.getBandwidthForRoad()[roadLevel] / epoch.getComfortableBandwidth();
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
            let ifLeveledUp = vertice.applyIncomeChange(this.epoch);
            if(ifLeveledUp > 0) this.doCitiesLayerNeedARefresh = true;
        }
    }


    save() {
        let save_obj = {};
        save_obj.objType = "Graph";

        for(let key in this) {
            if(typeof this[key] === "object" && !Array.isArray(this[key]) && !(this[key] instanceof Epoch)) {
                save_obj[key] = [];
                let arrOfEntries = Array.from(this[key].entries());

                for(let innerKey = 0; innerKey < arrOfEntries.length; innerKey++) {
                    let value = arrOfEntries[innerKey][1];
                    if(value instanceof Edge || value instanceof Vertice || value instanceof Epoch) {
                        value = arrOfEntries[innerKey][1].save();
                    }
                    save_obj[key].push([arrOfEntries[innerKey][0], value]);
                }
            } else if (this[key] instanceof Epoch) {
                save_obj[key] = this[key].save();
            }
            else save_obj[key] = this[key];
        }
        console.log("save_obj", save_obj);
        return save_obj;
    }

    static load(paramsObj) {
        console.log("paramsObj", paramsObj);
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

                    graph[key].set(paramsObj[key][i][0], value);
                }
            } else if(paramsObj[key].objType && paramsObj[key].objType === "Epoch") graph[key] = Epoch.load(paramsObj[key]);
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
