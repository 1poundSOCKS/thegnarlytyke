const Config = require('./config.cjs');
const Crag = require('./new/crag.cjs');

let _cragObject = null;
let _crag = new Crag();
let _topoImages = new Map();
let _selectedTopoImageContainer = null;
let _contentEditable = false;
let _mousePos = null;
let _nearestPointInfo = null;
let _dragStartPos = null;
let _dragPointInfo = null;
let _mouseDown = false;

module.exports = SetViewContentEditable = editable => {
  _contentEditable = editable;
  SetTableContentEditable(_contentEditable);
}

module.exports = LoadAndDisplayCrag = async (cragID, headerElement) => {
  const env = Config.environment;
  const cragURL = `env/${env}/data/${cragID}.crag.json`;
  const imagesPath = `env/${env}/images/`;
  let response = await fetch(cragURL);
  let crag = await response.json();

  if( headerElement && crag.name ) headerElement.innerText = crag.name;
  
  _cragObject = CreateCragObject(crag);
  _crag.Attach(crag);
  let cragTopoIDs = GetCragTopoIDs(_cragObject);
  
  let topoImageContainers = cragTopoIDs.map( topoID => {
    return document.getElementById('topo-images-container').appendChild(CreateTopoImageContainer(topoID));
  });

  let topoImageCanvases = topoImageContainers.map( container => {
    let topoCanvas = document.createElement('canvas')
    topoCanvas.classList.add('topo-image');
    topoCanvas = container.appendChild(topoCanvas);
    topoCanvas.onclick = event => OnTopoSelected(event);
    return topoCanvas;
  });
  
  topoImageCanvases.forEach( async canvas => {
    let topoID = canvas.parentElement.dataset.id;
    let imageFilename = GetTopoImageFile(_cragObject, topoID);
    if( imageFilename ) {
      let topoImage = await LoadImage(`${imagesPath}${imageFilename}`);
      _topoImages.set(topoID, topoImage);
      DisplayTopoImage(canvas, topoImage);
    }
  });

  RefreshCragRouteTable(_cragObject);
}

module.exports = SaveCrag = async () => {
  const requestBody = JSON.stringify(_cragObject);

  let response = await fetch('./save_crag', {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'same-origin',
    body: requestBody
  });
  let parsedResponse = await response.json();
}

module.exports = LoadImage = (url) => new Promise( (resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = (err) => reject(err);
  img.src = url;
});

let OnTopoSelected = event => {
  if( _selectedTopoImageContainer ) _selectedTopoImageContainer.classList.remove('topo-container-selected');

  _selectedTopoImageContainer = event.target.parentElement;
  _selectedTopoImageContainer.classList.add('topo-container-selected');
  let selectedTopoID = GetSelectedTopoID();

  let topoImagesContainer = document.getElementById('topo-images-container');
  topoImagesContainer.classList.remove('topo-images-container-initial');
  topoImagesContainer.classList.add('topo-images-container');

  RefreshIcons();
  RefreshMainTopoView();
  RefreshTopoRouteTable(_cragObject, selectedTopoID);
  RefreshCragRouteTable(_cragObject, selectedTopoID);

  document.getElementById('main-topo-container').classList.remove('do-not-display');
  if( _contentEditable ) AddMouseHandlerToMainTopoCanvas();
}

module.exports = GetSelectedTopoID = () => _selectedTopoImageContainer?.dataset.id;

let RefreshIcons = () => {
  const shiftTopoLeftContainer = document.getElementById('shift-topo-left-container');
  if( shiftTopoLeftContainer ) {
    if( _selectedTopoImageContainer.previousSibling ) shiftTopoLeftContainer.classList.remove('do-not-display');
    else shiftTopoLeftContainer.classList.add('do-not-display');
  }

  const shiftTopoRightContainer = document.getElementById('shift-topo-right-container');
  if( shiftTopoRightContainer ) {
    if( _selectedTopoImageContainer.nextSibling ) shiftTopoRightContainer.classList.remove('do-not-display');
    else shiftTopoRightContainer.classList.add('do-not-display');
  }
}

module.exports = ShiftSelectedTopoLeft = () => {
  const parentNode = _selectedTopoImageContainer.parentNode;
  const previousContainer = _selectedTopoImageContainer.previousSibling;
  _selectedTopoImageContainer.remove();
  parentNode.insertBefore(_selectedTopoImageContainer, previousContainer);
  RefreshIcons();
  const selectedTopoIndex = _crag.GetTopoIndex(GetSelectedTopoID());
  _crag.SwapTopos(selectedTopoIndex, selectedTopoIndex - 1);
}

