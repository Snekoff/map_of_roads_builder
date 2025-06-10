export class Drawing {

    constructor(minX, minY, maxX, maxY, mapLogic) {
        this.isInitalized = true;
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        this.blockSize = mapLogic.blockSize;
        this.coordsGridArr = mapLogic.coordsGridArr;
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
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        //ctx.stroke();
        ctx.fill();
    }

    line(x1 = 0, y1 = 0, x2 = 100, y2 = 100, isForVisualisation, width = 3) {

        //TODO: curve https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo

        if (!isForVisualisation) return 0;
        let canvas = document.getElementById("game-layer");
        let ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.moveTo(x1 + this.blockSize / 2, y1 + this.blockSize / 2);
        ctx.lineTo(x2 + this.blockSize / 2, y2 + this.blockSize / 2);
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
        ctx.moveTo(arr[0][0] * this.blockSize + xAdd + this.blockSize / 2, arr[0][1] * this.blockSize + yAdd + this.blockSize / 2);
        for(let i = 1; i < arr.length; i++) {
            ctx.lineTo(arr[i][0] * this.blockSize + xAdd + this.blockSize / 2, arr[i][1] * this.blockSize + yAdd + this.blockSize / 2);
        }

        ctx.lineWidth = Math.min(width + 1, 5);
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

    // 0 - plains  #61eb34
    // 1 - forest  #237d06
    // 2 - hills  #75966b
    // 3 - mountains  #707086
    // 4 - water  #5a5aed
    // 5 - rocks  #bababf
    // 6 - sand  #d9cb36
    // 7 - snow  #faf9eb
    // 8 - road[]  #f0a83c
    drawBackground(x, y) {
        console.log("this.coordsGridArr", this.coordsGridArr);
        this.refresh("game-layer");
        this.refresh("background-layer");
        this.refresh("vertices-layer");

        let canvas = document.getElementById("background-layer");
        let ctx = canvas.getContext("2d");

        let blockSize = this.blockSize
        let colors = [
            "#61eb34",
            "#237d06",
            "#75966b",
            "#707086",
            "#5a5aed",
            "#bababf",
            "#d9cb36",
            "#faf9eb",
            "#f0a83c"]
        let terrain_types = ["plains", "forest", "hills", "mountains", "water", "rocks", "sand", "snow", "road"];

        for (let i = 0; i < this.coordsGridArr.length; i++) {
            for (let j = 0; j < this.coordsGridArr[0].length; j++) {
                let type_tmp = this.coordsGridArr[i][j].type;
                /*for(let key of this.coordsGridArr[i][j].terrainTypes.keys()) {
                    type_tmp = key;
                    break;
                }*/

                ctx.fillStyle = colors[0]; //background of circle shaped tile
                ctx.fillRect(i * blockSize,  j * blockSize, blockSize, blockSize);

                ctx.fillStyle = colors[terrain_types.indexOf(type_tmp)];
                ctx.beginPath();
                ctx.arc(i * blockSize + blockSize/2, j * blockSize + blockSize/2, Math.round(blockSize / 2), 0, 2 * Math.PI);
                //ctx.stroke();
                ctx.fill();
            }
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
        let sizes = [40, 40];
        if (type >= imgSrc.length) return -1;

        let canvas = document.getElementById("vertices-layer");
        let ctx = canvas.getContext("2d");

        let icon = new Image();
        icon.src = imgSrc[type][level];

        // Make sure the image is loaded first otherwise nothing will draw.
        icon.onload = function () {
            ctx.drawImage(icon, x - sizes[0]/2, y - sizes[1], sizes[0], sizes[1]);
        }
        return 0;
    }

    drawVerticeTextBox(x, y, type, level) {


        let size = 30;
        let types = ['City', 'Vilg', 'Fort', 'cAm', 'Bad'];
        let levelsColors = ['#996633', '#A6A6A6', '#F2C40D', '#F2C40D', '#F2C40D'];
        if (type >= types.length) return -1;
        if (level >= levelsColors.length) return -1;

        let canvas = document.getElementById("vertices-layer");
        let ctx = canvas.getContext("2d");
        //draw rectangle as font for the text
        ctx.strokeStyle = levelsColors[level];
        ctx.lineWidth = 2;
        ctx.strokeRect(x - size, y - size  + 6, size + 2,size - 6);
        ctx.fillStyle = "blanchedalmond";
        ctx.fillRect(x - size, y - size + 6, size + 2,size - 6);

        // Draw text with one Big letter
        let oneBigLetterWidth = 16; //px
        if(type === 3) {
            let smallLetterWidth = 7;
            ctx.fillStyle = levelsColors[level];
            ctx.font = "12px Arial ";
            ctx.fillText(types[type][0],x - size,y - size/3 + 6);
            ctx.font = "Bold 24px Arial ";
            ctx.fillText(types[type][1],x - size + smallLetterWidth,y - size/3 + 6);
            ctx.font = "12px Arial ";
            ctx.fillText(types[type].slice(2),x - size + smallLetterWidth + oneBigLetterWidth,y - size/3 + 6);
            return 0
        }
        ctx.font = "Bold 24px Arial ";
        ctx.fillStyle = levelsColors[level];
        ctx.fillText(types[type][0],x - size,y - size/3 + 6);
        ctx.font = "12px Arial ";
        ctx.fillText(types[type].slice(1),x - size + oneBigLetterWidth,y - size/3 + 6);

        return 0;
    }

    drawImageOrColoredCircleIfCant(x, y, type, level) {
        //if (this.drawVerticeImage(x, y, type, level) > -1) return;
        if (this.drawVerticeTextBox(x, y, type, level) > -1) return;
        this.circle(x, y, type);
    }

    drawEdgesTextOnCanvas(graph) {
        //TODO: змінити малювання на малювання групками ліній, замість малювання усіх І не забути в такому разі додати іконку завантаження,поки лінії відмальовуются
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
                this.lineFromArr(edg.route, edg.isForVisualisation, edg.bandwidth);
            } else {
                let verticeMap = graph.verticesMap;
                let id1 = edg.vertices[0], id2 = edg.vertices[1];
                let item1 = verticeMap.get(id1);
                let item2 = verticeMap.get(id2);
                this.line(item1.x, item1.y, item2.x, item2.y, edg.isForVisualisation, edg.level);
            }
        }

        //}, 10)

    }

    drawVerticesTextOnCanvas(graph) {
        let vertices = graph.getAllVertices(graph.verticesMap);
        console.log("graph.getAllVertices()");
        console.log(vertices);
        for (let vert of vertices) {
            this.drawTextOfVerticeValuesNearIt(graph.verticesMap.get(vert.id));
        }
    }

    drawTextOfVerticeValuesNearIt(vertice) {
        let canvas = document.getElementById("game-layer");
        let ctx = canvas.getContext("2d");

        ctx.font = "bold 18px Alice in Wonderland"; //Arial
        ctx.fillStyle = "#79553D";
        ctx.strokeStyle = "#FFF1D6";
        ctx.lineWidth = 3;
        let text = `(${vertice.id}) ${vertice.name} Treasury:${vertice.richness.toFixed(1)}`;
        ctx.strokeText(text, vertice.x - 70, vertice.y - 35);
        ctx.fillText(text, vertice.x - 70, vertice.y - 35);
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