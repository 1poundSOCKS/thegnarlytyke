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
    routes: [{id: 1}],
    topos: [{id: 2}]
  }
  let crag = new Crag();
  crag.Attach(validObject);
  expect(crag.id).toEqual('12345');
  expect(crag.routes).toEqual([{id: 1}]);
  expect(crag.topos).toEqual([{id: 2}]);
});

test("GetTopoIndex: return -1 when no topos", () => {
  let cragObject = {
    id: '12345',
    routes: [],
    topos: []
  }
  let crag = new Crag();
  crag.Attach(cragObject);
  expect(crag.GetTopoIndex(1)).toEqual(-1);
});

test("GetTopoIndex: return -1 when it's the ID doesn't exist", () => {
  let cragObject = {
    id: '12345',
    routes: [],
    topos: [{id: 1}, {id: 2}, {id: 3}]
  }
  let crag = new Crag();
  crag.Attach(cragObject);
  expect(crag.GetTopoIndex(4)).toEqual(-1);
});

test("GetTopoIndex: return 0 when it's the first", () => {
  let cragObject = {
    id: '12345',
    routes: [{}],
    topos: [{id: 1}, {id: 2}, {id: 3}]
  }
  let crag = new Crag();
  crag.Attach(cragObject);
  expect(crag.GetTopoIndex(1)).toEqual(0);
});

test("GetTopoIndex: when supplied ID is the last", () => {
  let cragObject = {
    id: '12345',
    routes: [{}],
    topos: [{id: 1}, {id: 2}, {id: 3}]
  }
  let crag = new Crag();
  crag.Attach(cragObject);
  expect(crag.GetTopoIndex(3)).toEqual(2);
});

test("GetLastTopoIndex: return -1 when there aren't any topos", () => {
  let cragObject = {
    id: '12345',
    routes: [{}],
    topos: []
  }
  let crag = new Crag();
  crag.Attach(cragObject);
  expect(crag.GetLastTopoIndex()).toEqual(-1);
});

test("GetLastTopoIndex: return 0 for 1 topo", () => {
  let cragObject = {
    id: '12345',
    routes: [{}],
    topos: [{id: 1}]
  }
  let crag = new Crag();
  crag.Attach(cragObject);
  expect(crag.GetLastTopoIndex()).toEqual(0);
});

test("GetLastTopoIndex: return 2 for 3 topos", () => {
  let cragObject = {
    id: '12345',
    routes: [{}],
    topos: [{id: 1}, {id: 2}, {id: 3}]
  }
  let crag = new Crag();
  crag.Attach(cragObject);
  expect(crag.GetLastTopoIndex()).toEqual(2);
});
