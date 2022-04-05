require('../source/topo-overlay.js');

test("GetTopoRenderLines: no routes array in the topo", () => {
  let testInput = {
    topos:[
      {
        id: 'tid-1',
      }
    ]
  }
  let cragObject = CreateCragObject(testInput);
  let topoOverlay = CreateTopoOverlay(cragObject, 'tid-1');
  let renderLines = GetTopoOverlayRenderLines(topoOverlay);
  expect(renderLines).toEqual([]);
});

test("When there aren't any render points", () => {
  let testInput = {
    topos:[
      {
        id: 'tid-1',
        routes: [
          {
            points: []
          }
        ]
      }
    ]
  }
  let cragObject = CreateCragObject(testInput);
  let topoOverlay = CreateTopoOverlay(cragObject, 'tid-1');
  let renderSteps = GetTopoOverlayRenderPoints(topoOverlay);
  expect(renderSteps).toEqual([]);
});

test("When the topo ID doesn't exist", () => {
  let testInput = {
    topos:[
      {
        id: 'tid-1',
        routes: [
          {
            points: [
              {
                x: 0.1,
                y: 0.2
              }
            ]
          }
        ]
      }
    ]
  }
  let cragObject = CreateCragObject(testInput);
  let topoOverlay = CreateTopoOverlay(cragObject, 'tid-2');
  expect(topoOverlay).toBeNull();
});

test("When there's a single render point", () => {
  let testInput = {
    topos:[
      {
        id: 'tid-1',
        routes: [
          {
            points: [
              {
                x: 0.1,
                y: 0.2
              }
            ]
          }
        ]
      }
    ]
  }
  let cragObject = CreateCragObject(testInput);
  let topoOverlay = CreateTopoOverlay(cragObject, 'tid-1');
  let renderSteps = GetTopoOverlayRenderPoints(topoOverlay);
  expect(renderSteps).toEqual([
    [{type: rsRouteStart, x: 0.1, y: 0.2}]
  ]);
});

test("When there's two routes in right to left order", () => {
  let testInput = {
    topos:[
      {
        id: 'tid-1',
        routes: [
          {
            points: [
              {
                x: 0.3,
                y: 0.1
              }
            ]
          },
          {
            points: [
              {
                x: 0.1,
                y: 0.2
              }
            ]
          }
        ]
      }
    ]
  }
  
  let cragObject = CreateCragObject(testInput);
  let topoOverlay = CreateTopoOverlay(cragObject, 'tid-1');
  let renderSteps = GetTopoOverlayRenderPoints(topoOverlay);
  expect(renderSteps).toEqual([
    [{type: rsRouteStart, x: 0.1, y: 0.2}],
    [{type: rsRouteStart, x: 0.3, y: 0.1}]
  ]);
});

test("When there's a route with two render points", () => {
  let testInput = {
    topos:[
      {
        id: 'tid-1',
        routes: [
          {
            points: [
              {
                x: 0.1,
                y: 0.2
              },
              {
                x: 0.3,
                y: 0.4
              }
            ]
          }
        ]
      }
    ]
  }
  let cragObject = CreateCragObject(testInput);
  let topoOverlay = CreateTopoOverlay(cragObject, 'tid-1');
  let renderSteps = GetTopoOverlayRenderPoints(topoOverlay);
  expect(renderSteps).toEqual([
    [{type: rsRouteStart, x: 0.1, y: 0.2},{type: rsRouteEnd, x: 0.3, y: 0.4}]
  ]);
});

test("When there's a route with three render points", () => {
  let testInput = {
    topos:[
      {
        id: 'tid-1',
        routes: [
          {
            points: [
              {
                x: 0.1,
                y: 0.2
              },
              {
                x: 0.3,
                y: 0.4
              },
              {
                x: 0.5,
                y: 0.6
              }
            ]
          }
        ]
      }
    ]
  }
  let cragObject = CreateCragObject(testInput);
  let topoOverlay = CreateTopoOverlay(cragObject, 'tid-1');
  let renderSteps = GetTopoOverlayRenderPoints(topoOverlay);
  expect(renderSteps).toEqual([
    [{type: rsRouteStart, x: 0.1, y: 0.2},{type: rsRouteJoin, x: 0.3, y: 0.4},{type: rsRouteEnd, x: 0.5, y: 0.6}]
  ]);
});

