/** @type {HTMLCanvasElement} */

//Master function to help wait for assests to load???
//window.onload = (event) => {
const GLOBAL_SPEED_MOD = 0.01;
const START_SPEED = 0.3;
let gameSpeed = 0;
function goFast() {
  if (gameSpeed < START_SPEED) gameSpeed = gameSpeed + GLOBAL_SPEED_MOD + START_SPEED;
  else gameSpeed = gameSpeed + GLOBAL_SPEED_MOD;
  return gameSpeed; 
}

const GLOBAL_SIZE_MOD = 0.01;
let gameSize = 1;
function goSmall() {
  if (gameSize < -1) gameSize = -1;
  else gameSize = gameSize - GLOBAL_SIZE_MOD;
  return gameSize;
}

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(ctx)

//Background music
const bgMusicList = [
  "Assets/8bit-mix-56351.mp3",
  "Assets/chiptune.mp3",
  "Assets/games-master-classic-arcade-game-116849.mp3",
  "Assets/space-invaders-classic-arcade-game-116826.mp3",
];
let bgMusic = new Audio();
let bgMusicSrc = "";
bgMusic.loop = false;
bgMusic.volume = 0.15;

function runBgMusic() {

  const randomSong = bgMusicList[Math.floor(Math.random() * bgMusicList.length)];
  
  if (bgMusicSrc === randomSong) {
    //console.log("same song, run again")
    runBgMusic();
  } else {
    //console.log("playing new song")
    bgMusicSrc = randomSong;
    bgMusic.src = randomSong;
    bgMusic.play();

    bgMusic.addEventListener('ended', function () {
      //console.log("song ended")
      runBgMusic();
    }, true);
  }
}

let startAudio = new Audio();
startAudio.src = "Assets/start.wav";
//startAudio.volume = 0.15;
startAudio.loop = false;

let alarmSound = new Audio();
alarmSound.src = "Assets/Battle Stations loop.wav";
alarmSound.loop = false;

let titleBG = new Audio();
titleBG.src = "Assets/spaceship-ambience-with-effects-21420.mp3";
titleBG.loop = true;
titleBG.volume = 0.8;

let typeSound = new Audio();
typeSound.src = "Assets/computer-processing-sound-effect-01-122131.mp3";
typeSound.loop = true;



function fadeMusic(input) {
  let currentVolume = input.volume;
  if (currentVolume > 0.015) input.volume = input.volume - 0.01;
  if (currentVolume <= 0.015) input.pause();
}





//this is for that strange text on canvas centering problem
const elem = document.getElementById("empty");
let canvasSize = elem.getBoundingClientRect();

const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d", {
  willReadFrequently: true,
});
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

const pointsCanvas = document.getElementById("points");
const pointsCtx = pointsCanvas.getContext("2d");
pointsCanvas.width = window.innerWidth;
pointsCanvas.height = window.innerHeight;

const titleCanvas = document.getElementById('myCanvas');
let titleCtx = titleCanvas.getContext('2d');
titleCanvas.width = window.innerWidth - 50;
titleCanvas.height = window.innerHeight - 50;
titleCtx.fillStyle = "white";
titleCtx.font = "35px VT323";

let score = 0;
let totalScore = 0;
let isGameOver = false;
let isGameStart = true;

ctx.font = "50px VT323";
ctx.textBaseline = "middle";
ctx.textAlign - "center";

pointsCtx.font = "50px VT323";
pointsCtx.textBaseline = "middle";
pointsCtx.textAlign - "center";

let startTime = 0;
let timeToNextEnemy = 0;
let enemyInterval = 500;
let lastTime = 0;

function advanceGame() {
  if (!isGameOver) {
    setTimeout(() => {
      gameSpeed = goFast();
      gameSize = goSmall();
      advanceGame();
    }, 3000);
  }
}


const titleScript = [
  "In the far future …",
  "Humans have conquered most of the Galaxy.",
  "For aeons we thought we were alone.",
  "Pirates and rebels were the only threats.",
  "That is, until the rift appeared.",
  "You've been stationed on Omnicorp's flagship, Teresa.",
  "It was sent to investigate the reality rift.",
  "Something went terribly wrong.",
  "You watched yourself stretch across the stars,",
  "then … darkness.",
  "Only two things are clear:",
   "You’re no longer in known space.",
  "Strange cybernetic vessels are attacking!",
  "Red lights flash across your deck.",
  "Battle stations!"
];

