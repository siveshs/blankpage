"use strict";
console.log("working");

//
// DATA MODEL:
// store and display an array of textNodes
// each textNode consists of text, position

let nodeGraph = new TxtNodeGraph("field");
nodeGraph.addNode(200,200);
nodeGraph.addNode(215,215);
nodeGraph.addNode(230,230);


//
// ADDING GENERAL EVENT HANDLERS
//

// when delete key is pressed all nodes that are selected will be deleted
document.addEventListener('keydown', function (event) {
  // console.log(event.code);
  if((event.code == "Delete" || event.code == "Backspace" )
      && (event.ctrlKey || event.metaKey)
      && document.getElementsByClassName("editable")) {
      let selectedNodes = Array.from(document.getElementsByClassName("editable"));
      selectedNodes.forEach((node, i) => {
      const nodeId = Number(node.id.slice(4));
      nodeGraph.removeNode(nodeId);
    });
  }

  if(event.code == "Escape") {
    nodeGraph.nodes.forEach((node, index) => {
      const nodeDOMId = "node" + node.id;
      const nodeDOMElem = document.getElementById(nodeDOMId);
      node.state = NODE_STATE_DEFAULT; //deselect all
      node.updateDOM(nodeDOMElem);
    });
  }
});


// when user clicks 'Save', download json file
const saveButton = document.getElementById("saveButton");
saveButton.addEventListener('click', function (event) {
  const jsonToDownload = JSON.stringify(nodeGraph);
  const blob = new Blob([jsonToDownload],{type:"application/json"});

  const tempLink = document.createElement("a");
  tempLink.download = "blank.json";
  tempLink.href = URL.createObjectURL(blob);
  tempLink.click();
  URL.revokeObjectURL(tempLink.href);
});

// when user clicks 'Load' simulate click on an input element
const loadButton = document.getElementById("loadButton");
loadButton.addEventListener('click', function (event) {
  const tempInputField = document.createElement("input");
  tempInputField.type="file";
  tempInputField.accept="application/json";
  tempInputField.onchange = () => {
    const file = tempInputField.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      nodeGraph = JSON.parse(reader.result);
      console.log(reader.result);
    };
    reader.onerror = () => {
      console.error(reader.error);
    };
  };
  tempInputField.click();

});

// when user clicks new, check if there's a change, prompt to save, then clear
const newButton = document.getElementById("newButton");
newButton.addEventListener('click', function(event) {
  const field = document.getElementById("field");
  while (field.lastElementChild) {
    field.removeChild(field.lastElementChild);
  }
  nodeGraph = new TxtNodeGraph("field");
});
