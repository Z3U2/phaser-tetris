var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

  game.load.image('cube','assets/cube.png');
  game.load.image('wall','assets/invisible-wall.png');

}


var cursors;
var wall;
var block;
var leftTime = 0;
var rightTime = 0;
var downTime = 0;
var map = [];
initializeMap();
console.log(map);
var cleanup;

function create() {

  //  We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //  block group is a container for the non moving cubes
  block = game.add.group();

  // Invisible wall for collision
  wall = game.add.sprite(0,600,'wall');
  game.physics.arcade.enable(wall);
  wall.body.immovable = true;

  // Shape we're controlling
  shape = game.add.group();

  // Creating cube sprite, and x position
  shape.create(360,0,'cube');
  shape.create(440,0,'cube');

  // Enabling physics for cube
  game.physics.enable(shape,Phaser.Physics.ARCADE);



  // Physics properties for cube
  shape.setAll('body.velocity.y',150)
  // cube.body.collideWorldBounds = true;

  // Our controls
  cursors = game.input.keyboard.createCursorKeys();

  // cursors.left.onDown(goLeft);
  // cursors.right.onDown(goRight);

}

function update() {
  game.physics.arcade.collide(shape, wall,shapeCollide);
  block.forEach(function(blockShape){
    game.physics.arcade.collide(shape,blockShape,shapeCollide);
  })

  if (cursors.left.isDown)
    {
        // //  Move to the left
        // cube.body.position.x += -40;
        goLeft();
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        // cube.body.position.x += 40;
        goRight();
    }
    else if (cursors.down.isDown) {
      goDown();
    }
    else {
        // Stop
        shape.setAll('body.velocity.y',150);
    }

}


function shapeCollide() {
  console.log('collide');

  shape.forEach(function(cube) {
    // Saving indexes
    cube.xIndex = Math.round((cube.body.position.x-120)/80);
    cube.yIndex = Math.round((520-cube.body.position.y)/80);

    // Physics properties
    cube.body.velocity.x = 0;
    cube.body.velocity.y = 0;
    cube.body.immovable = true;

    cube.body.position.x = (80*cube.xIndex)+120;
    cube.body.position.y = 520-(80*cube.yIndex);
  })


  updateMap();

  newShape();
}

function newShape() {
  // Shape we're controlling
  shape = game.add.group();

  // Creating cube sprite, and x position
  shape.create(360,0,'cube');
  shape.create(360,80,'cube');

  // Enabling physics for cube
  game.physics.arcade.enable(shape);



  // Physics properties for cube
  shape.setAll('body.velocity.y', 150);
}

// left translate
function goLeft(){
  if ( checkLeft() && game.time.now>leftTime && checkBlock(-80)) {
    shape.forEach(function(cube){
      cube.position.x += -80;
    })
    leftTime = game.time.now + 150;
  }
}

// right translate
function goRight(){
  if ( checkRight() && game.time.now>rightTime && checkBlock(80) ) {
    shape.forEach(function(cube){
      cube.position.x += 80;
    })
    rightTime = game.time.now + 150;
  }
}

// Check collision with left border
function checkLeft(){
  var check = true;
  shape.forEach(function(cube){
    if(cube.body.position.x<=120){
      check=false;
    }
  })
  return check
}

// Check collision with right border
function checkRight() {
  var check = true;
  shape.forEach(function(cube){
    if(cube.body.position.x>=600){
      check = false;
    }
  })
  return check
}

// Check if there's collision with block group
function checkBlock(distance) {
  var check = true;
  shape.forEach(function(cube){
    if(isthere(cube.body.position.x+distance,cube.body.position.y)) {
      check = false;
    }
  })
  return check;
}

// Double speed
function goDown(){
  shape.setAll('body.velocity.y',300);
}

// initializes map to zeros
function initializeMap(){
  for (var i = 0; i < 4; i++) {
    map[i]=[0,0,0,0,0,0,0]
  }
}


// Updates map
function updateMap() {
  cleanup = [];
  shape.forEach(function(cube){
    map[cube.yIndex][cube.xIndex]=1;
  })
  block.add(shape);

  for (var i = 0; i < map.length; i++) {
    if (JSON.stringify(map[i]) == JSON.stringify([1,1,1,1,1,1,1])) {
      cleanup.push(i);
      console.log(cleanup);
    }
  }
  for (i in cleanup) {
    map.splice(cleanup[i]-i,1);
    map.push([0,0,0,0,0,0,0]);
  }

  if (cleanup.length>0) {
  block.forEach(function(blockShape){
    blockShape.forEach(function(blockCube){
      if (cleanup.indexOf(blockCube.yIndex)>-1 ) {
        console.log("here");
        blockCube.kill();
      }
    })
  });

  block.forEach(function(blockShape){
    blockShape.forEach(function(blockCube){
      blockCube.pastYIndex = blockCube.yIndex;
      for (i of cleanup) {
        if (blockCube.pastYIndex>i) {
          blockCube.yIndex += -1;
          blockCube.body.position.y += 80
        }
      }
      blockCube.pastYIndex = blockCube.yIndex;
    })
  })
  cleanup=[];
}

}

// Returns true if there's a block at that location
function isthere(x,y) {
  var isThere = false;
  block.forEach(function(blockShape){
    blockShape.forEach(function(blockCube){
      if (y<=blockCube.body.position.y+80 && y>=blockCube.body.position.y-80 && blockCube.body.position.x==x) {
        isThere = true;
      }
    })

  })
  return isThere;
}
