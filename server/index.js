import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path'

const uploadFolder = '../work/upload';
const dataFolder = '../work/data';
const imagesFolder = '../work/images';
const cragFilename = 'baildon_bank.json';

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/add_image_to_topo', (req, res) => {
  console.log('request to add image to topo');
  AddImageToTopo(req.body.image)
  .then( () => {
    res.send(JSON.stringify(
    {
      result: "success"
    }));
  })
  .catch( err => {
    console.error(err.toString());
    res.send(JSON.stringify(
      {
        result: "error",
        details: err.toString()
      }));
    })
});

app.get('/editor', (req, res) => {
  res.sendFile(path.resolve('public', 'editor.html'));
});

app.listen(80);

let AddImageToTopo = async (imageData) => {
  if( !imageData ) throw 'image data not supplied';
  const uniqueID = Date.now();
  const uploadFilename = `${uniqueID}.jpg`;
  const uploadFullFilename = path.join(uploadFolder, uploadFilename);
  const imagesFullFilename = path.join(imagesFolder, uploadFilename);
  await SaveImage(imageData, uploadFullFilename);
  await RenameFile(uploadFullFilename, imagesFullFilename);
  let crag = await LoadCrag();
  const topoCount = crag.topos.push({imageFile: uploadFilename});
  crag.topos[topoCount-1].id = uniqueID;
  await SaveCrag(crag);
}

let SaveImage = (imageData, filename) => new Promise( ( resolve, reject) => {
  console.log(`saving image data to '${filename}'`);
  const imageDataChunks = imageData.split(",");
  console.log(`image header='${imageDataChunks[0]}'`);
  const base64ImageData = imageData.split(",")[1];
  const buf = Buffer.from(base64ImageData, 'base64');
  console.log(`image size=${buf.byteLength}`);
  fs.writeFile(filename, buf,  "binary", err => {
    if( err ) reject(err);
    else resolve(filename);
  });
});

let RenameFile = (oldPath, newPath) => new Promise( (resolve, reject) => {
  console.log(`renaming file '${oldPath}' to '${newPath}'`);
  fs.rename(oldPath, newPath, err => {
    if (err) reject(err);
    else resolve(newPath);
  });
});

let LoadCrag = () => new Promise( (resolve, reject) => {
  const filename = path.resolve(dataFolder, cragFilename);
  console.log(`reading crag data from '${filename}'`);
  fs.readFile(filename, 'utf-8', (err, data) => {
    if (err) reject(err);
    else resolve(JSON.parse(data.toString()));
  });
});

let SaveCrag = (crag) => new Promise( (resolve, reject) => {
  const filename = path.resolve(dataFolder, cragFilename);
  console.log(`writing crag data to '${filename}'`);
  fs.writeFile(filename, JSON.stringify(crag, null, 2), (err) => {
    if (err) reject(err);
    else resolve();
  });
});
