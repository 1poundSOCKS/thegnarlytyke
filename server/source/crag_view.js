
let _cragObject = null;
let _topoImages = new Map();
let _selectedTopoImageContainer = null;
let _contentEditable = false;
let _nearestPointID = null;

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
  console.log(`New rendering: topoID=${topoID}`);
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
}

module.exports =  DrawMainTopoOverlay_old = (topoCanvas, cragObject, topoID) => {
  let topoRouteRenderSteps = GetTopoOverlayRenderSteps(cragObject, topoID, _contentEditable);
  let ctx = topoCanvas.getContext('2d');
  topoRouteRenderSteps.forEach( renderStep => {
    switch( renderStep.type ) {
      case rsRouteStart:
        DrawRoutePoint(ctx, topoCanvas.width * renderStep.x, topoCanvas.height * renderStep.y, renderStep.index, 1, "rgb(40, 150, 40)");
        break;
      case rsRouteEnd:
        DrawRoutePoint(ctx, topoCanvas.width * renderStep.x, topoCanvas.height * renderStep.y, renderStep.index, 1, "rgb(150, 20, 20)");
        break;
      case rsRoutePoint:
        DrawRoutePoint(ctx, topoCanvas.width * renderStep.x, topoCanvas.height * renderStep.y, renderStep.index, 1, "rgb(150, 150, 150)");
        break;
        case rsRouteLine:
        DrawRouteLine(ctx,
          topoCanvas.width * renderStep.start.x, topoCanvas.height * renderStep.start.y, 
          topoCanvas.width * renderStep.end.x, topoCanvas.height * renderStep.end.y, 1);
        break;
    }
  });
  let selectedTopoID = GetSelectedTopoID();
  if( selectedTopoID ) {
    let nearestPointInfo = _nearestPointID ? GetPointInfo(_cragObject, selectedTopoID, _nearestPointID) : null;
    if( nearestPointInfo ) {
      DrawRoutePoint(ctx, topoCanvas.width * nearestPointInfo.x, topoCanvas.height * nearestPointInfo.y, 'X', 1, "rgb(40, 40, 150)");
    }
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
  }

  topoCanvas.onmousemove = event => {
    let mousePos = GetMousePositionFromEvent(topoCanvas, event);
    let topoID = GetSelectedTopoID();
    let nearestPointID = GetNearestTopoPointID(_cragObject, topoID, mousePos.x, mousePos.y);
    if( nearestPointID !== _nearestPointID ) {
      _nearestPointID = nearestPointID;
      RefreshMainTopoView();
    }
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
