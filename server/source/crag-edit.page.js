const Config = require('./objects/config.cjs');
const CragLoader = require('./objects/crag-loader.cjs');
const Crag = require('./objects/crag.cjs');
const Topo = require('./objects/topo.cjs');
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs');
const TopoImage = require('./objects/topo-image.cjs');
const CragRouteTable = require('./objects/crag-route-table.cjs');
const TopoRouteTable = require('./objects/topo-route-table.cjs');
const ImageUploadCache = require('./objects/image-upload-cache.cjs');
const ImageStorage = require('./objects/image-storage.cjs');

let _crag = null;
let _topoMediaScroller = null;
let _mainTopoImage = null;
let _topoRouteTable = null;
let _cragRouteTable = null;
let _imageUploadCache = null;

window.onload = () => {
  fetch('config.json')
  .then( response => response.json() )
  .then( parsedData => {
    Config.Load(parsedData);
    OnConfigLoad();
  });
}

let OnConfigLoad = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const cragID = urlParams.get('id');

  const cragStorage = new CragLoader('client');
  _crag = new Crag(await cragStorage.Load(cragID));
  
  document.getElementById('crag-view-header').innerText = _crag.name;

  _mainTopoImage = new TopoImage(document.getElementById('main-topo-image'), true);

  _topoMediaScroller = new TopoMediaScroller(document.getElementById('topo-images-container'), _crag, false, OnTopoSelected);
  _topoMediaScroller.LoadTopoImages(`env/${Config.environment}/images/`);

  _cragRouteTable = new CragRouteTable(document.getElementById('crag-route-table'));
  _topoRouteTable = new TopoRouteTable(document.getElementById('topo-route-table'), (rowElement) => {
    _mainTopoImage.routeID = _topoRouteTable.selectedRouteID;
  });

  _imageUploadCache = new ImageUploadCache();
  document.getElementById('topo-image-file').onchange = OnUploadImageFile;
}

let OnTopoSelected = (topoID, topoContainer) => {
  const selectedTopo = new Crag(_crag).GetMatchingTopo(topoID);
  document.getElementById('main-topo-container').classList.remove('do-not-display');
  _mainTopoImage.image = _topoMediaScroller.topoImages.get(topoID);
  _mainTopoImage.topo = selectedTopo;
  _mainTopoImage.Refresh();
  _mainTopoImage.AddMouseHandler(topoContainer);
  RefreshIcons(topoContainer);
  _topoRouteTable.topo = selectedTopo;
  _topoRouteTable.Refresh(true);
  _cragRouteTable.crag = _crag;
  _cragRouteTable.Refresh();
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

module.exports = OnAddTopo = () => {
  const topo = new Topo();
  _topoMediaScroller.AddTopo(topo.topo);
  _crag.AppendTopo(topo.topo);
}

let OnUploadImageFile = async () => {
  const imageFiles = document.getElementById('topo-image-file');
  const topoImageFiles = Array.from(imageFiles.files).map( file => {
    return { file: file }
  });

  const image = await _imageUploadCache.LoadAndCompress(
    topoImageFiles[0].file, 
    _topoMediaScroller.GetSelectedTopoID(),
    _topoMediaScroller.GetSelectedTopoCanvas()
  );
  
  _topoMediaScroller.UpdateSelectedTopoImage(image);
  _mainTopoImage.image = image;
  _mainTopoImage.Refresh();
}

module.exports = OnShiftTopoLeft = () => {
  _topoMediaScroller.ShiftCurrentTopoLeft();
  const selectedTopoIndex = _crag.GetTopoIndex(GetSelectedTopoID());
  _crag.SwapTopos(selectedTopoIndex, selectedTopoIndex - 1);
  RefreshIcons(_topoMediaScroller.currentTopoContainer);
}

module.exports = OnShiftTopoRight = () => {
  _topoMediaScroller.ShiftCurrentTopoRight();
  RefreshIcons(_topoMediaScroller.currentTopoContainer);
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
  _imageUploadCache.imageDataMap.forEach( (imageData, ID) => {
    console.log(`ID: ${ID}, image data length: ${imageData.length}`);
    ImageStorage.prototype.SaveImage(ID, imageData).then( filename => {
      console.log(`saved filename: ${filename}`);
    });
  });
  // const cragStorage = new CragLoader('client');
  // cragStorage.Save(_crag);
}

module.exports = GetSelectedTopoID = () => {
  return _topoMediaScroller.GetSelectedTopoID();
}
