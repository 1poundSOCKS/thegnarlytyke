const Point = require('../../source/objects/point.cjs');

test("Create a new point", () => {
  const testObject = {id: 'p1', x: 1, y: 2};
  const point = new Point(testObject);
});

test("AttachTo: attach one point to another", () => {
  const attachSource = {id: 'p1', x: 1, y: 2};
  const attachDest = {id: 'p2', x: 3, y: 4};
  const point = new Point(attachSource);
  point.AttachTo(attachDest);
  expect(attachSource).toEqual({id: 'p1', attachedTo: attachDest});
});
