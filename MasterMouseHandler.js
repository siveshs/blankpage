// master mouse and touch handler that can enable singleclick
// doubleclick and drag-to-move features

function MasterMouseHandler() {
  //settings
  this.singleClickTimeout = 200;
  this.dragMovementThreshold = 5;

  //tracking variables
  this.mouseDownCounter = 0;
  this.singleClickTimeoutID = null;
  this.startingX = null;
  this.startingY = null;
}

MasterMouseHandler.prototype.singleClickHandler = function(event) {
  console.log('single click succesfully took place');
  alert('singleclick');
}

MasterMouseHandler.prototype.doubleClickHandler = function(event) {
  console.log('double click succesfully took place');
  alert('doubleclick');
}

MasterMouseHandler.prototype.handleEvent = function(event) {
  const target = event.target; // capturing event target for funcs
  const handler = this; //capturing this for use in funcs

  handler.mouseDownCounter++;

  if(handler.mouseDownCounter === 1) {
    // when the mouse is pressed down for the 1st time,
    // capture it's location in document coordinates
    // and also the shift w.r.t. target's origin
    handler.startingX = event.pageX;
    handler.startingY = event.pageY;
    const shiftX = event.pageX - target.offsetLeft;
    const shiftY = event.pageY - target.offsetTop;

    // add an event handler to handle singleclick on mouseUp
    // provided 'singleClickTimeout' milliseconds passes
    // and there is no subsequent click.
    target.onpointerup = function() {
      handler.singleClickTimeoutID = setTimeout( () => {
        handler.singleClickHandler(event);
        handler.mouseDownCounter = 0;
      },handler.singleClickTimeout);
      target.onpointermove = null;
      target.onpointerup = null;
    };

    // add an event handler to track movement of the pointer
    // pointer and trigger the actual drag actions when
    // if it crosses the threshold.
    target.onpointermove = function(event) {
      // console.log(`${Math.abs(event.pageX-handler.startingX)}`);
      // console.log(`${Math.abs(event.pageY-handler.startingY)}`);
      if (!target.classList.contains("editable")) {
        if( Math.abs(event.pageX-handler.startingX)
              >= handler.dragMovementThreshold ||
            Math.abs(event.pageY-handler.startingY)
              >= handler.dragMovementThreshold)
              {
                handler.mouseDownCounter = 0;
                target.onpointerup = null;
                target.onpointermove = null;
                dragBehavior(shiftX,shiftY);
              }
      }

    }

  } else if (handler.mouseDownCounter === 2) {
    target.onpointerup = function() {
      clearTimeout(handler.singleClickTimeoutID);
      handler.singleClickTimeoutID = null;
      handler.mouseDownCounter = 0;
      handler.doubleClickHandler(event);
      target.onpointerup = null;
    };
  }

  function dragBehavior(shiftX,shiftY) {
    document.onpointermove = function(event) {
      // console.log(`event.pageX = ${event.pageX}`);
      // console.log(`event.pageY = ${event.pageY}`);
      target.style.left = event.pageX - shiftX +'px';
      target.style.top = event.pageY - shiftY + 'px';
    }

    document.onpointerup = function(event) {
      // console.log('mouseup');
      document.onpointermove = null;
      document.onpointerup = null;
      handler.mouseDownCounter = 0;
    }
  }
};
