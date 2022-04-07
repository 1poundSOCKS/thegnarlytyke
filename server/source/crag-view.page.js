require('./crag_object.js');
require('./crag_view.js');
require('./route_tables.js');
require('./topo-overlay.js');

window.onload = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const cragID = urlParams.get('id');
  const cragNameDisplayElement = document.getElementById('crag-view-header');
  LoadAndDisplayCrag(`env/prod/data/${cragID}.crag.json`, 'env/prod/images/', cragNameDisplayElement);
  fetch('./ping')
  .then(response => {
    if( response.status == 200 )
      document.getElementById('crag-view-icon-bar').classList.remove('do-not-display');
  });
  document.getElementById('upload-topos-address').setAttribute('href', `./upload-topos.html?id=${cragID}`);
  document.getElementById('edit-topos-address').setAttribute('href', `./edit-crag.html?id=${cragID}`);
}
