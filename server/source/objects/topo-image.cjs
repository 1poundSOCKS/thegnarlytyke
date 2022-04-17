const TopoOverlay = require('./topo-overlay.cjs');

let TopoImage = function(canvas) {
  this.canvas = canvas;
  this.image = null;
  this.topo = null;
  this.contentEditable = false;
  this.nearestPointInfo = null;
  this.mousePos = null;
  this.nearestPointInfo = null;
  this.dragStartPos = null;
  this.dragPointInfo = null;
  this.mouseDown = false;
}

TopoImage.prototype.Refresh = function() {
  this.canvas.setAttribute('width', this.image.width);
  this.canvas.setAttribute('height', this.image.height);
  let ctx = this.canvas.getContext('2d');
  ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
  this.DrawOverlay();
}

TopoImage.prototype.DrawOverlay = function() {
  const topoOverlay = new TopoOverlay();
  topoOverlay.GenerateFromTopo(this.topo);
  
  if( this.dragPointInfo ) topoOverlay.UpdatePoints(this.dragPointInfo.id, this.dragPointInfo.x, this.dragPointInfo.y);

  let ctx = this.canvas.getContext('2d');

  topoOverlay.lines.forEach( line => {
    DrawRouteLine(ctx,
      this.canvas.width * line.startX, this.canvas.height * line.startY, 
      this.canvas.width * line.endX, this.canvas.height * line.endY, 1);
  })

  topoOverlay.points.forEach( point => {
    let routeLabel = point.routeIndex + 1;
    switch( point.type ) {
      case rsRouteJoin:
        if( this.contentEditable )
          DrawRoutePoint(ctx, this.canvas.width * point.x, this.canvas.height * point.y, routeLabel, 1, "rgb(150, 150, 150)");
        break;
      case rsRouteStart:
        DrawRoutePoint(ctx, this.canvas.width * point.x, this.canvas.height * point.y, routeLabel, 1, "rgb(40, 150, 40)");
        break;
      case rsRouteEnd:
        DrawRoutePoint(ctx, this.canvas.width * point.x, this.canvas.height * point.y, routeLabel, 1, "rgb(150, 20, 20)");
        break;
    }
  });

  if( this.nearestPointInfo ) {
    HighlightPoint(ctx, this.canvas.width * nearestPointInfo.x, this.canvas.height * nearestPointInfo.y, 1);
  }

  if( _selectedTopoRouteTableRow && _mousePos && _mouseDown && !_dragPointInfo ) {
    let routeLabel = _selectedTopoRouteTableRow.rowIndex + 1;
    DrawRoutePoint(ctx, topoCanvas.width * _mousePos.x, topoCanvas.height * _mousePos.y, routeLabel, 1, "rgb(150, 150, 150)");
  }
}

TopoImage.prototype.AddMouseHandler = function() {
  this.canvas.onmousemove = event => this.OnMouseMove(event);
  this.canvas.onmousedown = event => this.OnMouseDown(event);
  this.canvas.onmouseup = event => this.OnMouseUp(event);
  this.canvas.onmouseleave = event => this.OnMouseLeave(event);
}

TopoImage.prototype.OnMouseMove = function(event) {
  this.mousePos = GetMousePositionFromEvent(event);
  if( this.mouseDown ) {
    if( this.dragPointInfo ) {
      this.dragPointInfo.x = this.mousePos.x;
      this.dragPointInfo.y = this.mousePos.y;
    }
  }
  else {
    let topoID = GetSelectedTopoID();
    let nearestPointInfo = GetNearestTopoPointInfo(_crag, topoID, _mousePos.x, _mousePos.y);
    this.nearestPointInfo = ( nearestPointInfo && nearestPointInfo.distance < 0.03 ) ? nearestPointInfo : null;
  }
  this.Refresh();
}

TopoImage.prototype.OnMouseDown = function(event) {
  this.mouseDown = true;
  this.dragStartPos = GetMousePositionFromEvent(event);
  this.dragPointInfo = this.nearestPointInfo;
}

TopoImage.prototype.OnMouseUp = function(event) {
  this.mouseDown = false;
  let mousePos = GetMousePositionFromEvent(event);
  let topoID = GetSelectedTopoID();
  if( _dragPointInfo ) {
    MovePoint(_crag, topoID, _dragPointInfo.id, mousePos.x, mousePos.y);
    this.dragPointInfo = null;
  }
  else {
    let routeID  = GetSelectedTopoRouteTableID();
    let route = GetTopoRoute(_crag, topoID, routeID);
    if( route ) AppendPointToRoute(route, mousePos.x, mousePos.y);
    this.Refresh();
    RefreshTopoRouteTable(_crag, topoID);
  }
}

TopoImage.prototype.OnMouseLeave = function(event) {
  this.mouseDown = false;
}

TopoImage.prototype.GetMousePositionFromEvent = function(event) {
  let rect = this.canvas.getBoundingClientRect();
  let clientRectWidth = rect.right - rect.left;
  let clientRectHeight = rect.bottom - rect.top;
  let clientMouseX = event.clientX - rect.left;
  let clientMouseY = event.clientY - rect.top;
  let mousePercentX = clientMouseX / clientRectWidth;
  let mousePercentY = clientMouseY / clientRectHeight;
  return { x: mousePercentX, y: mousePercentY };
}

module.exports = TopoImage;

let DrawRoutePoint = (ctx, canvasX, canvasY, routeIndex, fontSize, colour) => {
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

let DrawRouteLine = (ctx, canvasStartX, canvasStartY, canvasEndX, canvasEndY, width) => {
  ctx.beginPath();
  ctx.setLineDash([10, 10]);
  ctx.moveTo(canvasStartX, canvasStartY);
  ctx.lineTo(canvasEndX, canvasEndY);
  ctx.lineWidth = "4";
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();
}
