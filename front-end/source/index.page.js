const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const Cookie = require('./objects/cookie.cjs')
const CragIndex = require('./objects/crag-index.cjs');
const PageHeaderNav = require('./objects/page-header-nav.cjs')
const CragCoverContainer = require('./objects/crag-cover-container.cjs');
const CragStorage = require('./objects/crag-storage.cjs');
const Crag = require('./objects/crag.cjs');
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs');
const TopoImage = require('./objects/topo-image.cjs');
const TopoRouteTable = require('./objects/topo-route-table.cjs');

let _cookie = null;
let _pageHeaderNav = null;
let _crag = null;
let _topoMediaScroller = null;
let _mainTopoImage = null;
let _topoRouteTable = null;

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  _cookie = new Cookie();
  const loggedOn = _cookie.IsUserLoggedOn();
  
  _pageHeaderNav = new PageHeaderNav(document.getElementById('page-header-nav'),'home');
  
  if( loggedOn && Config.mode == "edit" ) {
    _pageHeaderNav.AddItem('edit', 'crag-index-edit.html')
  }
  if( loggedOn ) {
    _pageHeaderNav.AddItem('logoff', null, OnLogoffClicked)
  }
  else {
    _pageHeaderNav.AddItem('logon', 'logon.html')
  }

  DataStorage.Init(Config);
  ImageStorage.Init(Config);
  const cragIndex = new CragIndex();
  await cragIndex.Load(DataStorage,ImageStorage);
  const parentElement = document.getElementById('crag-covers-container');
  cragIndex.data.crags.forEach( crag => {
    AppendCrag(crag, parentElement);
  })

  document.getElementById('close-crag-view').onclick = DisplayIndexView;
}

let AppendCrag = (crag, parentElement) => {
  const cragCover = new CragCoverContainer(crag, Config.images_url);
  parentElement.appendChild(cragCover.element);
  cragCover.element.onclick = () => {
    DisplayCragView(crag.id);
  }
}

let OnLogoffClicked = () => {
  _cookie.Logoff()
  location.reload()
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
  _topoRouteTable = new TopoRouteTable(document.getElementById('topo-route-table'), selectedTopo);
}
