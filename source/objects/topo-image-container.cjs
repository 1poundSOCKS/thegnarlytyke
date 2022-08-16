const Topo = require("./topo.cjs")
const ImageFileCompressor = require('./image-file-compressor.cjs');
const TopoOverlay = require("./topo-overlay.cjs");

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
  const topoOverlay = new TopoOverlay(this.topo,false,true);
  topoOverlay.Draw(this.canvas);
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

TopoImageContainer.prototype.ShiftLeft = function() {
  const previousSibling = this.GetPreviousSibling()
  if( previousSibling == null ) return
  this.InsertBefore(previousSibling)
}

TopoImageContainer.prototype.ShiftRight = function() {
  const nextSibling = this.GetNextSibling()
  if( nextSibling == null ) return
  this.InsertAfter(nextSibling)
}

TopoImageContainer.prototype.GetPreviousSibling = function() {
  const previousSiblings = []
  let element = this.element
  while( element.previousSibling ) {
    if( element.previousSibling.dataset.id ) previousSiblings.push(element.previousSibling)
    element = element.previousSibling
  }
  if( previousSiblings.length == 0 ) return null
  return previousSiblings[0]
}

TopoImageContainer.prototype.GetNextSibling = function() {
  const subsequentSiblings = []
  let element = this.element
  while( element.nextSibling ) {
    if( element.nextSibling.dataset.id ) subsequentSiblings.push(element.nextSibling)
    element = element.nextSibling
  }
  if( subsequentSiblings.length == 0 ) return null
  return subsequentSiblings[0]
}

TopoImageContainer.prototype.InsertBefore = function(element) {
  this.element.parentElement.insertBefore(this.element,element)
}

TopoImageContainer.prototype.InsertAfter = function(element) {
  element.parentElement.insertBefore(element,this.element)
}

module.exports = TopoImageContainer