//WIP 
let pH = 0;
function wrapText(input) {
  //console.log("too big");
  let someMath = Math.floor(input.length/2) - pH
  let temp1 = input.substring(0, someMath);
  console.log(someMath)
  //input.substring((Math.floor(input.length/2)), input.length);
  let tempIndex = temp1.length - 1;
  let temp2 = input.substring(Math.floor(input.length/2) + 1, input[input.length]);
  
  //console.log(temp[tempIndex])
  if (temp1[tempIndex] == " ") {
    //console.log("this is space " + temp[tempIndex] + " see.")
    return [temp1, temp2]
    
    
  } else {
    //pH++
    //wrapText(input)
    console.log("this is a letter " + temp1[tempIndex] + " at index " + temp1[tempIndex])
    return [temp1, temp2]
  }



  // line1Chars = 
  // line2Chars = input.substring((Math.floor(input.length/2) + 2), input.length);

  //console.log(line1Chars.lastIndexOf(" "))
  //console.log(line2Chars)
  //titleCtx.fillText(chars, 10, titleCanvas.height/2 + 25)
}

function runTitle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  titleBG.play();
  animTxt(0);
}
//runTitle()


//still need to finish the word wrap feature of this, only works in full screen
function runType(index) {
  typeSound.play();
  let words = titleScript[index];
  let countAll = 0;
  let count2 = 0;
  let pause = 100; // ms to wait before drawing next character
  let charsAll;
  let line1Chars;
  let line2Chars;
  function draw() {
    countAll ++;
    // Grab all the characters up to count
    charsAll = words.substring(0, countAll);

    // Clear the canvas each time draw is called
    titleCtx.clearRect(0, 0, titleCanvas.width, titleCanvas.height);
    // Draw the characters to the canvas
    //titleCtx.fillText(chars, 10, titleCanvas.height/2);
    //console.log(chars)

    let txtWidth = titleCtx.measureText(words).width;
    //titleCtx.fillText(txt, this.x - txtWidth/2, this.y)
    //console.log("words len " + txtWidth)

    if (txtWidth <= titleCanvas.width - 10) {
      //console.log("small enough");
      line1Chars = charsAll;
      titleCtx.fillText(line1Chars, 10, titleCanvas.height/2 + 25)
    }

    if (txtWidth > titleCanvas.width - 10) {
      //call new function
      const [line1Chars, line2Chars] = wrapText(charsAll);
      titleCtx.fillText(line1Chars, 10, titleCanvas.height/2)
      count2++;
      function otherDraw() {
        titleCtx.fillText(line2Chars, 10, titleCanvas.height/2 + 25)
      }
      // if (count2 >= line1Chars.length) {
      //   setTimeout(otherDraw, pause)
      // }
      
    }

    if (countAll < words.length) {
      setTimeout(draw, pause)
    } else if (countAll >= words.length) {
      console.log("done typing")
      typeSound.pause();
      //titleCtx.clearRect(0, 0, c.width, c.height);
    };
  }
  draw();
};

function animTxt(index) {
  if (index === titleScript.length) {
    alarmSound.play();
    setTimeout(function() {
      titleCtx.clearRect(0, 0, titleCanvas.width, titleCanvas.height);
      //fadeMusic(titleBG);
      titleBG.pause();
      startGame();
    }, 3000)
  };
  if (index < titleScript.length) {
    titleCtx.clearRect(0, 0, titleCanvas.width, titleCanvas.height);
    let timeToRead = titleScript[index].length * 150;
    runType(index);
    setTimeout(function() {animTxt(index+1)}, timeToRead);
  }
}


function startGame() {
  startAudio.play();
  menuObjects = [];
  animate(0);
  isGameStart = false;
  setTimeout(() => {
    runBgMusic();
  }, 1500);
  //have to do a few more checks for when user goes straight to play
  // alarmSound.addEventListener('ended', function () {
  //   setTimeout(() => {
  //     runBgMusic();
  //   }, 500);
  // }, true);
  startTime = new Date();
  advanceGame();
};









