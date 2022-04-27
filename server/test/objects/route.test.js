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
