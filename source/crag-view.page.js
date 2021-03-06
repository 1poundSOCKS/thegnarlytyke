const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require("./objects/image-storage.cjs");
const CragIndex = require('./objects/crag-index.cjs');
const CragStorage = require('./objects/crag-storage.cjs');
const Crag = require('./objects/crag.cjs');
const PageHeader = require('./objects/page-header.cjs')
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs');
const TopoImage = require('./objects/topo-image.cjs');
const TopoRouteTable = require('./objects/topo-route-table.cjs');
const Cookie = require('./objects/cookie.cjs')

let _crag = null;
let _topoMediaScroller = null;
let _mainTopoImage = null;
let _topoRouteTable = null;

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  const cookie = new Cookie();
  const loggedOn = cookie.IsUserLoggedOn();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const cragID = urlParams.get('id');

  _pageHeader = new PageHeader(document.getElementById("page-header"));
  if( Config.mode === "edit" && loggedOn ) _pageHeader.AddIcon("fa-edit","Edit").onclick = () => window.location.href = `crag-edit.html?id=${cragID}`;

  DataStorage.Init(Config);
  ImageStorage.Init(Config);

  const cragIndex = new CragIndex();
  const cragIndexData = await cragIndex.Load(DataStorage);
  const cragIndexEntry = cragIndexData.crags.filter(crag => crag.id == cragID)[0];

  try {
    const cragStorage = new CragStorage('client', Config);
    _crag = await cragStorage.Load(cragID);
  }
  catch ( err ) {
    _crag = new Crag({id:cragID});
  }

  document.getElementById('crag-name').innerText = cragIndexEntry.name;    

  _mainTopoImage = new TopoImage(document.getElementById('main-topo-image'), false);

  _topoMediaScroller = new TopoMediaScroller(document.getElementById('topo-images-container'), _crag, false, OnTopoSelected);
  _topoMediaScroller.LoadTopoImages(ImageStorage);
}

let OnTopoSelected = (topoID, topoContainer) => {
  const selectedTopo = new Crag(_crag).GetMatchingTopo(topoID);
  document.getElementById('main-topo-container').classList.remove('do-not-display');
  _mainTopoImage.image = _topoMediaScroller.topoImages.get(topoID);
  _mainTopoImage.topo = selectedTopo;
  _mainTopoImage.Refresh();
  _topoRouteTable = new TopoRouteTable(document.getElementById('topo-route-table'), selectedTopo);
}
