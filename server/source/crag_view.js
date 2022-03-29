let _cragObject = null;
let _topoImages = new Map();
let _selectedTopoImageContainer = null;
let _contentEditable = false;
let _nearestPointInfo = null;

module.exports = SetViewContentEditable = editable => {
  _contentEditable = editable;
  SetTableContentEditable(_contentEditable);
}

module.exports = LoadAndDisplayCrag = async (cragURL, imagesPath) => {
  let response = await fetch(cragURL);
  let crag = await response.json();
  
  _cragObject = CreateCragObject(crag);
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
      DisplayTopoImage(canvas, topoImage);//, 10);
    }
  });

  RefreshCragRouteTable(_cragObject);
}

module.exports = SaveCrag = async () => {
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
    body: JSON.stringify(_cragObject)
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

  RefreshMainTopoView();
  RefreshTopoRouteTable(_cragObject, selectedTopoID);
  RefreshCragRouteTable(_cragObject, selectedTopoID);

  document.getElementById('main-topo-container').classList.remove('do-not-display');
  if( _contentEditable ) AddMouseHandlerToMainTopoCanvas();
}

module.exports = GetSelectedTopoID = () => _selectedTopoImageContainer?.dataset.id;

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
  let renderLines = GetTopoOverlayRenderLines(cragObject, topoID);
  let renderPoints = GetTopoOverlayRenderPoints(cragObject, topoID);
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

  if( _nearestPointInfo && _nearestPointInfo.distance < 0.03 ) {
    HighlightPoint(ctx, topoCanvas.width * _nearestPointInfo.x, topoCanvas.height * _nearestPointInfo.y, 1);
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

  topoCanvas.onclick = event => {
    let mousePos = GetMousePositionFromEvent(topoCanvas, event);
    let topoID = GetSelectedTopoID();
    let routeID  = GetSelectedTopoRouteTableID();
    AppendPointToRoute(_cragObject, topoID, routeID, mousePos.x, mousePos.y);
    RefreshMainTopoView();
    RefreshTopoRouteTable(_cragObject, topoID);
  }

  topoCanvas.onmousemove = event => {
    let mousePos = GetMousePositionFromEvent(topoCanvas, event);
    let topoID = GetSelectedTopoID();
    let nearestPointInfo = GetNearestTopoPointInfo(_cragObject, topoID, mousePos.x, mousePos.y);
    _nearestPointInfo = nearestPointInfo;
    RefreshMainTopoView();
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
