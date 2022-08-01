let ImageStorage = function() {
  this.imagesPath = null;
  this.loadImageURL = null;
  this.saveImageURL = null;
  this.userID = ""
  this.userToken = ""
}

ImageStorage.prototype.Init = function(config, userID, userToken) {
  this.imagesPath = `${config.images_url}`;
  this.saveImageURL = `${config.save_image_url}`;
  this.userID = userID ? userID : "";
  this.userToken = userToken ? userToken : "";
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

ImageStorage.prototype.LoadImageFromDataURI = async function(imageData) {
  return new Promise( (resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = imageData;
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
  const response = await this.SaveImage(ID, imageData);
  if( response.filename ) filenameObject.imageFile = response.filename;
  return response;
}

ImageStorage.prototype.Save = async function(ID, imageData, type) {
  if( !type ) type = "topo";
  const url = `${this.saveImageURL}?user_id=${this.userID}&user_token=${this.userToken}&id=${ID}&type=${type}`;
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(imageData)
  });

  return response.json();
}

module.exports = new ImageStorage;
