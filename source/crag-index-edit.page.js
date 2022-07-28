const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const CragIndex = require('./objects/crag-index.cjs');
const PageHeaderNav = require('./objects/page-header-nav.cjs')
const IconBar = require('./objects/icon-bar.cjs')
const CragMediaScroller = require('./objects/crag-media-scroller.cjs');
const Cookie = require('./objects/cookie.cjs')
const CragCache = require('./objects/crag-cache.cjs')
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs')
const CragRouteTable = require('./objects/crag-route-table.cjs')
const TopoRouteTable = require('./objects/topo-route-table.cjs')
const TopoImage = require('./objects/topo-image.cjs');

let _cookie = null;
let _pageHeaderNav = null;
let _iconBar = null;
let _cragIndex = null;
let _cragMediaScroller = null;
let _cragCache = null
let _currentCrag = null
let _topoMediaScroller = null;
let _cragRouteTable = null;
let _topoRouteTable = null;
let _mainTopoImage = null;

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  _cookie = new Cookie();

  _pageHeaderNav = new PageHeaderNav(document.getElementById('page-header-nav'),'edit',_cookie,Config.mode == "edit");

  DataStorage.Init(Config, _cookie.GetValue("user-id"), _cookie.GetValue("user-token"));
  ImageStorage.Init(Config, _cookie.GetValue("user-id"), _cookie.GetValue("user-token"));
  
  _cragCache = new CragCache(DataStorage)

  _iconBar = new IconBar(document.getElementById('icon-bar-container'))

  _cragIndex = new CragIndex(Config);
  const cragIndexData = await _cragIndex.LoadForUserEdit(DataStorage, ImageStorage);

  _cragMediaScroller = new CragMediaScroller(document.getElementById('crag-covers-container'), Config.images_url, cragIndexData.crags, OnCragSelected)

  document.getElementById('image-file').onchange = OnUploadImageFile;
  document.getElementById("crag-name").onchange = OnCragNameChanged;

  _cragCoverImage = document.getElementById('crag-cover-image')
  _mainTopoImage = new TopoImage(document.getElementById('topo-image-edit'), true);

  document.getElementById('close-crag-view').onclick = () => {
    document.getElementById('crag-view-container').style = 'display:none'
    document.getElementById('crag-index-container').style = ''
  }
  document.getElementById('close-topo-view').onclick = () => {
    document.getElementById('topo-edit-container').style = 'display:none'
    document.getElementById('crag-view-container').style = ''
  }
}

let OnCragSelected = async () => {
  document.getElementById('crag-index-container').style = 'display:none'

  _cragMediaScroller.selectedContainer.CopyImageToCanvas(_cragCoverImage)
  document.getElementById("crag-name").value = _cragMediaScroller.selectedContainer.crag.name;
  _currentCrag = await _cragCache.Load(_cragMediaScroller.selectedContainer.crag.id)
  _topoMediaScroller = new TopoMediaScroller(document.getElementById('topo-images-container'), _currentCrag, false, OnTopoSelected)
  _topoMediaScroller.LoadTopoImages(ImageStorage,true)
  _cragRouteTable = new CragRouteTable(document.getElementById('crag-route-table'), _currentCrag, null, OnCragRouteToggled);
  
  document.getElementById('crag-index-container').style = 'display:none'
  window.scrollTo( 0, 0 );
  document.getElementById('crag-view-container').style = ''
}

let OnCragNameChanged = () => {
  if( _cragMediaScroller.selectedContainer ) _cragMediaScroller.selectedContainer.crag.name = document.getElementById("crag-name").value;
  _cragMediaScroller.RefreshSelectedContainer();
}

module.exports = OnAddCrag = () => {
  const crag = _cragIndex.AppendCrag();
  _cragMediaScroller.AppendCrag(crag);
}

let OnUploadImageFile = async () => {
  const imageFileElement = document.getElementById('image-file');
  _cragMediaScroller.selectedContainer.LoadImageFromFile(imageFileElement.files[0]);
}

module.exports = OnSaveChanges = () => {
  document.getElementById("status").value = "Saving..."
  _cragIndex.Save(DataStorage, ImageStorage)
  .then( (response) => {
    document.getElementById("status").value = response.error ? "ERROR!" : "Success!"
  })
  .catch( (e) => {
    document.getElementById("status").value = "ERROR!"
  })
}

let OnTopoSelected = (topoID, topoContainer) => {
  document.getElementById('crag-view-container').style = 'display:none'
  _cragRouteTable.SetTopoID(topoID)
  const selectedTopo = _currentCrag.GetMatchingTopo(topoID)
  _topoRouteTable = new TopoRouteTable(document.getElementById('topo-route-table'), selectedTopo, OnTopoRouteSelected)
  _mainTopoImage.image = _topoMediaScroller.topoImages.get(topoID);
  _mainTopoImage.topo = selectedTopo;
  _mainTopoImage.Refresh();
  _mainTopoImage.AddMouseHandler(topoContainer);
  document.getElementById('crag-view-container').style = 'display:none'
  window.scrollTo( 0, 0 );
  document.getElementById('topo-edit-container').style = ''
}

let OnCragRouteToggled = (route) => {
  _topoRouteTable.Refresh()
}

let OnTopoRouteSelected = (route) => {
}
