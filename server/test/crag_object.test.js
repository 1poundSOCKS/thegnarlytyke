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
  let testOutput = [GetTopoImageFile(cragObject, '111-aaa'), GetTopoImageFile(cragObject, '222-bbb'), GetTopoImageFile(cragObject, '333-ccc')];

  expect(testOutput).toEqual(expectedTestOutput);
});

test('Topo route IDs returned for a topo with no routes', () => {
  let testInput = { topos: [{ id: 'tid-111-aaa'}]};
  let expectedTestOutput = [];

  let cragObject = CreateCragObject(testInput);
  let testOutput = GetTopoRouteIDs(cragObject, 'tid-111-aaa');

  expect(testOutput).toEqual(expectedTestOutput);
});

test('Topo route IDs are returned in left to right order', () => {
  let testInput = {
    topos: [
      {
        id: 'tid-111-aaa',
        routes: [
          {
            id: 'last',
            points: [{x: 0.9}]
          },
          {
            id: 'first',
            points: [{x: 0.1}]
          },
          {
            id: 'middle',
            points: [{x: 0.5}]
          }
        ]
      }
    ]
  };
  let expectedTestOutput = ['first','middle','last'];

  let cragObject = CreateCragObject(testInput);
  let testOutput = GetTopoRouteIDs(cragObject, 'tid-111-aaa');

  expect(testOutput).toEqual(expectedTestOutput);
});

test('Topo routes IDs returned when the crag has multiple topos', () => {
  let testInput = { topos: [
    {
      id: 'tid-111-aaa', 
      routes: [{id: 'rid-123'}, {id: 'rid-456'}]
    },
    {
      id: 'tid-222-bbb',
      routes: []
    },
    {
      id: 'tid-333-ccc',
      routes: [{id: 'rid-789'}]
    }
  ]};

  let cragObject = CreateCragObject(testInput);
  let testOutput1 = GetTopoRouteIDs(cragObject, 'tid-111-aaa');
  expect(testOutput1).toEqual(['rid-123', 'rid-456']);
  
  let testOutput2 = GetTopoRouteIDs(cragObject, 'tid-222-bbb');
  expect(testOutput2).toEqual([]);

  let testOutput3 = GetTopoRouteIDs(cragObject, 'tid-333-ccc');
  expect(testOutput3).toEqual(['rid-789']);
});

test('Return route info when the route does not exist', () => {
  let testInput = { 
    routes: [
      { id: 'rid-1' },
      { id: 'rid-3' }
    ]
  };

  let cragObject = CreateCragObject(testInput);
  let testOutput = GetCragRouteInfo(cragObject, 'rid-2');
  expect(testOutput).toEqual(null);
});

test('Return route info when the route exists', () => {
  let testInput = { 
    routes: [
      { id: 'rid-1', name: 'Gnarly Route', grade: 'E12 7b' },
      { id: 'rid-3' }
    ]
  };

  let cragObject = CreateCragObject(testInput);
  let testOutput1 = GetCragRouteInfo(cragObject, 'rid-1');
  expect(testOutput1).toEqual({name: 'Gnarly Route', grade: 'E12 7b'});
  
  let testOutput2 = GetCragRouteInfo(cragObject, 'rid-3');
  expect(testOutput2).toEqual({});
});

test("Render steps for a non-existant route", () => {
  let testInput = {
    route: {
      id: 'rid-111',
      points: [ { x: 0.1, y: 0.2 }]
    }
  }

  let cragObject = CreateCragObject(testInput);
  let renderSteps = GetTopoOverlayRenderSteps(cragObject, 'rid-222');
  expect(renderSteps).toEqual([]);
});

test("Render steps for a route with a single point", () => {
  let testInput = {
    topos: [
      {
        id: 'rid-111',
        routes: [
          {
            points: [ { x: 0.1, y: 0.2 }]
          }
        ]
      }
    ]
  }

  let cragObject = CreateCragObject(testInput);
  let renderSteps = GetTopoOverlayRenderSteps(cragObject, 'rid-111');
  expect(renderSteps.length).toEqual(1);
  expect(renderSteps[0]).toEqual( { type: rsRouteStart, index: 1, x: 0.1, y: 0.2 } );
});

test("Render steps for a route with 3 points", () => {
  let testInput = {
    topos: [
      {
        id: 'rid-111',
        routes: [
          {
            points: [ { x: 0.1, y: 0.2 }, { x: 0.3, y: 0.4 }, { x: 0.5, y: 0.6 }]
          }
        ]
      }
    ]
  }

  let cragObject = CreateCragObject(testInput);
  let renderSteps = GetTopoOverlayRenderSteps(cragObject, 'rid-111');
  
  expect(renderSteps.length).toEqual(4);
  expect(renderSteps).toContainEqual( { type: rsRouteLine, start: {x: 0.1, y: 0.2}, end: {x: 0.3, y: 0.4} } );  
  expect(renderSteps).toContainEqual( { type: rsRouteLine, start: {x: 0.3, y: 0.4}, end: {x: 0.5, y: 0.6 }} );  
  expect(renderSteps).toContainEqual( { type: rsRouteStart, index: 1, x: 0.1, y: 0.2 } );
  expect(renderSteps).toContainEqual( { type: rsRouteEnd, index: 1, x: 0.5, y: 0.6 } );
});

