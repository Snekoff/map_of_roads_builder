import {Vertice} from "./vertice.js";
import {Edge} from "./edge.js";
import {Epoch} from "./epoch.js";
import {MapLogic} from "../map/map_logic.js";


export class Graph {
    reachModifier = 1 / 10000;
    incomeModifier = 1 / 30;

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
                   isForVisualisation = true,
                   isEitherWay
               }) {
        let mapLogic;
        if( this.mapLogic ) mapLogic = this.mapLogic;
        //console.log("vertices", vertices);
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
            richness,
            mapLogic,
            isEitherWay
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
        isEitherWay = true,
        isCheckNeeded = true,
        isForVisualisation = true,
        isBfsNeeded = true,
        routeReversed = [],
        lengthAlreadyBuilt = 0,
        edgesToBeAddedAndRouteAlready = {},
        levelAlreadyBuilt = 0
    ) {
        this.mapLogic = mapLogic;
        let bfsResult;
        /*console.log("vertice1Id", vertice1Id);
        console.log("vertice2Id", vertice2Id);
        console.log("this", this);
        console.log("edgesMap.get(`from ${vertice1Id} to ${vertice2Id}`)", edgesMap.get(`from ${vertice1Id} to ${vertice2Id}`));
        console.log("this.currentRound[0]", this.currentRound[0]);
        console.log("this.countDistanceBetweenVertices(vertice1Id, vertice2Id, this.verticesMap)", this.countDistanceBetweenVertices(vertice1Id, vertice2Id, this.verticesMap));*/

        if (isBfsNeeded) bfsResult = this.mapLogic.bfsFromOneVerticeToAnother(vertice1Id, vertice2Id, this, this.currentRound[0], this.countDistanceBetweenVertices(vertice1Id, vertice2Id, this.verticesMap));

        if (isBfsNeeded && bfsResult === undefined) {
            return -1;
        }
        let length = lengthAlreadyBuilt;
        let route = routeReversed;
        // edgesToBeAddedAndRoute {edges: [[]], routes: [[]], length: []}
        let edgesToBeAddedAndRoute = edgesToBeAddedAndRouteAlready;

        if(isBfsNeeded) {
            length = bfsResult.length;
            route = bfsResult.route;
            edgesToBeAddedAndRoute = bfsResult.edgesToBeAddedAndRoute;
        }

        //console.log("edgesToBeAddedAndRoute", edgesToBeAddedAndRoute);


        let checkResult = 0;
        let {prevLevel, isEdgeThere} = this.getCurrentLevelAndIsEdgeThere(edgesMap, vertice1Id, vertice2Id);

        if (isCheckNeeded) checkResult =
            this.checkAndSubtractMoneyOnBuildingIfNeeded(vertice1Id, vertice2Id, verticesMap, length,
                true, this.epoch, level, prevLevel);
        if (checkResult.checkResult === -1) {
            return -1;
        }


        level = isCheckNeeded ? checkResult.roadLevel : levelAlreadyBuilt;

        if (edgesToBeAddedAndRoute.routes[edgesToBeAddedAndRoute.routes.length - 1].length === 0) {
            edgesToBeAddedAndRoute.routes.splice(-1, 1);
        }
        if (edgesToBeAddedAndRoute.edges[edgesToBeAddedAndRoute.edges.length - 1].length === 0) {
            edgesToBeAddedAndRoute.edges.splice(-1, 1);
        }
        while (edgesToBeAddedAndRoute.length[edgesToBeAddedAndRoute.length.length - 1] === 0) {
            edgesToBeAddedAndRoute.length.splice(-1, 1);
        }

        let resultsOfEdges = [];
        for (let i = 0; i < edgesToBeAddedAndRoute.edges.length; i++) {
            let __ret = this.forEachEdgeInBfsRouteCreateOrUpdateEdge(edgesToBeAddedAndRoute, resultsOfEdges, i, edgesMap, level, isCheckNeeded, verticesMap, isBfsNeeded, protectionAmount, type, isForVisualisation, adjacentMap, isEitherWay);
            length = __ret.length;
            route = __ret.route;
            if (length === -1) {
                return -1;
            }
            //console.log("resultsOfEdges", resultsOfEdges);

            /*if(isEitherWay) {
                let __ret1 = this.forEachEdgeInBfsRouteCreateOrUpdateEdge(edgesToBeAddedAndRoute, resultsOfEdges, i, edgesMap, level, isCheckNeeded, verticesMap, false, protectionAmount, type, isForVisualisation, adjacentMap, isEitherWay);
                length = __ret1.length;
                route = __ret1.route;
                if (length === -1) {
                    return -1;
                }
            }*/

            // If route given from bfs and route goes through at least one vertice
            // than instead of one payment there will be accumulation of all
            // and payment in the end
            // because edge could possibly not be done and whole route does not make sense
            let id1 = edgesToBeAddedAndRoute.edges[i][0];
            let id2 = edgesToBeAddedAndRoute.edges[i][1];
            if (edgesToBeAddedAndRoute.routes.length > 1 && isBfsNeeded) {
                    this.checkAndSubtractMoneyOnBuildingIfNeeded(id1, id2, verticesMap, length,
                        false, this.epoch, level, prevLevel, vertice1Id);
            }
        }


        //console.log("resultsOfEdges", resultsOfEdges);
        for (let edge of resultsOfEdges) {
            //console.log("edge", edge);
            edge.edgesMap = this.edgesMap;
            edge.edgesToBeAddedAndRoute = edgesToBeAddedAndRoute;
            this.createBfsEdge(edge);
        }

        if (isCheckNeeded && isBfsNeeded) {
            // one payment for all segments
            if (edgesToBeAddedAndRoute.routes.length > 1) {
                this.verticesMap.get(vertice1Id).applyCumulativeCosts();
            } else {
                // payment for single edge
                checkResult =
                    this.checkAndSubtractMoneyOnBuildingIfNeeded(vertice1Id, vertice2Id, verticesMap, length,
                        false, this.epoch, level, prevLevel);
            }

        }
        if (isCheckNeeded && checkResult.checkResult === -1) {
            return -1;
        }

        // create fake edges to prevent new bfs there
        if(edgesToBeAddedAndRoute.routes.length > 1 && !this.edgesMap.has(`from ${vertice1Id} to ${vertice2Id}`) && !this.edgesMap.get(`from ${vertice2Id} to ${vertice1Id}`)) {

            edgesMap.set(`from ${vertice1Id} to ${vertice2Id}`, this.createEdge({vertices:[vertice1Id, vertice2Id], length: length * 1000, isForVisualisation: false, route: [], name: "", isEitherWay: isEitherWay}));
            //if(isEitherWay) edgesMap.set(`from ${vertice2Id} to ${vertice1Id}`, this.createEdge({vertices:[vertice2Id, vertice1Id], length: length * 500, isForVisualisation: false, route: [], name: ""}));

        }

        return {length, route, edgesToBeAddedAndRoute, level};
    }


    forEachEdgeInBfsRouteCreateOrUpdateEdge(edgesToBeAddedAndRoute, resultsOfEdges, i, edgesMap, level, isCheckNeeded, verticesMap, isBfsNeeded, protectionAmount, type, isForVisualisation, adjacentMap, isEitherWay) {
        let vertice1IdNew = edgesToBeAddedAndRoute.edges[i][0];
        let vertice2IdNew = edgesToBeAddedAndRoute.edges[i][1];

        let length = edgesToBeAddedAndRoute.length[i];
        let route = edgesToBeAddedAndRoute.routes[i];

        if (length === undefined || route === undefined) return {length: -1, route: []};

        // reverse road if this is backward road
        if (!isBfsNeeded) {
            route = route.reverse();
            let tmpVert = vertice1IdNew;
            vertice1IdNew = vertice2IdNew;
            vertice2IdNew = tmpVert;
        }

        let {prevLevel, isEdgeThere} = this.getCurrentLevelAndIsEdgeThere(edgesMap, vertice1IdNew, vertice2IdNew);

        if (isEdgeThere) {
            this.upgradeEdgeLevelAndRichness(edgesMap, vertice1IdNew, vertice2IdNew, level);
            let edge = this.edgesMap.get(`from ${vertice1IdNew} to ${vertice2IdNew}`);

            return {length: edge.length, route: edge.route};
        }


        resultsOfEdges.push({
            edgesMap,
            vertice1IdNew,
            vertice2IdNew,
            length,
            protectionAmount,
            level,
            route,
            type,
            isForVisualisation,
            adjacentMap,
            isBfsNeeded,
            isEitherWay
        });


        return {length, route};
    }

    createBfsEdge({
                      edgesMap,
                      vertice1IdNew,
                      vertice2IdNew,
                      length,
                      protectionAmount,
                      level,
                      route,
                      type,
                      isForVisualisation,
                      adjacentMap,
                      isBfsNeeded,
                      edgesToBeAddedAndRoute,
                      isEitherWay
                  }) {

        edgesMap.set(`from ${vertice1IdNew} to ${vertice2IdNew}`,
            this.createEdge({
                    vertices: [vertice1IdNew, vertice2IdNew],
                    name: this.nameForNextEdge[0],
                    length,
                    protectionAmount,
                    level,
                    route,
                    type,
                    isForVisualisation,
                    isEitherWay
                }
            )
        );
        this.nameForNextEdge[0]++;
        this.fillMapWithAdjacentVertices(adjacentMap, vertice1IdNew, [vertice2IdNew]);
        this.verticeAddLengthToAnotherVertice(vertice1IdNew, vertice2IdNew, length);
        if (isBfsNeeded) this.mapLogic.addRoadLevelToArrOfCells(route, level);
        this.mapLogic.hashResult(vertice1IdNew, vertice2IdNew, {
            length,
            route,
            edgesToBeAddedAndRoute
        }, this.currentRound[0]);
        if(isEitherWay) {
            this.mapLogic.hashResult(vertice2IdNew, vertice1IdNew, {
                length,
                route,
                edgesToBeAddedAndRoute
            }, this.currentRound[0]);
        }
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
        let richness2 = this.verticesMap.get(vertice2Id).richness;
        edge.richness = Math.max(Math.min(richness1, richness2), 1);
        this.mapLogic.addRoadLevelToArrOfCells(edge.route, level)
    }

    upgradeEdgeRichnessForAllEdges() {
        for (let edge of this.edgesMap.values()) {
            this.upgradeEdgeLevelAndRichness(this.edgesMap, edge.vertices[0], edge.vertices[1], edge.level)
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

    checkAndSubtractMoneyOnBuildingIfNeeded(vertice1Id, vertice2Id, verticesMap, length, isCheck, epoch = {getPriceForRoad() {return [0]}}, roadLevel = 0, prevLevel = 0, sponsorVertice = undefined) {
        let vertice1 = verticesMap.get(vertice1Id);
        let vertice2 = verticesMap.get(vertice2Id);
        let sponsor = sponsorVertice ? verticesMap.get(sponsorVertice) : undefined
        if (!vertice1 || !vertice2) return {checkResult: -1, roadLevel: 0};
        if (length <= 0) return {checkResult: -1, roadLevel: 0};
        let priceForRoadLevel = epoch.getPriceForRoad()[roadLevel] - epoch.getPriceForRoad()[prevLevel];


        let type1 = sponsor ? sponsor.type : vertice1.type;
        let type2 = vertice2.type;
        let richness1 = sponsor ? sponsor.richness : vertice1.richness;
        let richness2 = sponsor ? 0 : vertice2.richness;
        let reach1 = sponsor ? sponsor.reach : vertice1.reach;
        let reach2 = sponsor ? 0 : vertice2.reach;
        let checkResult = -1;
        let mul1 = 0.0, mul2 = 0.0;
        let priceForRoad = length * priceForRoadLevel / 100;


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

            if (checkResult === -1) {
                if (roadLevel === 0) return {checkResult: -1, roadLevel: 0};
                roadLevel--;
                continue;
            }

            if (!isCheck) {
                if (sponsor) {
                    sponsor.cumulateCosts(-1 * priceForRoad * mul1);
                } else {
                    vertice1.changeRichness(-1 * priceForRoad * mul1);
                    vertice2.changeRichness(-1 * priceForRoad * mul2);
                }
            }
            if (checkResult > -1) {
                break;
            }
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
            vertices.push(item);
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
        let roadModifier = this.reachModifier * epoch.getBandwidthForRoad()[roadLevel] / epoch.getComfortableBandwidth();
        let roadAddedReach = Math.round(valueFromRoad * roadModifier * 100) / 100;

        vertice.setReachIncome(base + roadAddedReach, true);
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
        let base = 0.01;
        let roadModifier = this.incomeModifier * epoch.getBandwidthForRoad()[roadLevel] / epoch.getComfortableBandwidth();
        let roadAddedRich = Math.round(valueFromRoad * roadModifier * 100) / 100;
        vertice.changeIncomeToAddInNextTurn(base + roadAddedRich, true);
    }

    setIncomeChangeForAllVertices() {
        for (let vertice of this.adjacentMap.keys()) {
            let arr = this.adjacentMap.get(vertice);
            for (let i = 0; i < arr.length; i++) {
                let edge = this.edgesMap.get(`from ${vertice} to ${arr[i]}`);
                if (!edge || !edge.isForVisualisation) continue;
                edge.updateLength(edge.route, this.mapLogic);

                let vert = this.verticesMap.get(arr[i])
                let roadRichness = edge.richness + this.reachModifier * vert.reach + 500;
                let roadLevel = edge.level;
                this.setIncomeChange(this.verticesMap.get(vertice), this.epoch, roadRichness, roadLevel);
            }
        }
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
            // save Map object
            if (typeof this[key] === "object" && !Array.isArray(this[key]) && !(this[key] instanceof Epoch) && !(this[key] instanceof MapLogic)) {
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
            } else if (key === 'verticesList' || this[key] instanceof MapLogic) {/*ignore*/
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
            for (let key in paramsObj) {
                if(/*paramsObj[key].objType && */key === "graph") {
                    return this.load(paramsObj[key]);
                }
            }
            return -1;
        }

        for (let key in paramsObj) {

            if (typeof paramsObj[key] === "object" && Array.isArray(paramsObj[key]) && paramsObj[key].at(0) && Array.isArray(paramsObj[key][0])) {

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

}
