const Topo = require('../../source/objects/topo.cjs');

test("create a new topo", () => {
  const topo  = new Topo();
  expect(topo.topo.id.length).toBeGreaterThan(0);
});

test("empty topo returns null for a matching route", () => {
  const topo = new Topo({});
  expect(topo.GetMatchingRoute('r1')).toBeNull();
});

test("return the only matching route", () => {
  const route = {id: 'r1'};
  const topo = new Topo({routes: [route]});
  expect(topo.GetMatchingRoute('r1')).toEqual({id: 'r1'});
});

test("return the last matching route", () => {
  const route1 = {id: 'r1'};
  const route2 = {id: 'r2'};
  const route3 = {id: 'r3'};
  const topo = new Topo({routes: [route1, route2, route3]});
  expect(topo.GetMatchingRoute('r3')).toEqual({id: 'r3'});
});

test("return the middle matching route", () => {
  const route1 = {id: 'r1'};
  const route2 = {id: 'r2'};
  const route3 = {id: 'r3'};
  const topo = new Topo({routes: [route1, route2, route3]});
  expect(topo.GetMatchingRoute('r2')).toEqual({id: 'r2'});
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

test("The route start and end point is null when there aren't any", () => {
  const route1 = {id:'r1'};
  const topo1 = new Topo({id:'t1',routes:[route1]});
  expect(topo1.GetRouteStartPoint(route1)).toBeNull();
  expect(topo1.GetRouteEndPoint(route1)).toBeNull();
  const route2 = {id:'r1',points:[]};
  const topo2 = new Topo({id:'t1',routes:[route1]});
  expect(topo2.GetRouteStartPoint(route2)).toBeNull();
  expect(topo2.GetRouteEndPoint(route2)).toBeNull();
});

test("The route start point when it's attached to another route with one point", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',attachedTo:point1};
  const route1 = {id:'r1',points:[point1]};
  const route2 = {id:'r2',points:[point2]};
  const topo1 = new Topo({id:'t1',routes:[route1,route2]});
  const startPoint = topo1.GetRouteStartPoint(route2);
  expect(startPoint).toEqual(point1);
});

test("The route start point when it's attached to the end of another", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const point3 = {id:'p3',attachedTo:point2};
  const point4 = {id:'p4',x:5,y:6};
  const route1 = {id:'r1',points:[point1,point2]};
  const route2 = {id:'r2',points:[point3,point4]};
  const topo1 = new Topo({id:'t1',routes:[route1,route2]});
  const startPoint = topo1.GetRouteStartPoint(route2);
  expect(startPoint).toEqual(point1);
});

test("The route start point when it's attached to the start of another", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const point3 = {id:'p3',attachedTo:point1};
  const point4 = {id:'p4',x:5,y:6};
  const route1 = {id:'r1',points:[point1,point2]};
  const route2 = {id:'r2',points:[point3,point4]};
  const topo1 = new Topo({id:'t1',routes:[route1,route2]});
  const startPoint = topo1.GetRouteStartPoint(route2);
  expect(startPoint).toEqual(point1);
});

