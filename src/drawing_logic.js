import {Graph} from "./graph/graph.js";
import {Drawing} from "./drawing.js";
import {MapLogic} from "./map/map_logic.js";
import {MapCell} from "./map/map_cell.js";

export class DrawingLogic {

    verticeObjectsList = [
        // {
        //     x: 100,
        //     y: 450,
        //     name: 'fort 1',
        //     type: 2,
        //     richness: 5,
        //     prosperity: 10,
        //     incomeToAddInNextTurn: 0,
        //     numOfWares: 0,
        //     defencePower: 0,
        //     reach: 1000,
        //     isForVisualisation: true
        // },
        // {
        //     x: 100,
        //     y: 650,
        //     name: 'village 1',
        //     type: 1,
        //     richness: 10,
        //     prosperity: 10,
        //     incomeToAddInNextTurn: 0,
        //     numOfWares: 0,
        //     defencePower: 0,
        //     reach: 500,
        //     isForVisualisation: true
        // }
        // ,{
        //     x: 900,
        //     y: 290,
        //     name: 'criminal camp 1',
        //     type: 4,
        //     richness: 15,
        //     prosperity: 10,
        //     incomeToAddInNextTurn: 0,
        //     numOfWares: 0,
        //     defencePower: 0,
        //     reach: 1500,
        //     isForVisualisation: true
        // }
        {
            x: 100,
            y: 850,
            name: 'fort 1',
            type: 2,
            richness: 5,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 100,
            reach: 100,
            isForVisualisation: true
        },
        {
            x: 200,
            y: 400,
            name: 'village 1',
            type: 1,
            richness: 2,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 0,
            reach: 50,
            isForVisualisation: true
        }
        , {
            x: 900,
            y: 290,
            name: 'fort 2',
            type: 2,
            richness: 5,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 100,
            reach: 150,
            isForVisualisation: true
        }
        , {
            x: 1100,
            y: 890,
            name: 'city 1',
            type: 0,
            richness: 6,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 150,
            reach: 150,
            isForVisualisation: true
        }
        , {
            x: 1500,
            y: 100,
            name: 'city 2',
            type: 0,
            richness: 6,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 150,
            reach: 100,
            isForVisualisation: true
        }
        , {
            x: 1300,
            y: 400,
            name: 'city 3',
            type: 0,
            richness: 6,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 150,
            reach: 100,
            isForVisualisation: true
        }
        , {
            x: 1450,
            y: 570,
            name: 'fort 3',
            type: 2,
            richness: 5,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 100,
            reach: 100,
            isForVisualisation: true
        }
        // ---------------------------------------------------
        , {
            x: 150,
            y: 100,
            name: 'city 4',
            type: 0,
            richness: 6,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 150,
            reach: 100,
            isForVisualisation: true
        }
        , {
            x: 200,
            y: 120,
            name: 'city 5',
            type: 0,
            richness: 6,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 150,
            reach: 120,
            isForVisualisation: true
        }
        , {
            x: 1900,
            y: 170,
            name: 'city 6',
            type: 0,
            richness: 6,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 150,
            reach: 100,
            isForVisualisation: true
        }
        , {
            x: 1800,
            y: 140,
            name: 'city 7',
            type: 0,
            richness: 6,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 150,
            reach: 170,
            isForVisualisation: true
        }
        , {
            x: 800,
            y: 440,
            name: 'city 8',
            type: 0,
            richness: 6,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 150,
            reach: 170,
            isForVisualisation: true
        }
        , {
            x: 1780,
            y: 900,
            name: 'fort 4',
            type: 2,
            richness: 5,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 100,
            reach: 50,
            isForVisualisation: true
        }
        , {
            x: 1090,
            y: 490,
            name: 'fort 5',
            type: 2,
            richness: 5,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 10,
            reach: 50,
            isForVisualisation: true
        }
        , {
            x: 1200,
            y: 800,
            name: 'village 2',
            type: 1,
            richness: 2,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 0,
            reach: 70,
            isForVisualisation: true
        }
        , {
            x: 790,
            y: 600,
            name: 'village 3',
            type: 1,
            richness: 2,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 0,
            reach: 70,
            isForVisualisation: true
        }
        , {
            x: 210,
            y: 700,
            name: 'village 4',
            type: 1,
            richness: 2,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 0,
            reach: 70,
            isForVisualisation: true
        }
        , {
            x: 100,
            y: 800,
            name: 'village 5',
            type: 1,
            richness: 2,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 0,
            reach: 70,
            isForVisualisation: true
        }
        , {
            x: 50,
            y: 370,
            name: 'village 6',
            type: 1,
            richness: 2,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 0,
            reach: 50,
            isForVisualisation: true
        }
        , {
            x: 50,
            y: 40,
            name: 'village 7',
            type: 1,
            richness: 2,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 0,
            reach: 90,
            isForVisualisation: true
        }
        , {
            x: 700,
            y: 345,
            name: 'village 8',
            type: 1,
            richness: 2,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 0,
            reach: 50,
            isForVisualisation: true
        }
        , {
            x: 1000,
            y: 600,
            name: 'village 9',
            type: 1,
            richness: 2,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 0,
            reach: 90,
            isForVisualisation: true
        }
        , {
            x: 865,
            y: 234,
            name: 'village 10',
            type: 1,
            richness: 2,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 0,
            reach: 50,
            isForVisualisation: true
        }
        , {
            x: 456,
            y: 255,
            name: 'village 11',
            type: 1,
            richness: 2,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 0,
            reach: 100,
            isForVisualisation: true
        }
        , {
            x: 678,
            y: 786,
            name: 'village 12',
            type: 1,
            richness: 2,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 0,
            reach: 50,
            isForVisualisation: true
        }
        , {
            x: 1356,
            y: 683,
            name: 'village 13',
            type: 1,
            richness: 2,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 0,
            reach: 35,
            isForVisualisation: true
        }
        , {
            x: 1050,
            y: 670,
            name: 'camp 1',
            type: 3,
            richness: 2,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 0,
            reach: 35,
            isForVisualisation: true
        }
        , {
            x: 1150,
            y: 970,
            name: 'criminal camp 1',
            type: 4,
            richness: 5,
            prosperity: 10,
            incomeToAddInNextTurn: 0,
            numOfWares: 0,
            defencePower: 0,
            reach: 35,
            isForVisualisation: true
        }

    ];

