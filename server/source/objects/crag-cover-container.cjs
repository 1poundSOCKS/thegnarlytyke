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
      this.canvas.width = image.width;
      this.canvas.height = image.height;
      const ctx = this.canvas.getContext("2d");
      ctx.drawImage(image,0, 0);
      const fontSize = 3;
      ctx.font = `bold ${fontSize}rem six caps`;
      const metrics = ctx.measureText(crag.name);
      let widthOfText = metrics.width;
      const xPosOfText = ctx.canvas.width /  2 - widthOfText / 2;
      ctx.fillStyle = 'rgba(225,225,225,0.6)';
      ctx.fillRect(0,0,ctx.canvas.width,60);
      ctx.fillStyle = "rgb(30,30,30)";
      ctx.fillText(crag.name, xPosOfText, 50);
     })
  }
  else if( crag.imageFile ) {
    this.image = document.createElement('img');
    this.image.classList.add("crag-cover-image");
    this.image.setAttribute('src',`${this.imageURL}${crag.imageFile}`)
    this.image.setAttribute('alt',crag.name);
    this.element.appendChild(this.image);
  }
  else {
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add("crag-cover-image");
    this.element.appendChild(this.canvas);
   }
}

module.exports = CragCoverContainer;