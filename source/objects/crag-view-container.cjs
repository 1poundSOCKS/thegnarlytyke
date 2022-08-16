const TopoMediaScroller = require('./topo-media-scroller.cjs');
const TopoImage = require('./topo-image.cjs');
const TopoRouteTable2 = require('./topo-route-table-2.cjs');

let CragViewContainer = function(parentElement,imageStorage) {
  this.parentElement = parentElement
  this.imageStorage = imageStorage

  this.cragNameElement = document.getElementById("crag-name")
  this.topoContainer = document.getElementById('main-topo-container')
  this.topoImage = new TopoImage(document.getElementById('main-topo-image'), false);
  this.topoRouteTable = new TopoRouteTable2(document.getElementById('topo-route-table-container'))
  this.topoMediaScroller = new TopoMediaScroller(document.getElementById('topo-images-container'))
  this.topoMediaScroller.topoImage = this.topoImage
  this.topoMediaScroller.topoRouteTable = this.topoRouteTable
  this.topoMediaScroller.autoSelectOnRefresh = true
}

CragViewContainer.prototype.Refresh = function(crag) {
  return new Promise( (accept) => {
    this.crag = crag
    if( this.cragNameElement ) {
      if( this.cragNameElement.nodeName.toLowerCase() === 'input' ) {
        this.cragNameElement.value = this.crag.name
        this.cragNameElement.onchange = () => {
          this.selectedContainer.cragDetails.name = this.cragNameElement.value
          this.selectedContainer.crag.name = this.cragNameElement.value
        }
      }
      else {
        this.cragNameElement.innerText = this.crag.name
      }
    }
    this.topoMediaScroller.Refresh(this.crag,this.imageStorage,true)
    .then( () => {
      if( this.crag.topos?.length == 0 ) this.topoContainer.style = 'display:none'
      else this.topoContainer.style = ''
      accept()
    })
  })
}

module.exports = CragViewContainer
