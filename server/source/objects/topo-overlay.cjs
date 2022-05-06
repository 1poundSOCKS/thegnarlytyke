const Route = require("./route.cjs");
const Topo = require("./topo.cjs");

const routeLineColor = "rgb(255, 255, 255)";
const routeStartPointColor = "rgb(40, 150, 40)";
const routeEndPointColor = "rgb(150, 20, 20)";
const routeJoinPointColor = "rgb(150, 150, 150)";

let TopoOverlay = function(topo, forEditor) {
  this.topo = topo;
  this.forEditor = forEditor;
  this.highlightedPoint = null;
}

TopoOverlay.prototype.Draw = function(canvas) {
  const ctx = canvas.getContext('2d');
  this.DrawRouteLines(ctx);
  this.DrawRouteStartPoints(ctx);
  this.DrawRouteEndPoints(ctx);
  if( this.forEditor ) this.DrawRouteJoinPoints(ctx);
  if( this.highlightedPoint ) this.HighlightPoint(ctx, this.highlightedPoint);
}

TopoOverlay.prototype.DrawRouteLines = function(ctx) {
  const topo = new Topo(this.topo);
  const topoLines = topo.GetRouteLines();

  const overlayLines = topoLines.map( line => {
    return {
      startX: line.startPoint.x * ctx.canvas.width,
      startY: line.startPoint.y * ctx.canvas.height,
      endX: line.endPoint.x * ctx.canvas.width,
      endY: line.endPoint.y * ctx.canvas.height
    };
  });

  overlayLines.forEach( line => {
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.moveTo(line.startX, line.startY);
    ctx.lineTo(line.endX, line.endY);
    ctx.lineWidth = "4";
    ctx.strokeStyle = routeLineColor;
    ctx.stroke();
  });
}

TopoOverlay.prototype.DrawRouteStartPoints = function(ctx) {
  const topo = new Topo(this.topo);
  const topoPoints = topo.GetSortedRouteStartPoints();
  
  const indexedPoints = topoPoints.map( (point, index) => {
    return {
      point: point,
      index: index
    }
  });

  const startCounts = new Map();
  indexedPoints.forEach( point => {
    let count = startCounts.get(point.point.id);
    if( !count ) count = 0;
    this.DrawRouteStartPoint(ctx, point.point, point.index, count);
    startCounts.set(point.point.id, count + 1);
  });
}

TopoOverlay.prototype.DrawRouteEndPoints = function(ctx) {
  const topo = new Topo(this.topo);
  const points = topo.GetSortedRouteEndPoints();
  
  const indexedPoints = points.map( (point, index) => {
    return {
      point: point,
      index: index
    }
  });

  const endCounts = new Map();
  indexedPoints.forEach( point => {
    let count = endCounts.get(point.point.id);
    if( !count ) count = 0;
    this.DrawRouteEndPoint(ctx, point.point, point.index, count);
    endCounts.set(point.point.id, count + 1);
  });
}

TopoOverlay.prototype.DrawRouteJoinPoints = function(ctx) {
  const topo = new Topo(this.topo);
  const routes = topo.GetSortedRoutes();
  routes.forEach( (routeData, index) => {
    const route = new Route(routeData);
    const points = route.GetJoinPoints();
    points.forEach( point => this.DrawRouteJoinPoint(ctx, point, index+1) );
  });
}

TopoOverlay.prototype.DrawRouteStartPoint = function(ctx, point, index, number) {
  this.DrawPoint(ctx, point.x, point.y + number * 0.04, index + 1, routeStartPointColor);
}

TopoOverlay.prototype.DrawRouteEndPoint = function(ctx, point, index, number) {
  this.DrawPoint(ctx, point.x, point.y - number * 0.04, index + 1, routeEndPointColor);
}

TopoOverlay.prototype.DrawRouteJoinPoint = function(ctx, point, index) {
  this.DrawPoint(ctx, point.x, point.y, index, routeJoinPointColor);
}

TopoOverlay.prototype.DrawPoint = function(ctx, x, y, text, color) {
  x = x * ctx.canvas.width;
  y = y * ctx.canvas.height;
  const fontSize = 1;
  ctx.font = `bold ${fontSize}rem serif`;
  const metrics = ctx.measureText(text);
  let widthOfText = metrics.width;
  let radiusOfPoint = widthOfText * 1.2;
  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.arc(x, y, radiusOfPoint, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, radiusOfPoint, 0, 2 * Math.PI, false);
  ctx.lineWidth = fontSize;
  ctx.strokeStyle = "#000000";
  ctx.stroke();
  ctx.fillStyle = "rgb(230,230,230)";
  ctx.fillText(text, x - (widthOfText * 0.5), y + (widthOfText * 0.6));
  return radiusOfPoint * 2;
}

TopoOverlay.prototype.HighlightPoint = function(ctx, point) {
  const fontSize = 1;
  ctx.font = `bold ${fontSize}rem serif`;
  const metrics = ctx.measureText('X');
  let widthOfRouteIndex = metrics.width;
  ctx.beginPath();
  ctx.arc(point.x * ctx.canvas.width, point.y * ctx.canvas.height, widthOfRouteIndex * 1.2, 0, 2 * Math.PI, false);
  ctx.lineWidth = fontSize * 3;
  ctx.strokeStyle = "rgb(250, 250, 250)";
  ctx.stroke();
}

module.exports = TopoOverlay;
