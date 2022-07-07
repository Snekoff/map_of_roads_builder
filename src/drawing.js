export class Drawing {

    constructor(minX, minY, maxX, maxY, blockSize) {
        this.isInitalized = true;
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        this.blockSize = blockSize;
    }

    circle(x = 0, y = 0, indexForColor = 0) {

        let canvas = document.getElementById("vertices-layer");
        let ctx = canvas.getContext("2d");

        ctx.beginPath();
        let arrOfColors = ['black', 'grey', 'brown', 'blue', 'orange', 'red', 'purple'];
        if (+indexForColor < 0 || +indexForColor > arrOfColors.size - 1) ctx.fillStyle = 'black';
        else {
            ctx.fillStyle = arrOfColors[+indexForColor];
        }
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, 2 * Math.PI);
        //ctx.stroke();
        ctx.fill();
    }

    line(x1 = 0, y1 = 0, x2 = 100, y2 = 100, isForVisualisation, width = 3) {

        //TODO: curve https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo

        if (!isForVisualisation) return 0;
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

    lineFromArr(arr, isForVisualisation = true, width = 3) {

        //TODO: curve https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo

        if (!isForVisualisation) return 0;
        let canvas = document.getElementById("game-layer");
        let ctx = canvas.getContext("2d");
        let xAdd = Math.min(this.minX, this.maxX);
        let yAdd = Math.min(this.minY, this.maxY);

        ctx.beginPath();
        ctx.moveTo(arr[0][0] * this.blockSize + xAdd, arr[0][1] * this.blockSize + yAdd);
        for(let i = 1; i < arr.length; i++) {
            ctx.lineTo(arr[i][0] * this.blockSize + xAdd, arr[i][1] * this.blockSize + yAdd);
        }

        ctx.lineWidth = width + 1;
        ctx.strokeStyle = "black";
        //if(!isForVisualisation) ctx.strokeStyle = "orange";

        ctx.stroke();

    }

    drawBackgroundImage(x, y, src = "./images/345d9724898967.5633bed73d62e.jpg") {
        this.refresh("game-layer");
        this.refresh("background-layer");
        this.refresh("vertices-layer");

        let canvas = document.getElementById("background-layer");
        let ctx = canvas.getContext("2d");

        let background = new Image();
        background.src = src;
        let width = 4000;
        let height = 1000;

        // Make sure the image is loaded first otherwise nothing will draw.
        background.onload = function () {
            ctx.drawImage(background, 500, 250, width / 3, height / 2, 0, 0, width, height); // поделить на 3 и на 2
        }
    }

    drawVerticeImage(x, y, type, level) {
        let imgSrc = [
            ["./images/city_level_1.png", "./images/city_level_2.png", "./images/city_level_3.png", "./images/city_level_4.png", "./images/city_level_5.png"],
            ["./images/village_level_1.png", "./images/village_level_2.png", "./images/village_level_3.png", "./images/village_level_4.png", "./images/village_level_5.png"],
            ["./images/fort1.png", "./images/fort1.png", "./images/fort1.png", "./images/fort1.png", "./images/fort1.png"],
            ["./images/camp.png", "./images/camp.png", "./images/camp.png", "./images/camp.png", "./images/camp.png"],
            ["./images/criminal_camp.png", "./images/criminal_camp.png", "./images/criminal_camp.png", "./images/criminal_camp.png", "./images/criminal_camp.png"],
        ];
        let sizes = [[90, 90], [90, 90], [90, 90], [90, 90], [90, 90]];
        if (type >= imgSrc.length) return -1;

        let canvas = document.getElementById("vertices-layer");
        let ctx = canvas.getContext("2d");

        let icon = new Image();
        icon.src = imgSrc[type][level];

        // Make sure the image is loaded first otherwise nothing will draw.
        icon.onload = function () {
            ctx.drawImage(icon, x - sizes[type][0] / 2, y - sizes[type][0] / 2 - 20, sizes[type][0], sizes[type][1]);
        }
        return 0;
    }

    drawImageOrColoredCircleIfCant(x, y, type, level) {
        if (this.drawVerticeImage(x, y, type, level) > -1) return;
        this.circle(x, y, type);
    }

    drawEdgesAndVerticesTextOnCanvas(graph) {
        let vertices = graph.getAllVertices(graph.verticesMap);
        console.log("graph.getAllVertices()");
        console.log(vertices);
        let edges = graph.getAllEdges(graph.edgesMap);
        console.log("graph.getAllEdges()");
        console.log(edges);

        this.refresh("game-layer");

        //setTimeout(() => {
        for (let edg of edges) {
            // console.log("edg", edg);
            // console.log("edg.route", edg.route);

            if(edg.route.length > 0) {
                this.lineFromArr(edg.route, edg.isForVisualisation, edg.level);
            } else {
                let verticeMap = graph.verticesMap;
                let id1 = edg.vertices[0], id2 = edg.vertices[1];
                let item1 = verticeMap.get(id1);
                let item2 = verticeMap.get(id2);
                this.line(item1.x, item1.y, item2.x, item2.y, edg.isForVisualisation, edg.level);
            }
        }
        for (let vert of vertices) {

            this.drawTextOfVerticeValuesNearIt(graph.verticesMap.get(vert.id));
        }
        //}, 10)

    }

    drawTextOfVerticeValuesNearIt(vertice) {
        let canvas = document.getElementById("game-layer");
        let ctx = canvas.getContext("2d");
        ctx.font = "bold 30px serif";
        ctx.fillStyle = "Blue";
        ctx.strokeStyle = "White";
        ctx.lineWidth = 3;
        let text = `${vertice.name} (${vertice.id}) Rich:${vertice.richness.toFixed(1)}`;
        ctx.strokeText(text, vertice.x - 20, vertice.y + 5);
        ctx.fillText(text, vertice.x - 20, vertice.y + 5);
    }

    drawVerticesGraphics(graph) {
        let vertices = graph.getAllVertices(graph.verticesMap);
        for (let vert of vertices) {
            this.drawImageOrColoredCircleIfCant(vert.x, vert.y, vert.type, vert.level);
        }
    }

    refresh(layer) {
        let canvas = document.getElementById(layer);
        let ctx = canvas.getContext("2d");
        ctx.reset();
    }

//   save() {
//     let canvas = document.getElementById("game-layer");
//     let ctx = canvas.getContext("2d");
//     ctx.save();
// }
//
//   restore() {
//     let canvas = document.getElementById("game-layer");
//     let ctx = canvas.getContext("2d");
//     ctx.restore();
// }

}