import {Graph} from "./graph.js";

export function circle(x = 0, y = 0, indexForColor = 0) {

    let canvas = document.getElementById("vertices-layer");
    let ctx = canvas.getContext("2d");

    ctx.beginPath();
    let arrOfColors = ['black', 'grey', 'brown', 'blue', 'orange', 'red', 'purple'];
    if(+indexForColor < 0 || +indexForColor > arrOfColors.size - 1) ctx.fillStyle = 'black';
    else {
        ctx.fillStyle = arrOfColors[+indexForColor];
    }
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    //ctx.stroke();
    ctx.fill();
}

export function line(x1 = 0, y1 = 0, x2 = 100, y2 = 100, isForVisualisation, width = 3) {

    //TODO: curve https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo

    if(!isForVisualisation) return 0;
    let canvas = document.getElementById("game-layer");
    let ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = width + 1;
    ctx.strokeStyle = "black";
    //if(!isForVisualisation) ctx.strokeStyle = "orange";

    ctx.stroke();

}

export function drawBackgroundImage(x, y, src = "345d9724898967.5633bed73d62e.jpg") {
    let canvas = document.getElementById("background-layer");
    let ctx = canvas.getContext("2d");

    let background = new Image();
    background.src = src;
    let width = 4000;
    let height = 2000;

    // Make sure the image is loaded first otherwise nothing will draw.
    background.onload = function(){
        ctx.drawImage(background, 500, 250, width / 3, height / 2, 0, 0, width, height);
    }
}

function drawVerticeImage(x, y, type) {
    let imgSrc = ["city1.png", "village1.png", "fort1.png"];
    let sizes = [[90, 90], [70, 50], [80, 50]];
    if(type >= imgSrc.length) return -1;

    let canvas = document.getElementById("vertices-layer");
    let ctx = canvas.getContext("2d");

    let icon = new Image();
    icon.src = imgSrc[type];

    // Make sure the image is loaded first otherwise nothing will draw.
    icon.onload = function(){
        ctx.drawImage(icon, x - sizes[type][0] / 2, y - sizes[type][0] / 2 - 20, sizes[type][0], sizes[type][1]);
    }
    return 0;
}

function drawImageOrColoredCircleIfCant(x, y, type) {
    if(drawVerticeImage(x, y, type) > -1) return;
    circle(x, y, type);
}

export function drawEdgesAndVerticesTextOnCanvas(graph) {
    let vertices = graph.getAllVertices(graph.verticesMap);
    console.log("graph.getAllVertices()");
    console.log(vertices);
    let edges = graph.getAllEdges(graph.edgesMap);
    console.log("graph.getAllEdges()");
    console.log(edges);

    refresh();

    //setTimeout(() => {
    for (let edg of edges) {
        let verticeMap = graph.verticesMap;
        let name1 = edg.vertices[0], name2 = edg.vertices[1];
        let item1 = verticeMap.get(name1);
        let item2 = verticeMap.get(name2);
        line(item1.x, item1.y, item2.x, item2.y, edg.isForVisualisation, edg.level);
    }
    for (let vert of vertices) {

        drawTextOfVerticeValuesNearIt(graph.verticesMap.get(vert.name));
    }
    //}, 10)

}

export function drawVerticesGraphics(graph) {
    let vertices = graph.getAllVertices(graph.verticesMap);
    for (let vert of vertices) {
        drawImageOrColoredCircleIfCant(vert.x, vert.y, vert.type);
    }
}

export function initialVerticesEdgesShow(noRandomGeneration = false) {
    console.log(document.getElementById("start").value);
    let numOfVerticesToGenerate = +document.getElementById("vertices1").value;
    let verticesList = [];
    let verticesNames = [];
    let edgesList = [];
    if(!noRandomGeneration) randomPointsGeneration(numOfVerticesToGenerate, verticesList, verticesNames, edgesList);


    let graph = new Graph(0,
        verticesList,
        verticesNames,
        edgesList,
        [],
        verticeObjectsList,
        edgeObjectsList);

    drawBackgroundImage(0, 0);
    drawVerticesGraphics(graph);
    drawEdgesAndVerticesTextOnCanvas(graph);
    return graph;
}

