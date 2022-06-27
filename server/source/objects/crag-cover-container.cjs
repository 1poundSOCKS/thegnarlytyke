let CragCoverContainer = function(crag, imageURL) {
  this.crag = crag;
  this.imageURL = imageURL;

  this.element = document.createElement('div');
  this.element.classList.add("crag-cover-container")
  this.element.setAttribute('data-id', crag.id);

  if( crag.imageLoader ) {
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add("crag-cover-image");
    this.element.appendChild(this.canvas);
    crag.imageLoader.then( image => {
      this.image = image;
      this.Refresh();
     })
  }
  else {
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add("crag-cover-image");
    this.element.appendChild(this.canvas);
   }
}

CragCoverContainer.prototype.Refresh = function() {
  this.canvas.width = this.image.width;
  this.canvas.height = this.image.height;
  const ctx = this.canvas.getContext("2d");
  ctx.drawImage(this.image,0, 0);
  const fontSize = 3;
  ctx.font = `bold ${fontSize}rem six caps`;
  const metrics = ctx.measureText(this.crag.name);
  let widthOfText = metrics.width;
  const xPosOfText = ctx.canvas.width /  2 - widthOfText / 2;
  ctx.fillStyle = 'rgba(225,225,225,0.6)';
  ctx.fillRect(0,0,ctx.canvas.width,60);
  ctx.fillStyle = "rgb(30,30,30)";
  ctx.fillText(this.crag.name, xPosOfText, 50);
}

module.exports = CragCoverContainer;