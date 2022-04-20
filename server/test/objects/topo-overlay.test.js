const TopoOverlay = require('../../source/objects/topo-overlay.cjs');

test("Create a new TopoOverlay object", () => {
  const overlay = new TopoOverlay();
  expect(overlay.lines).toEqual([]);
  expect(overlay.points).toEqual([]);
});

test("GeneratePointsFromRoute: an empty route", () => {
  const route = {};
  const overlay = new TopoOverlay();
  overlay.GeneratePointsFromRoute(route, 1);
  expect(overlay.points).toEqual([]);
});

test("GeneratePointsFromRoute: a route with 1 point", () => {
  const point1 = {id: 'p1', x: 1, y: 2};
  const route = {points: [point1]};
  const overlay = new TopoOverlay();
  overlay.GeneratePointsFromRoute(route, 1);
  expect(overlay.points).toEqual([
    {routeIndex: 1, type: rsRouteStart, id: 'p1', x: 1, y: 2}
  ]);
});

test("GeneratePointsFromRoute: a route with 2 points", () => {
  const point1 = {id: 'p1', x: 1, y: 2};
  const point2 = {id: 'p2', x: 3, y: 4};
  const route = {points: [point1, point2]};
  const overlay = new TopoOverlay();
  overlay.GeneratePointsFromRoute(route, 1);
  expect(overlay.points).toEqual([
    {routeIndex: 1, type: rsRouteStart, id: 'p1', x: 1, y: 2},
    {routeIndex: 1, type: rsRouteEnd, id: 'p2', x: 3, y: 4}
  ]);
});

test("GeneratePointsFromRoute: a route with 3 points", () => {
  const point1 = {id: 'p1', x: 1, y: 2};
  const point2 = {id: 'p2', x: 3, y: 4};
  const point3 = {id: 'p3', x: 5, y: 6};
  const route = {points: [point1, point2, point3]};
  const overlay = new TopoOverlay();
  overlay.GeneratePointsFromRoute(route, 1);
  expect(overlay.points).toEqual([
    {routeIndex: 1, type: rsRouteStart, id: 'p1', x: 1, y: 2},
    {routeIndex: 1, type: rsRouteJoin, id: 'p2', x: 3, y: 4},
    {routeIndex: 1, type: rsRouteEnd, id: 'p3', x: 5, y: 6}
  ]);
});

test("GeneratePointsFromTopo: from an empty topo", () => {
  const topo = {};
  const overlay = new TopoOverlay();
  overlay.GeneratePointsFromTopo(topo);
  expect(overlay.points).toEqual([]);
});

test("GeneratePointsFromTopo: from a minimal topo", () => {
  const point = {id: 'p1', x: 1, y: 2};
  const route = {points: [point]};
  const topo = {routes:[route]};
  const overlay = new TopoOverlay();
  overlay.GeneratePointsFromTopo(topo);
  expect(overlay.points).toEqual([{routeIndex: 0, type: rsRouteStart, id: 'p1', x: 1, y: 2}]);
});

test("GenerateLinesFromRoute: an empty route", () => {
  const route = {};
  const overlay = new TopoOverlay();
  overlay.GenerateLinesFromRoute(route);
  expect(overlay.lines).toEqual([]);
});

test("GenerateLinesFromRoute: a route with one point generates no lines", () => {
  const point = {id: 'p1', x: 1, y: 2};
  const route = {points: [point]};
  const overlay = new TopoOverlay();
  overlay.GenerateLinesFromRoute(route);
  expect(overlay.lines).toEqual([]);
});

test("GenerateLinesFromRoute: a route with two point generates one line", () => {
  const point1 = {id: 'p1', x: 1, y: 2};
  const point2 = {id: 'p2', x: 3, y: 4};
  const route = {points: [point1, point2]};
  const overlay = new TopoOverlay();
  overlay.GenerateLinesFromRoute(route);
  expect(overlay.lines).toEqual([
    {startID: 'p1', startX: 1, startY: 2, endID: 'p2', endX: 3, endY: 4}
  ]);
});

test("GenerateLinesFromRoute: a route with three points generates two lines", () => {
  const point1 = {id: 'p1', x: 1, y: 2};
  const point2 = {id: 'p2', x: 3, y: 4};
  const point3 = {id: 'p3', x: 5, y: 6};
  const route = {points: [point1, point2, point3]};
  const overlay = new TopoOverlay();
  overlay.GenerateLinesFromRoute(route);
  expect(overlay.lines).toEqual([
    {startID: 'p1', startX: 1, startY: 2, endID: 'p2', endX: 3, endY: 4},
    {startID: 'p2', startX: 3, startY: 4, endID: 'p3', endX: 5, endY: 6}
  ]);
});

