import {MapCell} from "./map_cell.js";
import {Epoch} from "../graph/epoch.js";
import {Edge} from "../graph/edge.js";
import {Vertice} from "../graph/vertice.js";
import {Graph} from "../graph/graph.js";

export class MapLogic {

    hashExpiredAfterRounds = 15;

    constructor(minX, minY, maxX, maxY, graph = undefined, isLoaded = false/*, rectGridOfTypes = [[[]]]*/) {
        this.isInitalized = true;
        if(!isLoaded) {
            this.maxX = maxX;
            this.maxY = maxY;
            this.minX = minX;
            this.minY = minY;
            this.graph = graph;
            /*this.rectGridOfTypes = rectGridOfTypes;*/
            this.hashBfs = new Map();

            let differX = Math.abs(Math.abs(this.maxX) - Math.abs(this.minX));
            let differY = Math.abs(Math.abs(this.maxY) - Math.abs(this.minY));
            let maxAxisValue = Math.max(differY, differX);

            this.blockSize = 10000;
            // let find appropriate block size.
            // Not too big to avoid high error cost
            // and not too small to avoid huge expenses on search
            while (maxAxisValue / this.blockSize < 200) {
                this.blockSize = Math.round(this.blockSize / 10);
                if (this.blockSize < 10 && this.blockSize !== Math.round(this.blockSize)) break;
            }

            // array of arrays of Cells
            this.coordsGridArr = new Array(Math.ceil(differX / this.blockSize));
            for (let i = 0; i < this.coordsGridArr.length; i++) {
                this.coordsGridArr[i] = new Array(Math.ceil(differY / this.blockSize));
            }

            // array of arrays of Types
            /* if (this.rectGridOfTypes[0][0].length === 0) {
                 this.rectGridOfTypes = new Array(Math.ceil(differX / this.blockSize));
                 for (let i = 0; i < this.rectGridOfTypes.length; i++) {
                     this.rectGridOfTypes[i] = new Array(Math.ceil(differY / this.blockSize));
                 }
             }*/

            this.initializeCellsWithVertices(graph, this.blockSize);
        }
    }

    show() {
        for (let key in this) {
            console.log(key + ': ', this[key]);
        }
        console.log(this.checkIfCellEmpty(0, 0));
    }

    addGraph(graph) {
        //this.graph = graph;
        if(graph === undefined) return -1;
        this.initializeCellsWithVertices(graph, this.blockSize);
    }

    checkIfCellEmpty(x, y) {
        return this.coordsGridArr[x][y] === undefined;
    }

    checkIfLowerPriceThanInInCell(x, y, priceForTraveling) {
        if (this.coordsGridArr[x][y] === undefined) return true;
        if (this.coordsGridArr[x][y].length > priceForTraveling) return true;
        return false;
    }

    writeInCell(x, y, priceForTraveling, from) {
        this.createCell({x, y});
        this.coordsGridArr[x][y].length = priceForTraveling;
        this.coordsGridArr[x][y].from = from;
    }

    createCell(params) {
        if (this.coordsGridArr[params.x][params.y] === undefined || this.coordsGridArr[params.x][params.y].objType !== "Map Cell") {
            /*if (!params.terrainTypes && this.rectGridOfTypes[params.x][params.y] !== undefined) {
                params.terrainTypes = this.rectGridOfTypes[params.x][params.y];
            } else if (params.terrainTypes) {
                this.rectGridOfTypes[params.x][params.y] = params.terrainTypes;
            }*/
            this.coordsGridArr[params.x][params.y] = new MapCell(params);
            return 0;
        }
        return -1;
    }

    addVerticeToCell(x, y, vertice = {type: 1, level: 0}) {
        this.createCell({x, y});
        this.coordsGridArr[x][y].addVerticeArr(vertice.id);
        let typeNames = ["city", "village", "fort", "camp", "criminal camp"];
        let typ = typeNames[vertice.type];
        this.coordsGridArr[x][y].addTerrainType({type: typ, level: vertice.level})
    }

    initializeCellsWithVertices(graph, blockSize) {
        if (graph === undefined) return -1;
        // console.log("initializeCellsWithVertices");
        // console.log('graph', graph);
        let arrOfVerticeCoords = this.findVerticesCordsAndReturnThemInArr(graph, blockSize);
        this.forEachVerticeAddCellObj(arrOfVerticeCoords, graph);

    }

