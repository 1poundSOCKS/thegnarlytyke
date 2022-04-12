const Crag = require('../../source/new/crag.cjs');

test("Create new Crag object", () => {
  let crag = new Crag();
  expect(crag.id).toBeNull();
  expect(crag.routes).toEqual([]);
  expect(crag.topos).toEqual([]);
});

test("Attach a minimal valid object to a Crag object", () => {
  let validObject = {
    id: '12345',
    routes: [{}],
    topos: [{}]
  }
  let crag = new Crag();
  crag.Attach(validObject);
  expect(crag.id).toEqual('12345');
  expect(crag.routes).toEqual([{}]);
  expect(crag.topos).toEqual([{}]);
});
