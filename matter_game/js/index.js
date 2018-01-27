"use strict";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const svg = document.getElementById('mainPage');
const startMessage = document.getElementById('startMessage');

function Dust(x, y, width, speed) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.speed = speed;
  this.color = "#aaa";

  this.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, width, width);
  }

  this.update = () => {
    // check bounds
    if (this.x + this.width > innerWidth) {
      this.x = 0;
    }
    this.x += this.speed;

    this.draw();
  }
}

// dust
const dusts = {
  nearDust: {
    width: 3,
    speed: 0.2
  },
  midDust: {
    width: 2,
    speed: 0.1
  },
  farDust: {
    width: 1,
    speed: 0.025
  }
};

let dustArray = [];

function init() {

  dustArray = [];
  // dust layer 1
  for (let i = 0; i < 50; ++i) {
    const x = Math.random() * (innerWidth - dusts.nearDust.width);
    const y = Math.random() * (innerHeight - dusts.nearDust.width);
    dustArray.push(new Dust(x, y, dusts.nearDust.width, dusts.nearDust.speed));
  }

  // dust layer 2
  for (let i = 0; i < 100; ++i) {
    const x = Math.random() * (innerWidth - dusts.midDust.width);
    const y = Math.random() * (innerHeight - dusts.midDust.width);
    dustArray.push(new Dust(x, y, dusts.midDust.width, dusts.midDust.speed));
  }

  // dust layer 3
  for (let i = 0; i < 350; ++i) {
    const x = Math.random() * (innerWidth - dusts.farDust.width);
    const y = Math.random() * (innerHeight - dusts.farDust.width);
    dustArray.push(new Dust(x, y, dusts.farDust.width, dusts.farDust.speed));
  }
}

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.font = "15px Arial";
  ctx.lineJoin = 'round';
  ctx.lineCap = "round";
}

setupCanvas();
init();
window.onresize = function() {
  setupCanvas();
  init();
};

//mouse input
window.onmousemove = function(e) {
  char.getMousePos(e.clientX, e.clientY);
};

//keyboard input
const keys = [];
document.body.addEventListener("keyup", function(e) {
  keys[e.keyCode] = false;
});
document.body.addEventListener("keydown", function(e) {
  keys[e.keyCode] = true;
  if (keys[84]) { //t = testing mode
    if (game.testing) {
      game.testing = false;
    } else {
      game.testing = true;
    }
  }
});

// Use stats lib
// const stats = new Stats();
// stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// stats.domElement.style.opacity = '0.5'