    forEachVerticeAddCellObj(arr, graph) {
        // arr = [[id, x, y], ...]
        // console.log("forEachVerticeAddCellObj");
        // console.log('arr', arr);
        // console.log('this.coordsGridArr', this.coordsGridArr);
        for (let i = 0; i < arr.length; i++) {
            //console.log('arr[i]', arr[i]);
            //if (this.coordsGridArr[arr[i][1]][arr[i][2]] !== undefined && this.coordsGridArr[arr[i][1]][arr[i][2]].verticeArr.indexOf(arr[0]) > 0) continue;
            this.addVerticeToCell(arr[i][1], arr[i][2], graph.verticesMap.get(arr[i][0]));
        }
    }

    findVerticesCordsAndReturnThemInArr(graph, blockSize) {
        let arr = [];
        for (let vertice of graph.verticesMap.values()) {
            //  "- this.minX" to avoid negative indexes
            let x = Math.floor((vertice.x - this.minX) / blockSize);
            let y = Math.floor((vertice.y - this.minY) / blockSize);
            if (x < 0) x = 0;
            if (y < 0) y = 0;
            if (x > this.coordsGridArr.length - 1) x = this.coordsGridArr.length - 1;
            if (y > this.coordsGridArr[0].length - 1) y = this.coordsGridArr[0].length - 1;
            arr.push([vertice.id, x, y]);
        }
        return arr;
    }

    bfsFromOneVerticeToAnother(startingVerticeId = -1, finalVerticeId = -1, graph, currentRound, distance) {

        let hash = this.returnHashedResultIfNotExpired(startingVerticeId, finalVerticeId, currentRound, distance);
        if (hash !== -1) {
            //console.log("bfsFromOneVerticeToAnother hashed", hash);
            return hash;
        }
        if (startingVerticeId === -1) startingVerticeId = Math.round(Math.random() * graph.verticesMap.size - 1);
        while (finalVerticeId === -1 || finalVerticeId === startingVerticeId) {
            finalVerticeId = Math.round(Math.random() * graph.verticesMap.size - 1);
        }
        console.log('startingVerticeId', startingVerticeId);
        console.log('finalVerticeId', finalVerticeId);
        console.log('this.blockSize', this.blockSize);
        console.log('graph', graph);
        let stVertice = graph.verticesMap.get(startingVerticeId);
        let fnVertice = graph.verticesMap.get(finalVerticeId);

        if (!stVertice || !fnVertice) {
            console.log('Error no item in graph');
            console.log('stVertice', stVertice);
            console.log('fnVertice', fnVertice);
            return;
        }
        let stX = Math.floor((stVertice.x - this.minX) / this.blockSize);
        let stY = Math.floor((stVertice.y - this.minY) / this.blockSize);

        let fnX = Math.floor((fnVertice.x - this.minX) / this.blockSize);
        let fnY = Math.floor((fnVertice.y - this.minY) / this.blockSize);

        let result = this.bfsOnGridReturnRouteAndLength([stX, stY], [fnX, fnY], stVertice, fnVertice, graph);
        console.log('bfs result', result);
        return result;
    }

    bfsOnVerticesReturnRouteAndLength(startingVertice, finalVertice, graph) {
        let result = {length: -1, route: []};
        let visitedArr = [];
        let bfsHeap = [startingVertice.id];
        let temResults = new Map();
        while (bfsHeap.length > 0) {
            this.bfsOnVertices(startingVertice, finalVertice, graph, bfsHeap, visitedArr, temResults);
        }

        if (temResults.has(finalVertice.id)) {
            let res = temResults.get(finalVertice.id);
            result.length = res.length;
            result.route = this.reverseBuildingRouteOnVertices(startingVertice, finalVertice, temResults)
        }

        return result;
    }

