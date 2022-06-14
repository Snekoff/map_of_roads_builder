import {MapCell} from "./map_cell.js";

export class MapLogic {

    hashExpiredAfterRounds = 15;

    constructor(minX, minY, maxX, maxY, graph = undefined, rectGridOfTypes = [[[]]]) {
        this.isInitalized = true;
        this.maxX = maxX;
        this.maxY = maxY;
        this.minX = minX;
        this.minY = minY;
        this.graph = graph;
        this.rectGridOfTypes = rectGridOfTypes;
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
        if (this.rectGridOfTypes[0][0].length === 0) {
            this.rectGridOfTypes = new Array(Math.ceil(differX / this.blockSize));
            for (let i = 0; i < this.rectGridOfTypes.length; i++) {
                this.rectGridOfTypes[i] = new Array(Math.ceil(differY / this.blockSize));
            }
        }

        this.initializeCellsWithVertices(graph, this.blockSize);
    }

    show() {
        for (let key in this) {
            console.log(key + ': ', this[key]);
        }
        console.log(this.checkIfCellEmpty(0, 0));
    }

    addGraph(graph) {
        this.graph = graph;
        this.initializeCellsWithVertices(graph, this.blockSize);
    }

    checkIfCellEmpty(x, y) {
        return this.coordsGridArr[x][y] === undefined;
    }

    checkIfLowerPriceThanInInCell(x, y, priceForTraveling) {
        if (this.coordsGridArr[x][y] === undefined) return true;
        if (this.coordsGridArr[x][y].price > priceForTraveling) return true;
        return false;
    }

    writeInCell(x, y, priceForTraveling, from) {
        this.createCell({x, y});
        this.coordsGridArr[x][y].price = priceForTraveling;
        this.coordsGridArr[x][y].from = from;
    }

    createCell(params) {
        if (this.coordsGridArr[params.x][params.y] === undefined) {
            if (!params.terrainTypes && this.rectGridOfTypes[params.x][params.y] !== undefined) {
                params.terrainTypes = this.rectGridOfTypes[params.x][params.y];
            } else if (params.terrainTypes) {
                this.rectGridOfTypes[params.x][params.y] = params.terrainTypes;
            }
            this.coordsGridArr[params.x][params.y] = new MapCell(params);
            return 0;
        }
        return -1;
    }

    addVerticeToCell(x, y, verticeId) {
        this.createCell({x, y});
        this.coordsGridArr[x][y].addVerticeArr(verticeId);
    }

    initializeCellsWithVertices(graph, blockSize) {
        if (graph === undefined) return -1;
        // console.log("initializeCellsWithVertices");
        // console.log('graph', graph);
        let arrOfVerticeCoords = this.findVerticesCordsAndReturnThemInArr(graph, blockSize);
        this.forEachVerticeAddCellObj(arrOfVerticeCoords);

    }

    forEachVerticeAddCellObj(arr) {
        // arr = [[id, x, y], ...]
        // console.log("forEachVerticeAddCellObj");
        // console.log('arr', arr);
        // console.log('this.coordsGridArr', this.coordsGridArr);
        for (let i = 0; i < arr.length; i++) {
            //console.log('arr[i]', arr[i]);
            if (this.coordsGridArr[arr[i][1]][arr[i][2]] !== undefined && this.coordsGridArr[arr[i][1]][arr[i][2]].verticeArr.indexOf(arr[0]) > 0) continue;
            this.addVerticeToCell(arr[i][1], arr[i][2], arr[i][0])
        }
    }

    findVerticesCordsAndReturnThemInArr(graph, blockSize) {
        let arr = [];
        for (let vertice of graph.verticesMap.values()) {
            //  "- this.minX" to avoid negative indexes
            let x = Math.floor(vertice.x / blockSize) - this.minX;
            let y = Math.floor(vertice.y / blockSize) - this.minY;
            if (x < 0) x = 0;
            if (y < 0) y = 0;
            if (x > this.coordsGridArr.length - 1) x = this.coordsGridArr.length - 1;
            if (y > this.coordsGridArr[0].length - 1) y = this.coordsGridArr[0].length - 1;
            arr.push([vertice.id, x, y]);
        }
        return arr;
    }

