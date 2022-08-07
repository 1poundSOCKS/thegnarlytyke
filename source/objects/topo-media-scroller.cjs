const Topo = require("./topo.cjs")
const FileSelector = require('./file-selector.cjs')
const ImageFileCompressor = require('./image-file-compressor.cjs');

let TopoImageContainer = function(parentElement, topo, callbackObject) {
  if( !topo ) topo = new Topo().topo
  this.id = topo.id
  this.element = document.createElement('div')
  this.element.classList.add('topo-container')
  this.element.dataset.id = topo.id
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
  if( this.topo.imageData ) {
    this.topo.image = await imageStorage.LoadImageFromDataURI(this.topo.imageData)
    this.Refresh()
  }
  else if( this.topo.imageFile ) {
      this.imageLoader = imageStorage.LoadImageFromFile(this.topo.imageFile);
      this.topo.image = await this.imageLoader;
      this.Refresh();
  }
}

TopoImageContainer.prototype.Refresh = function() {
  this.canvas.setAttribute('width', this.topo.image.width);
  this.canvas.setAttribute('height', this.topo.image.height);
  let ctx = this.canvas.getContext('2d');
  ctx.drawImage(this.topo.image, 0, 0);
}

TopoImageContainer.prototype.Select = function() {
  this.element.classList.add('selected');
}

TopoImageContainer.prototype.Unselect = function() {
  this.element.classList.remove('selected');
}

TopoImageContainer.prototype.UpdateImage = async function(imageFile) {
  const compressor = new ImageFileCompressor(this.canvas)
  this.topo.image = await compressor.LoadAndCompress(imageFile)
  this.topo.imageData = compressor.compressedImageData
  this.Refresh()
}

let TopoMediaScroller = function(element) {
  this.element = element
  this.topoImageContainers = new Map()
  this.fileSelector = new FileSelector(this.element)
}

TopoMediaScroller.prototype.Refresh = async function(crag,imageStorage) {
  this.crag = crag
  this.data = crag.topos
  this.imageStorage = imageStorage
  this.element.innerHTML = ''
  this.selectedTopoImageContainer = null
  this.topoImageContainers.clear()

  const topoImageLoads = this.data.map( topo => {
    const topoImageContainer = new TopoImageContainer(this.element,topo,this)
    this.topoImageContainers.set(topo.id,topoImageContainer)
    topoImageContainer.LoadImage(imageStorage)
  })

  if( this.autoSelectOnRefresh && topoImageLoads.length > 0 ) {
    const firstTopo = this.topoImageContainers.get(this.data[0].id)
    await firstTopo.imageLoader
    this.OnTopoSelected(this.topoImageContainers.get(this.data[0].id));
  }
}

TopoMediaScroller.prototype.AddNew = function() {
  const topoImageContainer = new TopoImageContainer(this.element,null,this)
  this.topoImageContainers.set(topoImageContainer.id,topoImageContainer)
  this.UpdateImage(topoImageContainer)
  this.RefreshData()
}

TopoMediaScroller.prototype.RefreshData = function() {
  const topoContainers = this.GetContainers()
  this.data.length = 0
  topoContainers.forEach( topo => {
    this.data.push(this.topoImageContainers.get(topo.dataset.id).topo)
  })
}

TopoMediaScroller.prototype.GetContainers = function() {
  return Array.from(this.element.childNodes)
  .filter( element => element.dataset.id )
}

TopoMediaScroller.prototype.UpdateSelectedImage = function() {
  if( !this.selectedTopoImageContainer ) return
  this.UpdateImage(this.selectedTopoImageContainer)
}

TopoMediaScroller.prototype.UpdateImage = function(topoImagecontainer) {
  this.fileSelector.SelectFile( file => topoImagecontainer.UpdateImage(file))
}

TopoMediaScroller.prototype.OnTopoSelected = function(topoImageContainer) {
  if( this.selectedTopoImageContainer ) this.selectedTopoImageContainer.Unselect()
  this.selectedTopoImageContainer = topoImageContainer
  this.selectedTopoImageContainer.Select()

  if( this.topoImage ) {
    this.topoImage.image = topoImageContainer.topo.image
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
