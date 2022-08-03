const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const Cookie = require('./objects/cookie.cjs')
const PageHeaderNav = require('./objects/page-header-nav.cjs')
const CragIndexContainer = require('./objects/crag-index-container.cjs')
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs');
const TopoImage = require('./objects/topo-image.cjs');
const TopoRouteTable2 = require('./objects/topo-route-table-2.cjs');

let _cragIndexContainer = null;

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
  const cookie = new Cookie();
  
  new PageHeaderNav(document.getElementById('page-header-nav'),'home',cookie,Config.mode == "edit");
  
  DataStorage.Init(Config);
  ImageStorage.Init(Config);

  const topoImage = new TopoImage(document.getElementById('main-topo-image'), false);

  const topoRouteTable = new TopoRouteTable2(document.getElementById('topo-route-table-container'))

  const topoMediaScroller = new TopoMediaScroller(document.getElementById('topo-images-container'))
  topoMediaScroller.topoImage = topoImage
  topoMediaScroller.topoRouteTable = topoRouteTable
  topoMediaScroller.autoSelectOnRefresh = true
  
  _cragIndexContainer = new CragIndexContainer(document.getElementById('crag-index-container'),DataStorage,ImageStorage)
  _cragIndexContainer.topoMediaScroller = topoMediaScroller
  _cragIndexContainer.Load(DisplayCragView)

  document.getElementById('close-crag-view').onclick = DisplayIndexView;
}

let DisplayIndexView = () => {
  document.getElementById('crag-view-container').style = 'display:none'
  window.scrollTo( 0, 0 );
  _cragIndexContainer.Unselect();
  document.getElementById('crag-index-container').style = ''
}

let DisplayCragView = async container => {
  document.getElementById('crag-index-container').style = 'display:none'
  window.scrollTo( 0, 0 );  
  document.getElementById('crag-name').innerText = container.crag.name;
  document.getElementById('crag-view-container').style = ''
}