let enemies = [];
class Enemy {
  constructor(num, source) {
    this.image = new Image();
    this.image.src = source;
    this.spriteSize = num;
    this.spriteWidth = this.image.width / this.spriteSize;
    this.spriteHeight = this.image.height;
    this.sizeModifier = Math.random() * goSmall() + 1.6;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = 0 - this.height;
    this.markedForDeletion = false;
    this.frame = 0;
    this.maxFrame = 2;
    this.animIterate = 100;
    this.smlEscapedSound = new Audio();
    this.smlEscapedSound.src = "Assets/ouch.wav";
    this.smlEscapedSound.volume = 0.3;
    this.bigEscapedSound = new Audio();
    this.bigEscapedSound.src = "Assets/big enemy got in.wav";
    this.bigEscapedSound.volume = 0.7;
    //we want anim and move speed to be linked
    this.animSpeed = goFast() * Math.random() * 1 + 10;
    this.directionX = Math.random() * (this.animSpeed * 0.05) - this.animSpeed * 0.05;
    this.directionY = this.animSpeed * 0.05 + gameSpeed;

    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];

    this.color =
      "rgb(" +
      this.randomColors[0] +
      ", " +
      this.randomColors[1] +
      ", " +
      this.randomColors[2] +
      ")";

    this.hasTrail = Math.random() > 0.5; //great shortcut
  }
  update(deltaTime) {
    //remove anims that are no longer on screen
    if (this.y > canvas.height) {
      if (this.hasTrail === true) {
        this.bigEscapedSound.play();
        score -= 5
      } else {
        this.smlEscapedSound.play();
        score -= 1
      }
      this.markedForDeletion = true;
    };

    if (score < 0) isGameOver = true;

    //bounce off left and right side of screen
    if (this.x < 0 || this.x > canvas.width - this.width) {
      this.directionX *= -1;
    }
    this.x += this.directionX;
    this.y += this.directionY;

    this.animIterate += deltaTime;

    //handle speed variations and move sprites
    if (this.animIterate > this.animSpeed) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.animIterate = 0;
      if (this.hasTrail && !this.markedForDeletion) {
        for (let i = 0; i < 1; i++) {
          particles.push(new Particle(
            this.x, this.y, this.width, this.color
            ));
        }
      }
    }
  }
  draw() {
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

let explosions = [];
class Explosion {
  constructor(x, y, size, spriteNum) {
    this.image = new Image();
    this.image.src = "Assets/enemy-explosion.png";
    this.spriteSize = spriteNum;
    this.spriteWidth = this.image.width / this.spriteSize;
    this.spriteHeight = this.image.height;
    this.size = size;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.sound = new Audio();
    this.sound.src = "Assets/pop-39222.mp3";
    this.sound.volume = 0.1;
    this.timeSinceLastFrame = 0;
    this.frameInterval = 100;
    this.markedForDeletion = false;
  }
  update(deltaTime) {
    if (this.frame === 0) this.sound.play();
    this.timeSinceLastFrame += deltaTime;
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++;
      this.timeSinceLastFrame = 0;
      if (this.frame > this.spriteSize) this.markedForDeletion = true;
    }
  }
  draw() {
    //console.log("should be explosion now")
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y + this.size * 0.25,
      this.size,
      this.size
    );
  }
}