    edgeObjectsList = [];

    limitInPercentsForHypotenuseLengthDeletion = 0;

    currentRound = [0];

    constructor(minX, minY, maxX, maxY, isLoaded = false) {
        this.isInitalized = true;
        if(!isLoaded) {
            this.minX = minX;
            this.minY = minY;
            this.maxX = maxX;
            this.maxY = maxY;

            this.mapLogic = new MapLogic(minX, minY, maxX, maxY);
            this.draw = new Drawing(minX, minY, maxX, maxY, this.mapLogic.blockSize);
        }
    }

    initialVerticesEdgesShow(noRandomGeneration = false) {
        //this.mapLogic = new MapLogic(this.minX, this.minY, this.maxX, this.maxY);
        //this.draw = new Drawing(this.minX, this.minY, this.maxX, this.maxY, this.mapLogic.blockSize);

        console.log(document.getElementById("start").value);
        this.currentRound = [0];

        let verticesList = [];
        let verticesNames = [];
        let edgesList = [];
        if (!noRandomGeneration) this.randomPointsGeneration(verticesList, verticesNames, edgesList);


        this.graph = new Graph(0,
            verticesList,
            verticesNames,
            edgesList,
            [],
            this.verticeObjectsList,
            this.edgeObjectsList,
            this.currentRound);
        this.mapLogic.addGraph(this.graph);

        console.log('--graph--', this.graph);
        this.draw.drawBackgroundImage(0, 0);
        this.draw.drawVerticesGraphics(this.graph);
        this.draw.drawEdgesAndVerticesTextOnCanvas(this.graph);
        return this.graph;
    }

