import path from 'path'
import fs, { writeFile } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const dataFolder = './public.test/data';
const imagesFolder = './public.test/images';

let GetCragFilename = (cragID) => path.resolve(dataFolder, `${cragID}.crag.json`);
let GetBackupCragFilename = (cragID) => path.resolve(dataFolder, `${cragID}.crag.backup.${new Date().getTime()}.json`);

export let GetFullImageFilename = (filename) => path.resolve(imagesFolder, filename);

export let AddTopo = async (cragID, imageData) => {
  const topo = CreateTopo();
  let imageFilename = await SaveTopoURIImageDataToJEPGFile(topo.id, imageData);
  topo.imageFile = imageFilename;
  await AppendTopoToCrag(cragID, topo);
  return topo;
}

let CreateTopo = () => {
  return {id: uuidv4()};
}

export let AppendTopoToCrag = async (cragID, topo) => {
  let cragObject = await ReadCragObjectFromFile(cragID);
  cragObject.topos ? cragObject.topos.push(topo) : cragObject.topos = [topo];
  return WriteDataToFile(JSON.stringify(cragObject, null, 2), GetCragFilename(cragID));
}

let ReadCragObjectFromFile = async (cragID) => {
  let cragObject = null;
  try {
    let cragData = await ReadFile(GetCragFilename(cragID));
    cragObject = JSON.parse(cragData);
  }
  catch( e ) {
    if( e.Error != fs.NOENT ) throw e;
    cragObject = { routes: [], topos: [] };
    await WriteDataToFile(JSON.stringify(cragObject), GetCragFilename(cragID));
  }
  return cragObject;
}

export let SaveCrag = async (crag) => {
  console.log(JSON.stringify(crag, null, 2));
  ReplaceTempIDsWithUUIDs(crag);
  let backupFilename = GetBackupCragFilename();
  // await DeleteFile(GetCragFilename());
  await RenameFile(GetCragFilename(), backupFilename);
  return WriteDataToFile(JSON.stringify(crag, null, 2), GetCragFilename());
};

let ReplaceTempIDsWithUUIDs = crag => {
  let mapOfIDReplacements = GetTempIDReplacementMap(crag);
  ReplaceTempIDs(crag, mapOfIDReplacements);
  console.log(`crag with new IDs: ${JSON.stringify(crag, null, 2)}`);
}

let GetTempIDReplacementMap = crag => {
  let tempIDsMap = new Map();
  crag.routes.forEach(route => {
    let routeID = route.id;
    if( routeID.startsWith('#') && !tempIDsMap.get(routeID) ) {
      console.log(`map set for crag route: id=${routeID}`);
      tempIDsMap.set(routeID, uuidv4());
    }
  });
  crag.topos.forEach(topo => {
    if( !topo.routes ) topo.routes = [];
    topo.routes.forEach(route => {
      let routeID = route.id;
      if( routeID.startsWith('#') && !tempIDsMap.get(routeID) ) {
        console.log(`map set for topo route: id=${routeID}`);
        tempIDsMap.set(routeID, uuidv4());
      }
      if( !route.points ) route.points = [];
      route.points.forEach( point => {
        let pointID = point.id;
        console.log(`point id: ${pointID}`);
        if( pointID.startsWith('#') && !tempIDsMap.get(pointID) ) {
          console.log(`map set for point: id=${pointID}`);
          tempIDsMap.set(pointID, uuidv4());
        }
      });
    });
  });
  return tempIDsMap;
}

let ReplaceTempIDs = (crag, mapOfIDReplacements) => {
  crag.routes.forEach(route => {
    if( route.id.startsWith('#') ) {
      route.id = mapOfIDReplacements.get(route.id);
    }
  });
  crag.topos.forEach(topo => {
    topo.routes.forEach(route => {
      if( route.id.startsWith('#') ) {
        route.id = mapOfIDReplacements.get(route.id);
      }
      route.points.forEach( point => {
        if( point.id.startsWith('#') ) {
          point.id = mapOfIDReplacements.get(point.id);
        }
      });
    });
  });
};

let SaveTopoURIImageDataToJEPGFile = (topoID, topoURIData) => new Promise( (resolve, reject) => {
  const filename = `${topoID}.topo.jpg`;
  const fullFilename = path.resolve(imagesFolder, filename);
  console.log(`saving image data to '${fullFilename}'`);
  const imageDataChunks = topoURIData.split(",");
  console.log(`image header='${imageDataChunks[0]}'`);
  const base64ImageData = imageDataChunks[1];
  const buf = Buffer.from(base64ImageData, 'base64');
  console.log(`image size=${buf.byteLength}`);
  fs.writeFile(fullFilename, buf,  "binary", err => {
    if( err ) reject(err);
    else {
      resolve(filename);
    }
  });
});

export let GetCrag = async () => {
  let cragData = await ReadFile(GetCragFilename());
  return JSON.parse(cragData);
}

export let DeleteTopo = async (topoID) => {
  console.log(`Deleting topo '${topoID}'`);
}

let ReadFolder = (folder) => new Promise( (resolve, reject) => {
  fs.readdir(folder, (err, files) => {
    if (err) {
      reject(err);
    }
    else {
      resolve(files);
    }
  })
});

export let ReadJSONFileIntoObject = async (filename) => {
  let jsonData = await ReadFile(filename);
  return JSON.parse(jsonData);
}

export let ReadFile = (filename) => new Promise( (resolve, reject) => {
  fs.readFile(filename, 'utf8' , (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

export let WriteObjectToFile = async (object, filename) => {
  const jsonData = JSON.stringify(object);
  return WriteDataToFile(jsonData, filename);
}

let WriteDataToFile = (data, filename) => new Promise( (resolve, reject) => {
  fs.writeFile(filename, data , (err, data) => {
    if (err) reject(err);
    else resolve();
  });
});

let RenameFile = (oldPath, newPath) => new Promise( (resolve, reject) => {
  console.log(`renaming file '${oldPath}' to '${newPath}'`);
  fs.rename(oldPath, newPath, err => {
    if (err) reject(err);
    else resolve(newPath);
  });
});

let CheckFileAccess = (filename, mode) => new Promise( (resolve, reject) => {
  fs.access(filename, mode, err => {
    err ? reject(err) : resolve();
  });
});

let DeleteFile = (filename) => new Promise( (resolve, reject) => {
  fs.unlink(filename, err => {
    err && err.Error != fs.NOENT ? reject(err) : resolve();
  });
});
