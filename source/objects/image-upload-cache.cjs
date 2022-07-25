let ImageUploadCache = function() {
  this.imageDataMap = new Map();
}

ImageUploadCache.prototype.LoadAndCompress = async function(file, id, canvas) {
  const result = await this.LoadTopoImageFile(file);
  const imageData = result.contents;
  const image = await this.LoadImage(imageData);
  canvas.setAttribute('height', 500);
  canvas.setAttribute('width', canvas.height * image.width / image.height);
  let ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const compressedImageData = canvas.toDataURL('image/jpeg', 0.5);
  const compressedImage = await this.LoadImage(compressedImageData);
  ctx.drawImage(compressedImage, 0, 0, canvas.width, canvas.height);
  this.imageDataMap.set(id, compressedImageData);
  return compressedImage;
}

ImageUploadCache.prototype.LoadImage = (url) => new Promise( (resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = (err) => reject(err);
  img.src = url;
});

ImageUploadCache.prototype.LoadTopoImageFile = file => new Promise( resolve => {
  let fileReader = new FileReader();
  fileReader.onload = () => resolve({file: file, contents: fileReader.result});
  fileReader.readAsDataURL(file);
});

module.exports = ImageUploadCache;
