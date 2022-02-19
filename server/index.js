import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path'

const updateFolder = 'work';

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/upload_image', (req, res) => {
  AddImageToTopo(req.body.image)
  .then( () => {
    res.send(JSON.stringify(
    {
      result: "success"
    }));
  })
  .catch( err => {
    res.send(JSON.stringify(
      {
        result: "error"
      }));
    })
});

app.get('/editor', (req, res) => {
  res.sendFile(path.resolve('public', 'editor.html'));
});

app.listen(80);

let AddImageToTopo = async (imageData) => {
  const uploadFolder = path.resolve('upload');
  const imagesFolder = path.resolve(path.join(updateFolder,'images'));
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

let SaveImage = async (imageData, filename) => {
  const imageDataChunks = imageData.split(",");
  console.log(`image header='${imageDataChunks[0]}'`);
  const base64ImageData = imageData.split(",")[1];
  const buf = Buffer.from(base64ImageData, 'base64');
  console.log(`image size=${buf.byteLength}`);
  fs.writeFile(filename, buf,  "binary", err => {
    if( err ) throw err;
    console.log(`image saved as ${filename}`);
  });
}

let RenameFile = async (oldPath, newPath) => {
  console.log(`renaming file '${oldPath}' to '${newPath}'`);
  fs.rename(oldPath, newPath, err => {
    if (err) throw err;
  });
}

let LoadCrag = () => new Promise( (resolve, reject) => {
  const filename = path.resolve(path.join(updateFolder, 'data'), 'baildon_bank.json');
  console.log(`reading crag data from '${filename}'`);
  fs.readFile(filename, 'utf-8', (err, data) => {
    if (err) reject(err);
    else resolve(JSON.parse(data.toString()));
  });
});

let SaveCrag = (crag) => new Promise( (resolve, reject) => {
  const filename = path.resolve(path.join(updateFolder, 'data'), 'baildon_bank.json');
  console.log(`writing crag data to '${filename}'`);
  fs.writeFile(filename, JSON.stringify(crag, null, 2), (err) => {
    if (err) reject(err);
    else resolve();
  });
});
