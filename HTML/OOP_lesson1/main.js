// define variable for ball count paragraph

var para = document.querySelector('p');
var count = 0;

// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

// define Shape constructor

function Shape() {
  this.x = random(0,width);
  this.y = random(0,height);
  this.velX = random(-7,7);
  this.velY = random(-7,7);
  this.exists = true;
}

// define Ball constructor

function Ball(x, y, velX, velY, exists) {
  Shape.call(this, x, y, velX, velY, exists);
  
  this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
  this.size = random(10,20);
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

// define ball draw method

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

// define Ball update method

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}

// define Ball collision detection

Ball.prototype.collisionDetect = function() {
  for(j = 0; j < balls.length; j++) {
    if( (!(this.x === balls[j].x && this.y === balls[j].y && this.velX === balls[j].velX && this.velY === balls[j].velY)) ) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
      }
    }
  }
}

// define EvilCircle constructor, inheriting from Shape

function EvilCircle(x, y, exists){
	Shape.call(this, x, y, exists);
	
	this.color = 'white';
	this.size = 10;
	this.velX = 20;
	this.velY = 20;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

// define EvilCircle draw method

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}

// define EvilCircle checkBounds method

EvilCircle.prototype.checkBounds = function() {
  if((this.x + this.size) >= width) {
    this.x = -(this.size);
  }

  if((this.x - this.size) <= 0) {
    this.x = -(this.size);
  }

  if((this.y + this.size) >= height) {
    this.y = -(this.size);
  }

  if((this.y - this.size) <= 0) {
    this.y = -(this.size);
  }
}

// define EvilCircle setControls method

EvilCircle.prototype.setControls = function() {
  var _this = this;
  window.onkeydown = function(e) {
	if (e.keyCode === 65) {
		_this.x -= _this.velX;
	} else if (e.keyCode === 68) {
		_this.x += _this.velX;
	} else if (e.keyCode === 87) {
		_this.y -= _this.velY;
	} else if (e.keyCode === 83) {
		_this.y += _this.velY;
	}
  }
}

// define EvilCircle collision detection

EvilCircle.prototype.collisionDetect = function() {
  for(j = 0; j < balls.length; j++) {
    if ( balls[j].exists ) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
		count--;
		para.textContent = 'Ball count: ' + count;
      }
    }
  }
}

// define array to store balls

var balls = [];

// define loop that keeps drawing the scene constantly

var evil = new EvilCircle();
evil.setControls();

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  while(balls.length < 25) {
    var ball = new Ball();
    balls.push(ball);
	count++;
    para.textContent = 'Ball count: ' + count;
  }

  for(i = 0; i < balls.length; i++) {
	  if(balls[i].exists){
		balls[i].draw();
		balls[i].update();
		balls[i].collisionDetect();
	  }
  }
  
  evil.draw();
  evil.checkBounds();
  evil.collisionDetect();
  
  requestAnimationFrame(loop);
}

loop();