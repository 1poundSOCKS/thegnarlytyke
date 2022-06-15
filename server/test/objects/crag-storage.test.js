const CragStorage = require('../../source/objects/crag-storage.cjs');

test("Parse a crag object to update attached point references", () => {
  const point1 = {id: 'p1', x: 1, y: 2};
  const point2 = {id: 'p2', attachedTo: 'p1'};
  const route = {id: 'r1', points: [point1, point2]};
  const topo = {id: 't1', routes: [route]};
  const crag = {id: 'c1', topos: [topo]};
  const cragLoader = new CragStorage();
  cragLoader.UpdateCragAfterRestore(crag);
  expect(crag.topos[0].routes[0].points).toEqual([point1, {id: 'p2', attachedTo: point1}]);
});

test("Format a crag object with attached points for storage", () => {
  const point1 = {id: 'p1', x: 1, y: 2};
  const point2 = {id: 'p2', attachedTo: point1};
  const route = {id: 'r1', points: [point1, point2]};
  const topo = {id: 't1', routes: [route]};
  const crag = {id: 'c1', topos: [topo]};
  const cragLoader = new CragStorage();
  const cragForStorage = cragLoader.FormatCragForStorage(crag);
  expect(cragForStorage.topos[0].routes[0].points[1].attachedTo).toEqual('p1');
});

test("Format a crag object for storage and ensure all properties included", () => {
  const cragRoute = {id: 'cr1', name: 'Easy Route', grade: 'VDiff'};
  const point = {id: 'p1', x: 1, y: 2};
  const topoRoute = {id: 'tr1', points: [point]};
  const topo = {id: 't1', imageFile: 'image.topo.jpg', routes: [topoRoute]};
  const crag = {id: 'c1', name: 'Crag X', routes: [cragRoute], topos: [topo]};
  const cragLoader = new CragStorage();
  const cragForStorage = cragLoader.FormatCragForStorage(crag);
  expect(cragForStorage).toEqual(crag);
});

test("Format points for storage when there aren't any", () => {
  const topoRoutes = [{id: 'tr1'}];
  const cragStorage = new CragStorage();
  const routesForStorage = cragStorage.FormatTopoRoutesForStorage(topoRoutes);
  expect(routesForStorage).toEqual([{id: 'tr1', points:[]}]);
});

test("Save a crag when the topo has no routes", () => {
  const topo1 = {id:'t1'};
  const crag = {topos:[topo1]};
  const cragStorage = new CragStorage();
  expect(cragStorage.FormatCragForStorage(crag)).toEqual(crag);
});

test("Restore a crag with an empty topo", () => {
  const topo1 = {id:'t1'};
  const crag = {topos:[topo1]};
  const cragStorage = new CragStorage();
  cragStorage.UpdateCragAfterRestore(crag);
  expect(crag).toEqual({topos:[topo1]});
});
