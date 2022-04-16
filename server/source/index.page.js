require('./crag_object.js');
require('./crag_view.js');
require('./route_tables.js');

window.onload = () => {
  LoadAndDisplayCrag('./data/crag.json', './images/');
}
