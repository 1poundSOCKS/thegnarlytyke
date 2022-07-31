const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const Cookie = require('./objects/cookie.cjs')
// const CragIndex = require('./objects/crag-index.cjs');
const PageHeaderNav = require('./objects/page-header-nav.cjs')
const CragIndexContainer = require('./objects/crag-index-container.cjs')
const CragCoverContainer = require('./objects/crag-cover-container.cjs');
const CragStorage = require('./objects/crag-storage.cjs');
const Crag = require('./objects/crag.cjs');
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs');
const TopoImage = require('./objects/topo-image.cjs');
const TopoRouteTable = require('./objects/topo-route-table.cjs');

let _cookie = null;
let _crag = null;
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

let cragIndexContainer = null;

let OnConfigLoad = async () => {
  _cookie = new Cookie();
  
  new PageHeaderNav(document.getElementById('page-header-nav'),'home',_cookie,Config.mode == "edit");
  
  DataStorage.Init(Config);
  ImageStorage.Init(Config);

  cragIndexContainer = new CragIndexContainer(document.getElementById('crag-covers-container'),DataStorage,ImageStorage)
  cragIndexContainer.Load(cragCoverContainer => {
    DisplayCragView(cragCoverContainer.crag.id)
  })

  document.getElementById('close-crag-view').onclick = DisplayIndexView;
}

let DisplayIndexView = () => {
  document.getElementById('crag-view-container').style = 'display:none'
  window.scrollTo( 0, 0 );
  document.getElementById('crag-covers-container').style = ''
}

let DisplayCragView = async cragID => {
  document.getElementById('crag-covers-container').style = 'display:none'
  window.scrollTo( 0, 0 );
  
  try {
    const cragStorage = new CragStorage('client', Config);
    _crag = await cragStorage.Load(cragID);
  }
  catch ( err ) {
    _crag = new Crag({id:cragID});
  }

  document.getElementById('crag-name').innerText = _crag.name;

  _mainTopoImage = new TopoImage(document.getElementById('main-topo-image'), false);

  _topoMediaScroller = new TopoMediaScroller(document.getElementById('topo-images-container'), _crag, false, OnTopoSelected);
  _topoMediaScroller.LoadTopoImages(ImageStorage);
  document.getElementById('crag-view-container').style = ''
}

let OnTopoSelected = (topoID, topoContainer) => {
  const selectedTopo = new Crag(_crag).GetMatchingTopo(topoID);
  document.getElementById('main-topo-container').classList.remove('do-not-display');
  _mainTopoImage.image = _topoMediaScroller.topoImages.get(topoID);
  _mainTopoImage.topo = selectedTopo;
  _mainTopoImage.Refresh();
  new TopoRouteTable(document.getElementById('topo-route-table'), selectedTopo);
}
