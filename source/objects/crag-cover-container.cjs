const ImageFileCompressor = require('./image-file-compressor.cjs');
const Crag = require('./crag.cjs');

let CragCoverContainer = function(cragDetails) {
  this.element = document.createElement('div');
  this.element.classList.add("crag-cover-container")
  this.cragDetails = cragDetails
  this.element.setAttribute('data-id', this.cragDetails.id);
  this.canvas = document.createElement('canvas');
  this.canvas.classList.add("crag-cover-image");
  this.element.appendChild(this.canvas);
}

CragCoverContainer.prototype.LoadCrag = function(dataStorage) {
  if( this.crag ) return this.crag
  this.crag = new Crag()
  return this.crag.SafeLoad(this.cragDetails.id,dataStorage)
}

CragCoverContainer.prototype.SaveCrag = async function (dataStorage,imageStorage) {
  const imageSaveResponse = await this.SaveImage(imageStorage)
  if( imageSaveResponse == null ) return null
  return this.crag.Save(dataStorage)
}

CragCoverContainer.prototype.UpdateImage = async function(imageFile) {
  const compressor = new ImageFileCompressor(this.canvas)
  this.image = await compressor.LoadAndCompress(imageFile)
  this.imageData = compressor.compressedImageData
  this.Refresh()
}

CragCoverContainer.prototype.LoadImage = function(imageStorage) {
  if( !this.cragDetails.imageFile ) return
  imageStorage.LoadImageFromFile(this.cragDetails.imageFile)
  .then( image => {
    this.image = image
    this.Refresh()
  })
}

CragCoverContainer.prototype.SaveImage = async function(imageStorage) {
  if( !this.imageData ) return null
  const saveResponse = await imageStorage.SaveImage(this.cragDetails.id,this.imageData,'crag')
  if( saveResponse.filename ) this.cragDetails.imageFile = saveResponse.filename
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
  const metrics = ctx.measureText(this.cragDetails.name);
  let widthOfText = metrics.width;
  const xPosOfText = ctx.canvas.width /  2 - widthOfText / 2;
  ctx.fillStyle = 'rgba(225,225,225,0.6)';
  ctx.fillRect(0,0,ctx.canvas.width,60);
  ctx.fillStyle = "rgb(30,30,30)";
  ctx.fillText(this.cragDetails.name, xPosOfText, 50);
}

CragCoverContainer.prototype.CopyImageToCanvas = function(destCanvas) {
  destCanvas.width = this.canvas.width
  destCanvas.height = this.canvas.height
  var ctx = destCanvas.getContext('2d')
  ctx.drawImage(this.image,0,0)
}

module.exports = CragCoverContainer;