test("GenerateFromTopo: from an empty topo", () => {
  const topo = {};
  const overlay = new TopoOverlay();
  overlay.GenerateFromTopo(topo);
  expect(overlay.lines).toEqual([]);
  expect(overlay.points).toEqual([]);
});

test("GenerateFromTopo: from a minimal topo", () => {
  const point1 = {id: 'p1', x: 1, y: 2};
  const point2 = {id: 'p2', x: 3, y: 4};
  const route = {points: [point1, point2]};
  const topo = {routes:[route]};
  const overlay = new TopoOverlay();
  overlay.GenerateFromTopo(topo);
  expect(overlay.lines).toEqual([
    {startID: 'p1', startX: 1, startY: 2, endID: 'p2', endX: 3, endY: 4}
  ]);
  expect(overlay.points).toEqual([
    {routeIndex: 0, type: rsRouteStart, id: 'p1', x: 1, y: 2},
    {routeIndex: 0, type: rsRouteEnd, id: 'p2', x: 3, y: 4}
  ]);
});

test("UpdatePoints: when there are no points", () => {
  const topo = {};
  const overlay = new TopoOverlay();
  overlay.GenerateFromTopo(topo);
  overlay.UpdatePoints('p1', 1, 2);
  expect(overlay.lines).toEqual([]);
  expect(overlay.points).toEqual([]);
});

test("UpdatePoints: update the first point", () => {
  const point1 = {id: 'p1', x: 1, y: 2};
  const point2 = {id: 'p2', x: 3, y: 4};
  const point3 = {id: 'p3', x: 5, y: 6};
  const route = {points: [point1, point2, point3]};
  const topo = {routes:[route]};
  const overlay = new TopoOverlay();
  overlay.GenerateFromTopo(topo);
  overlay.UpdatePoints('p1', 7, 8);
  expect(overlay.lines).toEqual([
    {startID: 'p1', startX: 7, startY: 8, endID: 'p2', endX: 3, endY: 4},
    {startID: 'p2', startX: 3, startY: 4, endID: 'p3', endX: 5, endY: 6}
  ]);
  expect(overlay.points).toEqual([
    {routeIndex: 0, type: rsRouteStart, id: 'p1', x: 7, y: 8},
    {routeIndex: 0, type: rsRouteJoin, id: 'p2', x: 3, y: 4},
    {routeIndex: 0, type: rsRouteEnd, id: 'p3', x: 5, y: 6},
  ]);
});

test("UpdatePoints: update the last point", () => {
  const point1 = {id: 'p1', x: 1, y: 2};
  const point2 = {id: 'p2', x: 3, y: 4};
  const point3 = {id: 'p3', x: 5, y: 6};
  const route = {points: [point1, point2, point3]};
  const topo = {routes:[route]};
  const overlay = new TopoOverlay();
  overlay.GenerateFromTopo(topo);
  overlay.UpdatePoints('p3', 7, 8);
  expect(overlay.lines).toEqual([
    {startID: 'p1', startX: 1, startY: 2, endID: 'p2', endX: 3, endY: 4},
    {startID: 'p2', startX: 3, startY: 4, endID: 'p3', endX: 7, endY: 8}
  ]);
  expect(overlay.points).toEqual([
    {routeIndex: 0, type: rsRouteStart, id: 'p1', x: 1, y: 2},
    {routeIndex: 0, type: rsRouteJoin, id: 'p2', x: 3, y: 4},
    {routeIndex: 0, type: rsRouteEnd, id: 'p3', x: 7, y: 8},
  ]);
});

test("UpdatePoints: update the middle point of three", () => {
  const point1 = {id: 'p1', x: 1, y: 2};
  const point2 = {id: 'p2', x: 3, y: 4};
  const point3 = {id: 'p3', x: 5, y: 6};
  const route = {points: [point1, point2, point3]};
  const topo = {routes:[route]};
  const overlay = new TopoOverlay();
  overlay.GenerateFromTopo(topo);
  overlay.UpdatePoints('p2', 7, 8);
  expect(overlay.lines).toEqual([
    {startID: 'p1', startX: 1, startY: 2, endID: 'p2', endX: 7, endY: 8},
    {startID: 'p2', startX: 7, startY: 8, endID: 'p3', endX: 5, endY: 6}
  ]);
  expect(overlay.points).toEqual([
    {routeIndex: 0, type: rsRouteStart, id: 'p1', x: 1, y: 2},
    {routeIndex: 0, type: rsRouteJoin, id: 'p2', x: 7, y: 8},
    {routeIndex: 0, type: rsRouteEnd, id: 'p3', x: 5, y: 6},
  ]);
});
