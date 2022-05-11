const Config = require('./objects/config.cjs');
const Crag = require('./objects/crag.cjs');
const TopoImage = require('./objects/topo-image.cjs');
const Topo = require('./objects/topo.cjs');
const CragLoader = require('./objects/crag-loader.cjs');
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs');

let _crag = new Crag();
let _contentEditable = false;
let _topoMediaScroller = null;
let _mainTopoImage = null;

module.exports = SetViewContentEditable = editable => {
  _contentEditable = editable;
  SetTableContentEditable(_contentEditable);
}

module.exports = LoadAndDisplayCrag = async (cragID, headerElement) => {
  _topoMediaScroller = new TopoMediaScroller(document.getElementById('topo-images-container'), _crag, _contentEditable, OnTopoSelected);
  _mainTopoImage = new TopoImage(document.getElementById('main-topo-image'));
  _mainTopoImage.contentEditable = _contentEditable;

  const cragStorage = new CragLoader('client');
  const crag = await cragStorage.Load(cragID);

  if( headerElement && crag.name ) headerElement.innerText = crag.name;

  _crag.Attach(crag);

  const env = Config.environment;
  const imagesPath = `env/${env}/images/`;
  _topoMediaScroller.LoadTopoImages(imagesPath);

  RefreshCragRouteTable(_crag);
}

module.exports = SaveCrag = async () => {
  const cragStorage = new CragLoader('client');
  cragStorage.Save(_crag);
}

let OnTopoSelected = (topoID, topoContainer) => {
  RefreshIcons(topoContainer);
  document.getElementById('main-topo-container').classList.remove('do-not-display');
  if( _contentEditable ) _mainTopoImage.AddMouseHandler();
  _mainTopoImage.image = _topoMediaScroller.topoImages.get(topoID);
  _mainTopoImage.topo = _crag.GetMatchingTopo(topoID);
  _mainTopoImage.Refresh();
  RefreshTopoRouteTable(_crag, topoID);
  if( _contentEditable ) {
    RefreshCragRouteTable(_crag, topoID);
    _mainTopoImage.AddMouseHandler();
  }
}

module.exports = RefreshIcons = (topoContainer) => {
  const shiftTopoLeftContainer = document.getElementById('shift-topo-left-container');
  if( shiftTopoLeftContainer ) {
    if( topoContainer.previousSibling ) shiftTopoLeftContainer.classList.remove('do-not-display');
    else shiftTopoLeftContainer.classList.add('do-not-display');
  }

  const shiftTopoRightContainer = document.getElementById('shift-topo-right-container');
  if( shiftTopoRightContainer ) {
    if( topoContainer.nextSibling ) shiftTopoRightContainer.classList.remove('do-not-display');
    else shiftTopoRightContainer.classList.add('do-not-display');
  }
}

module.exports = AddTopo = () => {
  const topo = new Topo();
  _topoMediaScroller.AddTopo(topo.topo);
}

module.exports = ShiftSelectedTopoLeft = () => {
  const parentNode = _selectedTopoImageContainer.parentNode;
  const previousContainer = _selectedTopoImageContainer.previousSibling;
  _selectedTopoImageContainer.remove();
  parentNode.insertBefore(_selectedTopoImageContainer, previousContainer);
  RefreshIcons();
  const selectedTopoIndex = _crag.GetTopoIndex(GetSelectedTopoID());
  _crag.SwapTopos(selectedTopoIndex, selectedTopoIndex - 1);
}

module.exports = ShiftSelectedTopoRight = () => {
  const parentNode = _selectedTopoImageContainer.parentNode;
  const nextContainer = _selectedTopoImageContainer.nextSibling;
  nextContainer.remove();
  parentNode.insertBefore(nextContainer, _selectedTopoImageContainer);
  RefreshIcons();
  const selectedTopoIndex = _crag.GetTopoIndex(GetSelectedTopoID());
  _crag.SwapTopos(selectedTopoIndex, selectedTopoIndex + 1);
}

module.exports = SortSelectedTopoRoutes = () => {
  const topo = GetSelectedTopo();
  topo.SortRoutesLeftToRight();
  RefreshTopoRouteTable(_crag, GetSelectedTopoID());
  _mainTopoImage.Refresh();
}
