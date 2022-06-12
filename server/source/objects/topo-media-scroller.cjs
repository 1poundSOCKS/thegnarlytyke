const Crag = require("./crag.cjs");
const { SaveImageAndUpdateFilename } = require("./image-storage.cjs");

let TopoMediaScroller = function(element, crag, edit, OnTopoSelectedCallback) {
  this.element = element;
  this.crag = crag;
  this.currentTopoContainer = null;
  this.edit = edit;
  this.topoImages = new Map();
  this.OnTopoSelectedCallback = OnTopoSelectedCallback;
}

TopoMediaScroller.prototype.LoadTopoImages = async function(imageStorage) {
  let cragTopoIDs = this.crag.topos.map( topo => topo.id );
  
  let topoImageContainers = cragTopoIDs.map( topoID => {
    return this.element.appendChild(this.CreateTopoImageContainer(topoID));
  });

  let topoImageCanvases = topoImageContainers.map( container => {
    let topoCanvas = document.createElement('canvas')
    topoCanvas.classList.add('topo-image');
    topoCanvas = container.appendChild(topoCanvas);
    topoCanvas.onclick = () => this.OnTopoSelected(container);
    return topoCanvas;
  });

  const topoImageLoaders = [];
  const crag = new Crag(this.crag);
  topoImageCanvases.forEach( async canvas => {
    let topoID = canvas.parentElement.dataset.id;
    let topo = crag.GetMatchingTopo(topoID);
    if( !topo ) return;

    if( topo.imageFile ) {
      try {
        let topoImageLoader = imageStorage.LoadImageFromFile(topo.imageFile);
        topoImageLoaders.push(topoImageLoader);
        let topoImage = await topoImageLoader;
        this.topoImages.set(topoID, topoImage);
        this.DisplayTopoImage(canvas, topoImage);
      }
      catch( e ) {
        console.error(e);
      }
    }
    else {
      try {
        let topoImageLoader = imageStorage.LoadImageFromAPI(topo.id);
        topoImageLoaders.push(topoImageLoader);
        let topoImage = await topoImageLoader;
        this.topoImages.set(topoID, topoImage);
        this.DisplayTopoImage(canvas, topoImage);
      }
      catch( e ) {
        console.error(e);
      }
    }
  });

  if( topoImageLoaders.length > 0 ) {
    await topoImageLoaders[0];
    this.OnTopoSelected(topoImageContainers[0]);
  }
}

TopoMediaScroller.prototype.AddTopo = function(topo) {
  const container = this.element.appendChild(this.CreateTopoImageContainer(topo.id));
  let canvas = document.createElement('canvas');
  canvas.classList.add('topo-image');
  canvas = container.appendChild(canvas);
  canvas.onclick = event => this.OnTopoSelected(event.target.parentElement);
  return canvas;
}

TopoMediaScroller.prototype.CreateTopoImageContainer = function(topoID) {
  let container = document.createElement('div');
  container.classList.add('topo-container');
  container.setAttribute('data-id', topoID);
  return container;
}

TopoMediaScroller.prototype.OnTopoSelected = function(topoContainer) {
  if( this.currentTopoContainer ) this.currentTopoContainer.classList.remove('topo-container-selected');
  this.currentTopoContainer = topoContainer;
  this.currentTopoContainer.classList.add('topo-container-selected');
  this.OnTopoSelectedCallback(this.currentTopoContainer.dataset.id, this.currentTopoContainer);
}

TopoMediaScroller.prototype.GetSelectedTopoID = function() {
  if( !this.currentTopoContainer ) return null;
  return this.currentTopoContainer.dataset.id;
}

TopoMediaScroller.prototype.GetSelectedTopoCanvas = function() {
  return this.currentTopoContainer.children[0]
};

TopoMediaScroller.prototype.DisplayTopoImage = function(topoCanvas, topoImage) {
  topoCanvas.setAttribute('width', topoImage.width);
  topoCanvas.setAttribute('height', topoImage.height);
  let ctx = topoCanvas.getContext('2d');
  ctx.drawImage(topoImage, 0, 0, topoCanvas.width, topoCanvas.height);
  return topoCanvas;
}

TopoMediaScroller.prototype.UpdateSelectedTopoImage = function(image) {
  this.topoImages.set(this.GetSelectedTopoID(), image);
}

TopoMediaScroller.prototype.ShiftCurrentTopoLeft = function() {
  if( !this.currentTopoContainer ) return;
  const parentNode = this.currentTopoContainer.parentNode;
  const previousContainer = this.currentTopoContainer.previousSibling;
  this.currentTopoContainer.remove();
  parentNode.insertBefore(this.currentTopoContainer, previousContainer);
}

TopoMediaScroller.prototype.ShiftCurrentTopoRight = function() {
  if( !this.currentTopoContainer ) return;
  const parentNode = this.currentTopoContainer.parentNode;
  const nextContainer = this.currentTopoContainer.nextSibling;
  nextContainer.remove();
  parentNode.insertBefore(nextContainer, this.currentTopoContainer);
}

module.exports = TopoMediaScroller;
