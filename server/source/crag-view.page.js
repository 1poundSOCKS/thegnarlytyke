const Config = require('./objects/config.cjs');
const ImageStorage = require("./objects/image-storage.cjs");
const CragLoader = require('./objects/crag-loader.cjs');
const Crag = require('./objects/crag.cjs');
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs');
const TopoImage = require('./objects/topo-image.cjs');
const TopoRouteTable = require('./objects/topo-route-table.cjs');

let _crag = null;
let _topoMediaScroller = null;
let _mainTopoImage = null;
let _topoRouteTable = null;

window.onload = () => {
  fetch('config.json', {cache: "reload"})
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

  ImageStorage.Init(Config);

  const cragStorage = new CragLoader('client', Config);
  _crag = await cragStorage.Load(cragID);
  
  document.getElementById('crag-view-header').innerText = _crag.name;

  _mainTopoImage = new TopoImage(document.getElementById('main-topo-image'), false);

  _topoMediaScroller = new TopoMediaScroller(document.getElementById('topo-images-container'), _crag, false, OnTopoSelected);
  _topoMediaScroller.LoadTopoImages(ImageStorage);

  if( Config.mode === "edit" ) {
    document.getElementById('edit-topos-address').setAttribute('href', `./crag-edit.html?id=${cragID}`);
    document.getElementById('crag-view-icon-bar').classList.remove('do-not-display');
  }
}

let OnTopoSelected = (topoID, topoContainer) => {
  const selectedTopo = new Crag(_crag).GetMatchingTopo(topoID);
  document.getElementById('main-topo-container').classList.remove('do-not-display');
  _mainTopoImage.image = _topoMediaScroller.topoImages.get(topoID);
  _mainTopoImage.topo = selectedTopo;
  _mainTopoImage.Refresh();
  _topoRouteTable = new TopoRouteTable(document.getElementById('topo-route-table'), selectedTopo);
}
