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

DataStorage.prototype.Load = async function(object_id) {
  if( this.loadUsingAPI ) return this.LoadUsingAPI(object_id)

  const response = await fetch(`${this.dataURL}${object_id}.json`, {cache: "reload"});
  return response.json();
}

DataStorage.prototype.LoadUsingAPI = async function(object_id) {
  const response = await fetch(`${this.loadDataURL}?user_id=${this.userID}&user_token=${this.userToken}&id=${object_id}`);
  return response.json();
}

DataStorage.prototype.Save = async function(object_id, data) {
  const requestBody = JSON.stringify(data, null, 2);
  const url = `${this.saveDataURL}?user_id=${this.userID}&user_token=${this.userToken}&id=${object_id}`;
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: requestBody
  });
  return response.json();
}

module.exports = new DataStorage;
