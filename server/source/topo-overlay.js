require('./crag_object.js');

module.exports = CreateTopoOverlay = (cragObject, topoID) => {
  let topoObject = GetTopo(cragObject, topoID);
  return topoObject ? { topo: topoObject } : null;
}

module.exports = GetTopoOverlayRenderLines = (topoOverlay) => {
  let renderLines = GetTopoRenderLines(topoOverlay.topo);
  return renderLines;
}

let GetTopoRenderLines = (topoObject) => {
  if( !topoObject.routes ) return [];
  let topoLines = topoObject.routes.map( route => {
    return GetRouteRenderLines(route);
  })
  .filter( routeLines => routeLines.length > 0 );
  return topoLines;
}

let GetRouteRenderLines = (routeObject) => {
  if( !routeObject.points ) return [];
  else return routeObject.points.map( (point, index, points) => {
    let nextPoint = points[index + 1];
    return nextPoint ? { startX: point.x, startY: point.y, endX: nextPoint.x, endY: nextPoint.y } : null;
  })
  .filter( line => line );
}

module.exports = GetTopoOverlayRenderPoints = (topoOverlay) => {
  let renderPoints = GetTopoRenderPoints(topoOverlay.topo);
  return renderPoints;
}

module.exports = GetTopoOverlayRenderPointsWithDragPoint = (topoOverlay, dragPoint) => {
  let renderPoints = GetTopoRenderPoints(topoOverlay.topo);
  return renderPoints.map( routePoints => {
    return routePoints.map( routePoint => {
      return routePoint.id == dragPoint.id ? 
      { type: routePoint.type, id: routePoint.id, x: dragPoint.x, y: dragPoint.y  } :
      { type: routePoint.type, id: routePoint.id, x: routePoint.x, y: routePoint.y  };
    });
  });
}

let GetTopoRenderPoints = (topoObject) => {
  let topoRoutes = topoObject.routes ? topoObject.routes : [];
  let topoRoutesWithPoints = topoRoutes.filter( route => route.points && route.points.length > 0 );
  topoRoutesWithPoints.sort( (point1, point2) => point1.points[0].x - point2.points[0].x );
  let allRoutePoints = topoRoutesWithPoints.map( route => {
    let lastPointIndex = route.points.length - 1;
    return route.points.map( (point, index) => {
      let pointType = rsRouteJoin;
      if( index == 0 ) pointType = rsRouteStart;
      else if( index == lastPointIndex ) pointType = rsRouteEnd;
      return {
        type: pointType,
        id: point.id,
        x: point.x,
        y: point.y
      }
    });
  });

  return allRoutePoints;
}
