import path from 'path'
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const defaultCragName = 'Baildon Bank';
const dataFolder = '../work/data';
const cragFilename = 'baildon_bank.json';

export let CreateCrag = (cragName) => {
  return {id: uuidv4(), name: cragName};
}

export let CreateTopo = (imageData) => {
  return {id: uuidv4(), imageData: imageData};
}

export let AddTopo = (crag, imageData) => {
  if( !crag.topos ) crag.topos = [];
  const topoCount = crag.topos.push(CreateTopo(imageData));
  return crag.topos[topoCount-1];
}

export let LoadCrag = () => new Promise( (resolve, reject) => {
  const filename = path.resolve(dataFolder, cragFilename);
  console.log(`reading crag data from '${filename}'`);
  fs.readFile(filename, 'utf-8', (err, data) => {
    if (err) resolve(CreateCrag(defaultCragName));
    else resolve(JSON.parse(data.toString()));
  });
});

export let SaveCrag = (crag) => new Promise( (resolve, reject) => {
  const filename = path.resolve(dataFolder, cragFilename);
  console.log(`writing crag data to '${filename}'`);
  fs.writeFile(filename, JSON.stringify(crag, null, 2), (err) => {
    if (err) reject(err);
    else resolve();
  });
});

export let SaveTopoImage = (topo, folder) => new Promise( (resolve, reject) => {
  const filename = `${topo.id}.jpg`;
  const fullFilename = path.resolve(folder, filename);
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
      resolve(fullFilename);
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
