const express = require('express');
const app = express();
const port = 3000

app.get('/',(req,res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function getBeats(){
  var song = 'Mortals.mp3';

  const spawn = require("child_process").spawn;
  const pythonProcess = spawn('python',["beats.py", song]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
}

getBeats();
