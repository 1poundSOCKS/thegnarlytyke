export function CreateCrag(cragName) {
  return {id: '0', name: cragName};
}

export function AddTopo(crag, imageData) {
  if( !crag.topos ) crag.topos = [];
  const topoCount = crag.topos.push();
  const topo = crag.topos[topoCount-1];
  topo.imageData = imageData;
  return topo;
}
