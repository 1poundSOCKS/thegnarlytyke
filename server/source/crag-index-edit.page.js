const Config = require('./objects/config.cjs');
const CragIndex = require('./objects/crag-index.cjs');

let _cragIndex = null;

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  _cragIndex = new CragIndex(Config);
  await _cragIndex.Load();
  const parentElement = document.getElementById('crag-covers-container');
  _cragIndex.data.crags.forEach( crag => {
    AppendCrag(crag, parentElement);
  })
}

let AppendCrag = (crag, parentElement) => {
  let cragElement = document.createElement('div');
  cragElement.classList.add("crag_cover-container")
  cragElement.setAttribute('data-id', crag.id);
  cragElement.onclick = () => OnCragClicked();
  let cragHeader = document.createElement('h3');
  cragHeader.classList.add("crag-cover-header");
  cragHeader.innerText = crag.name;
  cragElement.appendChild(cragHeader)
  const cragImage = document.createElement('img');
  cragImage.classList.add('crag-cover-image');
  cragImage.setAttribute('src',`${Config.images_url}${crag.imageFile}`)
  cragImage.setAttribute('alt',crag.name);
  cragElement.appendChild(cragImage);
  parentElement.appendChild(cragElement);
}

let OnCragClicked = () => {
  console.log(`Crag clicked`);
}

module.exports = OnAddCrag = () => {
  console.log(`Add crag`)
}

module.exports = OnSaveCragIndex = () => {
  console.log(`Save crag index`)
}
