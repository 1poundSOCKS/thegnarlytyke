const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const CragIndex = require('./objects/crag-index.cjs');
const CragStorage = require('./objects/crag-storage.cjs');
const Crag = require('./objects/crag.cjs');
const Topo = require('./objects/topo.cjs');
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs');
const TopoImage = require('./objects/topo-image.cjs');
const CragRouteTable = require('./objects/crag-route-table.cjs');
const TopoRouteTable = require('./objects/topo-route-table.cjs');
const ImageUploadCache = require('./objects/image-upload-cache.cjs');
const PageHeader = require('./objects/page-header.cjs')
const Cookie = require('./objects/cookie.cjs')

let _pageHeader = null;
let _crag = null;
let _topoMediaScroller = null;
let _mainTopoImage = null;
let _topoRouteTable = null;
let _cragRouteTable = null;
let _imageUploadCache = null;

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  const cookie = new Cookie();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const cragID = urlParams.get('id');

  _pageHeader = new PageHeader(document.getElementById("page-header"));
  _pageHeader.AddIcon("fa-plus","Add topo").onclick = () => OnAddTopo();
  document.getElementById('topo-image-file').onchange = () => OnUploadImageFile();
  _pageHeader.AddIcon("fa-file-arrow-up","Upload topo image").onclick = () => document.getElementById('topo-image-file').click();
  _pageHeader.AddIcon("fa-arrow-left","Upload topo image").onclick = () => OnShiftTopoLeft();
  _pageHeader.AddIcon("fa-arrow-right","Upload topo image").onclick = () => OnShiftTopoRight();
  _pageHeader.AddIcon("fa-save","Save").onclick = () => OnSave();

  DataStorage.Init(Config, cookie.GetValue("user-id"), cookie.GetValue("user-token"));
  ImageStorage.Init(Config, cookie.GetValue("user-id"), cookie.GetValue("user-token"));

  const cragIndex = new CragIndex();
  const cragIndexData = await cragIndex.Load(DataStorage);
  const cragIndexEntry = cragIndexData.crags.filter(crag => crag.id == cragID)[0];

  try {
    const cragStorage = new CragStorage('client', Config);
    _crag = new Crag(await cragStorage.Load(cragID));
  }
  catch ( err ) {
    _crag = new Crag({id:cragID});
  }

  document.getElementById('page-subheader-text').innerText = cragIndexEntry.name;

  _mainTopoImage = new TopoImage(document.getElementById('main-topo-image'), true);

  _topoMediaScroller = new TopoMediaScroller(document.getElementById('topo-images-container'), _crag, false, OnTopoSelected);
  _topoMediaScroller.LoadTopoImages(ImageStorage);

  _cragRouteTable = new CragRouteTable(document.getElementById('crag-route-table'), _crag);

  _imageUploadCache = new ImageUploadCache();
}

let OnTopoSelected = (topoID, topoContainer) => {
  const selectedTopo = _crag.GetMatchingTopo(topoID);
  document.getElementById('main-topo-container').classList.remove('do-not-display');
  _mainTopoImage.image = _topoMediaScroller.topoImages.get(topoID);
  _mainTopoImage.topo = selectedTopo;
  _mainTopoImage.Refresh();
  _mainTopoImage.AddMouseHandler(topoContainer);
  RefreshIcons(topoContainer);
  _topoRouteTable = new TopoRouteTable(document.getElementById('topo-route-table'), selectedTopo, OnTopoRouteSelected);
  _cragRouteTable = new CragRouteTable(document.getElementById('crag-route-table'), _crag, selectedTopo, OnCragRouteToggled);
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
  document.getElementById("status").value = "Saving..."

  const uploads = [];
  _imageUploadCache.imageDataMap.forEach( (imageData, ID) => {
    const topo = _crag.GetMatchingTopo(ID);
    uploads.push(ImageStorage.SaveImageAndUpdateFilename(ID, imageData, topo));
  });
  Promise.all(uploads)
  .then( (responses) => {
    const errorResponses = responses.filter(response => response.error)
    if( errorResponses.length > 0 ) {
      console.log(errorResponses[0].error)
      document.getElementById("status").value = "ERROR saving image!"
      return;
    }
    _crag.Save(DataStorage)
    .then( (response) => {
      if( response.error ) {
        console.log(response.error)
        document.getElementById("status").value = "ERROR saving crag!"
        return
      }
      document.getElementById("status").value = "Success!"
    })
    .catch( (e) => {
      console.log(e)
      document.getElementById("status").value = "ERROR saving crag!"
      return
    })
  })
  .catch( (e) => {
    console.log(e)
    document.getElementById("status").value = "ERROR saving image!"
    return
  })
}

module.exports = GetSelectedTopoID = () => {
  return _topoMediaScroller.GetSelectedTopoID();
}

let OnCragRouteToggled = (route) => {
  _topoRouteTable.Refresh(true);
}

let OnTopoRouteSelected = (route) => {
  _mainTopoImage.routeID = route.id;
}
