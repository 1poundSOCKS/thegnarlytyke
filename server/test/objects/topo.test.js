const Topo = require('../../source/objects/topo.cjs');

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
