const CragCoverContainer = require("./crag-cover-container.cjs");

let CragMediaScroller = function(element, imagesURL, crags, OnCragSelectedHandler) {
  this.element = element;
  this.imagesURL = imagesURL;
  this.crags = crags;
  this.OnCragSelectedHandler = OnCragSelectedHandler;
  this.crags.forEach( crag => {
    this.AppendCrag(crag);
  })
  this.selectedCanvas = null;
  this.selectedCrag = null;
}

CragMediaScroller.prototype.AppendCrag = function(crag) {
  const cragCoverContainer = new CragCoverContainer(crag, this.imagesURL);
  
  cragCoverContainer.element.onclick = () => {
    this.selectedContainer = cragCoverContainer;
    this.OnCragSelectedHandler();
  }

  this.element.appendChild(cragCoverContainer.element);
}

CragMediaScroller.prototype.RefreshSelectedContainer = function() {
  if( this.selectedContainer ) this.selectedContainer.Refresh();
}

module.exports = CragMediaScroller;