module.exports = ShiftSelectedTopoRight = () => {
  const parentNode = _selectedTopoImageContainer.parentNode;
  const nextContainer = _selectedTopoImageContainer.nextSibling;
  nextContainer.remove();
  parentNode.insertBefore(nextContainer, _selectedTopoImageContainer);
  RefreshIcons();
  const selectedTopoIndex = _crag.GetTopoIndex(GetSelectedTopoID());
  _crag.SwapTopos(selectedTopoIndex, selectedTopoIndex + 1);
}

module.exports = RefreshMainTopoView = () => {
  let selectedTopoID = _selectedTopoImageContainer.dataset.id;
  let selectedTopoImage = _topoImages.get(selectedTopoID);
  let mainTopoCanvas = document.getElementById('main-topo-image');
  DrawMainTopoImage(mainTopoCanvas, selectedTopoImage);
  DrawMainTopoOverlay(mainTopoCanvas, _cragObject, selectedTopoID);
}

module.exports = CreateTopoImageContainer = (topoID) => {
  let container = document.createElement('div');
  container.classList.add('topo-container');
  container.setAttribute('data-id', topoID);
  return container;
}

module.exports = DisplayTopoImage = (topoCanvas, topoImage, heightInRem) => {
  ResizeTopoCanvas(topoCanvas, topoImage, heightInRem);
  let ctx = topoCanvas.getContext('2d');
  ctx.drawImage(topoImage, 0, 0, topoCanvas.width, topoCanvas.height);
  return topoCanvas;
}

module.exports = ResizeTopoCanvas = (topoCanvas, topoImage, heightInRem) => {
  let height = heightInRem;
  let width = topoImage.width * height / topoImage.height;
  topoCanvas.setAttribute('width', topoImage.width);
  topoCanvas.setAttribute('height', topoImage.height);
  return topoCanvas;
}

module.exports =  DrawMainTopoImage = (topoCanvas, topoImage, widthInRem) => {
  topoCanvas.setAttribute('width', topoImage.width);
  topoCanvas.setAttribute('height', topoImage.height);
  let ctx = topoCanvas.getContext('2d');
  ctx.drawImage(topoImage, 0, 0, topoCanvas.width, topoCanvas.height);
}

module.exports =  DrawMainTopoOverlay = (topoCanvas, cragObject, topoID) => {
  let topoOverlay = CreateTopoOverlay(cragObject, topoID);
  let renderLines = GetTopoOverlayRenderLines(topoOverlay);
  let renderPoints = _dragPointInfo ?
  GetTopoOverlayRenderPointsWithDragPoint(topoOverlay, _dragPointInfo) :
  GetTopoOverlayRenderPoints(topoOverlay);
  let ctx = topoCanvas.getContext('2d');

  renderLines.forEach( routeLines => {
    routeLines.forEach( line => {
      DrawRouteLine(ctx,
        topoCanvas.width * line.startX, topoCanvas.height * line.startY, 
        topoCanvas.width * line.endX, topoCanvas.height * line.endY, 1);
    });
  })

  renderPoints.forEach( (routePoints, routeIndex) => {
    let routeLabel = routeIndex + 1;
    routePoints.forEach( point => {
      switch( point.type ) {
        case rsRouteJoin:
          if( _contentEditable )
            DrawRoutePoint(ctx, topoCanvas.width * point.x, topoCanvas.height * point.y, routeLabel, 1, "rgb(150, 150, 150)");
          break;
        case rsRouteStart:
          DrawRoutePoint(ctx, topoCanvas.width * point.x, topoCanvas.height * point.y, routeLabel, 1, "rgb(40, 150, 40)");
          break;
        case rsRouteEnd:
          DrawRoutePoint(ctx, topoCanvas.width * point.x, topoCanvas.height * point.y, routeLabel, 1, "rgb(150, 20, 20)");
          break;
        }
    });
  });

  if( _nearestPointInfo ) {
    HighlightPoint(ctx, topoCanvas.width * _nearestPointInfo.x, topoCanvas.height * _nearestPointInfo.y, 1);
  }

  if( _selectedTopoRouteTableRow && _mousePos && _mouseDown && !_dragPointInfo ) {
    let routeLabel = _selectedTopoRouteTableRow.rowIndex + 1;
    DrawRoutePoint(ctx, topoCanvas.width * _mousePos.x, topoCanvas.height * _mousePos.y, routeLabel, 1, "rgb(150, 150, 150)");
  }
}