test("Left to right sorting of route indexes in render", () => {
  let testInput = {
    topos: [
      {
        id: 'rid-111',
        routes: [
          {
            points: [ { x: 0.2, y: 0.2 }, { x: 0.3, y: 0.4 }, { x: 0.5, y: 0.6 }]
          },
          {
            points: [ { x: 0.1, y: 0.2 }, { x: 0.3, y: 0.4 }, { x: 0.7, y: 0.8 }]
          }
        ]
      }
    ]
  }

  let cragObject = CreateCragObject(testInput);
  let renderSteps = GetTopoOverlayRenderSteps(cragObject, 'rid-111');
  
  expect(renderSteps.length).toEqual(8);
  expect(renderSteps).toContainEqual({ type: rsRouteStart, index: 1, x: 0.1, y: 0.2 });
  expect(renderSteps).toContainEqual({ type: rsRouteStart, index: 2, x: 0.2, y: 0.2 });
  expect(renderSteps).toContainEqual({ type: rsRouteEnd, index: 1, x: 0.7, y: 0.8 });
  expect(renderSteps).toContainEqual({ type: rsRouteEnd, index: 2, x: 0.5, y: 0.6 });
});

test("Update a crag route name", () => {
  let testInput = {
    routes: [
      {
        id: 'rid-111',
        name: 'first route'
      },
      {
        id: 'rid-222',
        name: 'second route'
      },
      {
        id: 'rid-333',
        name: 'third route'
      }
    ]
  }

  let cragObject = CreateCragObject(testInput);
  SetCragRouteName(cragObject, 'rid-222', 'renamed route');

  expect(testInput.routes).toContainEqual({id: 'rid-222', name: 'renamed route'});
});

test("Update crag route grades", () => {
  let testInput = {
    routes: [
      {
        id: 'rid-111'
      },
      {
        id: 'rid-222',
        grade: 'hard'
      },
      {
        id: 'rid-333',
        grade: 'easy'
      }
    ]
  }

  let cragObject = CreateCragObject(testInput);
  SetCragRouteGrade(cragObject, 'rid-111', 'okay-ish');
  SetCragRouteGrade(cragObject, 'rid-222', 'really easy');
  SetCragRouteGrade(cragObject, 'rid-333', 'very hard');

  expect(testInput.routes).toContainEqual({id: 'rid-111', grade: 'okay-ish'});
  expect(testInput.routes).toContainEqual({id: 'rid-222', grade: 'really easy'});
  expect(testInput.routes).toContainEqual({id: 'rid-333', grade: 'very hard'});
});

test("append new crag routes", () => {
  let testInput = {
    routes: [
    ]
  }

  let cragObject = CreateCragObject(testInput);
  let id1 = AppendCragRoute(cragObject);
  let id2 = AppendCragRoute(cragObject);
  let id3 = AppendCragRoute(cragObject);
  let routeIDs = GetCragRouteIDs(cragObject);
  expect(routeIDs.length).toEqual(3);
  expect(routeIDs[0]).toEqual(id1);
  expect(routeIDs[1]).toEqual(id2);
  expect(routeIDs[2]).toEqual(id3);
});

test("add crag route to topo", () => {
  let testInput = {
    routes: [
      { id: 'rid-111' },
      { id: 'rid-222' }
    ],
    topos: [
      {
        id: 'tid-999',
        routes: [
          { id: 'rid-111'}
        ]
      }
    ]
  }

  let cragObject = CreateCragObject(testInput);
  AddCragRouteToTopo(cragObject, 'rid-222', 'tid-999');
  let topoRouteIDs = GetTopoRouteIDs(cragObject, 'tid-999');
  expect(topoRouteIDs.length).toEqual(2);
  expect(topoRouteIDs).toContainEqual('rid-111');
  expect(topoRouteIDs).toContainEqual('rid-222');
});

test("Remove a route from a topo", () => {
  let testInput = {
    routes: [
      { id: 'rid-111' },
      { id: 'rid-222' }
    ],
    topos: [
      {
        id: 'tid-999',
        routes: [
          { id: 'rid-111'},
          { id: 'rid-222'}
        ]
      }
    ]
  }

  let cragObject = CreateCragObject(testInput);
  RemoveCragRouteFromTopo(cragObject, 'rid-222', 'tid-999');
  let topoRouteIDs = GetTopoRouteIDs(cragObject, 'tid-999');
  expect(topoRouteIDs.length).toEqual(1);
  expect(topoRouteIDs).toContainEqual('rid-111');
});
