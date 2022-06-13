const Config = require('./config.cjs');

let ImageStorage = function() {
  this.imagesPath = null;
  this.loadImageURL = null;
  this.saveImageURL = null;
}

ImageStorage.prototype.Init = function(config) {
  this.imagesPath = `${config.images_url}`;
  this.loadImageURL = `${config.save_image_url}`;
  this.saveImageURL = `${config.save_image_url}`;
}

ImageStorage.prototype.LoadImageFromFile = async function(filename) {
  const url = `${this.imagesPath}${filename}`;
  return new Promise( (resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

ImageStorage.prototype.LoadImageFromAPI = async function(ID) {
  const url = `${this.loadImageURL}?id=${ID}`;
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
  });
  const data = await response.text();
  return new Promise( (resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = data;
  });
}

ImageStorage.prototype.SaveImageAndUpdateFilename = async function(ID, imageData, filenameObject) {
  const filename = await this.SaveImageWithAPI(ID, imageData);
  filenameObject.imageFile = filename;
}

ImageStorage.prototype.SaveImageToOriginServer = async function(ID, imageData) {
  const req = { ID: ID, imageData: imageData };
  const response = await fetch('/save-image', {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'same-origin',
    body: JSON.stringify(req)
  });
  return response;
}

ImageStorage.prototype.SaveImageWithAPI = async function(ID, imageData) {
  const url = `${this.saveImageURL}?id=${ID}`;
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(imageData)
  });

  const parsedResponse = await response.json();
  console.log(parsedResponse)
  return parsedResponse.filename;
}

module.exports = new ImageStorage;
