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

    static changeTypeAndLevelOfSelectedCell(offsetX, offsetY, drawingLogic, graph, addOrDel = 0, type, level = 1) {
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
                cell.addTypeAndLevel(newType, level - 1);
            }
        } else {
            //TODO: add deletion for vertices. Delete vertice without deleting edges. That could be implemented later
            cell.delType(newType);
        }


        return str;
    }

    static changeTypeAndLevelOfSelectedCells(x, y, drawingLogic, graph, addOrDel = 0, type, level = 1) {
        let cell = drawingLogic.mapLogic.coordsGridArr[x][y];
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
                cell.addTypeAndLevel(newType, level - 1);
            }
        } else {
            //TODO: add deletion for vertices. Delete vertice without deleting edges. That could be implemented later
            cell.delType(newType);
        }



        return str;
    }

    static selectionTypeChange(graph, drawingLogic, pos1, pos2, addOrDel, newType, newLevel) {
        let cellsArr = [];
        let blockSize = drawingLogic.draw.blockSize;

        let x1 = Math.floor(pos1.x / blockSize);
        let x2 = Math.floor(pos2.x / blockSize);
        let y1 = Math.floor(pos1.y / blockSize);
        let y2 = Math.floor(pos2.y / blockSize);
        x1 = x1 === -1 ? x2 : x1;
        x2 = x2 === -1 ? x1 : x2;
        y1 = y1 === -1 ? y2 : y1;
        y2 = y2 === -1 ? y1 : y2;
        let minX = Math.min(x1, x2);
        let minY = Math.min(y1, y2);
        let maxX = Math.max(x1, x2);
        let maxY = Math.max(y1, y2);

        for (let i = minX; i <= maxX; i++) {
            for (let j = minY; j <= maxY; j++) {
                cellsArr.push(drawingLogic.mapLogic.coordsGridArr[i][j]);
            }
        }
        console.log(cellsArr);
        for (let i = 0; i < cellsArr.length; i++) {
            this.changeTypeAndLevelOfSelectedCell(cellsArr[i].x * blockSize, cellsArr[i].y * blockSize, drawingLogic, graph, addOrDel, newType, newLevel);
        }
        this.refreshBackgroundVerticesAndEdges(drawingLogic, graph);
    }

    static selectionSetPoints(pos1, pos2, firstOrSecondPos, x, y) {
        if(firstOrSecondPos === 0) {
            pos1 = {x: x, y: y};
        }
        else {
            pos2 = {x: x, y: y};
        }
        let canvas1 = document.getElementById("selection-layer");
        let ctx1 = canvas1.getContext("2d");
        let x1, y1, x2, y2;
        // if one point not exists it means that only one point selection
        if(pos1.x === -1 || pos1.y === -1) {
            x1 = pos2.x;
            y1 = pos2.y;
            x2 = pos2.x;
            y2 = pos2.y;
            //console.log("pos1.x, pos1.y ", pos1.x, pos1.y," : ", x1, y1, x2, y2);
        } else if(pos2.x === -1 || pos2.y === -1) {
            x1 = pos1.x;
            y1 = pos1.y;
            x2 = pos1.x;
            y2 = pos1.y;
            //console.log("pos2.x, pos2.y ", pos2.x, pos2.y," : ", x1, y1, x2, y2);
        } else {
            x1 = pos1.x;
            y1 = pos1.y;
            x2 = pos2.x;
            y2 = pos2.y;
        }
        return {x1, y1, x2, y2, pos1, pos2}
    }

    static refreshBackgroundVerticesAndEdges(drawingLogic, graph) {
        drawingLogic.draw.drawBackground(0, 0);
        drawingLogic.draw.drawVerticesGraphics(graph);
        drawingLogic.draw.drawEdgesTextOnCanvas(graph);
        drawingLogic.draw.drawVerticesTextOnCanvas(graph);
    }
}


