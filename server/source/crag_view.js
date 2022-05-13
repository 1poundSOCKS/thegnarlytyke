const Config = require('./objects/config.cjs');
const Crag = require('./objects/crag.cjs');
const TopoImage = require('./objects/topo-image.cjs');
const CragLoader = require('./objects/crag-loader.cjs');
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs');

module.exports = _crag = null;
module.exports = _topoMediaScroller = null;
module.exports = _mainTopoImage = null;
let _contentEditable = false;

module.exports = SetViewContentEditable = editable => {
  _contentEditable = editable;
  SetTableContentEditable(_contentEditable);
}

module.exports = LoadAndDisplayCrag = async (cragID, headerElement) => {
  const cragStorage = new CragLoader('client');
  const crag = await cragStorage.Load(cragID);
  _crag = new Crag();
  _crag.Attach(crag);

  _topoMediaScroller = new TopoMediaScroller(document.getElementById('topo-images-container'), _crag, _contentEditable, OnTopoSelected);
  _mainTopoImage = new TopoImage(document.getElementById('main-topo-image'), _contentEditable);

  if( headerElement && crag.name ) headerElement.innerText = crag.name;

  const env = Config.environment;
  const imagesPath = `env/${env}/images/`;
  _topoMediaScroller.LoadTopoImages(imagesPath);

  RefreshCragRouteTable(_crag);
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