    randomPointsGeneration(verticesList, verticesNames, edgesList) {
        let numOfVerticesToGenerate = +document.getElementById("vertices1").value;
        for (let i = 0; i < numOfVerticesToGenerate; i++) {
            verticesList.push([Math.random() * 2000, Math.random() * 1000, Math.random() * 2]);
            verticesNames.push(`gen_name_${i}`);
        }
        let numOfEdgesToGenerate = +document.getElementById("edges1").value;
        for (let i = 0; i < numOfEdgesToGenerate; i++) {
            let name1 = verticesNames[Math.round(Math.random() * numOfVerticesToGenerate)];
            let name2 = verticesNames[Math.round(Math.random() * numOfVerticesToGenerate)];
            while (name1 === name2) {
                name2 = verticesNames[Math.round(Math.random() * numOfVerticesToGenerate)];
            }
            edgesList.push([name1, name2]);
        }
    }

    createEdgeAndCalculateParameters(graph, item, mapLogic, isEitherWay = true) {
        let createEdgeResult1 = 0;
        let createEdgeResult2 = 0;

        let level = this.binaryCheckWhatLevelOfRoadCouldBeMade(item[0], item[1], graph);
        if(graph.verticesMap.get(item[0]).type === 4) isEitherWay = false;
        createEdgeResult1 = graph.createEdgeFromTwoPointsAndAddPointsToAdjacentLists(item[0], item[1], graph.adjacentMap, graph.edgesMap, graph.nameForNextEdge, graph.verticesMap, mapLogic, 0, level, 0, isEitherWay, true, true);
        //if (isEitherWay && createEdgeResult1 !== -1) createEdgeResult2 = graph.createEdgeFromTwoPointsAndAddPointsToAdjacentLists(item[1], item[0], graph.adjacentMap, graph.edgesMap, graph.nameForNextEdge, graph.verticesMap, mapLogic, 0, level, 0, false, true, false, createEdgeResult1.route, createEdgeResult1.length, createEdgeResult1.edgesToBeAddedAndRoute, createEdgeResult1.level);
        if (createEdgeResult1 === -1 || createEdgeResult2 === -1) return -1;
        let verticesMap = graph.verticesMap;

        //findLessReachAndApplyReachChange(verticesMap, item, isEitherWay);
        return 0;
    }

    binaryCheckWhatLevelOfRoadCouldBeMade(vertice1Name, vertice2Name, graph) {
        let vertice1 = graph.verticesMap.get(vertice1Name);
        let vertice2 = graph.verticesMap.get(vertice2Name);
        let level = 0;
        let rich = vertice1.richness;
        let priceArr = graph.epoch.getPriceForRoad();

        if (vertice2.type === 1 && vertice2.richness < priceArr[level + 1] && vertice1.richness < priceArr[level + 1] * 10) return level;
        else if (vertice1.richness > priceArr[Math.min(level + 2, priceArr.length - 1)] * 10) {
            let tmp = priceArr[Math.min(level + 2, priceArr.length - 1)];
            vertice1.changeRichness(-1 * tmp);
            vertice2.changeRichness(tmp);
        }

        level = this.binarySearch(priceArr, rich, 0, priceArr.length - 1);

        return level;
    }

    binarySearch(arr, value, startIdx, endIdx) {
        // console.log("binarySearch");
        // console.log("arr", arr);
        // console.log("value", value);
        // console.log("startIdx", startIdx);
        // console.log("endIdx", endIdx);
        if (endIdx > arr.length - 1) return -1;
        if (arr[startIdx] > value) return 0;
        if (arr[endIdx] <= value) return endIdx;
        if (endIdx - startIdx === 1 && arr[startIdx] <= value && arr[endIdx] > value) return startIdx;

        let middle = Math.ceil((endIdx - startIdx) / 2) + startIdx;
        if (arr[startIdx] <= value && arr[middle] >= value) {
            return this.binarySearch(arr, value, startIdx, middle);
        }
        if (arr[middle] < value && arr[endIdx] >= value) {
            return this.binarySearch(arr, value, middle, endIdx);
        }
        //return -1;
    }