test("The route start point when it's attached to a route is then attached to a third", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const point3 = {id:'p3',attachedTo:point1};
  const point4 = {id:'p4',x:5,y:6};
  const point5 = {id:'p5',attachedTo:point4};
  const point6 = {id:'p6',x:7,y:8};
  const route1 = {id:'r1',points:[point1,point2]};
  const route2 = {id:'r2',points:[point3,point4]};
  const route3 = {id:'r3',points:[point5,point6]};
  const topo1 = new Topo({id:'t1',routes:[route1,route2,route3]});
  expect(topo1.GetRouteStartPoint(route3)).toEqual(point1);
  const topo2 = new Topo({id:'t2',routes:[route3,route2,route1]});
  expect(topo2.GetRouteStartPoint(route3)).toEqual(point1);
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

test("Routes that share a finish are sorted on the start point x-axis position", () => {
  const point1 = {id:'p1',x:3,y:1};
  const point2 = {id:'p2',x:4,y:2};
  const point3 = {id:'p3',x:2,y:3};
  const route1 = {id:'r1', points:[point1,point2,point3]};
  const point4 = {id:'p4',x:1,y:6};
  const point5 = {id: 'p5',attachedTo:point3};
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

test("append a new route to an empty topo", () => {
  const routeInfo1 = {id:'r1',name:'route#1',grade:'vdiff'};
  const topo = new Topo({id:'t1'});
  topo.AppendRoute(routeInfo1);
  expect(topo.GetMatchingRoute('r1')).toEqual({id:'r1',info:routeInfo1});
});

test("remove a route that doesn't exist", () => {
  const route1 = {id:'r1'};
  const topoData1 = {id:'t1',routes:[route1]};
  const topo1 = new Topo(topoData1);
  topo1.RemoveMatchingRoute('r2');
  expect(topoData1).toEqual({id:'t1',routes:[route1]});
});

test("remove a route that does exist", () => {
  const route1 = {id:'r1'};
  const route2 = {id:'r2'};
  const topoData1 = {id:'t1',routes:[route1,route2]};
  const topo1 = new Topo(topoData1);
  topo1.RemoveMatchingRoute('r2');
  expect(topoData1).toEqual({id:'t1',routes:[route1]});
});

test("get the route lines when there aren't any", () => {
  const topo1 = new Topo({id:'t1'});
  expect(topo1.GetRouteLines()).toEqual([]);

  const topo2 = new Topo({id:'t2',routes:[]});
  expect(topo2.GetRouteLines()).toEqual([]);

  const point1 = {id:'p1',x:1,y:2};
  const route1 = {id:'r1'};
  const route2 = {id:'r1',points:[]};
  const route3 = {id:'r3',points:[point1]};
  const topo3 = new Topo({id:'t3',routes:[route1,route2,route3]});
  expect(topo3.GetRouteLines()).toEqual([]);
});

test("topo has 1 route line when there's 1 route with 2 points", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const route1 = {id:'r1',points:[point1,point2]};
  const topo1 = new Topo({id:'t1',routes:[route1]});
  expect(topo1.GetRouteLines()).toEqual([{startPoint:point1,endPoint:point2}]);
});

test("topo has 2 routes lines when there's more 1 route with 3 points", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const point3 = {id:'p3',x:5,y:6};
  const route1 = {id:'r1',points:[point1,point2,point3]};
  const topo1 = new Topo({id:'t1',routes:[route1]});
  expect(topo1.GetRouteLines()).toEqual([
    {startPoint:point1,endPoint:point2},
    {startPoint:point2,endPoint:point3}
  ]);
});

test("topo has 2 route lines when there's 2 routes with 2 points each", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const route1 = {id:'r1',points:[point1,point2]};
  const point3 = {id:'p3',x:5,y:6};
  const point4 = {id:'p4',x:7,y:8};
  const route2 = {id:'r2',points:[point3,point4]};
  const topo1 = new Topo({id:'t1',routes:[route1,route2]});
  expect(topo1.GetRouteLines()).toEqual([
    {startPoint:point1,endPoint:point2},
    {startPoint:point3,endPoint:point4}
  ]);
});

test("attached points are resolved for route lines", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const point3 = {id:'p3',attachedTo:point1};
  const point4 = {id:'p4',attachedTo:point2};
  const route1 = {id:'r1',points:[point3,point4]};
  const topo1 = new Topo({id:'t1',routes:[route1]});
  expect(topo1.GetRouteLines()).toEqual([{startPoint:point1,endPoint:point2}]);
});

test("no routes starts returned when there are no points", () => {
  const topo1 = new Topo({id:'t1'});
  expect(topo1.GetSortedRouteStartPoints()).toEqual([]);

  const topo2 = new Topo({id:'t2',routes:[]});
  expect(topo2.GetSortedRouteStartPoints()).toEqual([]);
});

test("one route start returned when there's one route with one point", () => {
  const point1 = {id:'p1',x:1,y:2};
  const route1 = {id:'r1',points:[point1]};
  const topo1 = new Topo({id:'t1',routes:[route1]});
  expect(topo1.GetSortedRouteStartPoints()).toEqual([point1]);
});

