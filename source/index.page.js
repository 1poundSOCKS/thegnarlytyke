const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const Cookie = require('./objects/cookie.cjs')
const PageHeaderNav = require('./objects/page-header-nav.cjs')
const CragIndexContainer = require('./objects/crag-index-container.cjs')
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs');
const TopoImage = require('./objects/topo-image.cjs');
const TopoRouteTable = require('./objects/topo-route-table.cjs');

let _cookie = null;
let _cragIndexContainer = null;
let _topoMediaScroller = null;
let _mainTopoImage = null;

window.onload = () => {
  InitWindowStyle()
  Config.Load().then( () => OnConfigLoad() );
}

window.onresize = () => {
  InitWindowStyle()
}

let InitWindowStyle = () => {
  const cragCoversColumnCount = Math.max(1,~~(window.innerWidth / 400))
  document.documentElement.style.setProperty("--crag-covers-column-count", cragCoversColumnCount)
}

let OnConfigLoad = async () => {
  _cookie = new Cookie();
  
  new PageHeaderNav(document.getElementById('page-header-nav'),'home',_cookie,Config.mode == "edit");
  
  DataStorage.Init(Config);
  ImageStorage.Init(Config);

  _cragIndexContainer = new CragIndexContainer(document.getElementById('crag-covers-container'),DataStorage,ImageStorage)
  _cragIndexContainer.Load(DisplayCragView)

  document.getElementById('close-crag-view').onclick = DisplayIndexView;
}

let DisplayIndexView = () => {
  document.getElementById('crag-view-container').style = 'display:none'
  window.scrollTo( 0, 0 );
  _cragIndexContainer.Unselect();
  document.getElementById('crag-covers-container').style = ''
}

let DisplayCragView = async cragCoverContainer => {
  document.getElementById('crag-covers-container').style = 'display:none'
  window.scrollTo( 0, 0 );
  
  const crag = await cragCoverContainer.LoadCrag(DataStorage)
  document.getElementById('crag-name').innerText = crag.name;

  _mainTopoImage = new TopoImage(document.getElementById('main-topo-image'), false);

  _topoMediaScroller = new TopoMediaScroller(document.getElementById('topo-images-container'), crag, false, OnTopoSelected);
  _topoMediaScroller.LoadTopoImages(ImageStorage);
  document.getElementById('crag-view-container').style = ''
}

let OnTopoSelected = (selectedTopo) => {
  document.getElementById('main-topo-container').classList.remove('do-not-display');
  _mainTopoImage.image = _topoMediaScroller.topoImages.get(selectedTopo.id);
  _mainTopoImage.topo = selectedTopo;
  _mainTopoImage.Refresh();
  new TopoRouteTable(document.getElementById('topo-route-table'), selectedTopo);
}
