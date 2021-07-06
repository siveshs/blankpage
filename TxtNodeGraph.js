

function TxtNodeGraph(canvasId) {
  this.nodes = [];
  this.edges = [];
  this.canvasId = canvasId;
  this.addEventHandlersToCanvas(this.canvasId);
}

TxtNodeGraph.prototype.findNodeFromNodeId = function(nodeId) {
  let foundNode;
  this.nodes.forEach((node, index) => {
    if(node.id == nodeId) {
      foundNode = node;
    }
  });
  if(foundNode) {
    return foundNode;
  } else {
    console.error("node of given Id not found");
  }
};

TxtNodeGraph.prototype.findNodeIndexFromNodeId = function(nodeId) {
  let foundNodeIndex = null;
  this.nodes.forEach((node, index) => {
    if(node.id == nodeId) {
      foundNodeIndex = index;
    }
  });
  if(foundNodeIndex != null) {
    return foundNodeIndex;
  } else {
    console.error("node of given Id not found");
  }
};

TxtNodeGraph.prototype.addNode = function(x,y,text) {
  const newTxtNode = new TxtNode2(x,y,this);
  if(text != undefined) {
    newTxtNode.text = text;
  }
  this.nodes.push(newTxtNode);
  newTxtNode.appendToDOMId(this.canvasId);
}

TxtNodeGraph.prototype.removeNode = function(nodeId) {
  const indexOfNodeToRemove = this.findNodeIndexFromNodeId(nodeId);
  const domElemToRemove = document.getElementById("node"+nodeId);

  this.nodes.splice(indexOfNodeToRemove,1);
  domElemToRemove.remove();
}

TxtNodeGraph.prototype.addEventHandlersToCanvas = function (canvasId){
  const canvas = document.getElementById(canvasId);
  const thisNodeGraph = this;
  let mouseDownCounter = 0;
  let timeoutID;

  canvas.onmousedown = (event) => {
    if(event.target === canvas) {
      mouseDownCounter++;
      if(mouseDownCounter === 1) {
        canvas.onmouseup = () => {
            timeoutID = setTimeout(()=> {
            // console.log('single click in canvas');
            thisNodeGraph.nodes.forEach((node, index) => {
              const nodeDOMId = "node" + node.id;
              const nodeDOMElem = document.getElementById(nodeDOMId);
              node.state = NODE_STATE_DEFAULT; //deselect all
              node.text = nodeDOMElem.textContent; //match text if changed
              node.updateDOM(nodeDOMElem);
            });
            mouseDownCounter = 0;
            canvas.onmouseup = null;
          },200);
        };
      } else if (mouseDownCounter === 2) {
        clearTimeout(timeoutID);
        mouseDownCounter = 0;
        canvas.onmouseup = null;
        console.log('double-click in canvas');
        thisNodeGraph.addNode(event.pageX-75,event.pageY-30);
      }
    }
  };
}

TxtNodeGraph.prototype.loadFromJSON = function (jsonData) {
  parsedJson = JSON.parse(jsonData);
  console.log(parsedJson);
  // console.log(this);
  // remove all nodes
  for (let i=this.nodes.length-1;i>=0;i--) {
    this.removeNode(this.nodes[i].id);
  }
  // remove all edges

  // add new nodes
  for(let eachNode of parsedJson.nodes) {
    this.addNode(eachNode.x,eachNode.y,eachNode.text);
  }

  // add new edges



};