test("one route start returned when there's one route with two points", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const route1 = {id:'r1',points:[point1,point2]};
  const topo1 = new Topo({id:'t1',routes:[route1]});
  expect(topo1.GetSortedRouteStartPoints()).toEqual([point1]);
});

test("one route start returned when there's one route with one point and one without", () => {
  const route1 = {id:'r1',points:[]};
  const point1 = {id:'p1',x:1,y:2};
  const route2 = {id:'r2',points:[point1]};
  const topo1 = new Topo({id:'t1',routes:[route1,route2]});
  expect(topo1.GetSortedRouteStartPoints()).toEqual([point1]);
});

test("two route starts returned in the left to right route order when they're out of order", () => {
  const point1 = {id:'p1',x:3,y:4};
  const route1 = {id:'r1',points:[point1]};
  const point2 = {id:'p2',x:1,y:2};
  const route2 = {id:'r2',points:[point2]};
  const topo1 = new Topo({id:'t1',routes:[route1,route2]});
  expect(topo1.GetSortedRouteStartPoints()).toEqual([point2,point1]);
});

test("route starts are the same when routes share same start point", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const route1 = {id:'r1',points:[point1,point2]};
  const point3 = {id:'p2',attachedTo:point2};
  const route2 = {id:'r2',points:[point3]};
  const topo1 = new Topo({id:'t1',routes:[route1,route2]});
  expect(topo1.GetSortedRouteStartPoints()).toEqual([point1,point1]);
});

test("no routes ends returned when there are no points", () => {
  const topo1 = new Topo({id:'t1'});
  expect(topo1.GetSortedRouteEndPoints()).toEqual([]);

  const topo2 = new Topo({id:'t2',routes:[]});
  expect(topo2.GetSortedRouteEndPoints()).toEqual([]);
});

test("no route ends returned when there's one route with one point", () => {
  const point1 = {id:'p1',x:1,y:2};
  const route1 = {id:'r1',points:[point1]};
  const topo1 = new Topo({id:'t1',routes:[route1]});
  expect(topo1.GetSortedRouteEndPoints()).toEqual([]);
});

test("one route end returned when there's one route with two points", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const route1 = {id:'r1',points:[point1,point2]};
  const topo1 = new Topo({id:'t1',routes:[route1]});
  expect(topo1.GetSortedRouteEndPoints()).toEqual([point2]);
});

test("two route ends returned in the left to right route order when they're out of order", () => {
  const point1 = {id:'p1',x:5,y:6};
  const point2 = {id:'p2',x:7,y:8};
  const route1 = {id:'r1',points:[point1,point2]};
  const point3 = {id:'p3',x:1,y:2};
  const point4 = {id:'p4',x:3,y:4};
  const route2 = {id:'r2',points:[point3,point4]};
  const topo1 = new Topo({id:'t1',routes:[route1,route2]});
  expect(topo1.GetSortedRouteEndPoints()).toEqual([point4,point2]);
});

test("two route ends returned when the routes share a start point", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const route1 = {id:'r1',points:[point1,point2]};
  const point3 = {id:'p3',attachedTo:point1};
  const point4 = {id:'p4',x:5,y:6};
  const route2 = {id:'r2',points:[point3,point4]};
  const topo1 = new Topo({id:'t1',routes:[route1,route2]});
  expect(topo1.GetSortedRouteEndPoints()).toEqual([point2,point4]);
});

test("two route ends returned left to right when the routes share a start point and the ends are not left to right", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:5,y:6};
  const route1 = {id:'r1',points:[point1,point2]};
  const point3 = {id:'p3',attachedTo:point1};
  const point4 = {id:'p4',x:3,y:4};
  const route2 = {id:'r2',points:[point3,point4]};
  const topo1 = new Topo({id:'t1',routes:[route1,route2]});
  expect(topo1.GetSortedRouteEndPoints()).toEqual([point4,point2]);
});

test("Get a route containing a point when it has no points", () => {
  const point1 = {id:'p1'};
  const route1 = {id:'r1'};
  const topo1 = new Topo({id:'t1',routes:[route1]});
  expect(topo1.GetRouteContainingPoint(point1)).toBeNull();
});
