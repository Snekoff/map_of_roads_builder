import {Vertice} from "./vertice.js";
import {Edge} from "./edge.js";
import {Epoch} from "./epoch.js";
import {MapLogic} from "../map/map_logic.js";


export class Graph {
    reachModifier = 1 / 10000;
    incomeModifier = 1 / 300;

    constructor(
        numOfVertices = 0, // to generate randomly
        verticesList = [], // [[x1, y1,], [x2, y2], ... [x3, y3]]
        verticesNames = [], // [ 'name1', 'name2', ...  'name3']
        edgesList = [], // [['name1', 'name2',], ['name2', 'name3'], ... ['name3', 'name2']]
        edgesNames = [], // [ 'name1', 'name2', ...  'name3']
        verticeObjectsList = [],
        edgeObjectsList = [],
        currentRound,
        epoch_index = 0
    ) {

        this.numOfVertices = numOfVertices;
        this.adjacentMap = new Map();
        this.verticesList = verticesList;
        this.verticesNames = verticesNames;
        this.edgesList = edgesList;
        this.edgesNames = edgesNames;
        this.nameForNextVertice = 0;
        this.idForNextVertice = [0];
        this.nameForNextEdge = [0];
        this.idForNextEdge = 0;
        this.verticesMap = new Map();
        this.edgesMap = new Map();
        this.verticeObjectsList = verticeObjectsList;
        this.edgeObjectsList = edgeObjectsList;
        this.epoch = new Epoch(epoch_index);
        this.doCitiesLayerNeedARefresh = false;
        this.currentRound = currentRound;

        this.idForNextVertice[0] = this.checkVerticesListAndCreateVertices(
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

        this.createVerticesFromObjects(this.verticeObjectsList, this.verticesMap, this.idForNextVertice);
    }

    checkVerticesListAndCreateVertices(verticesList, verticesMap, verticesNames, name) {
        if (verticesList.length < 1) return name;
        let grph = this;
        verticesList.forEach(function (item, index) {
            let tmpName = verticesNames[index] || verticesNames[index] === 0 ? verticesNames[index] : name++;
            let vrtce = grph.createVertice({
                x: Math.round(item[0]),
                y: Math.round(item[1]),
                name: tmpName,
                id: grph.idForNextVertice[0]++,
                type: Math.round(item[2])
            });
            verticesMap.set(vrtce.id, vrtce);
        })
        return grph.idForNextVertice[0];
    }

    createVerticesFromObjects(verticeObjectsList, verticesMap, idForNextVertice) {
        let grph = this;
        verticeObjectsList.forEach(function (item) {
            // while(!item.name || verticesMap.has(item.id)) {
            //     item.name = item.name === 0 ? item.name : this.nameForNextEdge++;
            // }
            item.id = item.id ? item.id : idForNextVertice[0]++;
            item.name = item.name || item.name === 0 ? item.name : item.id;
            let vertice = grph.createVertice(item);
            verticesMap.set(item.id, vertice);
        })
        return verticesMap;
    }

    createVertice(params) {
        return new Vertice(params);
    }

    createEdge({
                   vertices,
                   name,
                   length,
                   protectionAmount = 0,
                   level = 0,
                   route = [],
                   type = 0,
                   isForVisualisation = true
               }) {
        let vrtc1 = this.verticesMap.get(vertices[0]);
        let vrtc2 = this.verticesMap.get(vertices[1]);
        let richness = Math.min(vrtc1.richness, vrtc2.richness);
        let id = this.idForNextEdge++;
        return new Edge({
            vertices,
            name,
            length,
            id,
            protectionAmount,
            level,
            route,
            type,
            isForVisualisation,
            bandwidth: this.epoch.getBandwidthForRoad()[level],
            richness
        });
    }

    fillMapWithAdjacentVertices(adjacentMap, verticeId, addedAdjacentList) {
        if (adjacentMap.has(verticeId)) {
            let tempListAdj = adjacentMap.get(verticeId).forEach(function (item) {
                addedAdjacentList.push(item);
            })
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
        mapLogic,
        protectionAmount = 0,
        level = 0,
        type = 0,
        isCheckNeeded = true,
        isForVisualisation = true,
        isBfsNeeded = true,
        routeReversed = [],
        lengthAlreadyBuilt = 0,
        edgesToBeAddedAndRouteAlready = {}
    ) {
        this.mapLogic = mapLogic;
        //let length = this.countDistanceBetweenVertices(vertice1Id, vertice2Id, verticesMap);
        let bfsResult;
        console.log("vertice1Id", vertice1Id);
        console.log("vertice2Id", vertice2Id);
        console.log("edgesMap.get(`from ${vertice1Id} to ${vertice2Id}`)", edgesMap.get(`from ${vertice1Id} to ${vertice2Id}`));
        if (isBfsNeeded) bfsResult = this.mapLogic.bfsFromOneVerticeToAnother(vertice1Id, vertice2Id, this, this.currentRound[0]);

        if (isBfsNeeded && bfsResult === undefined) return -1;

        let length = isBfsNeeded ? bfsResult.price : lengthAlreadyBuilt;
        let route = isBfsNeeded ? bfsResult.route : routeReversed;
        // edgesToBeAddedAndRoute = {edges: [[]], routes: [[]], length: []}
        let edgesToBeAddedAndRoute = isBfsNeeded ? bfsResult.edgesToBeAddedAndRoute : edgesToBeAddedAndRouteAlready;
        if (bfsResult === undefined) {
            bfsResult = {price: length, route, edgesToBeAddedAndRoute}
        }

        console.log("length", length);
        console.log("route", route);
        let checkResult = 0;
        let {prevLevel, isEdgeThere} = this.getCurrentLevelAndIsEdgeThere(edgesMap, vertice1Id, vertice2Id);
        if (prevLevel && prevLevel >= level) return -1;

        if (isCheckNeeded) checkResult =
            this.checkAndSubtractMoneyOnBuildingIfNeeded(vertice1Id, vertice2Id, verticesMap, length,
                true, this.epoch, level, prevLevel);
        if (checkResult.checkResult === -1) {
            // console.log("checkAndSubtractMoneyOnBuildingIfNeeded failed");
            // console.log("vertice1Id", vertice1Id);
            // console.log("vertice2Id", vertice2Id);
            // console.log("length", length);
            // console.log("level", level);
            // console.log("prevLevel", prevLevel);
            return -1;
        }

        level = checkResult.roadLevel;
        let vertice = this.verticesMap.get(vertice1Id);
        let resultsOfEdges = [];
        if(edgesToBeAddedAndRoute.routes[edgesToBeAddedAndRoute.routes.length - 1].length === 0) { edgesToBeAddedAndRoute.routes.splice(-1, 1); }
        if(edgesToBeAddedAndRoute.edges[edgesToBeAddedAndRoute.edges.length - 1].length === 0) { edgesToBeAddedAndRoute.edges.splice(-1, 1); }

        for (let i = 0; i < edgesToBeAddedAndRoute.edges.length; i++) {
            let __ret = this.forEachEdgeInBfsRouteCreateOrUpdateEdge(edgesToBeAddedAndRoute, resultsOfEdges, i, edgesMap, vertice1Id, vertice2Id, level, isCheckNeeded, verticesMap, isBfsNeeded, protectionAmount, type, isForVisualisation, adjacentMap);
            length = __ret.length;
            route = __ret.route;
            if (edgesToBeAddedAndRoute.routes.length > 1) {
                checkResult =
                    this.checkAndSubtractMoneyOnBuildingIfNeeded(vertice1Id, vertice2Id, verticesMap, length,
                        false, this.epoch, level, prevLevel, vertice1Id);
            }
            if(length === -1) {
                return -1;
            }
        }

        for(let edge of resultsOfEdges) {
            edge.edgesMap = this.edgesMap;
            this.createBfsEdge(edge);
        }

        if (isCheckNeeded) {
            if (edgesToBeAddedAndRoute.routes.length > 1) {
                this.verticesMap.get(vertice1Id).applyCumulativeCosts();
            } else {
                checkResult =
                    this.checkAndSubtractMoneyOnBuildingIfNeeded(vertice1Id, vertice2Id, verticesMap, length,
                        false, this.epoch, level, prevLevel);
            }

        }
        if (checkResult.checkResult === -1) return -1;

        // on previous step there are cumulated costs for each edge together
        // if there were few edges than vertice 1 is sponsor and have to pay for all if road was built successfully
        // if(edgesToBeAddedAndRoute.edges.length > 1) {
        //     vertice.applyCumulativeCosts(true);
        // }


        /*let {prevLevel, isEdgeThere} = this.getCurrentLevelAndIsEdgeThere(edgesMap, vertice1Id, vertice2Id);
        if (prevLevel && prevLevel >= level) return -1;

        if (isCheckNeeded) checkResult = this.checkAndSubtractMoneyOnBuildingIfNeeded(vertice1Id, vertice2Id, verticesMap, length, false, this.epoch, level, prevLevel);
        if (checkResult === -1) return -1;

        if (isEdgeThere) {
            this.upgradeEdgeLevelAndRichness(edgesMap, vertice1Id, vertice2Id, level);
        } else {
            if (!isBfsNeeded) route = route.reverse();
            edgesMap.set(`from ${vertice1Id} to ${vertice2Id}`, this.createEdge({
                vertices: [vertice1Id, vertice2Id],
                name: nameForNextEdge,
                length,
                protectionAmount,
                level,
                route,
                type,
                isForVisualisation
            }));
            this.fillMapWithAdjacentVertices(adjacentMap, vertice1Id, [vertice2Id]);
            this.verticeAddLengthToAnotherVertice(vertice1Id, vertice2Id, length);
            if (isBfsNeeded) this.mapLogic.addRoadLevelToArrOfCells(route, level);
            console.log("bfsResult1", bfsResult);
            this.mapLogic.hashResult(vertice1Id, vertice2Id, bfsResult, this.currentRound[0]);
        }*/
        return {length, route, edgesToBeAddedAndRoute};
    }


    forEachEdgeInBfsRouteCreateOrUpdateEdge(edgesToBeAddedAndRoute, resultsOfEdges, i, edgesMap, vertice1Id, vertice2Id, level, isCheckNeeded, verticesMap, isBfsNeeded, protectionAmount, type, isForVisualisation, adjacentMap) {
        //let checkResult = 0;
        let vertice1IdNew = edgesToBeAddedAndRoute.edges[i][0];
        let vertice2IdNew = edgesToBeAddedAndRoute.edges[i][1];
        console.log("edgesToBeAddedAndRoute.edges", edgesToBeAddedAndRoute.edges);
        console.log("edgesToBeAddedAndRoute.routes", edgesToBeAddedAndRoute.routes);
        let length = edgesToBeAddedAndRoute.length[i];
        let route = edgesToBeAddedAndRoute.routes[i];
        console.log("vertice1IdNew", vertice1IdNew);
        console.log("vertice2IdNew", vertice2IdNew);
        console.log("length", length);
        console.log("route", route);
        if(length === undefined || route === undefined) return {length: -1, route: []};

        let {prevLevel, isEdgeThere} = this.getCurrentLevelAndIsEdgeThere(edgesMap, vertice1Id, vertice2Id);
        if (prevLevel && prevLevel >= level) return {length: -1, route: []};

        // if (isCheckNeeded) checkResult =
        //     this.checkAndSubtractMoneyOnBuildingIfNeeded(vertice1IdNew, vertice2IdNew, verticesMap, length,
        //         false, this.epoch, level, prevLevel, vertice1Id);
        // if (checkResult === -1) return {length: -1, route: []};

        if (isEdgeThere) {
            this.upgradeEdgeLevelAndRichness(edgesMap, vertice1IdNew, vertice2IdNew, level);
            return {length: -1, route: []};
        }
        if (!isBfsNeeded) {
            route = route.reverse();
            let tmpVert = vertice1IdNew;
            vertice1IdNew = vertice2IdNew;
            vertice2IdNew = tmpVert;
        }

        resultsOfEdges.push({edgesMap, vertice1IdNew, vertice2IdNew, length, protectionAmount, level, route, type, isForVisualisation, adjacentMap, isBfsNeeded});

        console.log("length", length);
        console.log("route", route);
        return {length, route};
    }

    createBfsEdge({edgesMap, vertice1IdNew, vertice2IdNew, length, protectionAmount, level, route, type, isForVisualisation, adjacentMap, isBfsNeeded}) {
        edgesMap.set(`from ${vertice1IdNew} to ${vertice2IdNew}`,
            this.createEdge({
                    vertices: [vertice1IdNew, vertice2IdNew],
                    name: this.nameForNextEdge[0],
                    length,
                    protectionAmount,
                    level,
                    route,
                    type,
                    isForVisualisation
                }
            )
        );
        this.nameForNextEdge[0]++;
        this.fillMapWithAdjacentVertices(adjacentMap, vertice1IdNew, [vertice2IdNew]);
        this.verticeAddLengthToAnotherVertice(vertice1IdNew, vertice2IdNew, length);
        if (isBfsNeeded) this.mapLogic.addRoadLevelToArrOfCells(route, level);
        this.mapLogic.hashResult(vertice1IdNew, vertice2IdNew, {length, route}, this.currentRound[0]);
    }

    getCurrentLevelAndIsEdgeThere(edgesMap, vertice1Id, vertice2Id) {
        let prevLevel;
        let isEdgeThere = edgesMap.has(`from ${vertice1Id} to ${vertice2Id}`);
        if (isEdgeThere) {
            let edge = edgesMap.get(`from ${vertice1Id} to ${vertice2Id}`);
            prevLevel = edge.level;
            isEdgeThere = edge.isForVisualisation;
        }
        return {prevLevel, isEdgeThere};
    }

    upgradeEdgeLevelAndRichness(edgesMap, vertice1Id, vertice2Id, level) {
        let edge = edgesMap.get(`from ${vertice1Id} to ${vertice2Id}`);
        edge.level = level;
        let richness1 = this.verticesMap.get(vertice1Id).richness;
        let richness2 = this.verticesMap.get(vertice1Id).richness;
        edge.richness = Math.min(richness1, richness2);
        this.mapLogic.addRoadLevelToArrOfCells(edge.route, level)
    }

    upgradeEdgeRichnessForAllEdges() {
        for (let edge in this.edgesMap.values()) {
            let richness1 = this.verticesMap.get(edge.vertices[0]).richness;
            let richness2 = this.verticesMap.get(edge.vertices[1]).richness;
            edge.richness = Math.min(richness1, richness2);
        }
    }

    countDistanceBetweenVertices(vertice1Id, vertice2Id, verticesMap) {
        let distance = -1;
        let vertice1 = verticesMap.get(vertice1Id);
        let vertice2 = verticesMap.get(vertice2Id);
        if (!vertice1 || !vertice2) {
            return -1;
        }
        distance = Math.round(
            Math.pow(
                Math.pow(Math.abs(vertice1.x - vertice2.x), 2) + Math.pow(Math.abs(vertice1.y - vertice2.y), 2)
                , (1 / 2))
        );
        return distance;
    }

    checkAndSubtractMoneyOnBuildingIfNeeded(vertice1Id, vertice2Id, verticesMap, length, isCheck, epoch = {priceForRoadLevel: 0.1}, roadLevel = 0, prevLevel = 0, sponsorVertice = undefined) {
        // if(!isCheck) {
        //     console.log("vertice1Id", vertice1Id);
        //     console.log("vertice2Id", vertice2Id);
        //     console.log("roadLevel", roadLevel);
        //     console.log("prevLevel", prevLevel);
        // }
        let vertice1 = verticesMap.get(vertice1Id);
        let vertice2 = verticesMap.get(vertice2Id);
        let sponsor = sponsorVertice ? verticesMap.get(sponsorVertice) : undefined
        if (!vertice1 || !vertice2) return -1;
        if (length <= 0) return -1;
        let priceForRoadLevel = epoch.getPriceForRoad()[roadLevel] - epoch.getPriceForRoad()[prevLevel];
        // console.log('name1',vertice1Id);
        // console.log('name2',vertice2Id);
        // console.log('length',length);
        // console.log('vertice1',vertice1);
        // console.log('vertice2',vertice2);
        let type1 = sponsor ? sponsor.type : vertice1.type;
        let type2 = vertice2.type;
        let richness1 = sponsor ? sponsor.richness : vertice1.richness;
        let richness2 = sponsor ? 0 : vertice2.richness;
        let reach1 = sponsor ? sponsor.reach : vertice1.reach;
        let reach2 = sponsor ? 0 : vertice2.reach;
        let checkResult = -1;
        let mul1 = 0.0, mul2 = 0.0;
        let priceForRoad = length * priceForRoadLevel;

        while (roadLevel >= prevLevel) {
            priceForRoadLevel = epoch.getPriceForRoad()[roadLevel] - epoch.getPriceForRoad()[prevLevel];
            priceForRoad = length * priceForRoadLevel;

            if (type1 === 0 || type1 === 2) {
                if (type2 === 0 && reach1 + reach2 >= length && richness1 + richness2 >= priceForRoad) {
                    checkResult = 0;
                    mul1 = 1 / 2;
                    mul2 = 1 / 2;
                }
                if (type2 === 1 && reach1 >= length && richness1 >= priceForRoad) {
                    checkResult = 0;
                    mul1 = 1;
                    mul2 = 0;
                }
                if (type2 === 2 && reach1 + reach2 >= length && richness1 + richness2 >= priceForRoad) {
                    checkResult = 0;
                    mul1 = 1 / 2;
                    mul2 = 1 / 2;
                }
                if (type2 === 3 && reach1 >= length && richness1 >= priceForRoad) {
                    checkResult = 0;
                    mul1 = 1;
                    mul2 = 0;
                }
                if (type2 === 4) {
                    checkResult = -1;

                }
            }
            if (type1 === 1) {
                if (type2 === 0 && reach1 + reach2 >= length && richness1 >= priceForRoad) {
                    checkResult = 0;
                    mul1 = 1;
                    mul2 = 0;
                }
                if (type2 === 1 && reach1 >= length && richness1 >= priceForRoad) {
                    checkResult = 0;
                    mul1 = 1;
                    mul2 = 0;
                }
                if (type2 === 2 && reach1 + reach2 >= length && richness1 >= priceForRoad) {
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
                if (type2 === 0 && reach1 + reach2 >= length && richness1 + richness2 >= priceForRoad) {
                    checkResult = 0;
                    mul1 = 1 / 2;
                    mul2 = 1 / 2;
                }
                if (type2 === 1 && reach1 >= length) {
                    checkResult = 0;
                    mul1 = 0;
                    mul2 = 0;
                }
                if (type2 === 2 && reach1 + reach2 >= length && richness1 + richness2 >= priceForRoad) {
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
                if (type2 === 0 && reach1 >= length && richness1 >= 2 * priceForRoad / 3) {
                    checkResult = 0;
                    mul1 = 2 / 3;
                    mul2 = 0;
                }
                if (type2 === 1 && reach1 >= length && richness1 >= 2 * priceForRoad / 3) {
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
                if (type2 === 4 && reach1 + reach2 >= length && richness1 + richness2 >= 2 * priceForRoad / 3) {
                    checkResult = 0;
                    mul1 = 1 / 3;
                    mul2 = 1 / 3;
                }
            }

            if(checkResult === -1) {
                roadLevel--;
                continue;
            }

            if (!isCheck) {
                //if (checkResult === -1) return -1;
                if (sponsor) {
                    sponsor.cumulateCosts(-1 * priceForRoad * mul1 );
                } else {
                    vertice1.changeRichness(-1 * priceForRoad * mul1 );
                    vertice2.changeRichness(-1 * priceForRoad * mul2 );
                }
            }
            if(checkResult > -1) {
                break;
            }
        }

        if(vertice1.id === 3 || vertice2.id === 3 ) {
            console.log("checkAndSubtractMoneyOnBuildingIfNeeded");
            console.log("vertice1Id", vertice1Id);
            console.log("vertice2Id", vertice2Id);
            console.log("length", length);
            console.log("roadLevel", roadLevel);
            console.log("prevLevel", prevLevel);
            console.log("reach1", reach1);
            console.log("reach2", reach2);
            console.log("checkResult", checkResult);
        }



        return {checkResult, roadLevel};
    }

    getVerticeOrEdgeByName(id, map) {
        return map.get(id);
    }

    getAllVertices(verticesMap) {
        let vertices = [];
        for (let id of verticesMap.keys()) {
            let item = this.getVerticeOrEdgeByName(id, verticesMap);
            vertices.push(item/*{id: item.id, x: item.x, y: item.y}*/);
        }
        return vertices;
    }

    getAllEdges(edgesMap) {
        let edges = [];
        for (let id of edgesMap.keys()) {
            let item = this.getVerticeOrEdgeByName(id, edgesMap);
            edges.push(item);
        }
        return edges;
    }

    setReachIncome(vertice, epoch, valueFromRoad, roadLevel) {
        let base = 1;
        //let adjMapLngth = this.adjacentMap.get(vertice.id).length;
        let roadModifier = this.reachModifier * epoch.getBandwidthForRoad()[roadLevel] / epoch.getComfortableBandwidth();
        let roadAddedReach = valueFromRoad * roadModifier;

        vertice.setReachIncome(base + roadAddedReach/*adjMapLngth * roadModifier*/, true);
    }

    setReachIncomeForAllVertices() {
        for (let vertice of this.adjacentMap.keys()) {
            let arr = this.adjacentMap.get(vertice);
            for (let i = 0; i < arr.length; i++) {
                let edge = this.edgesMap.get(`from ${vertice} to ${arr[i]}`);
                if (!edge.isForVisualisation) continue;
                let roadRichness = edge.richness;
                let roadLevel = edge.level;
                this.setReachIncome(this.verticesMap.get(vertice), this.epoch, roadRichness, roadLevel);
            }
        }
    }

    applyReachChangeForAllVertices() {
        for (let vertice of this.verticesMap.values()) {
            vertice.applyReachChange();
        }
    }

    setIncomeChange(vertice, epoch, valueFromRoad, roadLevel) {
        //let tmp = this.adjacentMap.get(vertice.id).length / 3;
        let base = 0.01;
        let roadModifier = this.incomeModifier * epoch.getBandwidthForRoad()[roadLevel] / epoch.getComfortableBandwidth();
        let roadAddedReach = valueFromRoad * roadModifier;

        vertice.changeIncomeToAddInNextTurn(base + roadAddedReach/*adjMapLngth * roadModifier*/, true);
    }

    setIncomeChangeForAllVertices() {
        for (let vertice of this.adjacentMap.keys()) {
            let arr = this.adjacentMap.get(vertice);
            for (let i = 0; i < arr.length; i++) {
                let edge = this.edgesMap.get(`from ${vertice} to ${arr[i]}`);
                if (!edge.isForVisualisation) continue;
                let roadRichness = edge.richness;
                let roadLevel = edge.level;
                this.setIncomeChange(this.verticesMap.get(vertice), this.epoch, roadRichness, roadLevel);
            }
        }
        // let tmp = this.adjacentMap.keys();
        // for(let vertice of this.adjacentMap.keys()) {
        //     this.setIncomeChange(this.verticesMap.get(vertice));
        // }
    }

    applyIncomeChangeForAllVertices() {
        for (let vertice of this.verticesMap.values()) {
            let ifLeveledUp = vertice.applyIncomeChange(this.epoch);
            if (ifLeveledUp > 0) this.doCitiesLayerNeedARefresh = true;
        }
    }

    verticeAddLengthToAnotherVertice(vertice1Id, vertice2Id, length) {
        let vert = this.verticesMap.get(vertice1Id);
        vert.adjacentVerticesAndRoadLengthToThem.set(vertice2Id, length);
    }


    save() {
        let save_obj = {};
        save_obj.objType = "Graph";

        for (let key in this) {
            if (typeof this[key] === "object" && !Array.isArray(this[key]) && !(this[key] instanceof Epoch)) {
                save_obj[key] = [];
                let arrOfEntries = Array.from(this[key].entries());

                for (let innerKey = 0; innerKey < arrOfEntries.length; innerKey++) {
                    let value = arrOfEntries[innerKey][1];
                    if (value instanceof Edge || value instanceof Vertice || value instanceof Epoch) {
                        value = arrOfEntries[innerKey][1].save();
                    }
                    save_obj[key].push([arrOfEntries[innerKey][0], value]);
                }
            } else if (this[key] instanceof Epoch) {
                save_obj[key] = this[key].save();
            } else if (key === 'verticesList') {/*ignore*/
            } else save_obj[key] = this[key];
        }
        console.log("save_obj", save_obj);
        return save_obj;
    }

    static load(paramsObj) {
        console.log("paramsObj", paramsObj);
        let graph = new Graph();
        if (typeof paramsObj === "string") paramsObj = JSON.parse(paramsObj);
        if (!paramsObj.objType && paramsObj.objType !== "Graph") {
            // console.log("Graph.load paramsObj", paramsObj);
            // console.log("Graph.load typeof paramsObj", typeof paramsObj);
            // console.log("Graph.load paramsObj.objType", paramsObj.objType);
            return -1;
        }

        for (let key in paramsObj) {
            // console.log("--------------------------------paramsObj---------------------------------");
            // console.log("key", key);
            // console.log("typeof paramsObj[key]", typeof paramsObj[key]);
            // console.log("paramsObj[key]", paramsObj[key]);
            // console.log("paramsObj[key][0]", paramsObj[key][0]);
            // console.log("Array.isArray(paramsObj[key]", Array.isArray(paramsObj[key]));
            // console.log("Array.isArray(paramsObj[key][0])", Array.isArray(paramsObj[key][0]));

            if (typeof paramsObj[key] === "object" && Array.isArray(paramsObj[key]) && paramsObj[key].at(0) && Array.isArray(paramsObj[key][0])) {
                // console.log("+++++++++++++++++++++++++++++++in if+++++++++++++++++++++++++++++++++++++++++++++++++");
                // console.log("graph[key]", graph[key]);
                // console.log("paramsObj[key][0][0]", paramsObj[key][0][0]);
                // console.log("paramsObj[key][0][1]", paramsObj[key][0][1]);
                // console.log("typeof paramsObj[key][0][1]", typeof paramsObj[key][0][1]);

                for (let i = 0; i < paramsObj[key].length; i++) {
                    let value = paramsObj[key][i][1];
                    if (value.objType && value.objType === "Vertice") value = Vertice.load(value);
                    if (value.objType && value.objType === "Edge") value = Edge.load(value);

                    graph[key].set(paramsObj[key][i][0], value);
                }
            } else if (paramsObj[key].objType && paramsObj[key].objType === "Epoch") graph[key] = Epoch.load(paramsObj[key]);
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
