const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const db = require('./js/db.js');
const path = require('path');

const app = express();
const port = 3000;
let result = [];

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use('/js', express.static('js'));
app.use('/audioFiles', express.static('audioFiles'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

const session = require('express-session');
app.use(session({
  secret: 'tmykolyk',
  resave: false,
  saveUninitialized: false
}));

db.createTables();

app.get('/', (req, res) => {
  res.render('home', {title: 'DevoBeats', username: req.session.username});
});

app.get('/register', (req, res) => {
  if(req.session.username){
    return res.redirect('/');
  }
  res.render('register', { title: 'DevoBeats', error: null });
});

app.post('/register', async (req, res) => {
  const { username, password, confirm } = req.body;

  if (!username || !password || !confirm) {
    return res.render('register', { title: 'DevoBeats', error: "All fields are required." });
  }
  if (password !== confirm) {
    return res.render('register', { title: 'DevoBeats', error: "Passwords do not match." });
  }

  const userCreated = await db.createUser(username, password);
  if (userCreated) {
      return res.redirect('/login');
  } else {
    return res.render('register', { title: 'DevoBeats', error: "Username already exists!" });
  }
});

app.get('/login', (req, res) => {
  if(req.session.username){
    return res.redirect('/');
  }
  res.render('login', {title: 'DevoBeats'});
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.getUser(username);
    if (!user) {
      return res.render('login', { title: 'DevoBeats', error: 'User not found.' });
    }
    const storedPassword = await db.getPass(username);
    if (password !== storedPassword) {
      return res.render('login', { title: 'DevoBeats', error: 'Incorrect password.' });
    }
    req.session.username = username;
    req.session.userId = await db.UserToID(req.session.username);
    return res.redirect('/');
  } catch (err) {
    console.error('Login error:', err);
    return res.render('login', { title: 'DevoBeats', error: 'Server error.' });
  }
});

app.get('/songs', (req,res) => {
  let songs = [];
  fs.readdir('audioFiles',(err,files) => {
    songs = files;
    console.log(songs);
    res.render('selection', { title: 'Songs', songs: songs, username: req.session.username});
  });
})

app.all('/game', (req, res) => {
  if (req.method === 'POST' && req.body.song) {
    req.session.song = req.body.song;
  }
  const song = req.session.song || 'Royalty.mp3';
  res.render('game', { title: 'game', song: 'Song: ' + song.replace(".mp3",""), full: 'audioFiles/' + song, username: req.session.username });
});

app.get('/api/beats', (req, res) => {
  getBeats(req.session.song).then(data => {
    res.json(data);
  });
});

app.get('/api/score', (req, res) => {
  db.getUserSongScores(req.session.userId,req.session.song)
    .then(data => res.json(data))
});

app.post('/api/getScore', async (req, res) => {
  const { score } = req.body;
  const oldScore = await db.getUserSongScores(req.session.userId, req.session.song);
  if (score > oldScore) {
    await db.setUserScore(req.session.userId, req.session.song, score);
  }
  res.end();
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    res.redirect('/login');
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function getBeats(song) {
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
