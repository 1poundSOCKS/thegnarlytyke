const CragIndex = require('./crag-index.cjs');
const CragCoverContainer = require("./crag-cover-container.cjs");

let CragIndexContainer = function(element,dataStorage,imageStorage) {
  this.element = element
  this.dataStorage = dataStorage
  this.imageStorage = imageStorage
}

CragIndexContainer.prototype.Load = async function(OnCragSelectedHandler) {
  this.cragIndex = new CragIndex()
  await this.cragIndex.Load(this.dataStorage,this.imageStorage)
  this.cragIndex.data.crags.forEach( crag => {
    this.AppendCrag(crag,OnCragSelectedHandler);
  })
}

CragIndexContainer.prototype.AppendCrag = function(crag,OnCragSelectedHandler) {
  const cragCoverContainer = new CragCoverContainer(crag, this.imageStorage.imagesPath);
  this.element.appendChild(cragCoverContainer.element);
  cragCoverContainer.element.onclick = () => {
    this.selectedContainer = cragCoverContainer;
    OnCragSelectedHandler(this.selectedContainer);
  }
}

CragIndexContainer.prototype.RefreshSelectedContainer = function() {
  if( this.selectedContainer ) this.selectedContainer.Refresh();
}

module.exports = CragIndexContainer;
