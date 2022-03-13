
let _cragObject = null;
let _topoImages = new Map();
let _selectedTopoImageContainer = null;

module.exports = LoadAndDisplayCrag = async cragURL => {
  let response = await fetch(cragURL);
  let crag = await response.json();
  _cragObject = CreateCragObject(crag);
  let cragTopoIDs = GetCragTopoIDs(_cragObject);
  let topoImageContainers = cragTopoIDs.map( topoID => {
    return document.getElementById('topo-images-container').appendChild(CreateTopoImageContainer(topoID));
  });
  let topoImageCanvases = topoImageContainers.map( container => {
    let topoCanvas = container.appendChild(document.createElement('canvas'));
    topoCanvas.classList.add('topo-image');
    topoCanvas.onclick = event => TopoSelected(event);
    return topoCanvas;
  });
  topoImageCanvases.forEach( canvas => {
    let topoID = canvas.parentElement.dataset.id;
    let imageFilename = GetTopoImageFile(_cragObject, topoID);
    if( imageFilename ) {
      LoadImage(`./images/${imageFilename}`)
      .then( topoImage => {
        _topoImages.set(topoID, topoImage);
        DisplayTopoImage(canvas, topoImage, 10);
      });
    }
  });
}

let TopoSelected = event => {
  if( _selectedTopoImageContainer ) _selectedTopoImageContainer.classList.remove('topo-container-selected');
  _selectedTopoImageContainer = event.target.parentElement;
  _selectedTopoImageContainer.classList.add('topo-container-selected');
  let selectedTopoID = _selectedTopoImageContainer.dataset.id;
  let selectedTopoImage = _topoImages.get(selectedTopoID);
  let mainTopoCanvas = document.getElementById('main-topo-image');
  DrawMainTopoImage(mainTopoCanvas, selectedTopoImage, 60);
  DrawMainTopoOverlay(mainTopoCanvas, _cragObject, selectedTopoID);
  let topoRouteTable = document.getElementById("topo-route-table");
  RefreshTopoRouteTable(topoRouteTable, _cragObject, selectedTopoID);
  document.getElementById('main-topo-container').classList.remove('do-not-display');
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
  topoCanvas.setAttribute('style', `width: ${width}rem; height: ${height}rem;`);
  topoCanvas.setAttribute('width', topoImage.width);
  topoCanvas.setAttribute('height', topoImage.height);
  return topoCanvas;
}

module.exports =  DrawMainTopoImage = (topoCanvas, topoImage, widthInRem) => {
  let height = topoImage.height * widthInRem / topoImage.width;
  topoCanvas.setAttribute('style', `width: ${widthInRem}rem; height: ${height}rem;`);
  topoCanvas.setAttribute('width', topoImage.width);
  topoCanvas.setAttribute('height', topoImage.height);
  topoCanvas.height = topoImage.height;
  topoCanvas.width = topoImage.width * topoCanvas.height / topoImage.height;
  let ctx = topoCanvas.getContext('2d');
  ctx.drawImage(topoImage, 0, 0, topoCanvas.width, topoCanvas.height);
}

module.exports =  DrawMainTopoOverlay = (topoCanvas, cragObject, topoID) => {
  let topoRouteRenderSteps = GetTopoOverlayRenderSteps(cragObject, topoID);
  let ctx = topoCanvas.getContext('2d');
  topoRouteRenderSteps.forEach( renderStep => {
    switch( renderStep.type ) {
      case rsRouteStart:
        DrawRoutePoint(ctx, topoCanvas.width * renderStep.x, topoCanvas.height * renderStep.y, renderStep.index, 1, "rgb(40, 150, 40)");
        break;
      case rsRouteEnd:
        DrawRoutePoint(ctx, topoCanvas.width * renderStep.x, topoCanvas.height * renderStep.y, renderStep.index, 1, "rgb(150, 20, 20)");
        break;
      case rsRouteLine:
        DrawRouteLine(ctx,
          topoCanvas.width * renderStep.start.x, topoCanvas.height * renderStep.start.y, 
          topoCanvas.width * renderStep.end.x, topoCanvas.height * renderStep.end.y, 1);
        break;
    }
  });
}

module.exports =  RefreshTopoRouteTable = (topoRouteTable, cragObject, topoID) => {
  let tableBody = topoRouteTable.getElementsByTagName('tbody')[0];
  if( !tableBody ) tableBody = topoRouteTable.createTBody();
  while( topoRouteTable.rows.length > 0 ) topoRouteTable.deleteRow(0);
  GetTopoRouteIDs(cragObject, topoID).forEach( (routeID, index) => {
    let topoRouteInfo = GetCragRouteInfo(cragObject, routeID);
    let newRow = topoRouteTable.insertRow(topoRouteTable.rows.length);
    newRow.insertCell(0).innerText = index + 1;
    newRow.insertCell(1).innerText = topoRouteInfo.name;
    newRow.insertCell(2).innerText = topoRouteInfo.grade;
  });
}

module.exports =  DrawRoutePoint = (ctx, canvasX, canvasY, routeIndex, fontSize, colour) => {
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