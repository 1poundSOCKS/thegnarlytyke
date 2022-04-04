require('./crag_object.js');
require('./crag_view.js');
require('./route_tables.js');
require('./topo-overlay.js');

window.onload = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const cragID = urlParams.get('id');
  const cragNameDisplayElement = document.getElementById('crag-view-header');
  LoadAndDisplayCrag(`./data/${cragID}.crag.json`, './images/', cragNameDisplayElement);
  fetch('./ping')
  .then(response => {
    if( response.status == 200 )
      document.getElementById('crag-view-icon-bar').classList.remove('do-not-display');
  });
}