    bfsOnVertices(startingVertice, finalVertice, graph, bfsHeap, visitedArr, temResults) {
        let topItem = bfsHeap.shift();
        if (!graph.verticesMap.has(topItem)) {
            visitedArr.push(topItem);
            return -1;
        }
        let vertice = graph.verticesMap.get(topItem);
        if (visitedArr.indexOf(vertice.id) > 0) return -1;

        let currentSum = temResults.has(vertice.id) ? temResults.get(vertice.id).length : 0;
        if (temResults.has(finalVertice.id) && currentSum >= temResults.get(finalVertice.id).length) {
            return -1;
        }
        for (let entry of vertice.adjacentVerticesAndRoadLengthToThem.entries()) {
            let x = Math.floor((vertice.x - this.minX ) / this.blockSize);
            let y = Math.floor((vertice.y - this.minY ) / this.blockSize);

            if (temResults.has(entry[0]) && temResults.get(entry[0]).length > entry[1].length + currentSum) {
                temResults.set(entry[0], {length: currentSum + entry[1].length, from: [x, y]});
                bfsHeap.push(entry[0]);
            } else if (!temResults.has(entry[0])) {
                temResults.set(entry[0], {length: currentSum + entry[1].length, from: [x, y]});
                bfsHeap.push(entry[0]);
            }
        }
        return 0;
    }

    bfsOnGridReturnRouteAndLength(startingCell, finalCell, startingVertice, finalVertice, graph) {
        let result = {length: -1, route: []};
        let visitedArr = [];
        let bfsHeap = [startingCell];
        let temResults = new Map();
        let stCellKey = startingCell[0] + ' ' + startingCell[1];

        temResults.set(stCellKey, {
            length: this.coordsGridArr[startingCell[0]][startingCell[1]].currentMultiplier * this.blockSize,
            from: null
        });
        while (bfsHeap.length > 0) {
            // if there is already optimal route - use it to cut non-optimal earlier
            // but not stop it
            // variables may have changed since that route building
            if (this.checkIfThereAreVerticesInCell(bfsHeap[0][0], bfsHeap[0][1])) {
                this.goInVerticeAdjacentListAndFindRouteToFinalVertice(graph, bfsHeap, finalVertice, temResults, finalCell);
            }
            this.bfsOnGrid(startingCell, finalCell, bfsHeap, visitedArr, temResults);
        }

        let finCellKey = finalCell[0] + ' ' + finalCell[1];
        let edgesToBeMade;
        if (temResults.has(finCellKey)) {
            result.length = temResults.get(finCellKey).length;
            result.route = this.reverseBuildingRouteOnGrid(startingCell, finalCell, temResults);
            edgesToBeMade = this.edgesToBeMadeFromRoadAndAdjacentListsToBeUpdatedWith(result.route, startingCell, finalCell);
            result.edgesToBeAddedAndRoute = edgesToBeMade;
        }
        /*console.log("temResults", temResults);
        console.log("this.blockSize", this.blockSize);
        console.log("startingCell", startingCell);
        console.log("finalCell", finalCell);
        console.log("result", result);*/
        // console.log("x1-x2", Math.abs(startingCell[0] - finalCell[0]));
        // console.log("y1-y2", Math.abs(startingCell[1] - finalCell[1]));
        return result;
    }

    checkIfThereAreVerticesInCell(x, y) {
        if (this.coordsGridArr[x][y] === undefined) return false;
        return this.coordsGridArr[x][y].verticeArr.length > 0;
    }

    goInVerticeAdjacentListAndFindRouteToFinalVertice(graph, bfsHeap, finalVertice, temResults, finalCell) {
        let vertice = graph.verticesMap.get(this.coordsGridArr[bfsHeap[0][0]][bfsHeap[0][1]].verticeArr[0]);
        let vertResult = this.bfsOnVerticesReturnRouteAndLength(vertice, finalVertice, graph);
        if (vertResult.length > 0) {
            let finCellKey = finalCell.x + ' ' + finalCell.y;
            if (temResults.has(finCellKey) && temResults.get(finCellKey).length <= vertResult.length) {
            } else {
                temResults.get(finCellKey).length = vertResult.length;
                temResults.get(finCellKey).from = vertResult.from;
            }
        }
    }

    bfsOnGrid(startingCell, finalCell, bfsHeap, visitedArr, temResults) {

        let topItem = bfsHeap.shift();
        let x = topItem[0];
        let y = topItem[1];
        if (x > this.coordsGridArr.length - 1 || y > this.coordsGridArr[0].length - 1 || x < 0 || y < 0) {
            visitedArr.push(topItem);
            return -1;
        }
        let curCellKey = x + ' ' + y;
        if (visitedArr.indexOf(topItem) > 0) return -1;

        let finCellKey = finalCell[0] + ' ' + finalCell[1];
        let currentSum = temResults.has(curCellKey) ? temResults.get(curCellKey).length : 0;
        if (temResults.has(finCellKey) && currentSum >= temResults.get(finCellKey).length) {
            return -1;
        }
        let directionArr = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];

