const Route = require("./route.cjs");
const Topo = require("./topo.cjs");

const routeLineStrokeStyle            = "rgb(255, 255, 0)";
const routeLineStrokeStyle2           = "rgb(0, 255, 255)";
const routeLineStrokeStyle_Limestone  = "rgb(255, 255, 0)";
const routeLineStrokeStyle_Limestone2 = "rgba(255, 255, 255)";
const routeStartPointColor            = "rgb(40, 150, 40)";
const routeEndPointColor              = "rgb(150, 20, 20)";
const routeJoinPointColor             = "rgb(150, 150, 150, 0.6)";

let TopoOverlay = function(topo, forEditor, omitRouteNumbers) {
  this.topo = topo;
  this.forEditor = forEditor;
  this.highlightedPoint = null;
  this.omitRouteNumbers = omitRouteNumbers
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
  if( !this.topo.routes ) return

  this.topo.routes.forEach( routeData => {
    this.DrawRouteLine(ctx, routeData)
  })
}

TopoOverlay.prototype.DrawRouteLine = function(ctx, routeData) {
  const route = new Route(routeData)
  const points = route.GetResolvedPoints()

  if( points.length == 0 ) return

  const absPoints = points.map( point => {
    return { x: point.x * ctx.canvas.width, y: point.y * ctx.canvas.height }
  })

  ctx.setLineDash([10, 15]);
  ctx.lineDashOffset = 0
  ctx.lineWidth = "4";

  const rockType = this.topo.crag.rock_type
  switch( rockType ) {
    case 'limestone':
      ctx.strokeStyle = routeLineStrokeStyle_Limestone
      break
    default:
      ctx.strokeStyle = routeLineStrokeStyle
      break;
  }

  ctx.moveTo((absPoints[0].x), absPoints[0].y);

  for( pointIndex = 1; pointIndex < absPoints.length; pointIndex++ ) {
    ctx.lineTo(absPoints[pointIndex].x, absPoints[pointIndex].y);
  }

  ctx.stroke();

  const drawSecondDashColor = false
  if( drawSecondDashColor ) {
    ctx.setLineDash([10, 10]);
    ctx.lineDashOffset = 10
  
    switch( rockType ) {
      case 'limestone':
        ctx.strokeStyle = routeLineStrokeStyle_Limestone2
        break
      default:
        ctx.strokeStyle = routeLineStrokeStyle2
        break
    }
  
    ctx.moveTo((absPoints[0].x), absPoints[0].y);
  
    for( pointIndex = 1; pointIndex < absPoints.length; pointIndex++ ) {
      ctx.lineTo(absPoints[pointIndex].x, absPoints[pointIndex].y);
    }
  
    ctx.stroke();  
  }
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

  const startGroups = new Map()
  indexedPoints.forEach( indexedPoint => {
    let group = startGroups.get(indexedPoint.point.id)
    if( !group ) {
      group = []
      startGroups.set(indexedPoint.point.id, group)
    }
    group.push(indexedPoint)
  })

  startGroups.forEach( (startPoints) => {
    startPoints.forEach( (indexedPoint,index) => {
        this.DrawRouteStartPoint(ctx, indexedPoint.point, indexedPoint.index, index, startPoints.length);
    })
  })
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

  const endGroups = new Map()
  indexedPoints.forEach( indexedPoint => {
    let group = endGroups.get(indexedPoint.point.id)
    if( !group ) {
      group = []
      endGroups.set(indexedPoint.point.id, group)
    }
    group.push(indexedPoint)
  })

  endGroups.forEach( (endPoints) => {
    endPoints.forEach( (indexedPoint,index) => {
        this.DrawRouteEndPoint(ctx, indexedPoint.point, indexedPoint.index, index, endPoints.length);
    })
  })
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

TopoOverlay.prototype.DrawRouteStartPoint = function(ctx, point, index, number, groupTotal) {
  const row = (number == 0 ? 0 : 1)
  const secondRowCount = groupTotal - 1
  const rowPosition = (row == 0 ? 0 :  number - (secondRowCount + 1) / 2)
  const rowShiftY = ( groupTotal % 2 == 0 ) ? 0.04 : 0.035 // ensure second row is touching the first when there's an odd number of points
  this.DrawPoint(ctx, point.x + rowPosition * 0.03, point.y + row * rowShiftY, index + 1, routeStartPointColor);
}

TopoOverlay.prototype.DrawRouteEndPoint = function(ctx, point, index, number, groupTotal) {
  const row = (number == 0 ? 0 : 1)
  const secondRowCount = groupTotal - 1
  const rowPosition = (row == 0 ? 0 :  number - (secondRowCount + 1) / 2)
  const rowShiftY = ( groupTotal % 2 == 0 ) ? 0.04 : 0.035 // ensure second row is touching the first when there's an odd number of points
  this.DrawPoint(ctx, point.x + rowPosition * 0.03, point.y - row * rowShiftY, index + 1, routeEndPointColor);
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
  if( !this.omitRouteNumbers ) {
    ctx.fillStyle = "rgb(230,230,230)";
    ctx.fillText(text, x - (widthOfText * 0.5), y + (widthOfText * 0.6));
  }
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
