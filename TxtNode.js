TxtNode.currentId = -1;

function TxtNode(x,y) {
  this.text = "Enter text here...";
  this.x = x;
  this.y = y;
  TxtNode.currentId++;
  this.id = TxtNode.currentId;
}

TxtNode.prototype.appendToDOMId = function (elemID) {
  // create the element
  const newElement = document.createElement('div');
  newElement.classList.add("textNode");
  newElement.classList.add("disable-selections");
  newElement.innerHTML = this.text;
  newElement.style.left = this.x + 'px';
  newElement.style.top = this.y +'px';
  newElement.id = this.id;
  newElement.contentEditable = true;

  // add event listeners
  newElement.addEventListener('mousedown',nodeHandler);
  newElement.ondragstart = () => false ;
  newElement.onselectstart = () => false ;

  // append to domcontainer
  const domContainer = document.getElementById(elemID);
  domContainer.append(newElement);
};

let nodeHandler = new MasterMouseHandler();
nodeHandler.singleClickHandler = (event) => {
  if(event.target.classList.contains("textNode")&&
     !event.target.classList.contains("editable")) {
    event.target.classList.toggle("selected");
    event.target.classList.add("disable-selections");
    event.target.classList.remove("editable");
    event.target.contentEditable = true;
  }

};
nodeHandler.doubleClickHandler = () => {
  console.log('double-clicked');
  let editableElem = null;
  if(event.target.classList.contains("textNode") &&
     !event.target.classList.contains("editable")) {
    event.target.classList.remove("selected");
    event.target.classList.remove("disable-selections");
    event.target.classList.add("editable");
    editableElem = event.target;
    editableElem.contentEditable = true;
    document.addEventListener('click',turnOffEditability);
  }

  function turnOffEditability(event) {
    if(event.target.id != editableElem.id) {
      editableElem.classList.add("disable-selections");
      editableElem.classList.remove("editable");
      editableElem.contentEditable = false;
      document.removeEventListener('click',turnOffEditability);
    }
  }


};
