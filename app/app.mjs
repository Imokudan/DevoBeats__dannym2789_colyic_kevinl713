import express from 'express';
import {spawn} from 'node:child_process';
import fs from 'fs';
const app = express();
app.set('view engine', 'pug');
const port = 3000;
let result = [];

import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var song = 'audioFiles/Royalty.mp3';

app.use('/js', express.static('js'));
app.use('/audioFiles', express.static('audioFiles'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/home.html'));
});

function setSong(name){
  song = name;
  console.log(song);
}

app.get('/songs', (req,res) => {
  let songs = [];
  fs.readdir('audioFiles',(err,files) => {
    songs = files;
    console.log(songs);
    res.render('selection', { title: 'Songs', songs: songs, setSong: setSong });
  });
})

app.get('/game', (req, res) => {
  res.render('game', { title: 'game', song: 'Song: Royalty' });
});

app.get('/api/beats', (req, res) => {
  getBeats().then(data => {
    res.json(data);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function getBeats() {
  return new Promise((resolve, reject) => {
    let beats = [];
    const pythonProcess = spawn('python3', ['beats.py', song]);
    pythonProcess.stdout.on('data', data => {
      beats.push(data.toString());
    });
    pythonProcess.on('exit', code => {
      const arr = beats[0].replace(/^"|"$/g, '').split('\n').filter(Boolean).map(Number);
      result = arr;
      resolve(arr);
    });
    pythonProcess.on('error', err => {
      reject(err);
    });
  });
}
