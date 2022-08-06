const Topo = require("./topo.cjs")
const FileSelector = require('./file-selector.cjs')
const ImageFileCompressor = require('./image-file-compressor.cjs')

let TopoImageContainer = function(parentElement, topo, callbackObject) {
  if( !topo ) {
    topo = new Topo().topo
  }

  this.element = document.createElement('div')
  this.element.classList.add('topo-container')
  this.element.setAttribute('data-id', topo.id)
  this.canvas = document.createElement('canvas')
  this.canvas.classList.add('topo-image')
  this.canvas = this.element.appendChild(this.canvas)
  parentElement.appendChild(this.element)
  this.topo = topo
  this.element.onclick = () => {
    callbackObject.OnTopoSelected(this)
  }
}

TopoImageContainer.prototype.LoadImage = async function(imageStorage) {
  if( this.topo.imageFile ) {
      this.imageLoader = imageStorage.LoadImageFromFile(this.topo.imageFile);
      this.image = await this.imageLoader;
      this.Refresh();
  }
}

TopoImageContainer.prototype.Refresh = function() {
  this.canvas.setAttribute('width', this.image.width);
  this.canvas.setAttribute('height', this.image.height);
  let ctx = this.canvas.getContext('2d');
  ctx.drawImage(this.image, 0, 0);
}

TopoImageContainer.prototype.Select = function() {
  this.element.classList.add('selected');
}

TopoImageContainer.prototype.Unselect = function() {
  this.element.classList.remove('selected');
}

let TopoMediaScroller = function(element) {
  this.element = element
  this.fileSelector = new FileSelector(this.element)
}

TopoMediaScroller.prototype.Refresh = async function(crag,imageStorage) {
  this.crag = crag
  this.imageStorage = imageStorage
  this.element.innerHTML = ''
  this.selectedTopoImageContainer = null
  // this.topoImages = new Map()

  this.topoImageContainers = this.crag.topos.map( topo => new TopoImageContainer(this.element,topo,this) )

  const topoImageLoads = this.topoImageContainers.map( topoImageContainer => topoImageContainer.LoadImage(imageStorage) )
  if( this.autoSelectOnRefresh && topoImageLoads.length > 0 ) {
    await topoImageLoads[0];
    this.OnTopoSelected(this.topoImageContainers[0]);
  }
}

TopoMediaScroller.prototype.AddNewTopo = function() {
  const topoImageContainer = new TopoImageContainer(this.element,null,this)
  this.topoImageContainers.push(topoImageContainer)
  this.fileSelector.SelectFile( async file => {
    const compressor = new ImageFileCompressor(topoImageContainer.canvas)
    const image = await compressor.LoadAndCompress(file)
    const imageData = compressor.compressedImageData
    topoImageContainer.image = image
    topoImageContainer.imageData = imageData
    topoImageContainer.Refresh()
  })
}

TopoMediaScroller.prototype.OnTopoSelected = function(topoImageContainer) {
  if( this.selectedTopoImageContainer ) this.selectedTopoImageContainer.Unselect()
  this.selectedTopoImageContainer = topoImageContainer
  this.selectedTopoImageContainer.Select()

  if( this.topoImage ) {
    this.topoImage.image = topoImageContainer.image
    this.topoImage.topo = topoImageContainer.topo
    this.topoImage.Refresh()
  }
  if( this.topoRouteTable ) this.topoRouteTable.Refresh(topoImageContainer.topo)
}

TopoMediaScroller.prototype.GetSelectedTopoID = function() {
  if( !this.currentTopoContainer ) return null;
  return this.currentTopoContainer.dataset.id;
}

TopoMediaScroller.prototype.GetSelectedTopo = function() {
  if( !this.currentTopoContainer ) return null;
  return this.crag.GetMatchingTopo(this.currentTopoContainer.dataset.id);
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

// TopoMediaScroller.prototype.UpdateSelectedTopoImage = function(image) {
//   this.topoImages.set(this.GetSelectedTopoID(), image);
// }

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