    buildEdgesAndUpdateView(graph) {
        this.currentRound[0]++;
        let arrOfPairs = this.countDistancesBetweenVerticesAndReturnReachableForEach(graph);
        let outerThis = this;
        arrOfPairs.forEach(function (item) {
            // TODO: add cost calculations
            // TODO: add defence calculations
            // TODO: add level calculations
            // TODO: add type
            //if(!graph.edgesMap.has(`from ${item[0]} to ${item[1]}`) && !graph.edgesMap.has(`from ${item[1]} to ${item[0]}`)) {
            outerThis.createEdgeAndCalculateParameters(graph, item, outerThis.mapLogic);
            //}
        });

        graph.setReachIncomeForAllVertices();
        graph.applyReachChangeForAllVertices();
        graph.setIncomeChangeForAllVertices();
        graph.applyIncomeChangeForAllVertices();

        this.lookForUnnecessaryEdgesDeleteThemAndAddSubstitutionEdge(graph);
        this.findLongEdgesAndPlaceCampsOnThem(graph);
        if(graph.doCitiesLayerNeedARefresh) {
            graph.doCitiesLayerNeedARefresh = false;
            this.draw.refresh("vertices-layer");
            this.draw.drawVerticesGraphics(graph);
        }

        this.draw.drawEdgesAndVerticesTextOnCanvas(graph);
        if(this.currentRound[0] % 5 === 0) graph.upgradeEdgeRichnessForAllEdges();
        /*console.log('this.mapLogic.coordsGridArr', this.mapLogic.coordsGridArr);
        console.log('this.mapLogic.coordsGridArr[80][44]', this.mapLogic.coordsGridArr[80][44]);*/
        return graph;
    }

    countDistancesBetweenVerticesAndReturnReachableForEach(graph) {
        let arrOfPairs = [];
        let vertices = graph.getAllVertices(graph.verticesMap);
        for (let i = 0; i < vertices.length; i++) {
            for (let j = i + 1; j < vertices.length; j++) {
                let key = `from ${vertices[i].id} to ${vertices[j].id}`;
                if (graph.edgesMap.has(key) && (!graph.edgesMap.get(key).isForVisualisation || graph.edgesMap.get(key).level === graph.epoch.getPriceForRoad().length - 1)) continue;
                let distance = graph.countDistanceBetweenVertices(vertices[i].id, vertices[j].id, graph.verticesMap);
                let checkResult = graph.checkAndSubtractMoneyOnBuildingIfNeeded(vertices[i].id, vertices[j].id, graph.verticesMap, distance, true, graph.epoch);
                if (checkResult.checkResult === 0) {
                    arrOfPairs.push([vertices[i].id, vertices[j].id]);
                }
                checkResult = graph.checkAndSubtractMoneyOnBuildingIfNeeded(vertices[j].id, vertices[i].id, graph.verticesMap, distance, true, graph.epoch);
                if (checkResult.checkResult === 0) {
                    arrOfPairs.push([vertices[j].id, vertices[i].id]);
                }
            }
        }
        return arrOfPairs;
    }

    lookForUnnecessaryEdgesDeleteThemAndAddSubstitutionEdge(graph) {
        return 0;
        /*  Для всіх точок з яких виходить більше ніж один шлях - зробити перевірку: Вважатимемо відправну точку точкою А, вона з'єднана з точкою B та точкою C шляхами.
            Уявимо що В та С з'єднані - отримаємо трикутник. Порахуємо сторони трикутника. Якщо Гіпотенуза(найдовший шлях) буде менше ніж сумма катетів на 10% (попередня планка)
            то Видалити Гіпотенузу та з'єднати В та С, додавши точці відправній та найдальшій - бонуси. Якщо ж Гіпотенуза складає < 90% від сумми катетів то тоді залишаємо все як є.*/
        this.lookForUnnecessaryEdgesAndReassemble(graph);
        return graph;
    }

    lookForUnnecessaryEdgesAndReassemble(graph) {
        console.log("graph.adjacentMap");
        console.log(graph.adjacentMap);


        let finishedVerticesArr = [];
        let tmpKey = graph.adjacentMap.keys()[Symbol.iterator]().next().value;
        let depthIndex = [0];
        this.reassembleEdgesInTriangleIfNeeded(graph, finishedVerticesArr, tmpKey, depthIndex);

    }