function randomPointsGeneration(numOfVerticesToGenerate, verticesList, verticesNames, edgesList) {
    for (let i = 0; i < numOfVerticesToGenerate; i++) {
        verticesList.push([Math.random() * 2000, Math.random() * 1000]);
        verticesNames.push(`name_${i}`);
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

let verticeObjectsList = [
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
    //     x: 200,
    //     y: 400,
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
    //     name: 'fort 2',
    //     type: 2,
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
    ,{
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
    ,{
        x: 1100,
        y: 890,
        name: 'city 1',
        type: 0,
        richness: 20,
        prosperity: 10,
        incomeToAddInNextTurn: 0,
        numOfWares: 0,
        defencePower: 150,
        reach: 250,
        isForVisualisation: true
    }
    ,{
        x: 1500,
        y: 100,
        name: 'city 2',
        type: 0,
        richness: 20,
        prosperity: 10,
        incomeToAddInNextTurn: 0,
        numOfWares: 0,
        defencePower: 150,
        reach: 100,
        isForVisualisation: true
    }
    ,{
        x: 1300,
        y: 400,
        name: 'city 3',
        type: 0,
        richness: 20,
        prosperity: 10,
        incomeToAddInNextTurn: 0,
        numOfWares: 0,
        defencePower: 150,
        reach: 100,
        isForVisualisation: true
    }
    ,{
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
    ,{
        x: 150,
        y: 100,
        name: 'city 4',
        type: 0,
        richness: 20,
        prosperity: 10,
        incomeToAddInNextTurn: 0,
        numOfWares: 0,
        defencePower: 150,
        reach: 100,
        isForVisualisation: true
    }
    ,{
        x: 200,
        y: 120,
        name: 'city 5',
        type: 0,
        richness: 20,
        prosperity: 10,
        incomeToAddInNextTurn: 0,
        numOfWares: 0,
        defencePower: 150,
        reach: 120,
        isForVisualisation: true
    }
    ,{
        x: 1900,
        y: 170,
        name: 'city 6',
        type: 0,
        richness: 20,
        prosperity: 10,
        incomeToAddInNextTurn: 0,
        numOfWares: 0,
        defencePower: 150,
        reach: 100,
        isForVisualisation: true
    }
    ,{
        x: 1800,
        y: 140,
        name: 'city 7',
        type: 0,
        richness: 20,
        prosperity: 10,
        incomeToAddInNextTurn: 0,
        numOfWares: 0,
        defencePower: 150,
        reach: 170,
        isForVisualisation: true
    }
    ,{
        x: 800,
        y: 440,
        name: 'city 8',
        type: 0,
        richness: 20,
        prosperity: 10,
        incomeToAddInNextTurn: 0,
        numOfWares: 0,
        defencePower: 150,
        reach: 170,
        isForVisualisation: true
    }
    ,{
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
    ,{
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
    ,{
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
    ,{
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
    ,{
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
    ,{
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
    ,{
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
    ,{
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
    ,{
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
    ,{
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
    ,{
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
    ,{
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
    ,{
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
    ,{
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

];

let edgeObjectsList = [];

function findLessReachAndApplyReachChange(verticesMap, item, isEitherWay = true, divider1 = 2, divider2 = 2) {
    if (verticesMap.get(item[0]).reach > verticesMap.get(item[1]).reach) {
        let tmp = verticesMap.get(item[1]).reach;
        verticesMap.get(item[0]).setReachChange(tmp / divider1);
        if (isEitherWay) verticesMap.get(item[1]).setReachChange(tmp / divider2);
        return 0;
    }
    if (verticesMap.get(item[0]).reach < verticesMap.get(item[1]).reach) {
        let tmp = verticesMap.get(item[0]).reach;
        verticesMap.get(item[0]).setReachChange(tmp / divider2);
        if (isEitherWay) verticesMap.get(item[1]).setReachChange(tmp / divider1);
        return 0;
    }
    if (Math.round(verticesMap.get(item[0]).reach - verticesMap.get(item[1]).reach) === 0) {
        let tmp = verticesMap.get(item[1]).reach;
        verticesMap.get(item[0]).setReachChange(tmp / divider1);
        if (isEitherWay) verticesMap.get(item[1]).setReachChange(tmp / divider1);
        return 0;
    }
    return -1;
}

function createEdgeAndCalculateParameters(graph, item, isEitherWay = true) {
    let createEdgeResult1 = 0;
    let createEdgeResult2 = 0;

    let level = binaryCheckWhatLevelOfRoadCouldBeMade(item[0], item[1], graph);
    createEdgeResult1 = graph.createEdgeFromTwoPointsAndAddPointsToAdjacentLists(item[0], item[1], graph.adjacentMap, graph.edgesMap, graph.nameForNextEdge++, graph.verticesMap,0, level, 0, true);
    if(isEitherWay && createEdgeResult1 !== -1) createEdgeResult2 = graph.createEdgeFromTwoPointsAndAddPointsToAdjacentLists(item[1], item[0], graph.adjacentMap, graph.edgesMap, graph.nameForNextEdge++, graph.verticesMap,0, level, 0, false);
    if(createEdgeResult1 === -1 ||createEdgeResult2 === -1) return -1;
    let verticesMap = graph.verticesMap;

    //findLessReachAndApplyReachChange(verticesMap, item, isEitherWay);
    return 0;
}

function binaryCheckWhatLevelOfRoadCouldBeMade(vertice1Name, vertice2Name, graph) {
    let vertice1 = graph.verticesMap.get(vertice1Name);
    let vertice2 = graph.verticesMap.get(vertice2Name);
    let level = 0;
    let rich = vertice1.richness;
    let priceArr = graph.epoch.getPriceForRoad();

    if (vertice2.type === 1 && vertice2.richness <= priceArr[level] / 2) return level;

    level = binarySearch(priceArr, rich, 0, priceArr.length - 1);

    return level;
}

function binarySearch(arr, value, startIdx, endIdx) {
    // console.log("binarySearch");
    // console.log("arr", arr);
    // console.log("value", value);
    // console.log("startIdx", startIdx);
    // console.log("endIdx", endIdx);
    if(endIdx > arr.length - 1) return -1;
    if(arr[startIdx] > value) return 0;
    if(arr[endIdx] <= value) return endIdx;
    if(endIdx - startIdx === 1 && arr[startIdx] <= value && arr[endIdx] > value) return startIdx;

    let middle = Math.ceil((endIdx - startIdx) / 2) + startIdx;
    if(arr[startIdx] <= value && arr[middle] >= value) {
        return binarySearch(arr, value, startIdx, middle);
    }
    if (arr[middle] < value && arr[endIdx] >= value) {
        return binarySearch(arr, value, middle, endIdx);
    }
    //return -1;
}

export function buildEdgesAndUpdateView(graph) {
    let arrOfPairs = countDistancesBetweenVerticesAndReturnReachableForEach(graph);
    console.log("arrOfPairs", arrOfPairs);
    console.log("graph", graph);
    arrOfPairs.forEach(function (item) {
        // TODO: add cost calculations
        // TODO: add defence calculations
        // TODO: add level calculations
        // TODO: add type
        //if(!graph.edgesMap.has(`from ${item[0]} to ${item[1]}`) && !graph.edgesMap.has(`from ${item[1]} to ${item[0]}`)) {
            createEdgeAndCalculateParameters(graph, item);
        //}
    });

    graph.setReachIncomeForAllVertices();
    graph.applyReachChangeForAllVertices();
    graph.setIncomeChangeForAllVertices();
    graph.applyIncomeChangeForAllVertices();

    lookForUnnecessaryEdgesDeleteThemAndAddSubstitutionEdge(graph);

    drawEdgesAndVerticesTextOnCanvas(graph);
    return graph;
}

function countDistancesBetweenVerticesAndReturnReachableForEach(graph) {
    let arrOfPairs = [];
    let vertices = graph.getAllVertices(graph.verticesMap);
    for(let i = 0; i < vertices.length; i++) {
        for(let j = i + 1; j < vertices.length; j++) {
            let key = `from ${vertices[i].name} to ${vertices[j].name}`;
            if(graph.edgesMap.has(key) && (!graph.edgesMap.get(key).isForVisualisation || graph.edgesMap.get(key).level === graph.epoch.getPriceForRoad().length - 1)) continue;
            let distance = graph.countDistanceBetweenVertices(vertices[i].name, vertices[j].name, graph.verticesMap);
            let checkResult = graph.checkAndSubtractMoneyOnBuildingIfNeeded(vertices[i].name, vertices[j].name, graph.verticesMap, distance, true, graph.epoch);//graph.countDistanceBetweenVertices(vertices[i].name, vertices[j].name, graph.verticesMap);
            if(checkResult === 0) {
                arrOfPairs.push([vertices[i].name, vertices[j].name]);
            }
        }
    }
    return arrOfPairs;
}

function drawTextOfVerticeValuesNearIt(vertice) {
    let canvas = document.getElementById("game-layer");
    let ctx = canvas.getContext("2d");
    ctx.font = "bold 30px serif";
    ctx.fillStyle = "Blue";
    ctx.strokeStyle = "White";
    ctx.lineWidth = 3;
    let text = `${vertice.name} Reach:${Math.round(vertice.reach)} Rich:${vertice.richness.toFixed(1)}`;
    ctx.strokeText(text, vertice.x - 20, vertice.y + 5);
    ctx.fillText(text, vertice.x - 20, vertice.y + 5);
}

function lookForUnnecessaryEdgesDeleteThemAndAddSubstitutionEdge(graph) {
    /*  Для всіх точок з яких виходить більше ніж один шлях - зробити перевірку: Вважатимемо відправну точку точкою А, вона з'єднана з точкою B та точкою C шляхами.
		Уявимо що В та С з'єднані - отримаємо трикутник. Порахуємо сторони трикутника. Якщо Гіпотенуза(найдовший шлях) буде менше ніж сумма катетів на 10% (попередня планка)
		то Видалити Гіпотенузу та з'єднати В та С, додавши точці відправній та найдальшій - бонуси. Якщо ж Гіпотенуза складає < 90% від сумми катетів то тоді залишаємо все як є.*/
    lookForUnnecessaryEdgesAndReassemble(graph);
    return graph;
}



function lookForUnnecessaryEdgesAndReassemble(graph) {
    console.log("graph.adjacentMap");
    console.log(graph.adjacentMap);


    let finishedVerticesArr = [];
    let tmpKey = graph.adjacentMap.keys()[Symbol.iterator]().next().value;
    let depthIndex = [0];
    reassembleEdgesInTriangleIfNeeded(graph, finishedVerticesArr, tmpKey, depthIndex);

}

function reassembleEdgesInTriangleIfNeeded(graph, finishedVerticesArr, keyForMap, depthIndex) {
    // if(depthIndex[0] > 100) {
    //     console.log("-----------------------depthIndex > 100----------------");
    //     console.log("reassembleEdgesInTriangleIfNeeded keyForMap");
    //     console.log(keyForMap);
    //     console.log("reassembleEdgesInTriangleIfNeeded graph");
    //     console.log(graph);
    //     console.log("reassembleEdgesInTriangleIfNeeded finishedVerticesArr");
    //     console.log(finishedVerticesArr);
    //
    //     return;
    // }
    let outerBreak = false;
    if(!graph.adjacentMap.has(keyForMap)) {
        if(graph.verticesMap.has(keyForMap)) finishedVerticesArr.push(keyForMap);
        return;
    }
    if(finishedVerticesArr.indexOf(keyForMap) > -1) outerBreak = true;
    let adjArr = graph.adjacentMap.get(keyForMap);
    if(adjArr.length < 2) {
        finishedVerticesArr.push(keyForMap);
        outerBreak = true;
    }

    for(let i = 0; i < adjArr.length && !outerBreak; i++) {
        for (let j = i + 1; j < adjArr.length; j++) {
            if(keyForMap === adjArr[i] || keyForMap === adjArr[j] || adjArr[i] === adjArr[j]) {
                // console.log("---------------");
                // console.log("---------------");
                // console.log("adjArr", adjArr);
                // console.log("adjArr[i]", adjArr[i]);
                // console.log("adjArr[j]", adjArr[j]);
                // console.log("keyForMap", keyForMap);
                // console.log("graph", graph);
                // console.log("---------------");
                //continue;
            }
            let arr = countDistancesBetweenThreeVerticesAndReturnThemInArr(graph, keyForMap, adjArr[i], adjArr[j]);
            let doEdgeExistsArr = checkDoEdgeExistsArr(graph, keyForMap, adjArr[i], adjArr[j])
            let indxAndSum = findMaxDistanceFromArrAndReturnItsIndexAndSumOfCathetuses(arr);
            /*console.log("reassembleEdgesInTriangleIfNeeded indxAndSum");
            console.log(indxAndSum);*/

            if(!doEdgeExistsArr[indxAndSum[0]]) continue; // to avoid situation of not existing hypotenuse
            let tmpDebugResult = checkIfDifferenceBeyondLimitAndDoReassembleVerticesIfNeeded(graph, arr[indxAndSum[0]], indxAndSum[1], [keyForMap, adjArr[i], adjArr[j]], indxAndSum[0]);
            if(tmpDebugResult === 0) {
                // console.log("reassembleEdgesInTriangleIfNeeded keyForMap");
                // console.log(keyForMap);
                // console.log("reassembleEdgesInTriangleIfNeeded graph.adjacentMap");
                // console.log(graph.adjacentMap);
                // console.log("reassembleEdgesInTriangleIfNeeded finishedVerticesArr");
                // console.log(finishedVerticesArr);
                depthIndex[0] += 1;
                reassembleEdgesInTriangleIfNeeded(graph, finishedVerticesArr, keyForMap, depthIndex);
                outerBreak = true;
                break;
            }
        }
        if(i === adjArr.length - 1) finishedVerticesArr.push(keyForMap);
    }
    let newKey;
    let tmpArr = Array.from(graph.adjacentMap.keys());
    for(let key = 0; key < tmpArr.length && newKey === undefined; key++) {
        if(finishedVerticesArr.indexOf(tmpArr[key]) < 0) {
            newKey = tmpArr[key];
        }
    }
    if(newKey) {
        depthIndex[0] += 1;
        return reassembleEdgesInTriangleIfNeeded(graph, finishedVerticesArr, newKey, depthIndex);
    }
}

function countDistancesBetweenThreeVerticesAndReturnThemInArr(graph, verticeAName, verticeBName, verticeCName) {
    let AB = graph.countDistanceBetweenVertices(verticeAName, verticeBName, graph.verticesMap);
    let AC = graph.countDistanceBetweenVertices(verticeAName, verticeCName, graph.verticesMap);
    let BC = graph.countDistanceBetweenVertices(verticeBName, verticeCName, graph.verticesMap);
    return [AB, AC, BC];
}

function checkDoEdgeExistsArr(graph, verticeAName, verticeBName, verticeCName) {
    let arr = [false, false, false];
    if(graph.edgesMap.has(`from ${verticeAName} to ${verticeBName}`)) arr[0] = true;
    if(graph.edgesMap.has(`from ${verticeAName} to ${verticeCName}`)) arr[1] = true;
    if(graph.edgesMap.has(`from ${verticeBName} to ${verticeCName}`)) arr[2] = true;
    return arr;
}

function findMaxDistanceFromArrAndReturnItsIndexAndSumOfCathetuses(arr) {
    let maxLength = Math.max(arr[0], arr[1], arr[2]);
    let indexOfMax = arr.indexOf(maxLength);
    let sumOfCathetuses = 0;
    for (let k = 0; k < arr.length; k++) {
        if (k === indexOfMax) continue;
        sumOfCathetuses += arr[k];
    }
    return [indexOfMax, sumOfCathetuses];
}

function checkIfDifferenceBeyondLimitAndDoReassembleVerticesIfNeeded(graph, hypotenuse, sumOfCathetuses, arrOfNamesOfVertices, indxOfHypotenuse, limitInPercents = 15) {
    if(limitInPercents < 0) limitInPercents = 0;
    if(limitInPercents > 100) limitInPercents = 100;
    if(hypotenuse < sumOfCathetuses * (100 - limitInPercents)/100) return -1;

    let edgesNamesArr = [`from ${arrOfNamesOfVertices[0]} to ${arrOfNamesOfVertices[1]}`, `from ${arrOfNamesOfVertices[0]} to ${arrOfNamesOfVertices[2]}`, `from ${arrOfNamesOfVertices[1]} to ${arrOfNamesOfVertices[2]}`];
    let edge = graph.edgesMap.get(edgesNamesArr[indxOfHypotenuse]);

    let tmpDebugResult = addIfOneCathetusIsAbsent(graph, arrOfNamesOfVertices, edge.level);

    if(tmpDebugResult >= -1) tmpDebugResult = deleteUnnecessaryHypotenuse(graph, edge.vertices);
    return tmpDebugResult;
}

function addIfOneCathetusIsAbsent(graph, arrOfNamesOfVertices, level = 0) {
    //console.log("vertices in cathetus add", arrOfNamesOfVertices);
    let name1, name2;
    if(!graph.edgesMap.has(`from ${arrOfNamesOfVertices[0]} to ${arrOfNamesOfVertices[1]}`)) {
        name1 = arrOfNamesOfVertices[0];
        name2 = arrOfNamesOfVertices[1];
    }
    if(!graph.edgesMap.has(`from ${arrOfNamesOfVertices[0]} to ${arrOfNamesOfVertices[2]}`)) {
        name1 = arrOfNamesOfVertices[0];
        name2 = arrOfNamesOfVertices[2];
    }
    if(!graph.edgesMap.has(`from ${arrOfNamesOfVertices[1]} to ${arrOfNamesOfVertices[2]}`)) {
        name1 = arrOfNamesOfVertices[1];
        name2 = arrOfNamesOfVertices[2];
    }
    if(name1 && name2) {
        graph.createEdgeFromTwoPointsAndAddPointsToAdjacentLists(name1, name2, graph.adjacentMap, graph.edgesMap, graph.nameForNextEdge++, graph.verticesMap, 0, level, 0, false);
        graph.createEdgeFromTwoPointsAndAddPointsToAdjacentLists(name2, name1, graph.adjacentMap, graph.edgesMap, graph.nameForNextEdge++, graph.verticesMap, 0, level, 0, false);
        return 0;
    }
    return -1;
}



function deleteUnnecessaryHypotenuse(graph, verticesNames) {
    // find edges in Map
    // make it really long and hide from visualization
    // to avoid making it again on next step

    // find in AdjacentMap arr
    // delete from arr
    // replace arr
    //console.log("vertices in deleteUnnecessaryHypotenuse", verticesNames);
    let result = 0;
    let key1 = `from ${verticesNames[0]} to ${verticesNames[1]}`;
    let key2 = `from ${verticesNames[1]} to ${verticesNames[0]}`;
    if(!graph.edgesMap.has(key1) && !graph.edgesMap.has(key2)) return -1;
    if(!graph.edgesMap.get(key1).isForVisualisation || !graph.edgesMap.get(key2).isForVisualisation) return -1;
    if(graph.edgesMap.has(key1)) {
        let edge = graph.edgesMap.get(key1);
        edge.isForVisualisation = false;
        edge.length *= 5;
        edge.level = graph.epoch.getPriceForRoad().length - 1;
        graph.edgesMap.set(key1, edge);

        result += deleteVerticeFromAdjacentListOfAnotherVertice(graph, verticesNames[0], verticesNames[1]);
    }
    if(graph.edgesMap.has(key2)) {
        let edge = graph.edgesMap.get(key2);
        edge.isForVisualisation = false;
        edge.length *= 5;
        edge.level = graph.epoch.getPriceForRoad().length - 1;
        graph.edgesMap.set(key2, edge);

        result += deleteVerticeFromAdjacentListOfAnotherVertice(graph, verticesNames[1], verticesNames[0]);
    }
    return  result;
}

function deleteVerticeFromAdjacentListOfAnotherVertice(graph, vertice1, verticeToDelete) {
    if(!graph.adjacentMap.has(vertice1)) return -1;
    let adjacentArr = graph.adjacentMap.get(vertice1);
    // console.log("-------------deleteVerticeFromAdjacentListOfAnotherVertice-----------------");
    // console.log("vertice1");
    // console.log(vertice1);
    // console.log("verticeToDelete");
    // console.log(verticeToDelete);
    // console.log("graph.adjacentMap.get(vertice1)");
    // console.log(graph.adjacentMap.get(vertice1));
    // console.log("---------END deleteVerticeFromAdjacentListOfAnotherVertice-----------------");

    let indx = adjacentArr.indexOf(verticeToDelete);
    if(indx === -1) return -1;

    adjacentArr.splice(indx, 1);
    graph.adjacentMap.set(vertice1, adjacentArr);
    return 0;
}


function refresh() {
    let canvas = document.getElementById("game-layer");
    let ctx = canvas.getContext("2d");
    ctx.reset();
}

// function save() {
//     let canvas = document.getElementById("game-layer");
//     let ctx = canvas.getContext("2d");
//     ctx.save();
// }
//
// function restore() {
//     let canvas = document.getElementById("game-layer");
//     let ctx = canvas.getContext("2d");
//     ctx.restore();
// }