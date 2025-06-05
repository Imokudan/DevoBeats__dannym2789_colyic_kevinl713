const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const db = require('./js/db.js');
const path = require('path');

const app = express();
const port = 3000;
let result = [];

var song = 'Royalty.mp3';

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/js', express.static('js'));
app.use('/audioFiles', express.static('audioFiles'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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
    res.json(data);
  });
});

app.get('/api/score', (req, res) => {
  getScore().then(data => {
    res.json(data);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function getBeats() {
  return new Promise((resolve, reject) => {
    let beats = [];
    const pythonProcess = spawn('python3', ['beats.py', 'audioFiles/' + song]);
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