    reassembleEdgesInTriangleIfNeeded(graph, finishedVerticesArr, keyForMap, depthIndex) {
        let outerBreak = false;
        if (!graph.adjacentMap.has(keyForMap)) {
            if (graph.verticesMap.has(keyForMap)) finishedVerticesArr.push(keyForMap);
            return;
        }
        if (finishedVerticesArr.indexOf(keyForMap) > -1) outerBreak = true;
        let adjArr = graph.adjacentMap.get(keyForMap);
        if (adjArr.length < 2) {
            finishedVerticesArr.push(keyForMap);
            outerBreak = true;
        }

        console.log("adjArr", adjArr);
        for (let i = 0; i < adjArr.length && !outerBreak; i++) {
            for (let j = i + 1; j < adjArr.length; j++) {
                if (keyForMap === adjArr[i] || keyForMap === adjArr[j] || adjArr[i] === adjArr[j]) {
                    continue;
                }
                let arr = this.countDistancesBetweenThreeVerticesAndReturnThemInArr(graph, keyForMap, adjArr[i], adjArr[j]);
                let doEdgeExistsArr = this.checkDoEdgeExistsArr(graph, keyForMap, adjArr[i], adjArr[j])
                let indxAndSum = this.findMaxDistanceFromArrAndReturnItsIndexAndSumOfCathetuses(arr);


                if (!doEdgeExistsArr[indxAndSum[0]]) continue; // to avoid situation of not existing hypotenuse
                let arrOfIds = [keyForMap, adjArr[i], adjArr[j]];

                let tmpDebugResult = this.checkIfDifferenceBeyondLimitAndDoReassembleVerticesIfNeeded(graph, arr[indxAndSum[0]], indxAndSum[1], arrOfIds, indxAndSum[0], this.limitInPercentsForHypotenuseLengthDeletion);
                if (tmpDebugResult === 0) {
                    depthIndex[0] += 1;
                    this.reassembleEdgesInTriangleIfNeeded(graph, finishedVerticesArr, keyForMap, depthIndex);
                    outerBreak = true;
                    break;
                }
            }
            if (i === adjArr.length - 1) finishedVerticesArr.push(keyForMap);
        }
        let newKey;
        let tmpArr = Array.from(graph.adjacentMap.keys());
        for (let key = 0; key < tmpArr.length && newKey === undefined; key++) {
            if (finishedVerticesArr.indexOf(tmpArr[key]) < 0) {
                newKey = tmpArr[key];
            }
        }

        if (newKey || newKey === 0) {
            depthIndex[0] += 1;
            return this.reassembleEdgesInTriangleIfNeeded(graph, finishedVerticesArr, newKey, depthIndex);
        }
        return 0;
    }

    countDistancesBetweenThreeVerticesAndReturnThemInArr(graph, verticeAName, verticeBName, verticeCName) {
        let AB = graph.countDistanceBetweenVertices(verticeAName, verticeBName, graph.verticesMap);
        let AC = graph.countDistanceBetweenVertices(verticeAName, verticeCName, graph.verticesMap);
        let BC = graph.countDistanceBetweenVertices(verticeBName, verticeCName, graph.verticesMap);
        return [AB, AC, BC];
    }

    checkDoEdgeExistsArr(graph, verticeAId, verticeBId, verticeCId) {
        let arr = [false, false, false];
        if (graph.edgesMap.has(`from ${verticeAId} to ${verticeBId}`)) arr[0] = true;
        if (graph.edgesMap.has(`from ${verticeAId} to ${verticeCId}`)) arr[1] = true;
        if (graph.edgesMap.has(`from ${verticeBId} to ${verticeCId}`)) arr[2] = true;
        return arr;
    }

    findMaxDistanceFromArrAndReturnItsIndexAndSumOfCathetuses(arr) {
        let maxLength = Math.max(arr[0], arr[1], arr[2]);
        let indexOfMax = arr.indexOf(maxLength);
        let sumOfCathetuses = 0;
        for (let k = 0; k < arr.length; k++) {
            if (k === indexOfMax) continue;
            sumOfCathetuses += arr[k];
        }
        return [indexOfMax, sumOfCathetuses];
    }