module.exports = DrawRoutePoint = (ctx, canvasX, canvasY, routeIndex, fontSize, colour) => {
  ctx.font = `bold ${fontSize}rem serif`;
  const metrics = ctx.measureText(routeIndex);
  let widthOfRouteIndex = metrics.width;
  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.arc(canvasX, canvasY, widthOfRouteIndex * 1.2, 0, 2 * Math.PI, false);
  ctx.fillStyle = colour;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(canvasX, canvasY, widthOfRouteIndex * 1.2, 0, 2 * Math.PI, false);
  ctx.lineWidth = fontSize;
  ctx.strokeStyle = "#000000";
  ctx.stroke();
  ctx.fillStyle = "rgb(230,230,230)";
  ctx.fillText(routeIndex, canvasX - (widthOfRouteIndex * 0.5), canvasY + (widthOfRouteIndex * 0.6));
}

let HighlightPoint = (ctx, canvasX, canvasY, fontSize) => {
  ctx.font = `bold ${fontSize}rem serif`;
  const metrics = ctx.measureText('X');
  let widthOfRouteIndex = metrics.width;
  ctx.beginPath();
  ctx.arc(canvasX, canvasY, widthOfRouteIndex * 1.2, 0, 2 * Math.PI, false);
  ctx.lineWidth = fontSize * 3;
  ctx.strokeStyle = "rgb(250, 250, 250)";
  ctx.stroke();
}

module.exports =  DrawRouteLine = (ctx, canvasStartX, canvasStartY, canvasEndX, canvasEndY, width) => {
  ctx.beginPath();
  ctx.setLineDash([10, 10]);
  ctx.moveTo(canvasStartX, canvasStartY);
  ctx.lineTo(canvasEndX, canvasEndY);
  ctx.lineWidth = "4";
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();
}

let AddMouseHandlerToMainTopoCanvas = () => {
  let topoCanvas = document.getElementById('main-topo-image');

  topoCanvas.onmousemove = event => {
    _mousePos = GetMousePositionFromEvent(topoCanvas, event);
    if( _mouseDown ) {
      if( _dragPointInfo ) {
        _dragPointInfo.x = _mousePos.x;
        _dragPointInfo.y = _mousePos.y;
      }
    }
    else {
      let topoID = GetSelectedTopoID();
      let nearestPointInfo = GetNearestTopoPointInfo(_cragObject, topoID, _mousePos.x, _mousePos.y);
      _nearestPointInfo = ( nearestPointInfo && nearestPointInfo.distance < 0.03 ) ? nearestPointInfo : null;
    }
    RefreshMainTopoView();
  }

  topoCanvas.onmousedown = event => {
    _mouseDown = true;
    _dragStartPos = GetMousePositionFromEvent(topoCanvas, event);
    _dragPointInfo = _nearestPointInfo;
  }

  topoCanvas.onmouseup = event => {
    _mouseDown = false;
    let mousePos = GetMousePositionFromEvent(topoCanvas, event);
    let topoID = GetSelectedTopoID();
    if( _dragPointInfo ) {
      MovePoint(_cragObject, topoID, _dragPointInfo.id, mousePos.x, mousePos.y);
      _dragPointInfo = null;
    }
    else {
      let routeID  = GetSelectedTopoRouteTableID();
      let route = GetTopoRoute(_cragObject, topoID, routeID);
      if( route ) AppendPointToRoute(route, mousePos.x, mousePos.y);
      RefreshMainTopoView();
      RefreshTopoRouteTable(_cragObject, topoID);
    }
  }

  topoCanvas.onmouseleave = event => {
    _mouseDown = false;
  }
}

let GetMousePositionFromEvent = (element, event) => {
  let rect = element.getBoundingClientRect();
  let clientRectWidth = rect.right - rect.left;
  let clientRectHeight = rect.bottom - rect.top;
  let clientMouseX = event.clientX - rect.left;
  let clientMouseY = event.clientY - rect.top;
  let mousePercentX = clientMouseX / clientRectWidth;
  let mousePercentY = clientMouseY / clientRectHeight;
  return { x: mousePercentX, y: mousePercentY };
}
