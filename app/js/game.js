var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var song = document.getElementById("song");
var beats = [];
var lane1 = [];
var lane2 = [];
var lane3 = [];
var lane4 = [];
var points = 0;
var animationId;

//Get Beats Array functions
function getBeats(){
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

function singleLanes(arr){
  let arr1 = [];
  let arr2 = [];
  let arr3 = [];
  let arr4 = [];
  for(i = 0;i < arr.length;i++){
    switch (arr[i].laneNum){
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
  return [arr1,arr2,arr3,arr4];
}

//Animation Functions
function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLanes();
  drawRects();
  animationId = requestAnimationFrame(animate);
}

function drawLanes(){
  ctx.strokeStyle = 'black';
  for(i = 1; i < 4; i ++){
    ctx.beginPath();
    ctx.moveTo(i*canvas.width/4,0);
    ctx.lineTo(i*canvas.width/4,canvas.height);
    ctx.stroke();
  }
}

function drawRects(){
  ctx.beginPath();
  ctx.fillStyle = "black";
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
    checkCollision(lane1);
  }
  if(event.key == "s"){
    ctx.beginPath();
    ctx.rect(canvas.width/4,canvas.height-100,canvas.width/4,canvas.height/8);
    ctx.fill();
  }
  if(event.key == "d"){
    ctx.beginPath();
    ctx.rect(canvas.width/2,canvas.height-100,canvas.width/4,canvas.height/8);
    ctx.fill();
  }
  if(event.key == "f"){
    ctx.beginPath();
    ctx.rect(3*canvas.width/4,canvas.height-100,canvas.width/4,canvas.height/8);
    ctx.fill();
  }
}

function checkCollision(lane){
  let hit = false;
  let height = 0;
  for(i = 0; i < lane.length; i ++){
    height = canvas.height*(1-(beats[i].beat-song.currentTime)/3);
    if(canvas.height-100-height <= 0){
      points += 1;
      hit = true;
    }
  }
  if(hit == false){
    cancelAnimationFrame(animationId);
  }
}

function end(){
  document.removeEventListener("keydown", keyPress);
}

//Main Function
function game(){
  getBeats();
  canvas.width = window.innerWidth/2;
  canvas.height = window.innerHeight;
  document.addEventListener("keydown", keyPress);
  drawLanes();
  drawRects();
  animate();
}

game();
