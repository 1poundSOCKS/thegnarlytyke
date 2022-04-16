let uuid = require('uuid');

let CragCover = function(id, name) {
  this.id = id ? id : uuid.v4();
  this.name = name;
}

module.exports = CragCover;