    bfsFromOneVerticeToAnother(startingVerticeId = -1, finalVerticeId = -1, graph, currentRound) {
        let hash = this.returnHashedResultIfNotExpired(startingVerticeId, finalVerticeId, currentRound);
        if (hash !== -1) {
            //console.log("bfsFromOneVerticeToAnother hashed");
            return hash;
        }
        if (startingVerticeId === -1) startingVerticeId = Math.round(Math.random() * graph.verticesMap.size - 1);
        while (finalVerticeId === -1 || finalVerticeId === startingVerticeId) {
            finalVerticeId = Math.round(Math.random() * graph.verticesMap.size - 1);
        }
        // console.log('startingVerticeId', startingVerticeId);
        // console.log('finalVerticeId', finalVerticeId);
        // console.log('this.blockSize', this.blockSize);
        // console.log('graph', graph);
        let stVertice = graph.verticesMap.get(startingVerticeId);
        let fnVertice = graph.verticesMap.get(finalVerticeId);
        if (!stVertice && !fnVertice) {
            console.log('Error no item in graph');
            console.log('stVertice', stVertice);
            console.log('fnVertice', fnVertice);
            return;
        }
        let stX = Math.floor(stVertice.x / this.blockSize) - this.minX;
        let stY = Math.floor(stVertice.y / this.blockSize) - this.minY;

        let fnX = Math.floor(fnVertice.x / this.blockSize) - this.minX;
        let fnY = Math.floor(fnVertice.y / this.blockSize) - this.minY;

        let result = this.bfsOnGridReturnRouteAndLength([stX, stY], [fnX, fnY], stVertice, fnVertice, graph);
        console.log('bfs result', result);
        return result;
    }

