let uuid = require('uuid');

module.exports = function(id, name) {
  this.id = id ? id : uuid.v4();
  this.name = name;
}
