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

module.exports =  DrawMainTopoImage = topoImage => {
  let destCanvas = document.getElementById('main-topo-image');
  let width = 60;
  let height = topoImage.height * width / topoImage.width;
  destCanvas.setAttribute('style', `width: ${width}rem; height: ${height}rem;`);
  destCanvas.setAttribute('width', topoImage.width);
  destCanvas.setAttribute('height', topoImage.height);
  destCanvas.height = topoImage.height;
  destCanvas.width = topoImage.width * destCanvas.height / topoImage.height;
  let destCanvasCtx = destCanvas.getContext('2d');
  destCanvasCtx.drawImage(topoImage, 0, 0, destCanvas.width, destCanvas.height);
  return destCanvas;
}

module.exports =  DrawMainTopoOverlay = (cragObject, topoID) => {
  let topoRouteRenderSteps = GetTopoOverlayRenderSteps(cragObject, topoID);
  let topoCanvas = document.getElementById('main-topo-image');
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

module.exports =  RefreshTopoRouteTable = (cragObject, topoID) => {
  let topoRouteTable = document.getElementById("topo-route-table");
  while( topoRouteTable.rows.length > 1 ) topoRouteTable.deleteRow(1);
  GetTopoRouteIDs(cragObject, topoID).forEach( routeID => {
    let topoRouteInfo = GetCragRouteInfo(cragObject, routeID);
    let newRow = topoRouteTable.insertRow(topoRouteTable.rows.length);
    newRow.insertCell(0).innerText = topoRouteTable.rows.length - 1;
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