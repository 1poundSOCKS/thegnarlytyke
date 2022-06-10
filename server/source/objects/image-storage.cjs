const Config = require('./config.cjs');

let ImageStorage = function() {
  this.imagesPath = null;
  this.loadImageURL = null;
  this.saveImageURL = null;
  this.imagesPath = null;
}

ImageStorage.prototype.Init = function(config) {
  this.imagesPath = `env/${config.environment}/images/`;
  this.loadImageURL = `https://o8w8iaawi0.execute-api.eu-west-2.amazonaws.com/Prod/save_image`;
  this.saveImageURL = `https://o8w8iaawi0.execute-api.eu-west-2.amazonaws.com/Prod/save_image`;
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
  const url = `${this.imagesPath}${filename}`;
  const response = await fetch(url, {
    method: 'GET',
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
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
  return new Promise( resolve => {
    filenameObject.imageFile = filename;
    resolve(filename);
  });
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
  const url = `https://o8w8iaawi0.execute-api.eu-west-2.amazonaws.com/Prod/save_image?id=${ID}`;
  const response = await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'same-origin',
    body: JSON.stringify(imageData)
  });

  const parsedResponse = await response.json();
  console.log(parsedResponse)
  return parsedResponse.filename;
}

module.exports = new ImageStorage;
