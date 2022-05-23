import {Graph} from "./graph.js";

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



// export function handleSubmit (temp, event) {
//     let grph;
//
//     let file = document.querySelector('#file');
//
//     // Stop the form from reloading the page
//     event.preventDefault();
//
//     // If there's no file, do nothing
//     if (!file.value.length) return;
//
//     // Create a new FileReader() object
//     let reader = new FileReader();
//
//     // Setup the callback event to run when the file is read
//     reader.onload = temp => logFile;
//
//     // Read the file
//     reader.readAsText(file.files[0]);
//     setTimeout(() => {
//         this.graph = Graph.load(grph);
//         console.log("this", this);
//         console.log("temp", temp);
//     }, 100);
//
// }
//
function logFile (temp, event) {
    let str = event.target.result;
    let json = JSON.parse(str);
    // console.log("str", str);
    // console.log("json", json);

    //loadedGraph =
    temp = json;
}