test("When there's two routes with render points", () => {
  let testInput = {
    topos:[
      {
        id: 'tid-1',
        routes: [
          {
            points: [
              {
                x: 0.1,
                y: 0.2
              },
              {
                x: 0.3,
                y: 0.4
              },
              {
                x: 0.5,
                y: 0.6
              }
            ]
          },
          {
            points: [
              {
                x: 0.7,
                y: 0.8
              }
            ]
          }
        ]
      }
    ]
  }
  let cragObject = CreateCragObject(testInput);
  let topoOverlay = CreateTopoOverlay(cragObject, 'tid-1');
  let renderSteps = GetTopoOverlayRenderPoints(topoOverlay);
  expect(renderSteps).toEqual([
    [{type: rsRouteStart, x: 0.1, y: 0.2},{type: rsRouteJoin, x: 0.3, y: 0.4},{type: rsRouteEnd, x: 0.5, y: 0.6}],
    [{type: rsRouteStart, x: 0.7, y: 0.8}]
  ]);
});

test("When there aren't any render lines", () => {
  let testInput1 = {
    topos:[
      {
        id: 'tid-1',
        routes: [
          {
            points: []
          }
        ]
      }
    ]
  }
  let testInput2 = {
    topos:[
      {
        id: 'tid-2',
        routes: [
          {
            points: [
              {
                x: 0.1,
                y: 0.2
              }
            ]
          }
        ]
      }
    ]
  }

  let cragObject1 = CreateCragObject(testInput1);
  let topoOverlay1 = CreateTopoOverlay(cragObject1, 'tid-1');
  let renderLines1 = GetTopoOverlayRenderLines(topoOverlay1);
  expect(renderLines1).toEqual([]);

  let cragObject2 = CreateCragObject(testInput2);
  let topoOverlay2 = CreateTopoOverlay(cragObject2, 'tid-2');
  let renderLines2 = GetTopoOverlayRenderLines(topoOverlay2);
  expect(renderLines2).toEqual([]);
});

test("when there's a single render line", () => {
  let testInput = {
    topos:[
      {
        id: 'tid-1',
        routes: [
          {
            points: [
              {
                x: 0.1,
                y: 0.2
              },
              {
                x: 0.2,
                y: 0.3
              }
            ]
          }
        ]
      }
    ]
  }

  let cragObject = CreateCragObject(testInput);
  let topoOverlay = CreateTopoOverlay(cragObject, 'tid-1');
  let renderLines = GetTopoOverlayRenderLines(topoOverlay);
  expect(renderLines).toEqual([
    [{
      startX: 0.1,
      startY: 0.2,
      endX: 0.2,
      endY: 0.3
    }]
  ]);
});

test("GetTopoOverlayRenderPointsWithDragPoint: test point is moved in render data", () => {
  let crag = CreateCrag();
  let cragRoute = AppendRouteToCrag(crag, 'Gnarly Route', 'E12 7b');
  let topo = CreateCragTopo(crag);
  let route = AddRouteToTopo(topo, cragRoute);
  let point = AppendPointToRoute(route, 0.1, 0.2);
  let dragPoint = { id: point.id, x: 0.8, y: 0.9 };
  let topoOverlay = CreateTopoOverlay(crag, topo.id);
  let renderPoints = GetTopoOverlayRenderPoints(topoOverlay);
  expect(renderPoints).toEqual([
    [{type: rsRouteStart, id: point.id, x: 0.1, y: 0.2}]
  ]);
  let renderPointsAfterDrag = GetTopoOverlayRenderPointsWithDragPoint(topoOverlay, dragPoint);
  expect(renderPointsAfterDrag).toEqual([
    [{type: rsRouteStart, id: point.id, x: 0.8, y: 0.9}]
  ]);
});
