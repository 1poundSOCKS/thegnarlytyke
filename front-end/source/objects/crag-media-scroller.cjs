const CragCoverContainer = require("./crag-cover-container.cjs");

let CragMediaScroller = function(element, imagesURL, crags, OnCragSelectedHandler) {
  this.element = element;
  this.imagesURL = imagesURL;
  this.crags = crags;
  this.OnCragSelectedHandler = OnCragSelectedHandler;
  this.crags.forEach( crag => {
    this.AppendCrag(crag);
  })
}

CragMediaScroller.prototype.AppendCrag = function(crag) {
  const cragCoverContainer = new CragCoverContainer(crag, this.imagesURL);
  this.element.appendChild(cragCoverContainer.element);
  cragCoverContainer.element.onclick = () => {
    this.selectedContainer = cragCoverContainer;
    this.OnCragSelectedHandler();
  }
}

CragMediaScroller.prototype.RefreshSelectedContainer = function() {
  if( this.selectedContainer ) this.selectedContainer.Refresh();
}

module.exports = CragMediaScroller;