        for (let dir = 0; dir < directionArr.length; dir++) {
            let addX = directionArr[dir][0];
            let addY = directionArr[dir][1];

            if (x + addX > this.coordsGridArr.length - 1 || y + addY > this.coordsGridArr[0].length - 1 || x + addX < 0 || y + addY < 0) continue;
            if (this.checkIfCellEmpty(x + addX, y + addY)) this.createCell({x: x + addX, y: y + addY});
            let diagonalDistanceMult = dir % 2 > 0 ? Math.sqrt(2) : 1;
            let addedDistance = Math.ceil(this.coordsGridArr[x + addX][y + addY].currentMultiplier * this.blockSize * diagonalDistanceMult * 10) / 10;
            let newCellKey = +(x + addX) + ' ' + +(y + addY)
            if (temResults.has(newCellKey)
                && temResults.get(newCellKey).length <= currentSum + addedDistance) continue;

            temResults.set(newCellKey, {length: currentSum + addedDistance, from: [x, y]});
            bfsHeap.push([x + addX, y + addY]);
        }
        return 0;
    }

    reverseBuildingRouteOnGrid(startingCell, finalCell, resultMap) {

        let currentCell = finalCell;
        let route = [];
        while (currentCell[0] !== startingCell[0] || currentCell[1] !== startingCell[1]) {
            route.unshift(currentCell);
            let curCellKey = currentCell[0] + ' ' + currentCell[1];
            if (!resultMap.has(curCellKey)) {
                route.unshift(`Error ${curCellKey} not present in grid results`);
                break;
            }
            currentCell = resultMap.get(curCellKey).from;
        }
        if (route.length === 0 && startingCell !== finalCell) route.unshift(currentCell);
        route.unshift(startingCell);
        return route;
    }

    reverseBuildingRouteOnVertices(startingVertice, finalVertice, resultMap) {

        let currentCell = finalVertice;
        let route = [];

        // to avoid direct connections between vertices
        let x2 = Math.floor((startingVertice.x - this.minX) / this.blockSize);
        let y2 = Math.floor((startingVertice.y - this.minY) / this.blockSize);
        return [[x2, y2]];
    }

    addRoadLevelToArrOfCells(route, level) {
        for (let i = 0; i < route.length; i++) {
            let x = route[i][0];
            let y = route[i][1]
            this.createCell({x, y});
            this.coordsGridArr[x][y].addTerrainType({type: 'road', level: level});
        }
    }

    hashResult(from, to, result, timestampInRounds) {
        //console.log("hashResult result", result);
        return this.hashBfs.set(`from ${from} to ${to}`, {result, timestampInRounds});
    }

    returnHashedResultIfNotExpired(from, to, currentRound, distance) {
        // console.log("returnHashedResultIfNotExpired");
        // console.log("from", from);
        // console.log("to", to);
        // console.log("currentRound", currentRound);

        if (!this.hashBfs.has(`from ${from} to ${to}`)) return -1;
        let hash = this.hashBfs.get(`from ${from} to ${to}`);

        //console.log("hash", hash);
        let length = hash.result.edgesToBeAddedAndRoute.length.reduce((sum, item) => item + sum, 0);
        let addedTimeForOptimalRoute = 0;
        if(length < distance * 0.6) {
            addedTimeForOptimalRoute = Math.round((distance / length + 0.1) * 10);
            // console.log("Optimal route increased time for hash");
            // console.log("addedTimeForOptimalRoute", addedTimeForOptimalRoute);
        }


        //console.log("hash.timestampInRounds", hash.timestampInRounds);

        if (currentRound - hash.timestampInRounds >= this.hashExpiredAfterRounds + addedTimeForOptimalRoute) {
            this.hashBfs.delete(`from ${from} to ${to}`);
            return -1;
        }
        // console.log("Hashed incoming");
        // console.log("from", from);
        // console.log("to", to);
        // console.log("hash", hash);
        return hash.result;
    }

    edgesToBeMadeFromRoadAndAdjacentListsToBeUpdatedWith(route, startingCell, finalCell) {
        // example
        // route from A [150, 20] to B [19, 20] through vertices D [112, 5] and C [59, 5]
        // In that case new edges are AD, DC, CB
        // And AdjacentMap should be updated for these four vertices
        // A = {D}
        // D = {A, C}
        // C = {D, B}
        // B = {C}
        // route will look smt like this
        // [ [150, 20], [149, 19], [148, 18] ... [112, 5], .... [59, 5], [58, 6], [57, 7] ... [19, 20] ]
        // A ----- D ---------- C ------- B
        // there could be variants with roads that are already built
        // A - D ---------- C ------- B
        // or
        // A ----- D - C - B

        // edges: [[verticeId1, verticeId2], [verticeId2, verticeId3]]
        // routes: [[[1, 1], [1, 2], [1, 3]], [[1, 3], [2, 4], [3, 5]]]
        // length: [length1, length2]
        let edgesToBeAddedAndRoute = {edges: [[]], routes: [[]], length: [0]};
        // adj: [[verticeId1, verticeId2], [verticeId2, verticeId1], [verticeId2, verticeId3]]
        //let adjacentListsOfVertices = [];

        let length = edgesToBeAddedAndRoute.routes.length;
        let verticesIdList = []

        //console.log("edgesToBeMadeFromRoadAndAdjacentListsToBeUpdatedWith route", route);
        for (let i = 0; i < route.length; i++) {
            length = edgesToBeAddedAndRoute.routes.length;

            let curCell = this.coordsGridArr[route[i][0]][route[i][1]];
            console.log("curCell", curCell);
            if (curCell === undefined) continue;
            if (curCell.verticeArr.length === 0) {

                // if it is cell without vertice then remember route for this new edge
                // there must be i > 0
                // add cell to existing route
                this.edgesToBeMadeAddRouteStartingVerticeAndRouteAndPrice(curCell, verticesIdList, edgesToBeAddedAndRoute, length, route, i);
                continue;
            }
            // if there are at least one vertice in cell then find first that is in this cell and not in list of vertices already
            let k = 0;
            while (verticesIdList.indexOf(curCell.verticeArr[k]) > 0) {
                k++;
                if (k > curCell.verticeArr.length - 1) {
                    k = -1;
                    break;
                }
            }
            // if there is one add it to vertices list
            // end route if there is one
            // or start new
            if (k > -1) {
                verticesIdList.push(curCell.verticeArr[k]);
                this.updateEdgesAndRoutes(edgesToBeAddedAndRoute, length, route, i, verticesIdList);
            }
            // then are to make pairs of them
        }
        // console.log("edgesToBeMadeFromRoadAndAdjacentListsToBeUpdatedWith");
        // console.log("edgesToBeAddedAndRoute", edgesToBeAddedAndRoute);
        return edgesToBeAddedAndRoute;
    }

    edgesToBeMadeAddRouteStartingVerticeAndRouteAndPrice(curCell, verticesIdList, edgesToBeAddedAndRoute, length, route, i) {
        // console.log("edgesToBeAddedAndRoute.routes", edgesToBeAddedAndRoute.routes);
        // console.log("length", length);
        if(length === 0) {
            console.log("i", i);
            console.log("route", route);
            console.log("this.coordsGridArr[route[i][0]][route[i][1]]", this.coordsGridArr[route[i][0]][route[i][1]]);
        }

        edgesToBeAddedAndRoute.routes[length - 1].push(route[i]);
        let cell = this.coordsGridArr[route[i][0]][route[i][1]]
        edgesToBeAddedAndRoute.length[length - 1] += +cell.currentMultiplier * this.blockSize;
    }

    updateEdgesAndRoutes(edgesToBeAddedAndRoute, length, route, i, verticesIdList/*, adjacentListsOfVertices*/) {
        if (length === 0) return 0;
        // console.log("updateEdgesAndRoutes edgesToBeAddedAndRoute", edgesToBeAddedAndRoute);
        // console.log("length", length);
        // console.log("edgesToBeAddedAndRoute.routes[length - 1]", edgesToBeAddedAndRoute.routes[length - 1]);

        // add vertice to route
        this.addVerticeRouteAndLengthToEdgesToBeAddedAndRoute(edgesToBeAddedAndRoute, length, route, i, verticesIdList);

        // if there are more than 2 items in route and last item that was pushed is vertice
        // then route part ends here and new route starts with current vertice
        if (edgesToBeAddedAndRoute.routes[length - 1].length > 1) {
            // start new route
            edgesToBeAddedAndRoute.routes.push([]);
            edgesToBeAddedAndRoute.edges.push([]);
            edgesToBeAddedAndRoute.length.push(0);

            if(i < route.length - 1) this.addVerticeRouteAndLengthToEdgesToBeAddedAndRoute(edgesToBeAddedAndRoute, length + 1, route, i, verticesIdList);
        }
        return 0;
    }

    addVerticeRouteAndLengthToEdgesToBeAddedAndRoute(edgesToBeAddedAndRoute, length, route, i, verticesIdList) {

        edgesToBeAddedAndRoute.routes[length - 1].push(route[i]);
        edgesToBeAddedAndRoute.edges[length - 1].push(verticesIdList[verticesIdList.length - 1]);
        let cell = this.coordsGridArr[route[i][0]][route[i][1]]
        if(!edgesToBeAddedAndRoute.length.length < length) edgesToBeAddedAndRoute.length.push(0);
        edgesToBeAddedAndRoute.length[length - 1] += cell.currentMultiplier * this.blockSize;
    }


    save() {
        let save_obj = {};
        save_obj.objType = "Map Logic";

        for (let key in this) {
            // save Map object
            if (typeof this[key] === "object" && !Array.isArray(this[key]) && !(this[key] instanceof Graph) ) {
                save_obj[key] = [];
                let arrOfEntries = Array.from(this[key].entries());

                for (let innerKey = 0; innerKey < arrOfEntries.length; innerKey++) {
                    let value = arrOfEntries[innerKey][1];

                    save_obj[key].push([arrOfEntries[innerKey][0], value]);
                }

            } else if (Array.isArray(this[key]) && this[key].at(0) && Array.isArray(this[key][0])) {
                // save grid with Map Cell values
                // coordsGridArr = [[MapCell, MapCell, ...], []...]
                save_obj[key] = [];
                for(let i = 0; i < this[key].length; i++) {
                    save_obj[key].push([]);
                    let curLength = save_obj[key].length - 1;
                    for(let j = 0; j < this[key][0].length; j++) {
                        if(this[key][i][j] === undefined) {
                            save_obj[key][curLength].push({length: 0});
                            continue;
                        }
                        save_obj[key][curLength].push(this[key][i][j].save());
                    }
                }
            } else if(this[key] instanceof Graph) {/*ignore*/}
            else save_obj[key] = this[key];
        }
        console.log("save_obj", save_obj);

        return save_obj;
    }

    static load(paramsObj) {
        console.log("Map Logic paramsObj", paramsObj);
        let mapLogic = new MapLogic(0,0,0,0, undefined, true);
        if (typeof paramsObj === "string") paramsObj = JSON.parse(paramsObj);
        if (!paramsObj.objType && paramsObj.objType !== "Map Logic") {
            for (let key in paramsObj) {
                if(key === "mapLogic") {
                    return this.load(paramsObj[key]);
                }
            }
            return -1;
        }


        for (let key in paramsObj) {
            //console.log("key", key);
            if (typeof paramsObj[key] === "object" && Array.isArray(paramsObj[key]) && paramsObj[key].at(0) && Array.isArray(paramsObj[key][0]) && key === "coordsGridArr"/*paramsObj[key][0][0].objType && paramsObj[key][0][0].objType === "Map Cell"*/) {
                // load grid with Map Cell values
                mapLogic[key] = []
                for (let i = 0; i < paramsObj[key].length; i++) {
                    mapLogic[key].push([])
                    let lngth = mapLogic[key].length;
                    for (let j = 0; j < paramsObj[key][0].length; j++) {

                        let value = paramsObj[key][i][j];
                        if(value.length === 0) {
                            mapLogic[key][lngth - 1].push(undefined);
                            continue;
                        }

                        if (value.objType && value.objType === "Map Cell") value = MapCell.load(value);
                        mapLogic[key][lngth - 1].push(value);
                    }
                }
            } else if(Array.isArray(paramsObj[key]) && paramsObj[key].at(0) && Array.isArray(paramsObj[key][0])) {
                // load Map object
                mapLogic[key] = new Map();
                for (let i = 0; i < paramsObj[key].length; i++) {
                    let value = paramsObj[key][i][1];
                    mapLogic[key].set(paramsObj[key][i][0], value);
                }
            }
            else mapLogic[key] = paramsObj[key];
        }

        return mapLogic;
    }
}