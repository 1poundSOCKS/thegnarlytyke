const Topo = require("./topo.cjs");

const routeLineColor = "rgb(255, 255, 255)";
const routeStartPointColor = "rgb(40, 150, 40)";
const routeEndPointColor = "rgb(150, 20, 20)";
const routeJoinPointColor = "rgb(150, 150, 150)";

let TopoOverlay2 = function(topo, forEditor) {
  this.topo = topo;
  this.forEditor = forEditor;
}

TopoOverlay2.prototype.Draw = function(canvas) {
  const ctx = canvas.getContext('2d');
  this.DrawRouteLines(ctx);
  this.DrawRouteStartPoints(ctx);
  this.DrawRouteEndPoints(ctx);
  if( this.forEditor ) this.DrawRouteJoinPoints(ctx);
}

TopoOverlay2.prototype.DrawRouteLines = function(ctx) {
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

TopoOverlay2.prototype.DrawRouteStartPoints = function(ctx) {
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

TopoOverlay2.prototype.DrawRouteEndPoints = function(ctx) {
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

TopoOverlay2.prototype.DrawRouteJoinPoints = function(ctx) {
  const topo = new Topo(this.topo);
  const routes = topo.GetSortedRoutes();
  routes.forEach( route => {
    const points = topo.GetRouteJoinPoints(route);
    const indexedPoints = points.map( (point, index) => {
      return {
        point: point,
        index: index
      }
    });  
    indexedPoints.forEach( point => DrawRouteJoinPoint(ctx, point.point, point.index) );
  });
}

TopoOverlay2.prototype.DrawRouteStartPoint = function(ctx, point, index, number) {
  this.DrawPoint(ctx, point.x, point.y + number * 0.04, index + 1, routeStartPointColor);
}

TopoOverlay2.prototype.DrawRouteEndPoint = function(ctx, point, index, number) {
  this.DrawPoint(ctx, point.x, point.y - number * 0.04, index + 1, routeEndPointColor);
}

TopoOverlay2.prototype.DrawRouteJoinPoint = function(ctx, point, index) {
  this.DrawPoint(ctx, point.x, point.y, index, routeJoinPointColor);
}

TopoOverlay2.prototype.DrawPoint = function(ctx, x, y, text, color) {
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

module.exports = TopoOverlay2;
