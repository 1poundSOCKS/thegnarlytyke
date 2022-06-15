const Config = require('./objects/config.cjs');
const CragIndex = require('./objects/crag-index.cjs');
const CragMediaScroller = require('./objects/crag_media_scroller.cjs');

let _cragIndex = null;
let _cragMediaScroller = null;

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  _cragIndex = new CragIndex(Config);
  const cragIndexData = await _cragIndex.Load();
  _cragMediaScroller = new CragMediaScroller(document.getElementById('crag-covers-container'), Config.images_url, cragIndexData.crags, OnCragSelected)
}

let OnCragSelected = (cragID) => {
  console.log(`Crag clicked: ${cragID}`);
}

module.exports = OnAddCrag = () => {
  const crag = _cragIndex.AppendCrag();
  _cragMediaScroller.AppendCrag(crag);
}

module.exports = OnSaveCragIndex = () => {
  console.log(`Save crag index`)
}
