require('./config.js');
require('./crag_object.js');
require('./crag_view.js');
require('./route_tables.js');
require('./topo-overlay.js');

window.onload = () => {
  SetEnvironment().then( () => {
    OnEnvironmentSet();
  });
}

let OnEnvironmentSet = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const cragID = urlParams.get('id');
  const cragNameDisplayElement = document.getElementById('crag-view-header');
  SetViewContentEditable(true);
  LoadAndDisplayCrag(cragID, cragNameDisplayElement);
  document.getElementById('save-crag-button').onclick = () => {
    SaveCrag();
  }
}
