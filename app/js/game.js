var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight * 3 / 4;
var song = document.getElementById("song");
var score = document.getElementById("points");
var highScore = document.getElementById("highscore");
var beats = [];
var lane1 = [];
var lane2 = [];
var lane3 = [];
var lane4 = [];
var points = 0;
var animationId;
var rectHeight = canvas.height / 8;
var playing = false;

var startTimestamp = 0;
var startSongTime = 0;
var virtualTime = 0;

// Server and client functions
function getBeats() {
    fetch('/api/beats')
    .then(response => response.json())
    .then(data => {
      console.log('Beats data:', data);
      beats = setLanes(data);
      let temp = singleLanes(beats);
      lane1 = temp[0];
      lane2 = temp[1];
      lane3 = temp[2];
      lane4 = temp[3];
    })
    .catch(err => {
      console.error('Error fetching beats:', err);
    });
}

function sendScore() {
}

function receiveScore() {
  fetch('/api/score')
  .then(response => response.json())
  .then(data => {
    console.log('Previous score: ', data);
  })
  .catch(err => {
    console.error('Error fetching score:', err);
  });
}

function beat(lane, beat) {
  this.lane = lane;
  this.beat = beat;
  this.clicked = false;
}

function setLanes(arr) {
  let laneNum = 0;
  let last = 0;
  let array = [];
  for (let i = 0; i < arr.length; i++) {
    while (laneNum == last) {
      laneNum = Math.round(Math.random() * 4);
    }
    array[i] = new beat(laneNum, arr[i] + 3);
    last = laneNum;
  }
  return array;
}

function singleLanes(arr) {
  let arr1 = [];
  let arr2 = [];
  let arr3 = [];
  let arr4 = [];
  for (let i = 0; i < arr.length; i++) {
    switch (arr[i].lane) {
      case 0:
        arr1.push(arr[i]);
        break;
      case 1:
        arr2.push(arr[i]);
        break;
      case 2:
        arr3.push(arr[i]);
        break;
      case 3:
        arr4.push(arr[i]);
        break;
    }
  }
  return [arr1, arr2, arr3, arr4];
}

// Animation Functions
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  virtualTime = startSongTime + (performance.now() - startTimestamp) / 1000;

  drawLanes();
  drawRects();
  score.innerHTML = "Time: " + song.currentTime;
  highScore.innerHTML = "Fake: " + virtualTime;


  animationId = requestAnimationFrame(animate);
}

function drawLanes() {
  ctx.strokeStyle = 'black';
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(i * canvas.width / 4, 0);
    ctx.lineTo(i * canvas.width / 4, canvas.height);
    ctx.moveTo(0, canvas.height - 100);
    ctx.lineTo(canvas.width, canvas.height - 100);
    ctx.moveTo(0, canvas.height - 100 + rectHeight);
    ctx.lineTo(canvas.width, canvas.height - 100 + rectHeight);
    ctx.stroke();
  }
}

function drawRects() {
  ctx.beginPath();
  for (let i = 0; i < beats.length; i++) {
    if (beats[i].beat - virtualTime <= 5 && beats[i].beat - virtualTime > -1) {
      ctx.fillStyle = "black";
      ctx.globalAlpha = 1;
      if(beats[i].clicked){
        ctx.globalAlpha = 0.2;
      }
      ctx.fillRect(
        beats[i].lane * canvas.width / 4,
        canvas.height * (1 - (beats[i].beat - virtualTime) / 3),
        canvas.width / 4,
        rectHeight
      );
    }
  }
}

function startScreen() {
  const play = document.createElement('button');
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  play.textContent = 'Play';
  play.style.position = 'absolute';
  play.style.top = canvas.offsetTop + canvas.height / 2 - 25 + 'px';
  play.style.left = canvas.offsetLeft + canvas.width / 2 - 50 + 'px';
  play.style.padding = '10px 20px';
  play.style.fontSize = '16px';
  play.style.cursor = 'pointer';
  play.style.zIndex = '10';
  play.onclick = function () {
    playing = true;
    play.remove();
    drawLanes();
    drawRects();
    setTimeout(function () {
      startTimestamp = performance.now();
      startSongTime = song.currentTime;
      document.getElementById('song').play();
      animate();
    }, 3000);
  }
  document.body.append(play);
}

// Gameplay Functions
function keyPress(event) {
  if (playing) {
    if (event.key == "a") {
      checkCollision(lane1);
    }
    if (event.key == "s") {
      checkCollision(lane2);
    }
    if (event.key == "d") {
      checkCollision(lane3);
    }
    if (event.key == "f") {
      checkCollision(lane4);
    }
  }
}

function checkCollision(lane) {
  let hit = false;
  let height = 0;
  let current = virtualTime;
  for (let i = 0; i < lane.length; i++) {
    height = canvas.height * (1 - (lane[i].beat - current) / 3);
    if (
      canvas.height - 100 - height <= rectHeight &&
      canvas.height - 100 - height >= -rectHeight &&
      lane[i].clicked == false
    ) {
      lane[i].clicked = true;
      points += 1;
      hit = true;
    }
  }
  if (hit == false) {
    cancelAnimationFrame(animationId);
  }
}

function restart() {
  if (beats[beats.length - 1].clicked == true) {
    sendScore();
  }
  for (let beat of beats) {
    beat.clicked = false;
  }
}

// Main Function
function game() {
  getBeats();
  startScreen();
  document.addEventListener("keydown", keyPress);
}

game();
