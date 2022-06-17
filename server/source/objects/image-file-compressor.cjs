let ImageFileCompressor = function(canvas) {
  this.canvas = canvas;
}

ImageFileCompressor.prototype.LoadAndCompress = async function(file) {
  const result = await this.LoadTopoImageFile(file);
  const imageData = result.contents;
  const image = await this.LoadImage(imageData);
  this.canvas.setAttribute('height', 500);
  this.canvas.setAttribute('width', this.canvas.height * image.width / image.height);
  let ctx = this.canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
  const compressedImageData = this.canvas.toDataURL('image/jpeg', 0.5);
  const compressedImage = await this.LoadImage(compressedImageData);
  ctx.drawImage(compressedImage, 0, 0, this.canvas.width, this.canvas.height);
  return compressedImageData;
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
