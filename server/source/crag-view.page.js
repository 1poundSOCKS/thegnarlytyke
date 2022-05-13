const Config = require('./objects/config.cjs');
const CragLoader = require('./objects/crag-loader.cjs');
const Crag = require('./objects/crag.cjs');
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs');
const TopoImage = require('./objects/topo-image.cjs');
require('./route_tables.js');

let _crag = null;
let _topoMediaScroller = null;
let _mainTopoImage = null;

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
  _crag = await cragStorage.Load(cragID);
  
  document.getElementById('crag-view-header').innerText = _crag.name;

  _mainTopoImage = new TopoImage(document.getElementById('main-topo-image'), false);

  _topoMediaScroller = new TopoMediaScroller(document.getElementById('topo-images-container'), _crag, false, OnTopoSelected);
  _topoMediaScroller.LoadTopoImages(`env/${Config.environment}/images/`);

  if( Config.mode === "edit" ) {
    document.getElementById('upload-topos-address').setAttribute('href', `./upload-topos.html?id=${cragID}`);
    document.getElementById('edit-topos-address').setAttribute('href', `./crag-edit.html?id=${cragID}`);
    document.getElementById('crag-view-icon-bar').classList.remove('do-not-display');
  }
}

let OnTopoSelected = (topoID, topoContainer) => {
  RefreshIcons(topoContainer);
  document.getElementById('main-topo-container').classList.remove('do-not-display');
  _mainTopoImage.image = _topoMediaScroller.topoImages.get(topoID);
  _mainTopoImage.topo = new Crag(_crag).GetMatchingTopo(topoID);
  _mainTopoImage.Refresh();
  RefreshTopoRouteTable(_crag, topoID);
}

let RefreshIcons = (topoContainer) => {
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
