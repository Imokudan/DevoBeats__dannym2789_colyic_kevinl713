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

var song = 'Royalty.mp3';

app.use('/js', express.static('js'));
app.use('/audioFiles', express.static('audioFiles'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('home', {title: 'DevoBeats'});
});

app.get('/songs', (req,res) => {
  let songs = [];
  fs.readdir('audioFiles',(err,files) => {
    songs = files;
    console.log(songs);
    res.render('selection', { title: 'Songs', songs: songs});
  });
})

app.all('/game', (req, res) => {
  song = req.body.song;
  res.render('game', { title: 'game', song: 'Song: '+song.replace(".mp3",""), full: 'audioFiles/' + song });
});

app.get('/api/beats', (req, res) => {
  getBeats().then(data => {
    JSON.stringify(res.json(data));
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function getBeats() {
  return new Promise((resolve, reject) => {
    let beats = [];
    console.log("Song is currently: " + song);
    const pythonProcess = spawn('python3', ['-u', 'beats.py', '/home/danny/DevoBeats__dannym2789_colyic_kevinl713/app/audioFiles/' + song], {
      stdio: 'pipe',
      shell: false,
      cwd: '/home/danny/DevoBeats__dannym2789_colyic_kevinl713/app'
    });
    pythonProcess.stdout.setEncoding('utf8');
    pythonProcess.stdout.on('data', data => {
      console.log("stdout: " + data);
      data = data.toString();
      beats.push(data);
    });
    pythonProcess.stderr.on('data', data => {
      console.error('Python Erorr: ' + data.toString());
    });
    console.log(beats);
    pythonProcess.on('exit', code => {
      const arr = beats[0].replace(/^"|"$/g, '').split('\n').filter(Boolean).map(Number);
      result = arr;
      console.log("getBeats ran successfully");
      resolve(arr);
    });
    pythonProcess.on('error', err => {
      console.log("getBeats failed, error: " + err);
      reject(err);
    });
  });
}
