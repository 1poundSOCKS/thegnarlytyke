const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const CragIndex = require('./objects/crag-index.cjs');
const PageHeaderNav = require('./objects/page-header-nav.cjs')
const IconBar = require('./objects/icon-bar.cjs')
const CragIndexContainer = require('./objects/crag-index-container.cjs')
const Cookie = require('./objects/cookie.cjs')
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs')
const CragRouteTable = require('./objects/crag-route-table.cjs')
const TopoRouteTable = require('./objects/topo-route-table.cjs')
const TopoImage = require('./objects/topo-image.cjs')
const ImageFileCompressor = require('./objects/image-file-compressor.cjs')

let _cookie = null;
let _pageHeaderNav = null;
let _iconBar = null;
let _cragIndex = null;
let _cragIndexContainer = null;
let _currentCrag = null
let _topoMediaScroller = null;
let _cragRouteTable = null;
let _topoRouteTable = null;
let _mainTopoImage = null;

window.onload = () => {
  InitWindowStyle()
  Config.Load().then( () => OnConfigLoad() )
}

window.onresize = () => {
  InitWindowStyle()
}

let InitWindowStyle = () => {
  const cragCoversColumnCount = ~~(window.innerWidth / 400)
  const cragtoposColumnCount = ~~(window.innerWidth / 200)
  document.documentElement.style.setProperty("--crag-covers-column-count", cragCoversColumnCount)
  document.documentElement.style.setProperty("--crag-topos-column-count", cragtoposColumnCount)
}

let OnConfigLoad = async () => {
  _cookie = new Cookie();

  _pageHeaderNav = new PageHeaderNav(document.getElementById('page-header-nav'),'edit',_cookie,Config.mode == "edit");

  DataStorage.Init(Config, _cookie.GetValue("user-id"), _cookie.GetValue("user-token"));
  ImageStorage.Init(Config, _cookie.GetValue("user-id"), _cookie.GetValue("user-token"));
  
  _iconBar = new IconBar(document.getElementById('icon-bar-container'))

  _cragIndexContainer = new CragIndexContainer(document.getElementById('crag-covers-container'),DataStorage,ImageStorage)
  // _cragIndexContainer.Load(DisplayCragView)
  _cragIndexContainer.Load(SelectCragCoverContainer)

  _cragCoverImage = document.getElementById('crag-cover-image')
  _mainTopoImage = new TopoImage(document.getElementById('topo-image-edit'), true);

  /* page event handlers */
  document.getElementById('add-crag').onclick = () => document.getElementById('add-crag-image-file').click()
  document.getElementById('add-crag-image-file').onchange = () => OnAddCrag()

  document.getElementById('update-crag-cover-image').onclick = () => document.getElementById('update-crag-image-file').click()
  document.getElementById('update-crag-image-file').onchange = () => OnUpdateCragImage()

  document.getElementById("crag-name").onchange = OnCragNameChanged;

  document.getElementById('close-crag-view').onclick = () => {
    document.getElementById('crag-view-container').style = 'display:none'
    document.getElementById('crag-index-container').style = ''
  }
  document.getElementById('close-topo-view').onclick = () => {
    document.getElementById('topo-edit-container').style = 'display:none'
    document.getElementById('crag-view-container').style = ''
  }
}

let SelectCragCoverContainer = cragCoverContainer => {
}

let DisplayCragView = async cragCoverContainer => {
  document.getElementById('crag-index-container').style = 'display:none'

  cragCoverContainer.CopyImageToCanvas(_cragCoverImage)
  document.getElementById("crag-name").value = cragCoverContainer.cragIndexEntry.name;
  _currentCrag = await cragCoverContainer.LoadCrag(Config)
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

let OnAddCrag = async () => {
  const imageFiles = document.getElementById('add-crag-image-file')
  const topoImageFiles = Array.from(imageFiles.files).map( file => {
    return { file: file }
  })

  const compressor = new ImageFileCompressor(document.getElementById('image-file-compressor-canvas'))
  const image = compressor.LoadAndCompress(topoImageFiles[0].file)

  const cragIndexEntry = _cragIndex.AppendCrag('',image)
  _cragMediaScroller.AppendCrag(cragIndexEntry)
}

let OnUpdateCragImage = async () => {
  console.log(`OnUpdateCragImage`)
  const imageFiles = document.getElementById('update-crag-image-file')
  const topoImageFiles = Array.from(imageFiles.files).map( file => {
    return { file: file }
  })

  const compressor = new ImageFileCompressor(document.getElementById('image-file-compressor-canvas'))
  const image = await compressor.LoadAndCompress(topoImageFiles[0].file)

  _cragMediaScroller.selectedContainer.UpdateImage(image,compressor.compressedImageData)
  _cragMediaScroller.selectedContainer.CopyImageToCanvas(_cragCoverImage)
}

let OnSaveChanges = () => {
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
