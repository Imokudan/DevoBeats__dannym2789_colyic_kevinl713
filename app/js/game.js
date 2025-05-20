var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var song = document.getElementById("song");
var beats = [];

//Get Beats Array functions
function getBeats(){
  fetch('/api/beats')
    .then(response => response.json())
    .then(data => {
      console.log('Beats data:', data);
      beats = setLanes(data);
    })
    .catch(err => {
      console.error('Error fetching beats:', err);
    });
}

function beat(lane,beat){
  this.lane = lane;
  this.beat = beat;
}

function setLanes(arr){
  let laneNum = 0;
  let array = [];
  for (i = 0; i < arr.length; i ++){
    if(laneNum == 4){
      laneNum = 0;
    }
    array[i] = new beat(laneNum,arr[i]);
    laneNum ++;
  }
  return array;
}

//Animation Functions
function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLanes();
  drawRects();
  requestAnimationFrame(animate);
}

function drawLanes(){
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.rect(0,canvas.height-100,canvas.width,canvas.height/8);
  ctx.fill();
  for(i = 1; i < 4; i ++){
    ctx.beginPath();
    ctx.moveTo(i*canvas.width/4,0);
    ctx.lineTo(i*canvas.width/4,canvas.height);
    ctx.stroke();
  }
}

function drawRects(){
  ctx.beginPath();
  for(i = 0; i < beats.length; i++){
    if(beats[i].beat-song.currentTime<= 5 && beats[i].beat-song.currentTime>-1){
      ctx.rect(beats[i].lane*canvas.width/4,canvas.height*(1-(beats[i].beat-song.currentTime)/3),canvas.width/4,canvas.height/8);
    }
  }
  ctx.fill();
}

//Gameplay Functions
function keyPress(event){
  if(event.key == "a"){
    for(i = 0; i < beats.length; i ++){
      
    }
  }
  if(event.key == "s"){
    for(i = 0; i < beats.length; i ++){

    }
  }
  if(event.key == "d"){
    for(i = 0; i < beats.length; i ++){

    }
  }
  if(event.key == "f"){
    for(i = 0; i < beats.length; i ++){

    }
  }
}

//Main Function
function game(){
  getBeats();
  canvas.width = window.innerWidth/2;
  canvas.height = window.innerHeight;
  drawLanes();
  drawRects();
  animate();
}

game();
