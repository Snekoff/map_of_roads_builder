import {DrawingLogic} from "./src/drawing_logic.js";
import * as saveAndLoad from "./src/save_and_load_logic.js";
import {MapLogic} from "./src/map/map_logic.js";
import {MapCell} from "./src/map/map_cell.js";
import {Drawing} from "./src/drawing.js";
import {Graph} from "./src/graph/graph.js";





export class Interface {


    static start(drawingLogic) {
        let rndVertices = +document.getElementById("vertices1").value;
        //let rndEdges = +document.getElementById("edges1").value;
        return drawingLogic.initialVerticesEdgesShow(rndVertices);
    }

    static next_step(graph, drawingLogic) {
        return drawingLogic.buildEdgesAndUpdateView(graph);
    }

    static save(graph, drawingLogic) {
        return saveAndLoad.save(graph, drawingLogic, drawingLogic.mapLogic);
    }

    static load() {

        let graph = saveAndLoad.getLoadedGraph();
        let drawingLogic = saveAndLoad.getLoadedDrawingLogic();
        drawingLogic.graph = graph;
        drawingLogic.mapLogic.graph = graph;
        graph.mapLogic = drawingLogic.mapLogic;

        console.log("graph", graph);
        console.log("drawingLogic", drawingLogic);
        console.log("drawingLogic.mapLogic", drawingLogic.mapLogic);
        drawingLogic.draw.drawBackground(0, 0);
        drawingLogic.draw.drawVerticesGraphics(graph);
        drawingLogic.draw.drawEdgesTextOnCanvas(graph);
        drawingLogic.draw.drawVerticesTextOnCanvas(graph);
        //drawingLogic.draw.drawEdgesAndVerticesTextOnCanvas(graph);

        return {graph, drawingLogic};
    }

    static selectionUnderline(x1, y1, x2, y2, blockSize, canvas, ctx) {
        ctx.reset();
        console.log("selectionUnderline", x1, y1, x2, y2, blockSize);
        //find max and min and move line to the outer border of the cell
        x1 = Math.floor(x1 / blockSize) * blockSize;
        x2 = Math.floor(x2 / blockSize) * blockSize;
        y1 = Math.floor(y1 / blockSize) * blockSize;
        y2 = Math.floor(y2 / blockSize) * blockSize;
        let minX = Math.min(x1, x2);
        let minY = Math.min(y1, y2);
        let maxX = Math.max(x1, x2);
        let maxY = Math.max(y1, y2);
        console.log("selectionUnderline", minX, minY, maxX, maxY, blockSize);

        ctx.beginPath();
        ctx.moveTo(minX, minY);
        ctx.lineTo(maxX + blockSize, minY);
        ctx.lineTo(maxX + blockSize, maxY + blockSize);
        ctx.lineTo(minX, maxY + blockSize);
        ctx.lineTo(minX, minY);
        ctx.strokeStyle = "red"
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    static infoWindowStr(offsetX, offsetY, drawingLogic, graph) {

        /*
        console.log("x = ", offsetX, " y = ", offsetY);*/
        let cell = drawingLogic.mapLogic.showInfoOnCellByCords(offsetX, offsetY);
        let str = "";
        let isSettlementHere = false;
        for(let type of cell.terrainTypes.keys()) {
            //if there is a settlement - leave only its picture
            if(isSettlementHere) break;
            if(type === "city" || type === "village" || type === "fort" || type === "camp" || type === "criminal camp") {
                str = "";
                isSettlementHere = true;
            }
            //if there is already a picture - don`t add next one
            if(str) continue;
            let level = cell.terrainTypes.get(type) + 1;
            let img_link_str = "<div style='display: flex; justify-content: center; align-items: center;'>" +
                "<img src='./images/" + type +"_lvl_" + level  + ".jpg' " +
                "style='max-width: 100%; max-height: 250px;'></div>";
            str += img_link_str;
            console.log("img_link_str", img_link_str);
        }
        console.log("drawingLogic.mapLogic.coordsGridArr = ",drawingLogic.mapLogic.coordsGridArr);

        str += "<div style='padding: 0 10px'>"
        str += "type: " + cell.type + "<br>";
        str += "x = " + cell.x + " y = " + cell.y + "<br>";
        str += "multiplier = " + cell.currentMultiplier + "<br>";
        str += "types: ";

        let typesArr = []
        for(let type of cell.terrainTypes.entries()) {
            typesArr.push(type[0]);
        }
        str = str + typesArr + "</div>";

        return str;
    }

    static optionsWindow(offsetX, offsetY, drawingLogic, graph, addOrDel = 0, type, level = 1) {


        let cell = drawingLogic.mapLogic.coordsGridArr[Math.floor(offsetX / drawingLogic.mapLogic.blockSize)][Math.floor(offsetY / drawingLogic.mapLogic.blockSize)];
        let str = "";

        let types = ["plains", "forest", "hills", "mountains", "water", "rocks", "sand", "snow", "road",
            "city", "village", "fort", "camp", "criminal camp"];
        let newType = types.indexOf(type);


        if(addOrDel === 0) {
            if(newType > 8) {
                let tmpName = "added " + type + graph.idForNextVertice[0];
                console.log("1 options_window grph.idForNextVertice[0] = ", graph.idForNextVertice[0]);
                let vrtce = graph.createVertice({
                    x: offsetX,
                    y: offsetY,
                    name: tmpName,
                    id: graph.idForNextVertice[0]++,
                    type: newType - 9,
                    level: level - 1,
                    richness: 10
                });
                console.log("2 options_window grph.idForNextVertice[0] = ", graph.idForNextVertice[0]);
                graph.verticesMap.set(vrtce.id, vrtce);
                drawingLogic.mapLogic.addVerticeToCell(
                    Math.floor(offsetX / drawingLogic.mapLogic.blockSize),
                    Math.floor(offsetY / drawingLogic.mapLogic.blockSize),
                    vrtce);
            } else {
                cell.AddTypeAndLevel(newType, level - 1);
            }
        } else {
            //TODO: add deletion for vertices. Delete vertice without deleting edges. That could be implemented later
            cell.DelType(newType);
        }

        

        drawingLogic.draw.drawBackground(0, 0);
        drawingLogic.draw.drawVerticesGraphics(graph);
        drawingLogic.draw.drawEdgesTextOnCanvas(graph);
        drawingLogic.draw.drawVerticesTextOnCanvas(graph);

        return str;
    }
}


