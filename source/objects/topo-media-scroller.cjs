const TopoImageContainer = require('./topo-image-container.cjs')
const FileSelector = require('./file-selector.cjs')

let TopoMediaScroller = function(element) {
  this.element = element
  this.topoImageContainers = new Map()
  this.fileSelector = new FileSelector(this.element)
}

TopoMediaScroller.prototype.Refresh = function(crag,imageStorage) {
  return new Promise( accept => {
    this.crag = crag
    this.data = crag.topos
    this.imageStorage = imageStorage
    this.element.innerHTML = ''
    this.selectedTopoImageContainer = null
    this.topoImageContainers.clear()
  
    const topoImageLoads = this.data.map( topo => {
      const topoImageContainer = new TopoImageContainer(this.element,topo,this)
      this.topoImageContainers.set(topo.id,topoImageContainer)
      return topoImageContainer.LoadImage(imageStorage)
    })
  
    if( this.autoSelectOnRefresh && topoImageLoads.length > 0 ) {
      const firstTopo = this.topoImageContainers.get(this.data[0].id)
      firstTopo.imageLoader.then( () => {
        this.OnTopoSelected(this.topoImageContainers.get(this.data[0].id));
      })
    }

    Promise.all(topoImageLoads)
    .then( () => {
      accept()
    })
  })
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
  this.selectedTopo = this.crag.GetMatchingTopo(this.selectedTopoImageContainer.element.dataset.id)
  if( this.topoImage ) {
    this.topoImage.image = topoImageContainer.topo.image
    this.topoImage.topo = topoImageContainer.topo
    this.topoImage.Refresh()
  }
  if( this.topoRouteTable ) this.topoRouteTable.Refresh(topoImageContainer.topo)
}

TopoMediaScroller.prototype.DisplayTopoImage = function(topoCanvas, topoImage) {
  topoCanvas.setAttribute('width', topoImage.width);
  topoCanvas.setAttribute('height', topoImage.height);
  let ctx = topoCanvas.getContext('2d');
  ctx.drawImage(topoImage, 0, 0, topoCanvas.width, topoCanvas.height);
  return topoCanvas;
}

TopoMediaScroller.prototype.ShiftSelectedLeft = function() {
  if( !this.selectedTopoImageContainer ) return
  this.selectedTopoImageContainer.ShiftLeft()
  this.RefreshData()
}

TopoMediaScroller.prototype.ShiftSelectedRight = function() {
  if( !this.selectedTopoImageContainer ) return
  this.selectedTopoImageContainer.ShiftRight()
  this.RefreshData()
}

module.exports = TopoMediaScroller;
