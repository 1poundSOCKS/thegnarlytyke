let uuid = require('uuid');

module.exports = CreateCragObject = () => {
  let cragID = uuid.v4();
  return { loadedObject: {}, id: cragID, routes: [] };
}

module.exports = LoadCragObjectFromJSON = (JSONData) => {
  let newObject = CreateCragObject();
  if( JSONData.length == 0 ) return newObject;
  newObject.loadedObject = JSON.parse(JSONData);
  newObject.routes = newObject.loadedObject.routes.map( route => route );
  return newObject;
}

module.exports = SetUUIDGenFunction = (cragObject, UUIDGenFunction) => {
  cragObject.UUIDGenFunction = UUIDGenFunction;
}

module.exports = GetCragRoutesAsArray = (cragObject) => {
  return cragObject.routes;
}

module.exports = AppendRouteToCrag = (cragObject, routeName, routeGrade) => {
  let routeID = uuidv4(cragObject);
  return cragObject.routes[cragObject.routes.push({id: routeID, name: routeName, grade: routeGrade}) - 1];
}

let uuidv4 = cragObject => {
  return cragObject.UUIDGenFunction ? cragObject.UUIDGenFunction() : uuid.v4();
}
