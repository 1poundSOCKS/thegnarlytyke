let uuid = require('uuid');

module.exports = LoadCragCovers = jsonData => {
  let cragCovers = CreateCragCovers();
  let coversData = JSON.parse(jsonData);
  coversData.covers.forEach(cover => {
    AppendCragCover(cragCovers, cover.name, cover.id);
  });
  return cragCovers;
}

module.exports = CreateCragCovers = () => {
  return {
    covers: []
  };
}

module.exports = AppendCragCover = (cragCovers, name, id) => {
  let cragCover = {
    id: id ? id : uuid.v4(),
    name: name
  }
  cragCovers.covers.push(cragCover);
  return cragCover;
}

module.exports = GetCragCoverIDs = (cragCovers) => {
  return cragCovers.covers.map( cover => cover.id );
}
