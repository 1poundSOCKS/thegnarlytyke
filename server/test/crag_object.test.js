require('../source/crag_object.js');

test('Create an empty crag object and check it has no routes', () => {
  let cragObject = CreateCragObject();
  let cragRoutes = GetCragRoutesAsArray(cragObject);
  expect(cragRoutes.length).toEqual(0);
});

test('Load from empty string and check it has no routes', () => {
  let cragObject = LoadCragObjectFromJSON('');
  let cragRoutes = GetCragRoutesAsArray(cragObject);
  expect(cragRoutes.length).toEqual(0);
});

test('Load from JSON with a single route', () => {
  let input = `{
    "routes": [
      {
        "id": "111-aaa",
        "name": "Nails Route",
        "grade": "E11 7b"
      }
    ]
  }`;
  
  let expectedOutput = [{id: '111-aaa', name: 'Nails Route', grade: 'E11 7b'}];

  let cragObject = LoadCragObjectFromJSON(input);
  let cragRoutes = GetCragRoutesAsArray(cragObject);
  expect(cragRoutes.length).toEqual(1);
  expect(cragRoutes).toEqual(expectedOutput);
});

test('Add a route to an empty crag', () => {
  let expectedOutputObject = {id: '111-aaa', name: 'Nails Route', grade: 'E11 7b'};
  let expectedOutputArray = [expectedOutputObject];

  let cragObject = CreateCragObject();
  SetUUIDGenFunction(cragObject, () => { return '111-aaa' });

  let cragRoute = AppendRouteToCrag(cragObject, "Nails Route", "E11 7b");
  expect(cragRoute).toEqual(expectedOutputObject);

  let cragRoutes = GetCragRoutesAsArray(cragObject);
  expect(cragRoutes.length).toEqual(1);
  expect(cragRoutes).toEqual(expectedOutputArray);
});
