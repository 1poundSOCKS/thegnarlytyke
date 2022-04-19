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
  expect(topo.GetNearestPointWithin(1000)).toBeNull();
});

test("GetNearestPointWithin: a single point that is just within range", () => {
  const point = {id: 'p1', x: 1, y: 2};
  const route = {id: 'r1', points: [point]};
  const topo = new Topo({routes: [route]});
  expect(topo.GetNearestPointWithin(1, 4, 2)).toEqual({id: 'p1', x: 1, y: 2});
});

test("GetNearestPointWithin: a single point that is just out of range", () => {
  const point = {id: 'p1', x: 2, y: 1};
  const route = {id: 'r1', points: [point]};
  const topo = new Topo({routes: [route]});
  expect(topo.GetNearestPointWithin(5, 1, 2.99)).toBeNull();
});