// game Object
const gameProto = function() {
  this.cycle = 0;
  this.cyclePaused = 0;
  this.lastTimeStamp = 0;
  this.delta = 0;
  this.buttonCD = 0
  this.gravityDir = 0;

  this.timing = function() {
    this.cycle++;
    this.delta = (engine.timing.timestamp - this.lastTimeStamp) / 16.666666666666;
    this.lastTimeStamp = engine.timing.timestamp;
  }
  this.zoom = 1 / 300;
  this.scaleZoom = function() {
    if (this.zoom != 1) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }
  }
  this.keyZoom = function() {
    if (keys[187] && this.zoom < 1.5) { // +
      this.zoom *= 1.01;
    } else if (keys[189] && this.zoom > 0.5) { // -
      this.zoom *= 0.99;
    } else if (keys[48]) { //0
      this.zoom = 1;
    }
  }
  this.wipe = function() {
    if (this.isPaused) {
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      var skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
     skyGradient.addColorStop(0, '#00aaff');
     skyGradient.addColorStop(1, '#ffffff');
     ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  this.isPaused = false;

  this.pause = function() {
    if (keys[32] && char.buttonCD < this.cycle) {
      char.buttonCD = this.cycle + 20;
      if (!this.isPaused) {
        this.cyclePaused = this.cycle;
        this.isPaused = true;
        for (let i = 0; i < body.length; i++) {
          body[i].pausedVelocity = body[i].velocity;
          body[i].pausedVelocityA = body[i].angularVelocity;
          Matter.Sleeping.set(body[i], true);
        }
        for (let i = 0; i < bullet.length; i++) {
          bullet[i].pausedVelocity = bullet[i].velocity;
          bullet[i].pausedVelocityA = bullet[i].angularVelocity;
          Matter.Sleeping.set(bullet[i], true);
        }
      } else {
        this.isPaused = false;
        for (let i = 0; i < body.length; i++) {
          Matter.Sleeping.set(body[i], false);
          Matter.Body.setVelocity(body[i], body[i].pausedVelocity);
          Matter.Body.setAngularVelocity(body[i], body[i].angularVelocity)
        }
        for (let i = 0; i < bullet.length; i++) {
          bullet[i].birthCycle += this.cycle - this.cyclePaused;
          Matter.Sleeping.set(bullet[i], false);
          if (bullet[i].pausedVelocity) {
            Matter.Body.setVelocity(bullet[i], bullet[i].pausedVelocity);
            Matter.Body.setAngularVelocity(bullet[i], bullet[i].angularVelocity)
          }

        }
      }
    }
  }
}

const game = new gameProto();

// player Object
const charProto = function() {
  this.width = 50;
  this.radius = 30;
  this.stroke = "#333";
  this.fill = "#eee";
  this.height = 42;
  this.yOffWhen = {
    crouch: 22,
    stand: 49,
    jump: 70
  }
  this.yOff = 70;
  this.yOffGoal = 70;
  this.onGround = false;
  this.onBody = {};
  this.numTouching = 0;
  this.crouch = false;
  this.isHeadClear = true;
  this.spawnPos = {
    x: -1700,
    y: 750
  };
  this.spawnVel = {
    x: 0,
    y: 0
  };
  this.x = this.spawnPos.x;
  this.y = this.spawnPos.y;
  this.Sy = this.y;
  this.Vx = 0;
  this.VxMax = 7;
  this.Vy = 0;
  this.mass = 5;
  this.Fx = 0.004 * this.mass;
  this.FxAir = 0.0006 * this.mass;
  this.Fy = -0.04 * this.mass;
  this.angle = 0;
  this.walk_cycle = 0;
  this.stepSize = 0;
  this.flipSide = -1;
  this.hip = {
    x: 12,
    y: 24,
  };
  this.skirt = {
    x: 0,
    y: 0,
    x2: 0,
    y2: 0
  };
  this.foot = {
    x: 0,
    y: 0
  };
  this.chest = {
    x: 0,
    y: 0
  };
  this.canvasX = canvas.width / 2;
  this.canvasY = canvas.height / 2;
  this.transX = this.canvasX - this.x;
  this.transY = this.canvasX - this.x;
  this.mouse = {
    x: canvas.width / 3,
    y: canvas.height
  };
  this.getMousePos = function(x, y) {
    this.mouse.x = x;
    this.mouse.y = y;
  };

  this.move = function() {
    this.x = player.position.x;
    this.y = playerBody.position.y - this.yOff;
    this.Vx = player.velocity.x;
    this.Vy = player.velocity.y;
  };

  this.look = function() {
    let mX = this.mouse.x;
    if (mX > canvas.width * 0.8) {
      mX = canvas.width * 0.8;
    } else if (mX < canvas.width * 0.2) {
      mX = canvas.width * 0.2;
    }
    let mY = this.mouse.y;
    if (mY > canvas.height * 0.8) {
      mY = canvas.height * 0.8;
    } else if (mY < canvas.height * 0.2) {
      mY = canvas.height * 0.2;
    }
    this.canvasX = this.canvasX * 0.94 + (canvas.width - mX) * 0.06;
    this.canvasY = this.canvasY * 0.94 + (canvas.height - mY) * 0.06;
    this.transX = this.canvasX - this.x;
    this.Sy = 0.99 * this.Sy + 0.01 * (this.y);
    if (this.Sy - this.y > canvas.height / 2) {
      this.Sy = this.y + canvas.height / 2
    } else if (this.Sy - this.y < -canvas.height / 2) {
      this.Sy = this.y - canvas.height / 2
    }
    this.transY = this.canvasY - this.Sy;
    this.angle = Math.atan2(this.mouse.y - this.canvasY, this.mouse.x - this.canvasX);
  };
  this.doCrouch = function() {
    if (!this.crouch) {
      this.crouch = true;
      this.yOffGoal = this.yOffWhen.crouch;
      Matter.Body.translate(playerHead, {
        x: 0,
        y: 40
      })
    }
  }
  this.undoCrouch = function() {
    this.crouch = false;
    this.yOffGoal = this.yOffWhen.stand;
    Matter.Body.translate(playerHead, {
      x: 0,
      y: -40
    })
  }
  this.enterAir = function() {
    this.onGround = false;
    player.frictionAir = 0.001;
    if (this.isHeadClear) {
      if (this.crouch) {
        this.undoCrouch();
      }
      this.yOffGoal = this.yOffWhen.jump;
    };
  }
  this.enterLand = function() {
    this.onGround = true;
    if (this.crouch) {
      if (this.isHeadClear) {
        this.undoCrouch();
        player.frictionAir = 0.12;
      } else {
        this.yOffGoal = this.yOffWhen.crouch;
        player.frictionAir = 0.5;
      }
    } else {
      this.yOffGoal = this.yOffWhen.stand;
      player.frictionAir = 0.12;
    }
  };
  this.buttonCD_jump = 0;
  this.keyMove = function() {
    if (this.onGround) {
      if (this.crouch) {
        if (!(keys[40] || keys[83]) && this.isHeadClear) {
          this.undoCrouch();
          player.frictionAir = 0.12;
        }
      } else if (keys[40] || keys[83]) {
        this.doCrouch();
        player.frictionAir = 0.5;
      } else if ((keys[38] || keys[87]) && this.buttonCD_jump + 20 < game.cycle) {
        this.buttonCD_jump = game.cycle;
        Matter.Body.setVelocity(player, {
          x: player.velocity.x,
          y: 0
        });
        player.force.y = this.Fy / game.delta;
      }
      if (keys[37] || keys[65]) { //left / a
        if (player.velocity.x > -this.VxMax) {
          player.force.x = -this.Fx / game.delta;
        }
      } else if (keys[39] || keys[68]) { //right / d
        if (player.velocity.x < this.VxMax) {
          player.force.x = this.Fx / game.delta;
        }
      }

    } else {
      if (this.buttonCD_jump + 60 > game.cycle && !(keys[38] || keys[87]) && this.Vy < 0) {
        Matter.Body.setVelocity(player, {
          x: player.velocity.x,
          y: player.velocity.y * 0.94
        });
      }
      if (keys[37] || keys[65]) { // left / a
        if (player.velocity.x > -this.VxMax + 2) {
          player.force.x = -this.FxAir / game.delta;
        }
      } else if (keys[39] || keys[68]) { // right / d
        if (player.velocity.x < this.VxMax - 2) {
          player.force.x = this.FxAir / game.delta;
        }
      }
    }
    this.yOff = this.yOff * 0.85 + this.yOffGoal * 0.15
  };
  this.deathCheck = function() {
    if (this.y > 3000) {
      Matter.Body.setPosition(player, this.spawnPos);
      Matter.Body.setVelocity(player, this.spawnVel);
      this.dropBody();
    }
  };
  this.holdKeyDown = 0;
  this.buttonCD = 0;
  this.keyHold = function() {
    if (this.isHolding) {
      const Dx = body[this.holdingBody].position.x - holdConstraint.pointA.x;
      const Dy = body[this.holdingBody].position.y - holdConstraint.pointA.y;
      holdConstraint.length = Math.sqrt(Dx * Dx + Dy * Dy) * 0.95;
      holdConstraint.stiffness = -0.01 * holdConstraint.length + 1;
      if (holdConstraint.length > 100) this.dropBody();
      holdConstraint.pointA = {
        x: this.x + 50 * Math.cos(this.angle),
        y: this.y + 50 * Math.sin(this.angle)
      };
      if (keys[81]) { // q
        body[this.holdingBody].torque = 0.05 * body[this.holdingBody].mass;
      }
      if (this.buttonCD < game.cycle) {
        if (keys[70]) { //f
          this.holdKeyDown++;
        } else if (this.holdKeyDown && !keys[70]) {
          this.dropBody();
          this.throwBody();
        }
      }
    } else if (keys[70]) {
      this.findClosestBody();
      if (this.closest.dist2 < 10000) {
        this.isHolding = true;
        this.holdKeyDown = 0;
        this.buttonCD = game.cycle + 20;
        body[this.holdingBody].collisionFilter.group = 2;
        this.holdingBody = this.closest.index;
        body[this.holdingBody].collisionFilter.group = -2;
        body[this.holdingBody].frictionAir = 0.1;
        holdConstraint.bodyB = body[this.holdingBody];
        holdConstraint.length = 0;
        holdConstraint.pointA = {
          x: this.x + 50 * Math.cos(this.angle),
          y: this.y + 50 * Math.sin(this.angle)
        };
      }
    }
  };
  this.dropBody = function() {
    let timer; //reset player collision
    function resetPlayerCollision() {
      timer = setTimeout(function() {
        const dx = char.x - body[char.holdingBody].position.x
        const dy = char.y - body[char.holdingBody].position.y
        if (dx * dx + dy * dy > 20000) {
          body[char.holdingBody].collisionFilter.group = 2;
        } else {
          resetPlayerCollision();
        }
      }, 100);
    }
    resetPlayerCollision();
    this.isHolding = false;
    body[this.holdingBody].frictionAir = 0.01;
    holdConstraint.bodyB = jumpSensor;
  };
  this.throwMax = 150;
  this.throwBody = function() {
    let throwMag = 0;
    if (this.holdKeyDown > 20) {
      if (this.holdKeyDown > this.throwMax) this.holdKeyDown = this.throwMax;
      throwMag = body[this.holdingBody].mass * this.holdKeyDown * 0.001;
    }
    body[this.holdingBody].force.x = throwMag * Math.cos(this.angle);
    body[this.holdingBody].force.y = throwMag * Math.sin(this.angle);
  };
  this.isHolding = false;
  this.holdingBody = 0;
  this.closest = {
    dist2: 1000000,
    index: 0
  };

  this.findClosestBody = function() {
    this.closest.dist2 = 100000;
    for (let i = 0; i < body.length; i++) {
      const Px = body[i].position.x - (this.x + 50 * Math.cos(this.angle));
      const Py = body[i].position.y - (this.y + 50 * Math.sin(this.angle));
      if (body[i].mass < player.mass && Px * Px + Py * Py < this.closest.dist2) {
        this.closest.dist2 = Px * Px + Py * Py;
        this.closest.index = i;
      }
    }
  };

  this.drawLeg = function() {
    ctx.save();
    ctx.scale(this.flipSide, 1);
    ctx.drawImage(charLeg_img, this.foot.x -10, this.foot.y- 30);
    ctx.drawImage(charSkirt_img, this.skirt.x - 30, this.skirt.y + 5);
    ctx.drawImage(charBody_img, this.chest.x - 10, this.chest.y);

    ctx.fill();
    ctx.restore();
  };

  this.calcBodyPosition = function(cycle_offset, offset) {
    this.stepSize = 0.3 * this.stepSize + 0.1 * (8 * Math.sqrt(Math.abs(this.Vx)) * this.onGround);
    const stepAngle = 0.037 * this.walk_cycle + cycle_offset;
    this.foot.x = 2 * this.stepSize * Math.cos(stepAngle) + offset;
    this.foot.y = offset + this.stepSize * Math.sin(stepAngle) + this.yOff + this.height;
    const Ymax = this.yOff + this.height;
    if (this.foot.y > Ymax) this.foot.y = Ymax;

    this.chest.x = -1 / 3 * (this.hip.x - this.foot.x);
    this.chest.y = -1 / 3 * (this.hip.y - this.foot.y);
    this.skirt.x = -2 / 3 * (this.hip.x - this.foot.x);
    this.skirt.y = -2 / 3 * (this.hip.y - this.foot.y);
  };

  this.setSpawnPos = function(x, y) {
    this.spawnPos.x = x;
    this.spawnPos.y = y;
  }

  this.draw = function() {
    ctx.fillStyle = this.fill;
    if (this.mouse.x > canvas.width / 2) {
      this.flipSide = 1;
    } else {
      this.flipSide = -1;
    }
    this.walk_cycle += this.flipSide * this.Vx;

    //draw body
    ctx.save();
    ctx.translate(this.x, this.y);
    this.calcBodyPosition(Math.PI, -1);
    ctx.save();
    ctx.scale(this.flipSide, 1);
    ctx.drawImage(charLeg_img, this.foot.x -10, this.foot.y- 30);
    ctx.fill();
    ctx.restore();
    this.calcBodyPosition(0, 0);
    this.drawLeg();

    if ((this.angle < -Math.PI * 7 / 8 || this.angle > Math.PI * 8 / 9) || (this.angle > -Math.PI * 1 / 8 && this.angle < Math.PI * 1 / 9)) {
      ctx.rotate(this.angle);
    } else {
      if (this.angle < -Math.PI / 2) {
        ctx.rotate(-Math.PI * 7 / 8);
      }
      if (this.angle >= -Math.PI / 2 && this.angle < 0) {
        ctx.rotate(-Math.PI * 1 / 8);
      }
      if (this.angle > Math.PI / 2) {
        ctx.rotate(Math.PI * 8 / 9);
      }
      if (this.angle <= Math.PI / 2 && this.angle > 0) {
        ctx.rotate(Math.PI * 1 / 9);
      }
    }

    if (this.angle < -Math.PI / 2 || this.angle > Math.PI / 2) {
      ctx.drawImage(charHeadL_img, -34, -30);
    } else {
      ctx.drawImage(charHeadR_img, -35, -35);
    }

    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    //draw holding graphics
    if (this.isHolding) {
      if (this.holdKeyDown > 20) {
        if (this.holdKeyDown > this.throwMax) {
          ctx.strokeStyle = 'rgba(120, 0, 120, 0.8)';
        } else {
          ctx.strokeStyle = 'rgba(255, 0, 255, ' + (0.2 + 0.4 * this.holdKeyDown / this.throwMax) + ')';
        }
      } else {
        ctx.strokeStyle = 'rgba(0, 120, 120, 0.2)';

      }
      ctx.lineWidth = 10;
      ctx.moveTo(holdConstraint.bodyB.position.x + Math.random() * 2,
        holdConstraint.bodyB.position.y + Math.random() * 2);
      ctx.lineTo(this.x + 15 * Math.cos(this.angle), this.y + 15 * Math.sin(this.angle));
      ctx.stroke();
    }


    ctx.save();

    if (this.angle < -Math.PI / 2 || this.angle > Math.PI / 2) {
      ctx.translate(this.x + 5, this.y + 40);
      ctx.rotate(this.angle - Math.PI/2);
      ctx.drawImage(charHandL_img, -8, -8);
    } else {
      ctx.translate(this.x -5, this.y + 40);
      ctx.rotate(this.angle - Math.PI/2);
      ctx.drawImage(charHandR_img, -8, -8);
    }
    ctx.fill();
    ctx.restore();

  };
};
const char = new charProto();

//bullets
const bullet = [];
//mouse click events
window.onmousedown = function(e) {
  game.mouseDown = true;
};
window.onmouseup = function(e) {
  game.mouseDown = false;
};

function fireBullet(type) {
  const len = bullet.length;
  const dist = 15
  const dir = (Math.random() - 0.5) * 0.1 + char.angle
  bullet[len] = Bodies.rectangle(char.x + dist * Math.cos(char.angle) + 0, char.y + dist * Math.sin(char.angle) + 40, 30, 20, {
    angle: dir,
    frictionAir: 0,
    restitution: 0.25,
    collisionFilter: {
      group: -2
    }
  });
  //fire circles
  bullet[len].birthCycle = game.cycle;

  Matter.Body.setVelocity(bullet[len], {
    x: char.Vx,
    y: char.Vy
  });
  //add force to fire bullets
  const vel = 0.03;
  const f = {
    x: vel * Math.cos(dir) / game.delta,
    y: vel * Math.sin(dir) / game.delta
  }
  bullet[len].force = f;
  player.force.x -= f.x;
  player.force.y -= f.y;

  World.add(engine.world, bullet[len]); //add bullet to world
}

let fireBulletCD = 0;

function bulletLoop() {
  //fire check
  if (game.mouseDown && fireBulletCD < game.cycle && !game.isPaused) {
    fireBulletCD = game.cycle + 20; //bullet fire speed
    fireBullet();
  }
  //bullet loop
  let i = bullet.length;
  while (i--) {
    if (bullet[i].birthCycle + 5 < game.cycle) {
      bullet[i].collisionFilter.group = 1;
    }
    if (bullet[i].birthCycle + 200 < game.cycle && !game.isPaused) {
      Matter.World.remove(engine.world, bullet[i]);
      bullet.splice(i, 1);
    }
  }
}

//matter.js
const Engine = Matter.Engine,
  World = Matter.World,
  Events = Matter.Events,
  Composites = Matter.Composites,
  Composite = Matter.Composite,
  Constraint = Matter.Constraint,
  Vertices = Matter.Vertices,
  Query = Matter.Query,
  Body = Matter.Body,
  Bodies = Matter.Bodies;

const engine = Engine.create();

let vector = Vertices.fromPath('0 40  0 115  20 130  30 130  50 115  50 40');
const playerBody = Matter.Bodies.fromVertices(0, 0, vector);
var jumpSensor = Bodies.rectangle(0, 46, 40, 20, {
  sleepThreshold: 99999999999,
  isSensor: true
});
vector = Vertices.fromPath('0 -66 18 -82  0 -37 50 -37 50 -66 32 -82');
const playerHead = Matter.Bodies.fromVertices(0, -55, vector);
const headSensor = Bodies.rectangle(0, -57, 48, 45, {
  sleepThreshold: 99999999999,
  isSensor: true,
});

const player = Body.create({ //jumpSensor + playerBody
  parts: [playerBody, playerHead, jumpSensor, headSensor],
  inertia: Infinity,
  friction: 0.002,
  restitution: 0.3,
  sleepThreshold: Infinity,
  collisionFilter: {
    group: -2
  },
});
Matter.Body.setPosition(player, char.spawnPos);
Matter.Body.setVelocity(player, char.spawnVel);
Matter.Body.setMass(player, char.mass);
World.add(engine.world, [player]);
//holding body constraint
const holdConstraint = Constraint.create({
  pointA: {
    x: 0,
    y: 0
  },
  bodyB: jumpSensor,
  stiffness: 0.4,
});

World.add(engine.world, holdConstraint);

//spawn bodies
const body = [];
const map = [];
const cons = [];
const consBB = [];
const checkPoint = [];
const endPoint= [];

spawn();


function makeCheckPoint(x, y, width, height) {
  checkPoint[checkPoint.length] = Bodies.rectangle(x, y, width, height, {
    sleepThreshold: 99999999999,
    isSensor: true,
    isStatic: true
  });
}

function makeEndPoint(x, y, width, height) {
  endPoint[endPoint.length] = Bodies.rectangle(x, y, width, height, {
    sleepThreshold: 99999999999,
    isSensor: true,
    isStatic: true
  });
}

function spawn() {
  function BodyRect(x, y, width, height, properties) {
    body[body.length] = Bodies.rectangle(x + width / 2, y + height / 2, width, height, properties);
  }
  const propsBouncy = {
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    restitution: 1,
  }
  const propsOverBouncy = {
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    restitution: 1.05,
  }
  const propsHeavy = {
    density: 0.01 //default density 0.001
  }
  const propsNoRotation = {
    inertia: Infinity, //prevents player rotation
  }

  function constraintPB(x, y, bodyIndex, stiffness) {
    cons[cons.length] = Constraint.create({
      pointA: {
        x: x,
        y: y
      },
      bodyB: body[bodyIndex],
      stiffness: stiffness,
    })
  }

  function constraintBB(bodyIndexA, bodyIndexB, stiffness) {
    consBB[consBB.length] = Constraint.create({
      bodyA: body[bodyIndexA],
      bodyB: body[bodyIndexB],
      stiffness: stiffness,
    })
  }

  for (let i = 0; i < 10; i++) { //random bouncy circles
    body[body.length] = Bodies.circle(-1600 + (0.5 - Math.random()) * 200, 600 + (0.5 - Math.random()) * 200, 7 + Math.ceil(Math.random() * 30), {
      restitution: 0.8,
    })
  }


  for (let i = 0; i < 12; i++) { //a stack of boxesdd
    body[body.length] = Bodies.rectangle(6500 + i * 50, 450, 50, 50);
  }


  (function newtonsCradle() {  //jump pad
    const x = 5000;
    const r = 20;
    const y = 700;
    for (let i = 0; i < 5; i++) {
      body[body.length] = Bodies.circle(x + i * r * 2, 1000, r, Object.assign({}, propsHeavy, propsOverBouncy, propsNoRotation));
      constraintPB(x + i * r * 2, 1000, body.length - 1, 0.9);
    }
    body[body.length - 1].force.x = 0.02 * body[body.length - 1].mass; //give the last one a kick
  })();

  (function newtonsCradle() {
    const x = 4000;
    const r = 80;
    const y = 700;
    for (let i = 0; i < 3; i++) {
      body[body.length] = Bodies.circle(x + i * r * 2, 1300, r, Object.assign({}, propsHeavy, propsOverBouncy, propsNoRotation));
      constraintPB(x + i * r * 2, 800, body.length - 1, 0.9);
    }
    body[body.length - 1].force.x = 0.02 * body[body.length - 1].mass;
  })();

  //map statics
  function mapRect(x, y, width, height, properties) {
    map[map.length] = Bodies.rectangle(x + width / 2, y + height / 2, width, height, properties);
  }

  function mapVertex(x, y, vector, properties) {
    map[map.length] = Matter.Bodies.fromVertices(x, y, Vertices.fromPath(vector), properties);
  }

  //object
  for (let i = 0; i < 12; i++) { //a stack of boxes
    body[body.length] = Bodies.rectangle(2720, 500 + i * 25, 25, 25);
  }

  //map bound
  mapRect(-2200, -500, 200, 1800); //left wall
  mapRect(-2000, 1000, 3120, 300); //ground
  mapRect(-600, -500, 680, 1400); //first cave
  mapRect(1600, 1000, 1400, 300); //2nd ground
  mapRect(2700, 820, 300, 280);
  mapRect(4450, 1000, 2000, 300) //3rd ground
  mapRect(4050, 120, 10, 300);
  mapRect(5500, 500, 300, 100);
  mapRect(5800, 500, 800, 800);
  mapRect(6600, 500, 3000, 300); //4th ground
  mapRect(9400, -500, 200, 1000);
  makeCheckPoint(500, 900, 50, 50);
  makeCheckPoint(2850, 720, 50, 50);
  makeEndPoint(8500, 400, 50, 50);

  for (let i = 0; i < body.length; i++) {
    body[i].collisionFilter.group = 1;
    World.add(engine.world, body[i]);
  }
  for (let i = 0; i < map.length; i++) {
    map[i].collisionFilter.group = -1;
    Matter.Body.setStatic(map[i], true); //static
    World.add(engine.world, map[i]);
  }
  for (let i = 0; i < cons.length; i++) {
    World.add(engine.world, cons[i]);
  }
  for (let i = 0; i < consBB.length; i++) {
    World.add(engine.world, consBB[i]);
  }
  for (let i = 0; i < checkPoint.length; i++) {
    World.add(engine.world, checkPoint[i]);
  }
  for (let i = 0; i < endPoint.length; i++) {
    World.add(engine.world, endPoint[i]);
  }
}

// matter events
function playerOnGroundCheck(event) {
  function enter() {
    char.numTouching++;
    if (!char.onGround) char.enterLand();
  }
  const pairs = event.pairs;
  for (let i = 0, j = pairs.length; i != j; ++i) {
    let pair = pairs[i];
    if (pair.bodyA === jumpSensor) {
      char.onBody = pair.bodyB.id;
      enter();
    } else if (pair.bodyB === jumpSensor) {
      enter();
      char.onBody = pair.bodyA.id;
    }
  }
}

function playerSetCheckPoint(event) {
  const pairs = event.pairs;
  for (let i = 0, j = pairs.length; i != j; ++i) {
    let pair = pairs[i];
    for (let i = 0; i < checkPoint.length; i += 1) {
      if (pair.bodyA === checkPoint[i]) {
        // console.log("if");
      } else if (pair.bodyB === checkPoint[i]) {
        let vertices = checkPoint[i].vertices;
        char.setSpawnPos(vertices[0].x, vertices[0].y);
        // console.log(vertices[0].x);
        // console.log(char.spawnPos.x);
      }
    }

  }
}

function playerSetEndPoint(event) {
  const pairs = event.pairs;
  for (let i = 0, j = pairs.length; i != j; ++i) {
    let pair = pairs[i];
    for (let i = 0; i < endPoint.length; i += 1) {
      if (pair.bodyA === endPoint[i]) {
        console.log("if");
      } else if (pair.bodyB === endPoint[i]) {
          console.log("end");
          cancelAnimationFrame(cycle)
        mainPage.onclick = true;
        mainPage.style.display = 'true';
        location.reload();


      }
    }
  }
}

function playerOffGroundCheck(event) {
  function enter() {
    if (char.onGround && char.numTouching === 0) char.enterAir();
  }
  const pairs = event.pairs;
  for (let i = 0, j = pairs.length; i != j; ++i) {
    let pair = pairs[i];
    if (pair.bodyA === jumpSensor) {
      enter();
    } else if (pair.bodyB === jumpSensor) {
      enter();
    }
  }
}

function playerHeadCheck(event) {
  if (char.crouch) {
    char.isHeadClear = true;
    const pairs = event.pairs;
    for (let i = 0, j = pairs.length; i != j; ++i) {
      let pair = pairs[i];
      if (pair.bodyA === headSensor) {
        char.isHeadClear = false;
      } else if (pair.bodyB === headSensor) {
        char.isHeadClear = false;
      }
    }
  }
}
Events.on(engine, "beforeUpdate", function(event) {
  char.numTouching = 0;
});

Events.on(engine, "collisionStart", function(event) {
  playerOnGroundCheck(event);
  playerHeadCheck(event);
  playerSetCheckPoint(event);
  playerSetEndPoint(event);
});
Events.on(engine, "collisionActive", function(event) {
  playerOnGroundCheck(event);
  playerHeadCheck(event);
});
Events.on(engine, 'collisionEnd', function(event) {
  playerOffGroundCheck(event);
});

// render
function drawMap() {
  //draw map
  ctx.beginPath();
  for (let i = 0; i < map.length; i += 1) {
    let vertices = map[i].vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  }
  ctx.fillStyle = '#743';
  ctx.fill();
}

function drawBody() {
  //draw body
  ctx.beginPath();
  for (let i = 0; i < body.length; i += 1) {
    let vertices = body[i].vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  }
  ctx.lineWidth = 1.5;
  ctx.fillStyle = '#544';
  ctx.fill();
  ctx.strokeStyle = '#222';
  ctx.stroke();
}

function drawBullet() {
  //draw body
  ctx.beginPath();
  for (let i = 0; i < bullet.length; i += 1) {
    let vertices = bullet[i].vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  }

  ctx.fillStyle = '#f34';
  //ctx.fillStyle = '#0cc';
  ctx.fill();
}

function drawCons() {
  //draw body
  ctx.beginPath();
  for (let i = 0; i < cons.length; i += 1) {
    ctx.moveTo(cons[i].pointA.x, cons[i].pointA.y);
    ctx.lineTo(cons[i].bodyB.position.x, cons[i].bodyB.position.y);
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#999';
  ctx.stroke();
}

function drawCheckPoint() {
  ctx.beginPath();
  for (let i = 0; i < checkPoint.length; i += 1) {
    let vertices = checkPoint[i].vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  }
  ctx.fillStyle = '#88f';
  ctx.fill();
}

function drawEndPoint() {
  ctx.beginPath();
  for (let i = 0; i < endPoint.length; i += 1) {
    let vertices = endPoint[i].vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  }
  ctx.fillStyle = '#aa0';
  ctx.fill();
}

function drawUI() {
  ctx.beginPath();
  ctx.font = "48px serif";
  ctx.fillText(" A D 키로 좌우로 이동합니다.", -1700, 900);
  ctx.fillText(" S 키를 누르면 앉습니다.", -550, 965);
  ctx.fillText("파란색 상자는", 350, 730);
  ctx.fillText("체크포인트 입니다.", 300, 800);
  ctx.fillText("W키로 점프할 수 있습니다.", 1050, 800);
  ctx.fillText("마우스 버튼 클릭으로", 2000, 730);
  ctx.fillText("칼을 던질 수 있습니다.", 2000, 800);
  ctx.fillText("SPACE 키를 눌러", 3400, 730);
  ctx.fillText("캐릭터를 제외한 시간을 정지합니다.", 3200, 800);
  ctx.fillText("점프 패드를 통해 높이 뛸 수 있습니다.", 4700, 800);
  ctx.fillText("F키로 물건을 들을 수 있습니다.", 6500, 300);
  ctx.fillText("GOAL", 8500, 300);
  ctx.fill();

}

//main loop
function cycle() {
  // stats.begin();
  for (var dust of dustArray) {
    dust.update();
  }
  game.timing();
  game.wipe();
  char.keyMove();
  char.keyHold();
  game.keyZoom();
  game.pause();
  char.move();
  char.deathCheck();
  bulletLoop();
  char.look();
  game.wipe();
  ctx.save();
  game.scaleZoom();
  ctx.translate(char.transX, char.transY);
  drawCons();
  drawEndPoint();
  drawCheckPoint();
  drawBody();
  drawUI();
  char.draw();

  if (!game.isPaused) {}

  drawMap();
  drawBullet();
  ctx.restore();

  let line = 80;
  ctx.fillText("x: " + char.x.toFixed(0), 5, line);
  line += 20;
  ctx.fillText("y: " + char.y.toFixed(0), 5, line);
  line += 20;

  // stats.end();
  requestAnimationFrame(cycle);
}
const charBody_img = new Image();
charBody_img.src = './img/body.png';
const charLeg_img = new Image();
charLeg_img.src = './img/leg.png';
const charSkirt_img = new Image();
charSkirt_img.src = './img/skirt.png';

const charHeadR_img = new Image();
charHeadR_img.src = './img/head_r.png';

const charHeadL_img = new Image();
charHeadL_img.src = './img/head_l.png';

const charHandL_img = new Image();
charHandL_img.src = './img/hand_l.png';

const charHandR_img = new Image();
charHandR_img.src = './img/hand_r.png';

function runPlatformer() {
  mainPage.onclick = null;
  mainPage.style.display = 'none';
  // document.body.appendChild(stats.dom);
  Engine.run(engine);
  console.clear();
  open();
  requestAnimationFrame(cycle);
}

function open() {
  const introCycles = 200;
  game.zoom = game.cycle / introCycles;
  if (game.cycle < introCycles) {
    requestAnimationFrame(open);
  } else {
    ctx.restore();
  }
}

document.oncontextmenu = function(event) {
  event.preventDefault();
}
