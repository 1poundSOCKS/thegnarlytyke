let { CreateCrag, AddTopo } = require('../server/crag.js');

test('Crag initialisation', () => {
  let crag = CreateCrag('Baildon Bank');
  expect(crag.id.length).toBeGreaterThan(0);
  expect(crag.name).toEqual('Baildon Bank');
});

test('Crags have unique IDs', () => {
  let crag1 = CreateCrag('Baildon Bank');
  let crag2 = CreateCrag('Almscliff');
  expect(crag1.id.length).toBeGreaterThan(0);
  expect(crag2.id.length).toBeGreaterThan(0);
  expect(crag1.id).toNotEqual(crag2.id);
});

test('Add a topo to a crag', () => {
  let crag = CreateCrag('Baildon Bank');
  let topo = AddTopo(crag, 'Scar Wall', '***IMG_DATA');
  expect(crag.topos).toHaveLength(1);
  expect(crag.topos[0]).toEqual(topo);
  expect(topo.imageData).toEqual('***IMG_DATA');
});
