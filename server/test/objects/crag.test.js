const Crag = require('../../source/objects/crag.cjs');

test("Create new Crag object", () => {
  let crag = new Crag();
  expect(crag.id.length).toBeGreaterThan(0);
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

test("SwapTopos: switch when just 2 topos", () => {
  let cragObject = {
    id: '12345',
    routes: [{}],
    topos: [{id: 1}, {id: 2}]
  }
  let crag = new Crag();
  crag.Attach(cragObject);
  crag.SwapTopos(0, 1);
  expect(crag.topos).toEqual([{id: 2}, {id: 1}])
});

test("SwapTopos: switch when 3 topos", () => {
  let cragObject = {
    id: '12345',
    routes: [{}],
    topos: [{id: 1}, {id: 2}, {id: 3}]
  }
  let crag = new Crag();
  crag.Attach(cragObject);
  crag.SwapTopos(2, 0);
  expect(crag.topos).toEqual([{id: 3}, {id: 2}, {id: 1}])
});

test("GetMatchingTopo: when there aren't any return null", () => {
  let crag = new Crag();
  let topo = crag.GetMatchingTopo('12345');
  expect(topo).toBeNull();
});

test("GetMatchingTopo: when there's a matching topo", () => {
  let crag = new Crag();
  crag.topos.push({id: '123', matchCheck: 'x'});
  crag.topos.push({id: '456', matchCheck: 'y'});
  crag.topos.push({id: '789', matchCheck: 'z'});
  let topo1 = crag.GetMatchingTopo('789');
  expect(topo1.matchCheck).toEqual('z');
  let topo2 = crag.GetMatchingTopo('456');
  expect(topo2.matchCheck).toEqual('y');
  let topo3 = crag.GetMatchingTopo('123');
  expect(topo3.matchCheck).toEqual('x');
});

test("return null when there aren't any matching routes", () => {
  let crag1 = new Crag({id: 'c1'});
  expect(crag1.GetMatchingRoute('r1')).toBeNull();
  let crag2 = new Crag({id: 'c2'});
  expect(crag2.GetMatchingRoute('r1')).toBeNull();
});

test("return a matching route", () => {
  const route1 = {id:'r1',name:'route#1',grade:'vdiff'};
  const route2 = {id:'r2',name:'route#2',grade:'e1'};
  let crag1 = new Crag({id: 'c1',routes:[route1,route2]});
  expect(crag1.GetMatchingRoute('r1')).toEqual(route1);
  expect(crag1.GetMatchingRoute('r2')).toEqual(route2);
});

test("Append a new topo to an empty crag", () => {
  const topo = {id:'t1'};
  const crag = new Crag({id:'c1'});
  expect(crag.AppendTopo(topo)).toEqual(1);
  expect(crag.topos).toEqual([topo]);
});

test("Append a new topo to a crag with topos", () => {
  const topo1 = {id:'t1'};
  const topo2 = {id:'t2'};
  const topo3 = {id:'t3'};
  const crag = new Crag({id:'c1',topos:[topo1,topo2]});
  expect(crag.AppendTopo(topo3)).toEqual(3);
  expect(crag.topos).toEqual([topo1,topo2,topo3]);
});