    checkIfDifferenceBeyondLimitAndDoReassembleVerticesIfNeeded(graph, hypotenuse, sumOfCathetuses, arrOfIdsOfVertices, indxOfHypotenuse, limitInPercents) {
        if (limitInPercents < 0) limitInPercents = 0;
        if (limitInPercents > 100) limitInPercents = 100;
        if (hypotenuse < sumOfCathetuses * (100 - limitInPercents) / 100) return -1;

        let edgesIdsArr = [`from ${arrOfIdsOfVertices[0]} to ${arrOfIdsOfVertices[1]}`, `from ${arrOfIdsOfVertices[0]} to ${arrOfIdsOfVertices[2]}`, `from ${arrOfIdsOfVertices[1]} to ${arrOfIdsOfVertices[2]}`];
        let edge = graph.edgesMap.get(edgesIdsArr[indxOfHypotenuse]);

        let tmpDebugResult = this.addIfOneCathetusIsAbsent(graph, arrOfIdsOfVertices, this.mapLogic, edge.level);

        console.log("graph", graph);
        if (tmpDebugResult >= -1) tmpDebugResult = this.deleteUnnecessaryHypotenuse(graph, edge.vertices);
        return tmpDebugResult;
    }

    addIfOneCathetusIsAbsent(graph, arrOfIdsOfVertices, mapLogic, level = 0) {
        console.log("vertices in cathetus add", arrOfIdsOfVertices);
        let id1, id2;
        if (!graph.edgesMap.has(`from ${arrOfIdsOfVertices[0]} to ${arrOfIdsOfVertices[1]}`)) {
            id1 = arrOfIdsOfVertices[0];
            id2 = arrOfIdsOfVertices[1];
        }
        if (!graph.edgesMap.has(`from ${arrOfIdsOfVertices[0]} to ${arrOfIdsOfVertices[2]}`)) {
            id1 = arrOfIdsOfVertices[0];
            id2 = arrOfIdsOfVertices[2];
        }
        if (!graph.edgesMap.has(`from ${arrOfIdsOfVertices[1]} to ${arrOfIdsOfVertices[2]}`)) {
            id1 = arrOfIdsOfVertices[1];
            id2 = arrOfIdsOfVertices[2];
        }
        if (id1 && id2) {
            console.log("addIfOneCathetusIsAbsent 1");
            let result = graph.createEdgeFromTwoPointsAndAddPointsToAdjacentLists(id1, id2, graph.adjacentMap, graph.edgesMap, graph.nameForNextEdge, graph.verticesMap, mapLogic, 0, level, 0,true, false);
            console.log("addIfOneCathetusIsAbsent 2");
            console.log("result", result);
            //graph.createEdgeFromTwoPointsAndAddPointsToAdjacentLists(id2, id1, graph.adjacentMap, graph.edgesMap, graph.nameForNextEdge, graph.verticesMap, mapLogic, 0, level, 0, false, true, false, result.route, result.length, result.edgesToBeAddedAndRoute, result.level);
            console.log("addIfOneCathetusIsAbsent 3");
            return 0;
        }
        return -1;
    }

