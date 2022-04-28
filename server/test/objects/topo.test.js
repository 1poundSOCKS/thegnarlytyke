const Crag = require('../../source/objects/crag.cjs');
const Route = require('../../source/objects/route.cjs');
const Topo = require('../../source/objects/topo.cjs');

test("GetRoute: empty topo returns null", () => {
  const topo = new Topo({});
  expect(topo.GetRoute('r1')).toBeNull();
});

test("GetRoute: return the only route", () => {
  const route = {id: 'r1'};
  const topo = new Topo({routes: [route]});
  expect(topo.GetRoute('r1')).toEqual({id: 'r1'});
});

test("GetRoute: return the last route", () => {
  const route1 = {id: 'r1'};
  const route2 = {id: 'r2'};
  const route3 = {id: 'r3'};
  const topo = new Topo({routes: [route1, route2, route3]});
  expect(topo.GetRoute('r3')).toEqual({id: 'r3'});
});

test("GetRoute: return the middle route", () => {
  const route1 = {id: 'r1'};
  const route2 = {id: 'r2'};
  const route3 = {id: 'r3'};
  const topo = new Topo({routes: [route1, route2, route3]});
  expect(topo.GetRoute('r2')).toEqual({id: 'r2'});
});

test("GetNearestPointWithin: empty topo returns null", () => {
  const topo = new Topo({});
  expect(topo.GetNearestPointWithin(1, 2, 1000)).toBeNull();
});

test("GetNearestPointWithin: a single point that is just within range", () => {
  const point = {id: 'p1', x: 1, y: 2};
  const route = {id: 'r1', points: [point]};
  const topo = new Topo({routes: [route]});
  expect(topo.GetNearestPointWithin(1, 4, 2)).toEqual({parent: route, id: 'p1', x: 1, y: 2});
});

test("GetNearestPointWithin: a single point that is within range and an attached point on the next route", () => {
  const point = {id: 'p1', x: 1, y: 2};
  const attachedPoint = {id: 'p2', attachedTo: point};
  const route1 = {id: 'r1', points: [point]};
  const route2 = {id: 'r2', points: [attachedPoint]};
  const topo = new Topo({routes: [route1, route2]});
  expect(topo.GetNearestPointWithin(1, 2, 2)).toEqual({parent: route1, id: 'p1', x: 1, y: 2});
});

test("GetNearestPointWithin: a single point that is within range and an attached point on the previous route", () => {
  const point = {id: 'p1', x: 1, y: 2};
  const attachedPoint = {id: 'p2', attachedTo: point};
  const route1 = {id: 'r1', points: [attachedPoint]};
  const route2 = {id: 'r2', points: [point]};
  const topo = new Topo({routes: [route1, route2]});
  expect(topo.GetNearestPointWithin(1, 2, 2)).toEqual({parent: route2, id: 'p1', x: 1, y: 2});
});

test("GetNearestPointWithin: a single point that is just out of range", () => {
  const point = {id: 'p1', x: 2, y: 1};
  const route = {id: 'r1', points: [point]};
  const topo = new Topo({routes: [route]});
  expect(topo.GetNearestPointWithin(5, 1, 2.99)).toBeNull();
});

test("GetNextNearestPointWithin: empty topo returns null", () => {
  const topo = new Topo({});
  expect(topo.GetNextNearestPointWithin(1, 2, 1000)).toBeNull();
});

test("GetNextNearestPointWithin: a single point that is just within range and not excluded", () => {
  const point = {id: 'p1', x: 1, y: 2};
  const route = {id: 'r1', points: [point]};
  const topo = new Topo({routes: [route]});
  expect(topo.GetNextNearestPointWithin(1, 4, 2, 'p2')).toEqual({parent: route, id: 'p1', x: 1, y: 2});
});

