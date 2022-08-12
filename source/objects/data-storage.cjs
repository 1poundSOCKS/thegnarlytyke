let DataStorage = function() {
  this.dataURL = null;
  this.saveDataURL = null;
}

DataStorage.prototype.Init = function(config, userID, userToken,loadUsingAPI) {
  this.dataURL = config.data_url;
  this.saveDataURL = config.save_data_url;
  this.loadDataURL = config.load_data_url;
  this.userID = userID ? userID : "";
  this.userToken = userToken ? userToken : "";
  this.loadUsingAPI = loadUsingAPI;
}

DataStorage.prototype.Load = function(object_id,versioned) {
  return new Promise( (accept,reject) => {

    const url = this.loadUsingAPI ? 
    `${this.loadDataURL}?user_id=${this.userID}&user_token=${this.userToken}&id=${object_id}&versioned=${versioned}` : `${this.dataURL}${object_id}.json`
    const headers = this.loadUsingAPI ? null : {cache: "reload"}
    this.LoadWithURL(url,headers)
    .then( response => accept(response) )
    .catch( err => reject(err) )
  })
}

DataStorage.prototype.LoadWithURL = function(url,headers) {
  return new Promise( (accept,reject) => {
    fetch(url,headers)
    .then( responseData => responseData.json() )
    .then( response => {
      if( response.error ) reject(response.error)
      else accept(response)
    })
    .catch( err => reject(err) )
  })
}

DataStorage.prototype.Save = function(object_id, data, versioned) {
  return new Promise( (accept,reject) => {
    const requestBody = JSON.stringify(data, null, 2);
    const url = `${this.saveDataURL}?user_id=${this.userID}&user_token=${this.userToken}&id=${object_id}&versioned=${versioned}`;
    fetch(url, {
      method: 'POST',
      mode: 'cors',
      body: requestBody
    })
    .then( responseData => responseData.json() )
    .then( response => {
      if( response.error ) reject(response.error)
      else accept(response.key)
    })
    .catch( err => reject(err ))
  })
}

module.exports = new DataStorage;