    deleteUnnecessaryHypotenuse(graph, verticesId) {
        // find edges in Map
        // make it really long and hide from visualization
        // to avoid making it again on next step

        // find in AdjacentMap arr
        // delete from arr
        // replace arr
        //console.log("vertices in deleteUnnecessaryHypotenuse", verticesId);
        let result = 0;
        let key1 = `from ${verticesId[0]} to ${verticesId[1]}`;
        let key2 = `from ${verticesId[1]} to ${verticesId[0]}`;
        console.log("key1", key1);
        console.log("key2", key2);
        if (!graph.edgesMap.has(key1) && !graph.edgesMap.has(key2)) return -1;
        if (/*graph.edgesMap.has(key1) && graph.edgesMap.has(key2) &&*/ !graph.edgesMap.get(key1).isForVisualisation && !graph.edgesMap.get(key2).isForVisualisation) return -1;
        if (graph.edgesMap.has(key1) && graph.edgesMap.get(key1).isForVisualisation) {
            let edge = graph.edgesMap.get(key1);
            edge.isForVisualisation = false;
            edge.length *= 5;
            //edge.level = graph.epoch.getPriceForRoad().length - 1;
            graph.edgesMap.set(key1, edge);
            console.log("key1 delete");
            result += this.deleteVerticeFromAdjacentListOfAnotherVertice(graph, verticesId[0], verticesId[1]);
        }
        if (graph.edgesMap.has(key2) && graph.edgesMap.get(key2).isForVisualisation) {
            let edge = graph.edgesMap.get(key2);
            edge.isForVisualisation = false;
            edge.length *= 5;
            //edge.level = graph.epoch.getPriceForRoad().length - 1;
            graph.edgesMap.set(key2, edge);
            console.log("key1 delete");
            result += this.deleteVerticeFromAdjacentListOfAnotherVertice(graph, verticesId[1], verticesId[0]);
        }
        return result;
    }

    deleteVerticeFromAdjacentListOfAnotherVertice(graph, vertice1Id, verticeToDeleteId) {
        if (!graph.adjacentMap.has(vertice1Id)) return -1;
        let adjacentArr = graph.adjacentMap.get(vertice1Id);
        // console.log("-------------deleteVerticeFromAdjacentListOfAnotherVertice-----------------");
        // console.log("vertice1Id");
        // console.log(vertice1Id);
        // console.log("verticeToDeleteId");
        // console.log(verticeToDeleteId);
        // console.log("graph.adjacentMap.get(vertice1Id)");
        // console.log(graph.adjacentMap.get(vertice1Id));
        // console.log("---------END deleteVerticeFromAdjacentListOfAnotherVertice-----------------");

        let indx = adjacentArr.indexOf(verticeToDeleteId);
        if (indx === -1) return -1;

        adjacentArr.splice(indx, 1);
        graph.adjacentMap.set(vertice1Id, adjacentArr);
        return 0;
    }

    findLongEdgesAndPlaceCampsOnThem(graph) {
        let edgesNum = graph.edgesMap.size;
        let verticesNum = graph.verticesMap.size;
        let maxEdgesNum = verticesNum * (verticesNum - 1);
        console.log("findLongEdgesAndPlaceCampsOnThem", edgesNum);
        // console.log("edgesNum", edgesNum);
        // console.log("maxEdgesNum", maxEdgesNum);
        // console.log("edgesNum < maxEdgesNum * 0.8", edgesNum < maxEdgesNum * 0.8);
        //if(edgesNum < maxEdgesNum * 0.8) return -1;

        for(let vertice of graph.verticesMap.values()) {
            let chk = this.checkIfEnoughMoneyToBuildACamp(vertice, graph.epoch);
            if(chk) {

                let maxCamps = this.findHowManyCampsCouldBeMade(vertice, graph.epoch);
                let arr = this.findAndReturnArrOfTooLongRoads(vertice, graph);

                for (let i = 0; i < arr.length && i < maxCamps; i++) {
                    // check if another camp was built nearby
                    let outerContinue = false;
                    for (let j = i - 1; j >= 0; j--) {
                        if(Math.abs(arr[i][0] - arr[j][0]) < this.graph.epoch.getMaxComfortableRoadLength() / 5 &&
                            Math.abs(arr[i][1] - arr[j][1]) < this.graph.epoch.getMaxComfortableRoadLength() / 5) {
                            outerContinue = true;
                            break;
                        }
                    }
                    if(outerContinue) continue;

                    // this.deleteUnnecessaryHypotenuse(graph, arr[i][2]);
                    graph.createVerticesFromObjects([{
                        x: arr[i][0],
                        y: arr[i][1],
                        type: 3,
                        name: graph.nameForNextVertice++,
                        reach: Math.round(vertice.reach / 1000),
                        richness: 10
                    }], graph.verticesMap, graph.idForNextVertice);
                    vertice.changeRichness(-1 * graph.epoch.getPriceForCamp());

                    // add vertice to cell and update layer
                    let x = Math.floor((arr[i][0] - this.mapLogic.minX) / this.mapLogic.blockSize);
                    let y = Math.floor((arr[i][1] - this.mapLogic.minY) / this.mapLogic.blockSize);
                    this.mapLogic.addVerticeToCell(x, y, graph.verticesMap.get(graph.idForNextVertice - 1));
                    graph.doCitiesLayerNeedARefresh = true;
                    this.mapLogic.hashBfs.clear();

                    // hide long edge
                    let key = `from ${arr[i][2][0]} to ${arr[i][2][1]}`;
                    graph.edgesMap.get(key).isForVisualisation = false;
                    key = `from ${arr[i][2][1]} to ${arr[i][2][2]}`;
                    graph.edgesMap.get(key).isForVisualisation = false;
                }

            }
        }
        return 0;
    }

