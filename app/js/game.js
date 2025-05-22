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
var rectHeight = canvas.height/8;

//Get Beats Array functions
function getBeats(){
  fetch('/api/beats')
    .then(response => response.json())
    .then(data => {
      console.log('Beats data:', data);
      beats = setLanes(data);
      let temp = singleLanes(beats);
      console.log(temp);
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
  this.clicked = false;
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
    switch (arr[i].lane){
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
  console.log(points);
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
    ctx.moveTo(0,canvas.height-100);
    ctx.lineTo(canvas.width,canvas.height-100);
    ctx.moveTo(0,canvas.height-100+rectHeight);
    ctx.lineTo(canvas.width,canvas.height-100+rectHeight);
    ctx.stroke();
  }
}

function drawRects(){
  ctx.beginPath();
  ctx.fillStyle = "black";
  for(i = 0; i < beats.length; i++){
    if(beats[i].beat-song.currentTime<= 5 && beats[i].beat-song.currentTime>-1){
      ctx.rect(beats[i].lane*canvas.width/4,canvas.height*(1-(beats[i].beat-song.currentTime)/3),canvas.width/4,rectHeight);
    }
  }
  ctx.fill();
}

//Gameplay Functions
function keyPress(event){
  if(event.key == "a"){
    console.log("a");
    checkCollision(lane1);
  }
  if(event.key == "s"){
    console.log("s");
    checkCollision(lane2);
  }
  if(event.key == "d"){
    console.log("d");
    checkCollision(lane3);
  }
  if(event.key == "f"){
    console.log("f");
    checkCollision(lane4);
  }
}

function checkCollision(lane){
  let hit = false;
  let height = 0;
  for(i = 0; i < lane.length; i ++){
    height = canvas.height*(1-(lane[i].beat-song.currentTime)/3);
    if(canvas.height-100-height <= rectHeight && canvas.height-100-height >= -rectHeight && lane[i].clicked == false){
      lane[i].clicked = true;
      points += 1;
      hit = true;
      console.log(lane[i]);
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
