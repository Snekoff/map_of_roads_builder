import {Graph} from "./graph.js";

function circleWithBaldBorder() {
    let canvas = document.getElementById("coordinateGrid");
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.fillStyle = 'rgba(111, 99, 229, 1.0)';
    ctx.strokeStyle = 'rgba(152, 11, 99, 1.0)';
    ctx.lineWidth = '35';
    ctx.beginPath();
    ctx.arc(95, 70, 30, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

export function circleWith() {
    let canvas = document.getElementById("coordinateGrid");
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    let radius = 100;
    let x0 = radius, y0 = radius, r0 = 0;
    let x1 = radius, y1 = radius, r1 = radius;
    ctx.translate(3 * radius, 3 *radius);

    //let grad = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    let grad = ctx.createConicGradient(90, radius, radius)
    for(let i = 0; i < 360; i++){
        grad.addColorStop(i / 360, `rgba( ${Math.max(Math.min(200 * i / 360, 255), 0)}, ${Math.min(255 * Math.max(360 - i, 0), 255)}, ${Math.min(Math.max(255 * i / 360, 0), 255)}, 1.0)`);
    }

    // ${}
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.arc(x0, y0, radius, 0, 2 * Math.PI);

    // for(let i = 0; i < 720; i++) {
    //     ctx.rotate(45 * Math.PI/180);
    //     ctx.beginPath();
    //     ctx.arc(x0, y0, radius, 0, 2 * Math.PI);
    //     ctx.stroke();
    //     ctx.fill();
    // }
    ctx.stroke();
    ctx.fill();
}

export function circle(x = 0, y = 0, indexForColor = 0) {

    let canvas = document.getElementById("coordinateGrid");
    let ctx = canvas.getContext("2d");

    ctx.beginPath();
    if(indexForColor === 0) ctx.fillStyle = 'black';
    else {
        ctx.fillStyle = 'rgb(' + (50 + indexForColor * 20) + ','+ (230 - indexForColor * 20) +','+ (150 + Math.pow(-1, indexForColor) * 20) + ')';
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

export function main () {

    console.log(document.getElementById("btn1").value);
    let numOfVerticesToGenerate = +document.getElementById("vertices1").value;
    let verticesList = [], verticesNames = [];
    let edgesList = [];
    for(let i = 0; i < numOfVerticesToGenerate; i++) {
        verticesList.push([Math.random() * 2000, Math.random() * 1000]);
        verticesNames.push(`name_${i}`);
    }
    let numOfEdgesToGenerate = +document.getElementById("edges1").value;
    for(let i = 0; i < numOfEdgesToGenerate; i++) {
        let name1 = verticesNames[Math.round(Math.random() * numOfVerticesToGenerate)];
        let name2 = verticesNames[Math.round(Math.random() * numOfVerticesToGenerate)];
        while(name1 === name2) {
            name2 = verticesNames[Math.round(Math.random() * numOfVerticesToGenerate)];
        }
        edgesList.push([name1, name2]);
    }

    let graph = new Graph(0, 0, 0, 0, 0,
        verticesList,
        verticesNames,
        edgesList,
        ['name_1', 'name_4', 'name_2']);
    // let graph = new Graph(0, 0, 0, 0, 0,
    //     [[10, 20], [50, 40], [10, 70], [27, 37], [15, 3]],
    //     ['name_1', 'name_4', 'name_2', 'name_5', 'name_6'],
    //     [['name_1', 'name_4'], ['name_1', 'name_2'], ['name_2', 'name_6'], ['name_6', 'name_5']],
    //     ['name_1', 'name_4', 'name_2']);
    let vertices = graph.getAllVertices(graph.verticesMap);
    console.log("graph.getAllVertices()");
    console.log(vertices);
    let edges = graph.getAllEdges(graph.edgesMap);
    console.log("graph.getAllEdges()");
    console.log(edges);

    refresh();
    let mul = 1;
    let colorIndex = 0;
    for(let vert of vertices.values()) {
        circle(vert.x * mul, vert.y * mul, colorIndex++);
    }
    for(let edg of edges.values()) {
        let verticeMap = graph.verticesMap;
        let name1 = edg.vertice1, name2 = edg.vertice2;
        let item1 = verticeMap.get(name1);
        let item2 = verticeMap.get(name2);
        line(item1.x * mul, item1.y * mul, item2.x * mul, item2.y * mul);
    }


    //circleWithBaldBorder();
    //circleWith();
    //circle();
}

function refresh() {
    let canvas = document.getElementById("coordinateGrid");
    let ctx = canvas.getContext("2d");
    ctx.reset();
}

