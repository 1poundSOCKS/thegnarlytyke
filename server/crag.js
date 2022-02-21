import path from 'path'
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const dataFolder = '../work/data';
const imagesFolder = '../work/images';

let CreateTopo = (imageData) => {
  return {id: uuidv4(), imageData: imageData};
}

let GetTopoFilename = (topo) => path.resolve(dataFolder, `${topo.id}.topo.json`);

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

let RenameFile = (oldPath, newPath) => new Promise( (resolve, reject) => {
  console.log(`renaming file '${oldPath}' to '${newPath}'`);
  fs.rename(oldPath, newPath, err => {
    if (err) reject(err);
    else resolve(newPath);
  });
});