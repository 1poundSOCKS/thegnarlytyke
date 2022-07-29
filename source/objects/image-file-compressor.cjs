let ImageFileCompressor = function(canvas) {
  this.canvas = canvas;
  this.imageData = null;
  this.image = null;
  this.compressedImageData = null;
  this.compressedImage = null;
}

ImageFileCompressor.prototype.LoadAndCompress = async function(file) {
  const result = await this.LoadTopoImageFile(file);
  this.imageData = result.contents;
  this.image = await this.LoadImage(this.imageData);
  this.canvas.setAttribute('height', 500);
  this.canvas.setAttribute('width', this.canvas.height * this.image.width / this.image.height);
  let ctx = this.canvas.getContext('2d');
  ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
  this.compressedImageData = this.canvas.toDataURL('image/jpeg', 0.5);
  const imageLoader = this.LoadImage(this.compressedImageData);
  imageLoader.then( image => {
    this.compressedImage = image
  })

  return imageLoader;
}

ImageFileCompressor.prototype.LoadTopoImageFile = file => new Promise( resolve => {
  let fileReader = new FileReader();
  fileReader.onload = () => resolve({file: file, contents: fileReader.result});
  fileReader.readAsDataURL(file);
});

ImageFileCompressor.prototype.LoadImage = (url) => new Promise( (resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = (err) => reject(err);
  img.src = url;
});

module.exports = ImageFileCompressor;
