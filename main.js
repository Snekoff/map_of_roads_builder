import {Graph} from "./graph.js";

export function circle(x = 0, y = 0, indexForColor = 0) {

    let canvas = document.getElementById("coordinateGrid");
    let ctx = canvas.getContext("2d");

    ctx.beginPath();
    let arrOfColors = ['black', 'grey', 'brown', 'blue', 'orange', 'red', 'purple'];
    if(+indexForColor < 0 || +indexForColor > arrOfColors.size - 1) ctx.fillStyle = 'black';
    else {
        ctx.fillStyle = arrOfColors[+indexForColor];
    }
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

export function line(x1 = 0, y1 = 0, x2 = 100, y2 = 100) {

    let canvas = document.getElementById("coordinateGrid");
    let ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 15;

    ctx.stroke();

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
    {
        x: 100,
        y: 850,
        name: 'fort 1',
        type: 2,
        richness: 5,
        prosperity: 10,
        incomeToAddInNextTurn: 1,
        numOfWares: 0,
        defencePower: 0,
        reach: 50,
        isForVisualisation: true
    },
    {
        x: 200,
        y: 400,
        name: 'village 1',
        type: 1,
        richness: 10,
        prosperity: 10,
        incomeToAddInNextTurn: 2,
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
        richness: 15,
        prosperity: 10,
        incomeToAddInNextTurn: 3,
        numOfWares: 0,
        defencePower: 0,
        reach: 50,
        isForVisualisation: true
    }
    ,{
        x: 1100,
        y: 890,
        name: 'city 1',
        type: 0,
        richness: 20,
        prosperity: 10,
        incomeToAddInNextTurn: 4,
        numOfWares: 0,
        defencePower: 0,
        reach: 700,
        isForVisualisation: true
    }
    ,{
        x: 1500,
        y: 100,
        name: 'city 2',
        type: 0,
        richness: 25,
        prosperity: 10,
        incomeToAddInNextTurn: 5,
        numOfWares: 0,
        defencePower: 0,
        reach: 150,
        isForVisualisation: true
    }
    ,{
        x: 1300,
        y: 400,
        name: 'city 3',
        type: 0,
        richness: 30,
        prosperity: 10,
        incomeToAddInNextTurn: 6,
        numOfWares: 0,
        defencePower: 0,
        reach: 150,
        isForVisualisation: true
    }
    ,{
        x: 1450,
        y: 570,
        name: 'fort 3',
        type: 2,
        richness: 35,
        prosperity: 10,
        incomeToAddInNextTurn: 7,
        numOfWares: 0,
        defencePower: 0,
        reach: 50,
        isForVisualisation: true
    }

];

let edgeObjectsList = [];

export function initialVerticesEdgesShow() {
    console.log(document.getElementById("btn1").value);
    let numOfVerticesToGenerate = +document.getElementById("vertices1").value;
    let verticesList = [];
    let verticesNames = [];
    let edgesList = [];
    randomPointsGeneration(numOfVerticesToGenerate, verticesList, verticesNames, edgesList);


    let graph = new Graph(0, 0, 0, 0, 0,
        verticesList,
        verticesNames,
        edgesList,
        [],
        verticeObjectsList,
        edgeObjectsList);

    let vertices = graph.getAllVertices(graph.verticesMap);
    console.log("graph.getAllVertices()");
    console.log(vertices);
    let edges = graph.getAllEdges(graph.edgesMap);
    console.log("graph.getAllEdges()");
    console.log(edges);

    refresh();
    let mul = 1;
    for (let vert of vertices.values()) {
        circle(vert.x * mul, vert.y * mul, vert.type);
    }
    for (let edg of edges.values()) {
        let verticeMap = graph.verticesMap;
        let name1 = edg.vertice1, name2 = edg.vertice2;
        let item1 = verticeMap.get(name1);
        let item2 = verticeMap.get(name2);
        line(item1.x * mul, item1.y * mul, item2.x * mul, item2.y * mul);
    }
    return graph;
}

export function buildEdgesAndUpdateView(graph) {
    let arrOfPairs = countDistancesBetweenVerticesAndReturnReachableForEach(graph);
    arrOfPairs.forEach(function (item) {
        // TODO: add cost calculations
        // TODO: add defence calculations
        // TODO: add level calculations
        // TODO: add type
        if(!graph.edgesMap.has(`from ${item[0]} to ${item[1]}`) && !graph.edgesMap.has(`from ${item[1]} to ${item[0]}`)) {
            graph.createEdgeFromTwoPointsAndAddPointsToAdjacentLists(item[0], item[1], graph.adjacentMap, graph.edgesMap, graph.nameForNextEdge++, graph.verticesMap);
            graph.createEdgeFromTwoPointsAndAddPointsToAdjacentLists(item[1], item[0], graph.adjacentMap, graph.edgesMap, graph.nameForNextEdge++, graph.verticesMap);
            if (graph.verticesMap.get(item[0]).reach > graph.verticesMap.get(item[1]).reach) {
                let tmp = graph.verticesMap.get(item[1]).reach;
                graph.verticesMap.get(item[0]).reach += tmp;
                graph.verticesMap.get(item[1]).reach += tmp;
            } else {
                let tmp = graph.verticesMap.get(item[0]).reach;
                graph.verticesMap.get(item[0]).reach += tmp;
                graph.verticesMap.get(item[1]).reach += tmp;
            }
        }
    })

    let mul = 1;
    let vertices = graph.getAllVertices(graph.verticesMap);
    console.log("graph.getAllVertices()");
    console.log(vertices);
    let edges = graph.getAllEdges(graph.edgesMap);
    console.log("graph.getAllEdges()");
    console.log(edges);
    for (let edg of edges) {
        let verticeMap = graph.verticesMap;
        let name1 = edg.vertices[0], name2 = edg.vertices[1];
        let item1 = verticeMap.get(name1);
        let item2 = verticeMap.get(name2);
        line(item1.x * mul, item1.y * mul, item2.x * mul, item2.y * mul);
    }
    console.log("graph reach");
    console.log(`1.${graph.verticesMap.get(vertices.shift().name).reach} 2.${graph.verticesMap.get(vertices.shift().name).reach} 3.${graph.verticesMap.get(vertices.shift().name).reach} 4.${graph.verticesMap.get(vertices.shift().name).reach} 5.${graph.verticesMap.get(vertices.shift().name).reach} 6.${graph.verticesMap.get(vertices.shift().name).reach} 7.${graph.verticesMap.get(vertices.shift().name).reach}`);
    return graph;
}

function countDistancesBetweenVerticesAndReturnReachableForEach(graph) {
    let arrOfPairs = [];
    let vertices = graph.getAllVertices(graph.verticesMap);
    for(let i = 0; i < vertices.length; i++) {
        for(let j = i + 1; j < vertices.length; j++) {
            let distance = graph.countDistanceBetweenVertices(vertices[i].name, vertices[j].name, graph.verticesMap);
            if(distance < vertices[i].reach || distance < vertices[j].reach) {
                arrOfPairs.push([vertices[i].name, vertices[j].name]);
            }
        }
    }
    return arrOfPairs;
}


export function main () {

    initialVerticesEdgesShow();


    //circleWithBaldBorder();
    //circleWith();
    //circle();
}

function refresh() {
    let canvas = document.getElementById("coordinateGrid");
    let ctx = canvas.getContext("2d");
    ctx.reset();
}

