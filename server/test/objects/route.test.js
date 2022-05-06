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

test("No join points returned when there are 2 points or less", () => {
  const route1 = new Route({id:'r1'});
  expect(route1.GetJoinPoints()).toEqual([]);
  const route2 = new Route({id:'r2',points:[]});
  expect(route2.GetJoinPoints()).toEqual([]);
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p1',x:1,y:2};
  const route3 = new Route({id:'r3',points:[point1,point2]});
  expect(route3.GetJoinPoints()).toEqual([]);
});

test("No join points when the only points excluding the start and end are attached", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const point3 = {id:'p3',attachedTo:point1};
  const point4 = {id:'p4',x:5,y:6};
  const route1 = new Route({id:'r3',points:[point2,point3,point4]});
  expect(route1.GetJoinPoints()).toEqual([]);
});

test("Valid join points returned", () => {
  const point1 = {id:'p1',x:1,y:2};
  const point2 = {id:'p2',x:3,y:4};
  const point3 = {id:'p3',attachedTo:point1};
  const point4 = {id:'p4',x:5,y:6};
  const point5 = {id:'p5',x:7,y:8};
  const route1 = new Route({id:'r1',points:[point1,point2,point3,point4,point5]});
  expect(route1.GetJoinPoints()).toEqual([point2,point4]);
});