    bfsOnVerticesReturnRouteAndLength(startingVertice, finalVertice, graph) {
        let result = {price: -1, route: []};
        let visitedArr = [];
        let bfsHeap = [startingVertice.id];
        let temResults = new Map();
        while (bfsHeap.length > 0) {
            this.bfsOnVertices(startingVertice, finalVertice, graph, bfsHeap, visitedArr, temResults);
        }

        if (temResults.has(finalVertice.id)) {
            let res = temResults.get(finalVertice.id);
            result.price = res.price;
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

        let currentSum = temResults.has(vertice.id) ? temResults.get(vertice.id).price : 0;
        if (temResults.has(finalVertice.id) && currentSum >= temResults.get(finalVertice.id).price) {
            return -1;
        }
        for (let entry of vertice.adjacentVerticesAndRoadLengthToThem.entries()) {
            let x = Math.floor(vertice.x / this.blockSize) - this.minX;
            let y = Math.floor(vertice.y / this.blockSize) - this.minY;

            if (temResults.has(entry[0]) && temResults.get(entry[0]).price > entry[1].price + currentSum) {
                temResults.set(entry[0], {price: currentSum + entry[1].price, from: [x, y]});
                bfsHeap.push(entry[0]);
            } else if (!temResults.has(entry[0])) {
                temResults.set(entry[0], {price: currentSum + entry[1].price, from: [x, y]});
                bfsHeap.push(entry[0]);
            }
        }
        return 0;
    }

    bfsOnGridReturnRouteAndLength(startingCell, finalCell, startingVertice, finalVertice, graph) {
        let result = {price: -1, route: []};
        let visitedArr = [];
        let bfsHeap = [startingCell];
        let temResults = new Map();
        let stCellKey = startingCell[0] + ' ' + startingCell[1];
        //console.log("stCellKey", stCellKey);
        temResults.set(stCellKey, {
            price: this.coordsGridArr[startingCell[0]][startingCell[1]].currentMultiplier * this.blockSize,
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
            result.price = temResults.get(finCellKey).price;
            result.route = this.reverseBuildingRouteOnGrid(startingCell, finalCell, temResults);
            edgesToBeMade = this.edgesToBeMadeFromRoadAndAdjacentListsToBeUpdatedWith(result.route, startingCell, finalCell);
            result.edgesToBeAddedAndRoute = edgesToBeMade;
        }
        // console.log("temResults", temResults);
        // console.log("this.blockSize", this.blockSize);
        // console.log("startingCell", startingCell);
        // console.log("finalCell", finalCell);
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
        if (vertResult.price > 0) {
            let finCellKey = finalCell.x + ' ' + finalCell.y;
            if (temResults.has(finCellKey) && temResults.get(finCellKey).price <= vertResult.price) {
            } else {
                temResults.get(finCellKey).price = vertResult.price;
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
        let currentSum = temResults.has(curCellKey) ? temResults.get(curCellKey).price : 0;
        if (temResults.has(finCellKey) && currentSum >= temResults.get(finCellKey).price) {
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
                && temResults.get(newCellKey).price <= currentSum + addedDistance) continue;

            temResults.set(newCellKey, {price: currentSum + addedDistance, from: [x, y]});
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
        let x2 = Math.floor(startingVertice.x / this.blockSize) - this.minX;
        let y2 = Math.floor(startingVertice.y / this.blockSize) - this.minY;
        return [[x2, y2]];

        //
        // let x = Math.floor(currentCell.x / this.blockSize) - this.minX;
        // let y = Math.floor(currentCell.y / this.blockSize) - this.minY;
        // while (currentCell.id !== startingVertice.id) {
        //
        //     route.unshift([x, y]);
        //     let curCellKey = x + ' ' + y;
        //     if(!resultMap.has(curCellKey)) {
        //         route.unshift(`Error ${curCellKey} not present in grid results`);
        //         break;
        //     }
        //     currentCell = resultMap.get(curCellKey).from;
        //     x = currentCell[0];
        //     y = currentCell[1];
        // }
        //
        // if(route.length === 0 && startingVertice.id !== finalVertice.id) route.unshift([x, y]);
        //
        // let x1 = Math.floor(startingVertice.x / this.blockSize) - this.minX;
        // let y1 = Math.floor(startingVertice.y / this.blockSize) - this.minY;
        // route.unshift([x1, y1]);
        // return route;
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

    returnHashedResultIfNotExpired(from, to, currentRound) {
        // console.log("returnHashedResultIfNotExpired");
        // console.log("from", from);
        // console.log("to", to);
        // console.log("currentRound", currentRound);

        if (!this.hashBfs.has(`from ${from} to ${to}`)) return -1;
        let hash = this.hashBfs.get(`from ${from} to ${to}`);

        //console.log("hash.timestampInRounds", hash.timestampInRounds);

        if (currentRound - hash.timestampInRounds >= this.hashExpiredAfterRounds) {
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
        let edgesToBeAddedAndRoute = {edges: [[]], routes: [[]], length: []};
        // adj: [[verticeId1, verticeId2], [verticeId2, verticeId1], [verticeId2, verticeId3]]
        //let adjacentListsOfVertices = [];

        let length = edgesToBeAddedAndRoute.routes[0].length;
        let verticesIdList = []

        for (let i = 0; i < route.length; i++) {
            let curCell = this.coordsGridArr[route[i][0]][route[i][1]];
            if (curCell === undefined) continue;
            if (curCell.verticeArr.length === 0) {
                length = edgesToBeAddedAndRoute.routes[edgesToBeAddedAndRoute.routes.length - 1].length;
                // if it is regular cell without vertice then remember route for this new edge
                // there must be i > 0
                if (length === 0) {
                    length = edgesToBeAddedAndRoute.routes.length;
                    // if route is empty start new
                    // start is last visited vertice
                    this.edgesToBeMadeAddRouteStartingVerticeAndRouteAndPrice(curCell, verticesIdList, edgesToBeAddedAndRoute, length, route, i);
                } else {
                    length = edgesToBeAddedAndRoute.routes.length;
                    // other ways add cell to existing route
                    edgesToBeAddedAndRoute.routes[length - 1].push(route[i]);
                    let cell = this.coordsGridArr[route[i][0]][route[i][1]]
                    edgesToBeAddedAndRoute.length[length - 1] += cell.currentMultiplier * this.blockSize;
                }
                continue;
            }
            // if there are at least one vertice in cell then find first that is in this cell and not in list of vertices already
            let k = 0;
            while (verticesIdList.indexOf(curCell.verticeArr[k]) > 0) {
                if (k > curCell.verticeArr.length - 1) {
                    k = -1;
                    break;
                }
                k++;
            }
            // if there is one add it to vertices list
            // end route if there is one
            // start new
            if (k > -1) {
                verticesIdList.push(curCell.verticeArr[k]);
                this.updateEdgesAndRoutes(edgesToBeAddedAndRoute, length, route, i, verticesIdList/*, adjacentListsOfVertices*/);
            }
            // then are to make pairs of them
        }
        console.log("edgesToBeMadeFromRoadAndAdjacentListsToBeUpdatedWith");
        console.log("edgesToBeAddedAndRoute", edgesToBeAddedAndRoute);
        return edgesToBeAddedAndRoute;
    }

    edgesToBeMadeAddRouteStartingVerticeAndRouteAndPrice(curCell, verticesIdList, edgesToBeAddedAndRoute, length, route, i) {
        console.log("edgesToBeAddedAndRoute", edgesToBeAddedAndRoute);
        console.log("length", length);
        /*let vertice = this.coordsGridArr[route[i - 1][0]][route[i - 1][1]];//curCell.verticeArr[0];
        if (verticesIdList.length > 0) vertice = verticesIdList[verticesIdList.length - 1];
        edgesToBeAddedAndRoute.edges[length - 1].push(vertice);
        edgesToBeAddedAndRoute.routes[length - 1].push(route[i - 1]);*/
        edgesToBeAddedAndRoute.routes[length - 1].push(route[i]);

        /*let cell = this.coordsGridArr[route[i - 1][0]][route[i - 1][1]]
        edgesToBeAddedAndRoute.length.push(cell.currentMultiplier * this.blockSize);*/

        let cell = this.coordsGridArr[route[i][0]][route[i][1]]
        edgesToBeAddedAndRoute.length[length - 1] += cell.currentMultiplier * this.blockSize;
    }

    updateEdgesAndRoutes(edgesToBeAddedAndRoute, length, route, i, verticesIdList/*, adjacentListsOfVertices*/) {
        if (length === 0) return 0;
        console.log("edgesToBeAddedAndRoute", edgesToBeAddedAndRoute);
        console.log("length", length);
        console.log("edgesToBeAddedAndRoute.routes[length - 1]", edgesToBeAddedAndRoute.routes[length - 1]);

        // add vertice to route
        edgesToBeAddedAndRoute.routes[length - 1].push(route[i]);
        edgesToBeAddedAndRoute.edges[length - 1].push(verticesIdList[verticesIdList.length - 1]);
        let cell = this.coordsGridArr[route[i][0]][route[i][1]]
        edgesToBeAddedAndRoute.length[length - 1] += cell.currentMultiplier * this.blockSize;

        // make adjacent list updates queue
        // adjacentListsOfVertices.push(edgesToBeAddedAndRoute.edges[length - 1][0], edgesToBeAddedAndRoute.edges[length - 1][1]);
        // adjacentListsOfVertices.push(edgesToBeAddedAndRoute.edges[length - 1][1], edgesToBeAddedAndRoute.edges[length - 1][0]);


        // make reversed routes for either way roads
        /*let route1 = edgesToBeAddedAndRoute.routes[length - 1].reverse();
        let edge1 = edgesToBeAddedAndRoute.edges[length - 1].reverse();
        let length1 = edgesToBeAddedAndRoute.length[length - 1];
        edgesToBeAddedAndRoute.routes.push(route1);
        edgesToBeAddedAndRoute.edges.push(edge1);
        edgesToBeAddedAndRoute.length.push(length1);
        */

        if (edgesToBeAddedAndRoute.routes[length - 1].length > 1) {
            // start new route
            edgesToBeAddedAndRoute.routes.push([]);
            edgesToBeAddedAndRoute.edges.push([]);
        }
        return 0;
    }

    /*addVerticeRouteAndLengthToEdgesToBeAddedAndRoute(edgesToBeAddedAndRoute, length, route, i, verticesIdList) {
        edgesToBeAddedAndRoute.routes[length - 1].push(route[i]);
        edgesToBeAddedAndRoute.edges[length - 1].push(verticesIdList[verticesIdList.length - 1]);
        let cell = this.coordsGridArr[route[i][0]][route[i][1]]
        edgesToBeAddedAndRoute.length[length - 1] += cell.currentMultiplier * this.blockSize;
    }*/
}