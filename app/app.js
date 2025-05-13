//temporary code
/*const http = require('http');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});*/

const express = require('express');
const app = express();
const port = 3000

app.get('/',(req,res) => {
  res.send('Hello World!');
})

app.all('/game',(req,res) => {
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function getBeats(){
  var song = 'Mortals.mp3';

  //Use HTMLMediaElement currentTime

  const spawn = require("child_process").spawn;
  const pythonProcess = spawn('python',["beats.py", song]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
}


getBeats();
