const ImageFileCompressor = require('./image-file-compressor.cjs');
const Crag = require('./crag.cjs');

let CragCoverContainer = function(cragCover) {
  this.element = document.createElement('div');
  this.element.classList.add("crag-cover-container")
  this.cragCover = cragCover
  this.element.setAttribute('data-id', this.cragCover.id);
  this.canvas = document.createElement('canvas');
  this.canvas.classList.add("crag-cover-image");
  this.element.appendChild(this.canvas);
}

CragCoverContainer.prototype.LoadCrag = async function(dataStorage) {
  if( this.crag ) return this.crag
  this.crag = new Crag()
  await this.crag.SafeLoad(this.cragCover.id,dataStorage)
  return this.crag
}

CragCoverContainer.prototype.UpdateImage = async function(imageFile) {
  const compressor = new ImageFileCompressor(this.canvas)
  this.image = await compressor.LoadAndCompress(imageFile)
  this.imageData = compressor.compressedImageData
  this.Refresh()
}

CragCoverContainer.prototype.LoadImage = async function(imageStorage) {
  if( !this.cragCover.imageFile ) return
  this.image = await imageStorage.LoadImageFromFile(this.cragCover.imageFile)
  this.Refresh()
}

CragCoverContainer.prototype.SaveImage = async function(imageStorage) {
  if( !this.imageData ) return null
  const saveResponse = await imageStorage.SaveImage(this.cragCover.id,this.imageData,'crag')
  if( saveResponse.filename ) this.cragCover.imageFile = saveResponse.filename
  return saveResponse
}

CragCoverContainer.prototype.Refresh = function() {
  const ctx = this.canvas.getContext("2d");

  const image = this.image

  if( image ) {
    this.canvas.width = image.width;
    this.canvas.height = image.height;
    ctx.drawImage(image,0, 0);  
  }
  else {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  const fontSize = 3;
  ctx.font = `bold ${fontSize}rem six caps`;
  const metrics = ctx.measureText(this.cragCover.name);
  let widthOfText = metrics.width;
  const xPosOfText = ctx.canvas.width /  2 - widthOfText / 2;
  ctx.fillStyle = 'rgba(225,225,225,0.6)';
  ctx.fillRect(0,0,ctx.canvas.width,60);
  ctx.fillStyle = "rgb(30,30,30)";
  ctx.fillText(this.cragCover.name, xPosOfText, 50);
}

CragCoverContainer.prototype.CopyImageToCanvas = function(destCanvas) {
  destCanvas.width = this.canvas.width
  destCanvas.height = this.canvas.height
  var ctx = destCanvas.getContext('2d')
  ctx.drawImage(this.image,0,0)
}

module.exports = CragCoverContainer;