let particles = [];
class Particle {
  constructor(x, y, size, color) {
    this.size = size;
    this.x = x + this.size / 2 + Math.random() * 50 - 25;
    this.y = y + this.size / 3 + Math.random() * 50 - 25;
    this.radius = (Math.random() * this.size) / 10;
    this.maxRadius = 25; //Math.floor() * 20 + 55; //rnd no work for some reason I cant figure out
    this.markedForDeletion = false;
    this.speedX = Math.random() * 1 + 0.5;
    this.color = color;
  }
  update() {
    this.y -= this.speedX; 
    this.radius += 0.3;
    if (this.radius > this.maxRadius - 10) this.markedForDeletion = true;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = 1 - this.radius / this.maxRadius;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}


let menuObjects = [];
class Circle {
  constructor() {
    this.size = Math.random() * 75 + 75;
    this.radius = this.size / 2;
    this.x = this.radius + Math.random() * (canvas.width - this.radius * 2);
    this.y = this.radius + Math.random() * (canvas.height - this.radius * 2);
    
    this.markedForDeletion = false;
    this.speedX = Math.random() * 1 + 0.5;
    this.directionY = Math.random() * 1 + 0.5;

    this.randomColors = [
      Math.floor(Math.random() * 110 + 190), "100%", "50%"
    ];

    this.color =
      "hsl(" +
      this.randomColors[0] +
      ", " +
      this.randomColors[1] +
      ", " +
      this.randomColors[2] +
      ")";
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "35px VT323";
    ctx.fillStyle = "black";
    let txt = "menu";
    let txtWidth = ctx.measureText(txt).width;
    ctx.fillText(txt, this.x - txtWidth/2, this.y
  );
  }
}
class Square {
  constructor(circX, circY, circS) {
    this.size = Math.random() * 75 + 75;
    this.width = this.size;
    this.height = this.size;

    this.x = this.helperX(circX, circS);
    this.y = this.helperY(circY, circS);
    
    this.markedForDeletion = false;
    this.speedX = Math.random() * 1 + 0.5;
    this.directionY = Math.random() * 1 + 0.5;;

    this.randomColors = [
      255, Math.floor(Math.random() * 255), 0,
    ];

    this.color =
      "rgb(" +
      this.randomColors[0] +
      ", " +
      this.randomColors[1] +
      ", " +
      this.randomColors[2] +
      ")";
  }
  helperX(circX, circS) {
    if (circX + circS/2 > (canvas.width/2)) {
      return 50;
    } else {
      return 200;
    }
  }
  helperY(circY, circS) {
    if (canvas.height - circY < 0 + circY) {
      return circY - circS - 125;
    } else {
      return circY + circS/2 + 125;
    }
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.font = "35px VT323";
    ctx.fillStyle = "black";
    let txt = "play";
    let txtWidth = ctx.measureText(txt).width;
    ctx.fillText(txt, this.x + this.width/2 - txtWidth/2, this.y + this.height/2
  );
  }
}

function menuAnim() {
  //ctx.clearRect(0, 0, canvas.width, canvas.height);

  menuObjects.push(new Circle());
  menuObjects.push(new Square(menuObjects[0].x, menuObjects[0].y, menuObjects[0].size));

  [...menuObjects].forEach((o) =>
    o.draw()
  );



  // if (isGameStart) requestAnimationFrame(menuAnim);
  // else isGameStart = false;
}
menuAnim()









function drawScore() {
  pointsCtx.fillStyle = "black";
  pointsCtx.fillText("points: " + score, 30, 30);
  pointsCtx.fillStyle = "white";
  pointsCtx.fillText("points: " + score, 31.5, 31.5);
}

function formatDate(dif) {  
  //let days = Math.floor(dif / (1000 * 60 * 60 * 24));
  let hours = Math.floor((dif % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((dif % (1000 * 60)) / 1000);

  return hours + "h, " + minutes + "m, " + seconds + "s.";
}

function drawGameOver() {
  //I have no idea why I have to use an empty div and convoluted math to find the center of the page but it works. Also had to add in some dirty variables.
  pointsCtx.clearRect(0, 0, pointsCanvas.width, pointsCanvas.height);

  let endTime = formatDate(new Date() - startTime);

  ctx.fillStyle = "black";
  ctx.font = "100px VT323";
  let txt = "Game Over";
  let txtWidth = ctx.measureText(txt).width * 0.5;
  ctx.fillText(
    txt,
    (canvasSize.right - canvasSize.left) * 0.5 + canvasSize.left - txtWidth,
    canvasSize.top + (canvasSize.top - canvasSize.bottom * 0.5)
  );

  ctx.fillStyle = "white";
  ctx.fillText(
    txt,
    (canvasSize.right - canvasSize.left) * 0.5 + canvasSize.left - txtWidth + 3,
    canvasSize.top + (canvasSize.top - canvasSize.bottom * 0.5) + 3
  );

  ctx.fillStyle = "black";
  ctx.font = "50px VT323";
  let txt2 = "Total Score: " + totalScore * Math.floor((new Date() - startTime) / 1000);
  let txt2Width = ctx.measureText(txt).width * 0.5;
  ctx.fillText(
    txt2,
    (canvasSize.right - canvasSize.left) * 0.5 + canvasSize.left - txt2Width,
    canvasSize.top + (canvasSize.top - canvasSize.bottom * 0.5) + 100
  );

  ctx.fillStyle = "white";
  ctx.fillText(
    txt2,
    (canvasSize.right - canvasSize.left) * 0.5 +
      canvasSize.left -
      txt2Width +
      1.5,
    canvasSize.top + (canvasSize.top - canvasSize.bottom * 0.5) + 101.5
  );
  
  ctx.fillStyle = "white";
  ctx.font = "25px VT323";
  let txt3 = "Total Time: " + endTime;
  let txt3Width = ctx.measureText(txt).width * 0.5;
  ctx.fillText(
    txt3,
    (canvasSize.right - canvasSize.left) * 0.5 + canvasSize.left - txt3Width,
    canvasSize.top + (canvasSize.top - canvasSize.bottom * 0.5) + 150
  );

  // ctx.fillStyle = "black";
  // ctx.font = "25px VT323";
  let txt4 = "Highest Points: " + totalScore;
  let txt4Width = ctx.measureText(txt).width * 0.5;
  ctx.fillText(
    txt4,
    (canvasSize.right - canvasSize.left) * 0.5 + canvasSize.left - txt4Width,
    canvasSize.top + (canvasSize.top - canvasSize.bottom * 0.5) + 200
  );

  totalScore = 0;
}
















document.addEventListener("keydown", (e) => {
  //if (e.key == 27) console.log("esc key yes")
  if (e.key = 27) {
    console.log("esc key pressed")
    location.reload();
  }
})

window.addEventListener("click", function (e) {
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
  //console.log(detectPixelColor);
  const pxlColor = detectPixelColor.data;
  
  enemies.forEach((o) => {
    if (
      o.randomColors[0] === pxlColor[0] &&
      o.randomColors[1] === pxlColor[1] &&
      o.randomColors[2] === pxlColor[2]
    ) {
      //colors match, we have collision
      o.markedForDeletion = true;
      if (o.hasTrail) score += 5;
      else score++;
      if (score > totalScore) totalScore += score - totalScore;
      
      explosions.push(new Explosion(o.x, o.y, o.width, 7));
    }
  });
});

function isIntersect(point, o) {
  return Math.sqrt((point.x-o.x) ** 2 + (point.y - o.y) ** 2) < o.radius;
}

window.addEventListener('click', (e) => {
  if (startGame) mainMenu(e);
});

  const body = document.body
  
  let startX
  const endTouch = (e) => {
    // if (startGame) mainMenu(e);
    body.removeEventListener('touchmove', moveTouch)
    body.removeEventListener('touchend', endTouch)
  }

  const moveTouch = (e) => {

    //dont need
  }

  const startTouch = (e) => {
    const {
      touches
    } = e
    if (touches && touches.length === 1) {
      const touch = touches[0]
      //console.log("first touch x " + touch.clientX)
      if (isGameStart) mainMenu(touch);
      startX = touch.clientX
      body.addEventListener('touchmove', moveTouch)
      body.addEventListener('touchend', endTouch)
    }
  }
  
body.addEventListener('touchstart', startTouch)

function mainMenu(e) {
  //console.log("y " + e.clientY)
  //console.log("x " + e.clientX)

  menuObjects.forEach(o => {
    if (o.width + o.x > e.x && o.x < e.x && o.height + o.y > e.y && o.y < e.y) {
      //console.log("square?")
      //runTitle();
      startGame();
    }
    if (isIntersect(e, o)) {
      runTitle()
      //console.log("circle?");
      //alert("Sorry, this feature is in production.")
      
    }
  });
}


function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, collisionCanvas.width, collisionCanvas.height);
  pointsCtx.clearRect(0, 0, pointsCanvas.width, pointsCanvas.height);
  if (score < 0) isGameOver = true;
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextEnemy += deltaTime;
  if (timeToNextEnemy > enemyInterval) {
    enemies.push(new Enemy(4, 'Assets/enemy-03.png'));
    timeToNextEnemy = 0;

    //sort by size for 2d depth
    enemies.sort(function (a, b) {
      return a.width - b.width;
    });
  }
  
  [...particles, ...enemies, ...explosions].forEach((object) =>
    object.update(deltaTime)
  );
  [...explosions, ...particles, ...enemies].forEach((object) => object.draw());

  drawScore();
  
  enemies = enemies.filter((object) => !object.markedForDeletion);
  
  explosions = explosions.filter((o) => !o.markedForDeletion);

  particles = particles.filter((object) => !object.markedForDeletion);

  //console.log(explosions)
  if (!isGameOver) requestAnimationFrame(animate);
  else drawGameOver(), setInterval(function() {fadeMusic(bgMusic)}, 100);
}
//};