test("GetNextNearestPointWithin: a single point that is just within range and is excluded", () => {
  const point = {id: 'p1', x: 1, y: 2};
  const route = {id: 'r1', points: [point]};
  const topo = new Topo({routes: [route]});
  expect(topo.GetNextNearestPointWithin(1, 4, 2, 'p1')).toBeNull();
});

test("GetNextNearestPointWithin: nearest point is excluded, so return the next point", () => {
  const point1 = {id: 'p1', x: 1, y: 2};
  const point2 = {id: 'p2', x: 3, y: 4};
  const route = {id: 'r1', points: [point1, point2]};
  const topo = new Topo({routes: [route]});
  expect(topo.GetNextNearestPointWithin(1, 2, 5, 'p1')).toEqual({parent: route, id: 'p2', x: 3, y: 4});
});

test("Get routes left to right when there aren't any routes", () => {
  const topo1 = new Topo({id:'t1'});
  expect(topo1.GetSortedRoutes()).toEqual([]);
  const topo2 = new Topo({id:'t2', routes:[]});
  expect(topo2.GetSortedRoutes()).toEqual([]);
});

test("Get routes left to right when there aren't any routes with points", () => {
  const route1 = {id:'r1'};
  const topo1 = new Topo({id:'t1',routes:[route1]});
  expect(topo1.GetSortedRoutes()).toEqual([route1]);
  const route2 = {id:'r1',points:[]};
  const topo2 = new Topo({id:'t2',routes:[route1,route2]});
  expect(topo2.GetSortedRoutes()).toEqual([route1,route2]);
});

test("Get routes left to right when there's one with a point and one without", () => {
  const route1 = {id:'r1', points:[]};
  const route2 = {id:'r2', points:[{id:'p2',x:1,y:2}]};
  const topo1 = new Topo({id:'t1',routes:[route1,route2]});
  expect(topo1.GetSortedRoutes()).toEqual([route2,route1]);
});

test("Get routes left to right when two routes with different start points", () => {
  const route1 = {id:'r1', points:[{id:'p1',x:3,y:4}]};
  const route2 = {id:'r2', points:[{id:'p2',x:1,y:2}]};
  const topo1 = new Topo({id:'t1',routes:[route1,route2]});
  expect(topo1.GetSortedRoutes()).toEqual([route2,route1]);
});

test("Routes with a shared start are sorted on end point x-axis position", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:5,y:2};
  const point3 = {id:'p3',attachedTo:point1};
  const point4 = {id:'p4',x:3,y:4};
  const route1 = {id:'r1', points:[point1,point2]};
  const route2 = {id:'r2', points:[point3,point4]};
  const topo1 = new Topo({id:'t1',routes:[route1,route2]});
  expect(topo1.GetSortedRoutes()).toEqual([route2,route1]);
});

test("Routes that branch after the start, but have a shared start, are sorted on end point x-axis position", () => {
  const point1 = {id:'p1',x:3,y:1};
  const point2 = {id:'p2',x:4,y:2};
  const point3 = {id:'p3',x:2,y:3};
  const route1 = {id:'r1', points:[point1,point2,point3]};
  const point4 = {id:'p4',attachedTo:point2};
  const point5 = {id: 'p5',x:1,y:3};
  const route2 = {id:'r2', points:[point4,point5]};
  const topo1 = new Topo({id:'t1',routes:[route1,route2]});
  expect(topo1.GetSortedRoutes()).toEqual([route2,route1]);
});

test("Routes info is sorted left to right", () => {
  const routeInfo1 = {id:'r1',name:'route#1',grade:'vdiff'};
  const routeInfo2 = {id:'r2',name:'route#2',grade:'severe'};
  const route1 = {id:'r1',points:[{id:'p1',x:3,y:4}],info:routeInfo1};
  const route2 = {id:'r2',points:[{id:'p2',x:1,y:2}],info:routeInfo2};
  const topo = new Topo({id:'t1',routes:[route1,route2]});
  expect(topo.GetSortedRouteInfo()).toEqual([routeInfo2,routeInfo1]);
});
