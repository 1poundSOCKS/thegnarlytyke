const TopoOverlay = require('./topo-overlay.cjs');
const Topo = require('./topo.cjs');
const Route = require('./route.cjs');
const Point = require('./point.cjs');

let TopoImage = function(canvas, editable) {
  this.canvas = canvas;
  this.image = null;
  this.topo = null;
  this.contentEditable = editable;
  this.routeID = null;
  this.mousePos = null;
  this.nearestPointInfo = null;
  this.dragStartPos = null;
  this.dragPointInfo = null;
  this.mouseDown = false;
  this.Clear();
}

TopoImage.prototype.Clear = function() {
  const ctx = this.canvas.getContext('2d');
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

TopoImage.prototype.Refresh = function(topo) {
  if( topo ) {
    this.topo = topo
    this.image = this.topo.image
  }

  if( this.topo?.image ) {
    if( this.image.height == 500 ) {
      this.canvas.setAttribute('width', this.image.width);
      this.canvas.setAttribute('height', this.image.height);  
    }
    else {
      this.canvas.height = 500;
      this.canvas.width = this.image.width * this.canvas.height / this.image.height;  
    }
  
    let ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
  }
  else {
    this.Clear();
  }

  this.DrawOverlay();
}

TopoImage.prototype.DrawOverlay = function() {
  if( !this.topo ) return;

  const topoOverlay = new TopoOverlay(this.topo,this.contentEditable);
  topoOverlay.highlightedPoint = this.nearestPointInfo;
  topoOverlay.Draw(this.canvas);
}

TopoImage.prototype.AddMouseHandler = function() {
  this.canvas.onmousemove = event => this.OnMouseMove(event);
  this.canvas.onmousedown = event => this.OnMouseDown(event);
  this.canvas.onmouseup = event => this.OnMouseUp(event);
  this.canvas.onmouseleave = event => this.OnMouseLeave(event);
}

TopoImage.prototype.OnMouseMove = function(event) {
  this.mousePos = this.GetMousePositionFromEvent(event);
  if( this.mouseDown ) {
    if( this.dragPointInfo ) this.OnMouseDrag();
  }
  else {
    const topo = new Topo(this.topo);
    this.nearestPointInfo = topo.GetNearestPointWithin(this.mousePos.x, this.mousePos.y, 0.03);
  }
  this.Refresh();
}

TopoImage.prototype.OnMouseDrag = function() {
  this.dragPointInfo.x = this.mousePos.x;
  this.dragPointInfo.y = this.mousePos.y;
  const topo = new Topo(this.topo);
  this.nearestPointInfo = topo.GetNextNearestPointWithin(this.mousePos.x, this.mousePos.y, 0.03, this.dragPointInfo.id);
}

TopoImage.prototype.OnMouseDown = function(event) {
  this.mouseDown = true;
  this.dragStartPos = this.GetMousePositionFromEvent(event);
  this.dragPointInfo = this.nearestPointInfo;
}

TopoImage.prototype.OnMouseUp = function(event) {
  this.mouseDown = false;
  this.mousePos = this.GetMousePositionFromEvent(event);
  const topo = new Topo(this.topo);
  if( this.dragPointInfo && this.nearestPointInfo ) {
    const droppedPoint = new Point(this.dragPointInfo);
    droppedPoint.AttachTo(this.nearestPointInfo);
  }
  else if( this.dragPointInfo && !this.nearestPointInfo ) {
    this.dragPointInfo.x = this.mousePos.x;
    this.dragPointInfo.y = this.mousePos.y;
    this.dragPointInfo = null;
  }
  else {
    if( this.routeID ) {
      const route = new Route(topo.GetMatchingRoute(this.routeID));
      route.AppendPoint(this.mousePos.x, this.mousePos.y);
    }
  }
  this.Refresh();
  if( this.OnRouteChangedCallback ) this.OnRouteChangedCallback(this.callbackObject)
}

TopoImage.prototype.OnMouseLeave = function(event) {
  this.mouseDown = false;
  this.Refresh();
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

TopoImage.prototype.OnTopoRouteSelected = function(route) {
  console.log(route)
  this.routeID = route.id
}

module.exports = TopoImage;