    checkIfEnoughMoneyToBuildACamp(vertice, epoch) {
        if(vertice.type !== 0 && vertice.type !== 2) return false;
        if(vertice.richness < epoch.getPriceForCamp()) return false;
        return  true;
    }

    findHowManyCampsCouldBeMade(vertice, epoch) {
        return Math.round(vertice.richness / epoch.getPriceForCamp());
    }

    findAndReturnArrOfTooLongRoads(vertice, graph) {
        let adj = graph.adjacentMap.get(vertice.id);
        let arr = [];
        let outerThis = this;
        //console.log("adj", adj);
        adj.forEach(function (item) {
            let key = `from ${vertice.id} to ${item}`;
            // console.log("item", item);
            // console.log("key", key);
            if(graph.edgesMap.has(key)) {
                let edge = graph.edgesMap.get(key);
                if(edge.isForVisualisation && edge.length > graph.epoch.getMaxComfortableRoadLength()) {
                    let vertice2 = graph.verticesMap.get(item)
                    let middlePointOfBfsRoute = Math.round((edge.route.length - 1) / 2);
                    console.log("findAndReturnArrOfTooLongRoads");
                    console.log("edge", edge);
                    console.log("edge.route", edge.route);
                    console.log("middlePointOfBfsRoute", middlePointOfBfsRoute);

                    let x = edge.route[middlePointOfBfsRoute][0] * outerThis.mapLogic.blockSize + outerThis.mapLogic.minX;
                    let y = edge.route[middlePointOfBfsRoute][1] * outerThis.mapLogic.blockSize + outerThis.mapLogic.minY;
                    console.log("x", x);
                    console.log("y", y);
                    /*let x = Math.floor((vertice.x - vertice2.x) / 2);
                    let y = Math.floor((vertice.y - vertice2.y) / 2);*/
                    arr.push([x, y, edge.vertices]);
                    console.log("arr", arr);
                }
            }
        })
        return arr;
    }


    save() {
        let save_obj = {};
        save_obj.objType = "Drawing Logic";

        for (let key in this) {
            if(this[key] instanceof MapLogic) {
                save_obj[key] = this[key].save()
            } else if(this[key] instanceof Drawing) {/*ignore*/}
            else save_obj[key] = this[key];
        }
        console.log("save_obj", save_obj);
        return save_obj;
    }

    static load(paramsObj) {
        console.log("Drawing Logic paramsObj", paramsObj);
        let drawingLogic = new DrawingLogic(0, 0, 0, 0, true);
        if (typeof paramsObj === "string") paramsObj = JSON.parse(paramsObj);
        if (!paramsObj.objType && paramsObj.objType !== "Drawing Logic") {
            for (let key in paramsObj) {
                if(key === "drawingLogic") {
                    return this.load(paramsObj[key]);
                }
            }
            return -1;
        }


        for (let key in paramsObj) {
            if(paramsObj[key].objType && paramsObj[key].objType === "Map Logic") {
                drawingLogic[key] = MapLogic.load(paramsObj[key]);
            }
            else drawingLogic[key] = paramsObj[key];
        }
        drawingLogic.draw = new Drawing(drawingLogic.minX, drawingLogic.minY, drawingLogic.maxX, drawingLogic.maxY, drawingLogic.mapLogic.blockSize);
        return drawingLogic;
    }
}