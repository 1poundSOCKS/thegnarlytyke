const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const CragIndex = require('./objects/crag-index.cjs');

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  DataStorage.Init(Config);
  const cragIndex = new CragIndex();
  await cragIndex.Load(DataStorage);
  const parentElement = document.getElementById('crag-covers-container');
  cragIndex.data.crags.forEach( crag => {
    AppendCrag(crag, parentElement);
  })

  if( Config.mode === "edit" ) {
    document.getElementById('edit-crag-index-address').setAttribute('href', `./crag-index-edit.html`);
    document.getElementById('crag-index-icon-bar').classList.remove('do-not-display');
  }
}

let AppendCrag = (crag, parentElement) => {
  let cragElement = document.createElement('div');
  cragElement.classList.add("crag-cover-container")
  cragElement.setAttribute('data-id', crag.id);
  cragElement.setAttribute('onclick',`window.location.href='crag-view.html?id=${crag.id}'`);
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
