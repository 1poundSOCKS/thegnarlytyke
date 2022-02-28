import path from 'path'
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const dataFolder = '../work/data';
const imagesFolder = '../work/images';

let CreateTopo = (imageData) => {
  return {id: uuidv4(), imageData: imageData};
}

let GetTopoFilename = (topo) => path.resolve(dataFolder, `${topo.id}.topo.json`);
let GetRoutesFilename = () => path.resolve(dataFolder, 'routes.json');

export let GetFullImageFilename = (filename) => path.resolve(imagesFolder, filename);

export let AddTopo = async (imageData) => {
  const topo = CreateTopo(imageData);
  await SaveTopoImage(topo);
  await SaveTopo(topo);
  return topo;
}

export let SaveTopo = (topo) => new Promise( (resolve, reject) => {
  const filename = GetTopoFilename(topo);
  console.log(`writing topo data to '${filename}'`);
  fs.writeFile(filename, JSON.stringify(topo, null, 2), (err) => {
    if (err) reject(err);
    else resolve(filename);
  });
});

export let SaveRoutes = async (routes) => {
  await DeleteFile(GetRoutesFilename());
  return WriteDataToFile(JSON.stringify(routes, null, 2), GetRoutesFilename());
};

export let SaveTopoImage = (topo) => new Promise( (resolve, reject) => {
  const filename = `${topo.id}.jpg`;
  const fullFilename = path.resolve(imagesFolder, filename);
  console.log(`saving image data to '${fullFilename}'`);
  const imageDataChunks = topo.imageData.split(",");
  console.log(`image header='${imageDataChunks[0]}'`);
  const base64ImageData = imageDataChunks[1];
  const buf = Buffer.from(base64ImageData, 'base64');
  console.log(`image size=${buf.byteLength}`);
  fs.writeFile(fullFilename, buf,  "binary", err => {
    if( err ) reject(err);
    else {
      topo.imageFile = filename;
      resolve(topo);
    }
  });
});

export let GetCrag = async () => {
  let routeData = await ReadFile(GetRoutesFilename());
  let routeObject = await JSON.parse(routeData);
  console.log(routeData);
  let fileList = await ReadFolder(dataFolder);
  let topoFileList = fileList.filter(filename => filename.endsWith('.topo.json'));
  let fileReaders = topoFileList.map( file => ReadFile(path.resolve(dataFolder, file)) );
  let topos = await Promise.all(fileReaders);
  let parsedTopos = topos.map( topoString => {
    let topo = JSON.parse(topoString);
    topo.imageData = undefined;
    return topo;
  });
  return { routes: routeObject.routes, topos: parsedTopos };
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

let ReadFile = (filename) => new Promise( (resolve, reject) => {
  fs.readFile(filename, 'utf8' , (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

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
