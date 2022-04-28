const Route = require('../../source/objects/route.cjs');

test("AppendPoint: append the first point", () => {
  const routeData = {id: 'r1'}
  const route = new Route(routeData);
  const point = route.AppendPoint(1, 2);
  expect(point.id.length).toBeGreaterThan(0);
  expect(point.x).toEqual(1);
  expect(point.y).toEqual(2);
  expect(routeData.points).toEqual([point]);
});

test("AppendPoint: append two points", () => {
  const routeData = {id: 'r1'}
  const route = new Route(routeData);
  const point1 = route.AppendPoint(1, 2);
  const point2 = route.AppendPoint(3, 4);
  expect(point2.id.length).toBeGreaterThan(0);
  expect(point2.x).toEqual(3);
  expect(point2.y).toEqual(4);
  expect(routeData.points).toEqual([point1, point2]);
});

test("Resolve points when there are none", () => {
  const route1 = new Route({id:'r1'});
  expect(route1.GetResolvedPoints()).toEqual([]);
  const route2 = new Route({id:'r1',points:[]});
  expect(route2.GetResolvedPoints()).toEqual([]);
});

test("Resolve points when non are attached", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const point3 = {id:'p2',x:5,y:6};
  const route1 = new Route({id:'r1',points:[point1,point2,point3]});
  expect(route1.GetResolvedPoints()).toEqual([point1,point2,point3]);
});

test("Resolve points when one is attached", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const point3 = {id:'p2',attachedTo:point2};
  const route1 = new Route({id:'r1',points:[point1,point3]});
  expect(route1.GetResolvedPoints()).toEqual([point1,point2]);
});

test("First route is left of the second route when the second route has no points", () => {
  const point1 = {id:'p1',x:1,y:2};
  const route1 = new Route({id:'r1',points:[point1]});
  const route2 = {id:'r2'};
  expect(route1.CalculateSortOrder(route2)).toEqual(-1);
});

test("First route is right of the second route when the first route has no points", () => {
  const route1 = new Route({id:'r1'});
  const point1 = {id:'p1',x:1,y:2};
  const route2 = {id:'r2',points:[point1]};
  expect(route1.CalculateSortOrder(route2)).toEqual(1);
});

test("First route is left of the second route when the route starts left of the second route", () => {
  const point1 = {id:'p1',x:1,y:2};
  const route1 = new Route({id:'r1',points:[point1]});
  const point2 = {id:'p2',x:3,y:4};
  const route2 = {id:'r2',points:[point2]};
  expect(route1.CalculateSortOrder(route2)).toEqual(-1);
});

test("First route is right of the second route when the route starts right of the second route", () => {
  const point1 = {id:'p1',x:3,y:4};
  const route1 = new Route({id:'r1',points:[point1]});
  const point2 = {id:'p2',x:1,y:2};
  const route2 = {id:'r2',points:[point2]};
  expect(route1.CalculateSortOrder(route2)).toEqual(1);
});

test("First route is left of the second route when it starts in the same place and ends left of it", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const route1 = new Route({id:'r1',points:[point1,point2]});
  const point3 = {id:'p3',attachedTo:point1};
  const point4 = {id:'p4',x:4,y:5};
  const route2 = {id:'r2',points:[point3,point4]};
  expect(route1.CalculateSortOrder(route2)).toEqual(-1);
});

test("First route is right of the second route when it starts in the same place and ends right of it", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:4,y:5};
  const route1 = new Route({id:'r1',points:[point1,point2]});
  const point3 = {id:'p3',attachedTo:point1};
  const point4 = {id:'p4',x:3,y:4};
  const route2 = {id:'r2',points:[point3,point4]};
  expect(route1.CalculateSortOrder(route2)).toEqual(1);
});

test("Order is preserved when both routes are start and end in the same place", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const route1 = new Route({id:'r1',points:[point1,point2]});
  const route2 = {id:'r2',points:[point1,point2]};
  expect(route1.CalculateSortOrder(route2)).toEqual(0);
});

test("Routes should be swapped when they share a start but the second route finished left of the first", () => {
  const point1 = {id:'p1',x:3,y:1};
  const point2 = {id:'p2',x:4,y:2};
  const point3 = {id:'p3',x:2,y:3};
  const route1 = new Route({id:'r1', points:[point1,point2,point3]});
  const point4 = {id:'p4',attachedTo:point2};
  const point5 = {id: 'p5',x:1,y:3};
  const route2 = {id:'r2', points:[point4,point5]};
  expect(route1.CalculateSortOrder(route2)).toEqual(1);
});
