require('../source/crag_object.js');

test('Create an empty crag object and check it has no routes or topos', () => {
  let cragObject = CreateCragObject();
  let cragRoutes = GetCragRoutes(cragObject);
  expect(cragRoutes.length).toEqual(0);
  let cragTopoIDs = GetCragTopoIDs(cragObject);
  expect(cragTopoIDs.length).toEqual(0);
});

test('Create a crag object from an existing empty parsed object and check it has no routes or topos', () => {
  let cragObject = CreateCragObject(JSON.parse('{}'));
  let cragRoutes = GetCragRoutes(cragObject);
  expect(cragRoutes.length).toEqual(0);
  let cragTopoIDs = GetCragTopoIDs(cragObject);
  expect(cragTopoIDs.length).toEqual(0);
});

test('Create a crag object with no topos and get the topos IDs', () => {
  let cragObject = CreateCragObject({});
  let cragTopoIDs = GetCragTopoIDs(cragObject);

  expect(cragTopoIDs.length).toEqual(0);
});

test('Create a crag object with multiple topos and get the IDs', () => {
  let testInput = { topos: [{ id: '111-aaa' }, { id: '222-bbb' }, { id: '333-ccc' }]};
  let cragObject = CreateCragObject(testInput);
  let cragTopoIDs = GetCragTopoIDs(cragObject);
  expect(cragTopoIDs.length).toEqual(3);
  expect(cragTopoIDs[0]).toEqual('111-aaa');
  expect(cragTopoIDs[1]).toEqual('222-bbb');
  expect(cragTopoIDs[2]).toEqual('333-ccc');
});

test('Create a crag object with multiple topos and get the topos IDs', () => {
  let testInput = { topos: [{ id: '111-aaa' }, { id: '222-bbb' }, { id: '333-ccc' }]};
  let expectedTestOutput = ['111-aaa', '222-bbb', '333-ccc'];

  let cragObject = CreateCragObject(testInput);
  let testOutput = GetCragTopoIDs(cragObject);

  expect(testOutput).toEqual(expectedTestOutput);
});

test('Create a crag object with three topos and get the image filename of the first, middle and last topo', () => {
  let testInput = { topos: [{ id: '111-aaa', imageFile: '111-aaa.topo.jpg' }, { id: '222-bbb' }, { id: '333-ccc', imageFile: '333-ccc.topo.jpg' }]};
  let expectedTestOutput = ['111-aaa.topo.jpg', null, '333-ccc.topo.jpg'];

  let cragObject = CreateCragObject(testInput);
  console.log(cragObject);
  let testOutput = [GetTopoImageFilename(cragObject, '111-aaa'), GetTopoImageFilename(cragObject, '222-bbb'), GetTopoImageFilename(cragObject, '333-ccc')];

  expect(testOutput).toEqual(expectedTestOutput);
});

test('Add a route to an empty crag', () => {
  let expectedOutputObject = {id: '111-aaa', name: 'Nails Route', grade: 'E11 7b'};
  let expectedOutputArray = [expectedOutputObject];

  let cragObject = CreateCragObject();
  SetUUIDGenFunction(cragObject, () => { return '111-aaa' });

  let cragRoute = AppendRouteToCrag(cragObject, "Nails Route", "E11 7b");
  expect(cragRoute).toEqual(expectedOutputObject);

  let cragRoutes = GetCragRoutes(cragObject);
  expect(cragRoutes.length).toEqual(1);
  expect(cragRoutes).toEqual(expectedOutputArray);
});
