import {Graph} from "./graph/graph.js";

export function save(graph) {
    // save Graph with whole inside structure as JSON
    let jsonData = JSON.stringify(graph.save());
    download(jsonData, 'json.json', 'application/json'); //text/plain
    return 0;
}

function download(content, fileName, contentType) {
    let a = document.createElement("a");
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}





let loadedGraph;
export function getLoadedGraph() {
    return loadedGraph;
}

export function load(event) {
    let promise = loadScript(event);

    //console.log('promise.state', promise.state);

    loadedGraph = promise.then(
        json => {
            //console.log("json", json);
            loadedGraph = Graph.load(json)
        },
        error => alert(`Ошибка: ${error.message}`)
    );
}

export function loadScript(event) {
    return new Promise(function(resolve, reject) {
        let file = document.querySelector('#file');

        // Stop the form from reloading the page
        event.preventDefault();

        // If there's no file, do nothing
        if (!file.value.length) return;

        // Create a new FileReader() object
        let reader = new FileReader();

        //console.log("event", event);
        reader.onload = () => {
            // console.log("reader", reader);
            // console.log("reader.result", reader.result);
            let json = /*JSON.parse(*/reader.result/*)*/;
            //console.log("json", json);
            resolve(json);
        }
        reader.onerror = () => reject(new Error(`Ошибка загрузки файла ${file}`));

        // Read the file
        reader.readAsText(file.files[0]);
    });
}

/*

export function load(event) {
    let sav = new SaveAndLoadLogic();
    console.log("--event--", event);
    let promise = sav.loadScript(event);
    console.log("--promise--", promise);

    //console.log('promise.state', promise.state);
    let outerThis = sav;
    let loadedGraph = promise.then(
        json => {
            //console.log("json", json);
            sav.loadedGraph = Graph.load(json)
        },
        error => alert(`Ошибка: ${error.message}`)
    );
    sav.loadedGraph = loadedGraph;
}

export class SaveAndLoadLogic {

    loadedGraph;

    constructor() {
    }

    save(graph) {
        // save Graph with whole inside structure as JSON
        let jsonData = JSON.stringify(graph.save());
        this.download(jsonData, 'json.json', 'application/json'); //text/plain
        return 0;
    }

    download(content, fileName, contentType) {
        let a = document.createElement("a");
        let file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    getLoadedGraph() {
        return this.loadedGraph;
    }



    /!*static load(event) {
        console.log("--event--", event);
        let promise = this.loadScript(event);
        console.log("--promise--", promise);

        //console.log('promise.state', promise.state);
        let outerThis = this;
        this.loadedGraph = promise.then(
            json => {
                console.log("--promise.then--", outerThis.loadedGraph);
                //console.log("json", json);
                outerThis.loadedGraph = Graph.load(json)
            },
            error => alert(`Ошибка: ${error.message}`)
        );
    }*!/

    loadScript(event) {
        return new Promise(function (resolve, reject) {
            let file = document.querySelector('#file');

            // Stop the form from reloading the page
            event.preventDefault();

            // If there's no file, do nothing
            if (!file.value.length) return;

            // Create a new FileReader() object
            let reader = new FileReader();

            //console.log("event", event);
            reader.onload = () => {
                // console.log("reader", reader);
                // console.log("reader.result", reader.result);
                let json = /!*JSON.parse(*!/reader.result/!*)*!/;
                //console.log("json", json);
                resolve(json);
            }
            reader.onerror = () => reject(new Error(`Ошибка загрузки файла ${file}`));

            // Read the file
            reader.readAsText(file.files[0]);
        });
    }

}*/
