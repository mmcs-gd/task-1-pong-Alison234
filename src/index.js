const canvas = document.getElementById("cnvs");
const score = document.getElementById('score');
const restart = document.getElementById('restart')
const gameState = {};

score.style.color = "#9723e0";
score.style.fontSize = '30px';

function onMouseMove(e) {
    gameState.pointer.x = e.pageX;
    gameState.pointer.y = e.pageY;
}

restart.addEventListener('click',startGame,false);

function windowLoser(context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.textAlign = "center";
    context.fillStyle = "#ff0000";
    context.font = "italic 50pt Impact";
    context.fillText("Game Over! Your total score is: " + gameState.TotalScore,canvas.width / 2, canvas.height / 2, canvas.width/2);
    context.closePath();
    restart.style.visibility = 'visible';
}

function queueUpdates(numTicks) {
    for (let i = 0; i < numTicks; i++) {
        gameState.lastTick = gameState.lastTick + gameState.tickLength;
        update(gameState.lastTick);
    }
}

function draw(tFrame) {
    const context = canvas.getContext('2d');
    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatform(context);
    drawBall(context);
    if(gameState.IsTimeToBonus && gameState.IsBonus){
        drawBonus(context);
    }
    if(gameState.isLose){
        windowLoser(context);
    }
}

function update(tick) {
    const vx = (gameState.pointer.x - gameState.player.x) / 10;
    gameState.player.x += vx;
    const ball = gameState.ball;
    const bonus = gameState.bonus;
    ball.y += ball.vy;
    ball.x += ball.vx;
    if(gameState.IsTimeToBonus && gameState.IsBonus) {
        bonus.y2 += bonus.vy;
        bonus.y1 += bonus.vy;
        bonus.x1 += bonus.vx;
        bonus.x2 += bonus.vx;
    }
    score.innerHTML = 'Score ' + gameState.TotalScore;
    Conclusion();
}

function equalMas (a,b){
    for(let i = 0;i<a.length;i++){
        if(a[i]!=b[i]){
            return  false;
        }
    }
    return true;
}
function  Conclusion(){

    const ball = gameState.ball;
    IspunchBall = ball.vy > 0;
        if(ball.y + ball.radius >= gameState.player.y - gameState.player.height/2  && (ball.x  >= gameState.player.x -  gameState.platform.width/2 &&
            ball.x  <= gameState.player.x + gameState.platform.width/2 &&  IspunchBall)){
            gameState.ball.vy = -1*gameState.ball.vy;
            IspunchBall = !IspunchBall;
        }

    if(gameState.ball.y - ball.radius > canvas.offsetHeight){
        gameState.isLose = true;
        stopGame(gameState.stopCycle);
    }
    if(gameState.ball.y < 0)
        gameState.ball.vy =-1* gameState.ball.vy;

    if(gameState.ball.x < 0)
        gameState.ball.vx = -1*gameState.ball.vx;

    if(gameState.ball.x > canvas.offsetWidth)
        gameState.ball.vx = -1*gameState.ball.vx ;

    if(gameState.IsBonus) {
        if (gameState.bonus.y2 > canvas.offsetHeight)
            gameState.IsBonus = false;

        if (gameState.bonus.y2 + gameState.bonus.width > gameState.player.y - gameState.platform.height/2 && (gameState.bonus.x1> gameState.player.x - gameState.platform.width / 2 &&
            gameState.bonus.x1 < gameState.player.x + gameState.platform.width / 2)) {
            gameState.TotalScore += 15;
            gameState.IsBonus = false;
        }
        if(gameState.bonus.x1 + gameState.bonus.width < 0)
            gameState.bonus.vx = -1*gameState.bonus.vx;

        if(gameState.bonus.x1  + gameState.bonus.width> canvas.offsetWidth)
            gameState.bonus.vx = -1*gameState.bonus.vx ;

    }
}

function run(tFrame) {
    gameState.stopCycle = window.requestAnimationFrame(run);
    const nextTick = gameState.lastTick + gameState.tickLength;
    let numTicks = 0;
    if (tFrame > nextTick) {
        const timeSinceTick = tFrame - gameState.lastTick;
        numTicks = Math.floor(timeSinceTick / gameState.tickLength);
    }
    queueUpdates(numTicks);
    draw(tFrame);
    gameState.lastRender = tFrame;
}

function stopGame(handle) {
    timerStop();
    window.cancelAnimationFrame(handle);
}

function drawPlatform(context) {
    const {x, y, width, height} = gameState.player;
    context.beginPath();
    context.rect(x - width / 2, y - height / 2, width, height);
    context.fillStyle = "#15c0cf";
    context.shadowColor = "blue";
    context.shadowBlur = 10;
    context.fill();
    context.closePath();
}

function drawBonus(context) {
    const {x1,y1,x2,y2,width,height} = gameState.bonus;
    context.beginPath();
    context.rect(x1, y1, width, height);
    context.rect(x2, y2, height, width);
    context.fillStyle = "#f1657b";
    context.fill();
    context.closePath();
}


function drawBall(context) {
    const {x, y, radius} = gameState.ball;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = "#bf34af";
    context.fill();
    context.closePath();
}

function  setupBonus(){
    gameState.IsTimeToBonus = true;
    gameState.IsBonus = true;
    let randomBonusX = getRandomIntInclusive(0,canvas.width-100);
    let randomBonusY = getRandomIntInclusive(0,100);
    gameState.bonus = {
        x1:randomBonusX,
        x2:randomBonusX+10,
        y1:randomBonusY,
        y2:randomBonusY-10,
        width:30,
        height:10,
        vy:getRandomIntInclusive(1,5),
        vx:getRandomIntInclusive(1,5)
    }
    console.log('Setup to Bonus');
}

function setup() {
    restart.style.visibility = 'hidden';
    gameState.IsTimeToBonus = false;
    gameState.IsBonus = false;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.addEventListener('mousemove', onMouseMove, false);
    gameState.lastTick = performance.now();
    gameState.lastRender = gameState.lastTick;
    gameState.tickLength = 15; //ms
    gameState.isLose = false;
    gameState.TotalScore = 0;
    gameState.bonusTimer = 0;
    gameState.scoreTimer = 0;
    gameState.speedTimer = 0;

    let randomStartAngel = getRandomIntInclusive(-100,100)/10;
    gameState.platform = {
        width: 400,
        height: 30,
    };
    gameState.player = {
        x: 100,
        y: canvas.height - gameState.platform.height/2,
        width: gameState.platform.width,
        height: gameState.platform.height
    };
    gameState.pointer = {
        x: 0,
        y: 0,
    };
    gameState.ball = {
        x: canvas.width / 2,
        y: 0 ,
        radius: 25,
        vx: randomStartAngel,
        vy: 5
    }
}

function  timerStop(){
    clearInterval(gameState.scoreTimer);
    clearInterval(gameState.bonusTimer);
    clearInterval(gameState.speedTimer);
}

function timer(){
    gameState.scoreTimer  = setInterval(function () {
            gameState.TotalScore++;
        }, 1000);
    gameState.bonusTimer = setInterval(function () {
                setupBonus();
        }, 15000);
    gameState.speedTimer =  setInterval(function () {
                gameState.ball.vx += gameState.ball.vx * 0.1;
                gameState.ball.vy += gameState.ball.vy * 0.1;
        }, 10000);

}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.round(Math.random() * (max - min + 1) + min);
}

function startGame(){
    setup();
    run();
    timer();
}

startGame();
