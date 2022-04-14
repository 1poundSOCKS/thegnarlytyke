const Config = require('./config.cjs');
require('./crag_object.js');
require('./crag_view.js');
require('./route_tables.js');
require('./topo-overlay.js');

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
  SetViewContentEditable(true);
  LoadAndDisplayCrag(cragID, cragNameDisplayElement);
}

module.exports = OnShiftTopoLeft = () => ShiftSelectedTopoLeft();
module.exports = OnShiftTopoRight = () => ShiftSelectedTopoRight();
module.exports = OnSave = () => SaveCrag();
