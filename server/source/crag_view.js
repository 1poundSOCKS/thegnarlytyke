const Config = require('./objects/config.cjs');
const Crag = require('./objects/crag.cjs');
const TopoOverlay = require('./objects/topo-overlay.cjs');
const TopoImage = require('./objects/topo-image.cjs');

let _crag = new Crag();
let _topoImages = new Map();
let _selectedTopoImageContainer = null;
let _contentEditable = false;
let _mainTopoImage = null;

module.exports = SetViewContentEditable = editable => {
  _contentEditable = editable;
  SetTableContentEditable(_contentEditable);
}

module.exports = LoadAndDisplayCrag = async (cragID, headerElement) => {
  _mainTopoImage = new TopoImage(document.getElementById('main-topo-image'));
  if( _contentEditable ) _mainTopoImage.AddMouseHandler();

  const env = Config.environment;
  const cragURL = `env/${env}/data/${cragID}.crag.json`;
  const imagesPath = `env/${env}/images/`;
  let response = await fetch(cragURL);
  let crag = await response.json();

  if( headerElement && crag.name ) headerElement.innerText = crag.name;
  
  _crag.Attach(crag);
  let cragTopoIDs = _crag.topos.map( topo => topo.id );
  
  let topoImageContainers = cragTopoIDs.map( topoID => {
    return document.getElementById('topo-images-container').appendChild(CreateTopoImageContainer(topoID));
  });

  let topoImageCanvases = topoImageContainers.map( container => {
    let topoCanvas = document.createElement('canvas')
    topoCanvas.classList.add('topo-image');
    topoCanvas = container.appendChild(topoCanvas);
    topoCanvas.onclick = event => OnTopoSelected(event);
    return topoCanvas;
  });
  
  topoImageCanvases.forEach( async canvas => {
    let topoID = canvas.parentElement.dataset.id;
    let topo = _crag.GetMatchingTopo(topoID);
    if( topo && topo.imageFile ) {
        let topoImage = await LoadImage(`${imagesPath}${topo.imageFile}`);
      _topoImages.set(topoID, topoImage);
      DisplayTopoImage(canvas, topoImage);
    }
  });

  RefreshCragRouteTable(_crag);
}

module.exports = SaveCrag = async () => {
  const requestBody = JSON.stringify(_crag);

  let response = await fetch('./save_crag', {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'same-origin',
    body: requestBody
  });
  let parsedResponse = await response.json();
}

module.exports = LoadImage = (url) => new Promise( (resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = (err) => reject(err);
  img.src = url;
});

let OnTopoSelected = event => {
  if( _selectedTopoImageContainer ) _selectedTopoImageContainer.classList.remove('topo-container-selected');

  _selectedTopoImageContainer = event.target.parentElement;
  _selectedTopoImageContainer.classList.add('topo-container-selected');
  let selectedTopoID = GetSelectedTopoID();

  let topoImagesContainer = document.getElementById('topo-images-container');
  topoImagesContainer.classList.remove('topo-images-container-initial');
  topoImagesContainer.classList.add('topo-images-container');

  RefreshIcons();
  RefreshMainTopoView();
  RefreshTopoRouteTable(_crag, selectedTopoID);
  RefreshCragRouteTable(_crag, selectedTopoID);

  document.getElementById('main-topo-container').classList.remove('do-not-display');
  if( _contentEditable ) AddMouseHandlerToMainTopoCanvas();
}

module.exports = GetSelectedTopoID = () => _selectedTopoImageContainer?.dataset.id;

let RefreshIcons = () => {
  const shiftTopoLeftContainer = document.getElementById('shift-topo-left-container');
  if( shiftTopoLeftContainer ) {
    if( _selectedTopoImageContainer.previousSibling ) shiftTopoLeftContainer.classList.remove('do-not-display');
    else shiftTopoLeftContainer.classList.add('do-not-display');
  }

  const shiftTopoRightContainer = document.getElementById('shift-topo-right-container');
  if( shiftTopoRightContainer ) {
    if( _selectedTopoImageContainer.nextSibling ) shiftTopoRightContainer.classList.remove('do-not-display');
    else shiftTopoRightContainer.classList.add('do-not-display');
  }
}

module.exports = ShiftSelectedTopoLeft = () => {
  const parentNode = _selectedTopoImageContainer.parentNode;
  const previousContainer = _selectedTopoImageContainer.previousSibling;
  _selectedTopoImageContainer.remove();
  parentNode.insertBefore(_selectedTopoImageContainer, previousContainer);
  RefreshIcons();
  const selectedTopoIndex = _crag.GetTopoIndex(GetSelectedTopoID());
  _crag.SwapTopos(selectedTopoIndex, selectedTopoIndex - 1);
}

module.exports = ShiftSelectedTopoRight = () => {
  const parentNode = _selectedTopoImageContainer.parentNode;
  const nextContainer = _selectedTopoImageContainer.nextSibling;
  nextContainer.remove();
  parentNode.insertBefore(nextContainer, _selectedTopoImageContainer);
  RefreshIcons();
  const selectedTopoIndex = _crag.GetTopoIndex(GetSelectedTopoID());
  _crag.SwapTopos(selectedTopoIndex, selectedTopoIndex + 1);
}

module.exports = RefreshMainTopoView = () => {
  let selectedTopoID = _selectedTopoImageContainer.dataset.id;
  _mainTopoImage.image = _topoImages.get(selectedTopoID);
  _mainTopoImage.topo = _crag.GetMatchingTopo(selectedTopoID);
  _mainTopoImage.Refresh();
}

module.exports = CreateTopoImageContainer = (topoID) => {
  let container = document.createElement('div');
  container.classList.add('topo-container');
  container.setAttribute('data-id', topoID);
  return container;
}

module.exports = DisplayTopoImage = (topoCanvas, topoImage, heightInRem) => {
  ResizeTopoCanvas(topoCanvas, topoImage, heightInRem);
  let ctx = topoCanvas.getContext('2d');
  ctx.drawImage(topoImage, 0, 0, topoCanvas.width, topoCanvas.height);
  return topoCanvas;
}

module.exports = ResizeTopoCanvas = (topoCanvas, topoImage, heightInRem) => {
  let height = heightInRem;
  let width = topoImage.width * height / topoImage.height;
  topoCanvas.setAttribute('width', topoImage.width);
  topoCanvas.setAttribute('height', topoImage.height);
  return topoCanvas;
}
