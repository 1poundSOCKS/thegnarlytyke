const Config = require('./objects/config.cjs');
require('./crag_view.js');
require('./route_tables.js');

window.onload = () => {
  fetch('config.json')
  .then( response => response.json() )
  .then( parsedData => {
    Config.Load(parsedData);
    OnConfigLoad();
  });
}

let OnConfigLoad = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const cragID = urlParams.get('id');
  const cragNameDisplayElement = document.getElementById('crag-view-header');
  LoadAndDisplayCrag(cragID, cragNameDisplayElement);
  if( Config.mode === "edit" ) {
    document.getElementById('upload-topos-address').setAttribute('href', `./upload-topos.html?id=${cragID}`);
    document.getElementById('edit-topos-address').setAttribute('href', `./crag-edit.html?id=${cragID}`);
    document.getElementById('crag-view-icon-bar').classList.remove('do-not-display');
  }
}
