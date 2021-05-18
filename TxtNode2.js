const NODE_STATE_DEFAULT = "default";
const NODE_STATE_SELECTED = "selected";
const NODE_STATE_EDITABLE = "editable";

// --------------------------------------------
// STATIC VARIABLES (OR) CONSTRUCTOR VARIABLES?
// --------------------------------------------

TxtNode2._currentCount = 0;
TxtNode2.findIdFromDOMId = function(DOMId) {
  return Number(DOMId.slice(4));
};

// -------------------------------
// CONSTRUCTOR & related functions
// -------------------------------

function TxtNode2(x,y) {
  this.text = "lorem ipsum something blah";
  this.x = x;
  this.y = y;
  this.width = 50;
  this.height = 20;
  this.state = NODE_STATE_DEFAULT;
  this.id = TxtNode2._currentCount ++;
  // this.parentGraph = parentGraph;
}

// -----------------
// UTILITY FUNCTIONS
// -----------------

TxtNode2.prototype.toggleState = function() {
  switch (this.state) {
    case NODE_STATE_DEFAULT:
      this.state = NODE_STATE_SELECTED;
      break;
    case NODE_STATE_SELECTED:
      this.state = NODE_STATE_EDITABLE;
      break;
    case NODE_STATE_EDITABLE:
      // this.state = NODE_STATE_DEFAULT;
      break;
  }
};

// --------------
// DOM Management
// --------------

TxtNode2.prototype.appendToDOMId = function (parentElemID) {
  const parentElem = document.getElementById(parentElemID);
  const newDOMElem = document.createElement("div");
  newDOMElem.classList.add("txtNode2");
  this.matchNodeStateToDOMElem(newDOMElem);
  this.addEventHandlers(newDOMElem);
  parentElem.append(newDOMElem);
};


// this func needs to be rewritten. nodeGraph variable is hardcoded
TxtNode2.prototype.addEventHandlers = function(newDOMElem) {
  newDOMElem.onmousedown = (event) => {
    const targetElem = event.target;
    const targetNodeId = TxtNode2.findIdFromDOMId(event.target.id);

    // NEED TO REWRITE THIS LINE.nodeGraph IS HARDCODED
    const targetNode = nodeGraph.findNodeFromNodeId(targetNodeId);

    const initialMouseOffsetX = event.pageX - targetElem.offsetLeft;
    const initialMouseOffsetY = event.pageY - targetElem.offsetTop;

    let timeoutID;
    if (targetNode.state === NODE_STATE_DEFAULT) {  //if default
      timeoutID = setTimeout(() => {
        targetNode.state = NODE_STATE_EDITABLE;
        targetNode.updateDOM(targetElem);
      },200);

      document.onmousemove = (event) => {
        clearTimeout(timeoutID);
        newX = event.pageX - initialMouseOffsetX;
        newY = event.pageY - initialMouseOffsetY;
        targetElem.style.left = newX + 'px';
        targetElem.style.top = newY + 'px';
        targetNode.x = newX;
        targetNode.y = newY;
      }

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };

    } else if (targetNode.state === NODE_STATE_SELECTED) { //if sel
      timeoutID = setTimeout(() => {
        targetNode.state = NODE_STATE_EDITABLE;
        targetNode.updateDOM(targetElem);
      },200);

      document.onmousemove = (event) => {
        clearTimeout(timeoutID);
        newX = event.pageX - initialMouseOffsetX;
        newY = event.pageY - initialMouseOffsetY;
        targetElem.style.left = newX + 'px';
        targetElem.style.top = newY + 'px';
        targetNode.x = newX;
        targetNode.y = newY;
      }

      document.onmouseup = () => {
        console.log('mouse up');
        document.onmousemove = null;
        document.onmouseup = null;
      };
    } else if (targetNode.state === NODE_STATE_EDITABLE) { //if edit

      }
  };
}



TxtNode2.prototype.matchNodeStateToDOMElem = function(newDOMElem) {
  newDOMElem.innerHTML = this.text;
  newDOMElem.id = "node" + this.id;
  newDOMElem.style.left = this.x + 'px';
  newDOMElem.style.top = this.y + 'px';
  newDOMElem.style.width = this.width + 'px';
  newDOMElem.style.height = this.height + 'px';
  switch(this.state) {
    case NODE_STATE_DEFAULT:
      newDOMElem.classList.add(NODE_STATE_DEFAULT);
      newDOMElem.classList.remove(NODE_STATE_SELECTED);
      newDOMElem.classList.remove(NODE_STATE_EDITABLE);
      newDOMElem.contentEditable = "false";
      break;
    case NODE_STATE_SELECTED:
      newDOMElem.classList.remove(NODE_STATE_DEFAULT);
      newDOMElem.classList.add(NODE_STATE_SELECTED);
      newDOMElem.classList.remove(NODE_STATE_EDITABLE);
      newDOMElem.contentEditable = "false";
      break;
    case NODE_STATE_EDITABLE:
      newDOMElem.classList.remove(NODE_STATE_DEFAULT);
      newDOMElem.classList.remove(NODE_STATE_SELECTED);
      newDOMElem.classList.add(NODE_STATE_EDITABLE);
      newDOMElem.contentEditable = "true";
      break;
  }
};

TxtNode2.prototype.updateDOM = function (targetDOMElem) {
  this.matchNodeStateToDOMElem(targetDOMElem);
};
