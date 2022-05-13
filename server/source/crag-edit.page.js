const Config = require('./objects/config.cjs');
const CragLoader = require('./objects/crag-loader.cjs');
const Topo = require('./objects/topo.cjs');
require('./crag_view.js');
require('./route_tables.js');

window.onload = () => {
  fetch('config.json')
  .then( response => response.json() )
  .then( parsedData => {
    Config.Load(parsedData);
    OnConfigLoad();
  });
}

let OnConfigLoad = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const cragID = urlParams.get('id');
  const cragNameDisplayElement = document.getElementById('crag-view-header');
  SetViewContentEditable(true);
  LoadAndDisplayCrag(cragID, cragNameDisplayElement);
}

module.exports = OnAddTopo = () => {
  const topo = new Topo();
  _topoMediaScroller.AddTopo(topo.topo);
}

module.exports = OnShiftTopoLeft = () => {
  const parentNode = _selectedTopoImageContainer.parentNode;
  const previousContainer = _selectedTopoImageContainer.previousSibling;
  _selectedTopoImageContainer.remove();
  parentNode.insertBefore(_selectedTopoImageContainer, previousContainer);
  RefreshIcons();
  const selectedTopoIndex = _crag.GetTopoIndex(GetSelectedTopoID());
  _crag.SwapTopos(selectedTopoIndex, selectedTopoIndex - 1);
}

module.exports = OnShiftTopoRight = () => {
  const parentNode = _selectedTopoImageContainer.parentNode;
  const nextContainer = _selectedTopoImageContainer.nextSibling;
  nextContainer.remove();
  parentNode.insertBefore(nextContainer, _selectedTopoImageContainer);
  RefreshIcons();
  const selectedTopoIndex = _crag.GetTopoIndex(GetSelectedTopoID());
  _crag.SwapTopos(selectedTopoIndex, selectedTopoIndex + 1);
}

module.exports = OnSortTopoRoutes = () => {
  const topo = GetSelectedTopo();
  topo.SortRoutesLeftToRight();
  RefreshTopoRouteTable(_crag, GetSelectedTopoID());
  _mainTopoImage.Refresh();
}

module.exports = OnSave = () => {
  const cragStorage = new CragLoader('client');
  cragStorage.Save(_crag);
}
