import { addScore } from "./leaderboard.js";

const canvas = document.getElementById("canv");
const context = canvas.getContext("2d");
const beginBtn = document.getElementById("btn")
const faby0 = document.getElementById("faby0")
const faby1 = document.getElementById("faby1")
const faby2 = document.getElementById("faby2")
const faby3 = document.getElementById("faby3")
const fabySprites = [faby0, faby1, faby2, faby3]
const pipeStyle1 = document.getElementById("pipeStyle1")
const pipeStyle2 = document.getElementById("pipeStyle2")
const pipeStyle3 = document.getElementById("pipeStyle3")
const background1 = document.getElementById("background")
const background2 = document.getElementById("background")
let name = ""
beginBtn.addEventListener("click", begin)


canvas.height = 700
canvas.width = 600
const gravity = 0.6
const backgroundSpeed = 0.75
let isJumping = false
let lost = false
let backgroundPos = [0, canvas.width]
let score = 0
let highestScore = 0
let firstGame = true
let currentFaby = fabySprites[0]


let faby = 
{
    y: 1,
    x: canvas.width * 0.1,
    fallSpeed: 0,
    width: 25,
    height: 25,
    set updateX(change)
    {
        this.x += change
    },
    set updateY(change)
    {
        this.y += change
    },
    set updateFallSpeed(change)
    {
        this.fallSpeed += change
    },
    jumpSpeed: 12,  
    targetY: null,
    spriteIndex: 0,
    frameCount: 0
}

class pipes
{
    constructor(x, height, interval, width, passed)
    {
        this.x = x
        this.height = height
        this.interval = interval
        this.width = width
        this.passed = false
    }
    drawPipe()
    {
        context.fillStyle = "#42f560"

        context.drawImage(pipeStyle1, this.x, 0, this.width, canvas.height - this.height - this.interval)
        context.drawImage(pipeStyle1, this.x, canvas.height - this.height, this.width, this.height)   
    }
    
    updatePipe()
    {
        let speed = 3
        this.x -= speed
        if(this.x <= -50)
        { 
            this.x += 250 + 250 + 250
            this.height = Math.random() * 450 + 30
            this.passed = false
        }
    }
    checkCollision() 
    {
        if 
        (
            faby.x + faby.width + 6 > this.x &&  // Right side of Faby touches left side of pipe
            faby.x < this.x + this.width &&  // Left side of Faby touches right side of pipe
            (
                faby.y < canvas.height - this.height - this.interval ||  // Hits top pipe
                faby.y + faby.height > canvas.height - this.height // Hits bottom pipe
            )
        ) 
        {
            lost = true
        }
    }
    updateScore()
    {
        if (this.x <= faby.x && this.passed == false) 
        {
            score ++
            this.passed = true
        }
    }
}

//Jump trigger, using a button for now
document.addEventListener("keydown", jump)
canvas.addEventListener("click", jump)

//function to clear and prepare canvas
function initializeCanvas()
{
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "rgb(52, 177, 182)"
}

function jump(e)
{
    if(((e.key == "a") || canvas.click) && isJumping == false)
    {
        isJumping = true
        faby.fallSpeed = 0
        if(faby.targetY == null)
        {
            faby.targetY = Math.max(faby.y - faby.jumpSpeed * 6, 0)
        }
    }   
}

function updateFaby() 
{
    if(isJumping)
    {
        if (faby.y  <= 0) 
        {
            faby.y = 0;
            isJumping = false
            faby.targetY = null
            faby.fallSpeed = 0;
        } else if (faby.y > faby.targetY)
        {
            faby.y -= faby.jumpSpeed / 3
        } else
        {
            isJumping = false
            faby.fallSpeed = 0;
            faby.targetY = null
        }
    } else if (faby.y + faby.height < canvas.height) 
    {
        faby.fallSpeed += gravity;

        faby.y += faby.fallSpeed;

        if (faby.y + faby.height > canvas.height) 
        {
            faby.y = canvas.height - faby.height;
            faby.fallSpeed = 0;
        }
    }

    faby.frameCount++;

    if (faby.frameCount % 10 === 0) 
    { 
        faby.spriteIndex = (faby.spriteIndex + 1) % fabySprites.length;
        currentFaby = fabySprites[faby.spriteIndex];
    }
}


function updateBackground()
{
    backgroundPos[0] -= backgroundSpeed;
    backgroundPos[1] -= backgroundSpeed;

    if (backgroundPos[0] <= -canvas.width) 
    {
        backgroundPos[0] = backgroundPos[1] + canvas.width;
    }

    if (backgroundPos[1] <= -canvas.width) {
        backgroundPos[1] = backgroundPos[0] + canvas.width;
    }

    context.drawImage(background1, backgroundPos[0], 0, canvas.width, canvas.height)
    //background outside the canvas
    context.drawImage(background2, backgroundPos[1], 0, canvas.width, canvas.height)
}

function drawFaby()
{
    context.fillStyle = "#ecf542"
    context.drawImage(currentFaby, faby.x, faby.y, faby.width, faby.height)
}

function gameOverScreen()
{
    
    context.fillStyle = "#ecf542"
    context.fontFamily = "Exo"
    context.font = "90px Exo"
    context.fillText("Game Over", 90, 200)
    
    

    if (score < highestScore) return;
    highestScore = score;
    while (!name || name.length !== 3) {
        if(name == null){
            name = prompt("Enter your name (exactly 3 characters) to save your score:");
        } else{
            name = prompt(`${name}`);
        }
        if (name === null) return; 
        name = name.toUpperCase();
        
        addScore(name, score);
    }
    
    
}

function displayScore()
{
    context.fillStyle = "#ecf542"
    context.fontFamily = "Exo"
    context.font = "30px Exo"
    context.fillText(`Score: ${score}`, 10, 40)
}

function begin()
{
    let pipe1 = new pipes(605, Math.random() * 350 + 205, 175, 60, false)
    let pipe2 = new pipes(605 + 250, Math.random() * 350 + 200, 175, 60, false)
    let pipe3 = new pipes(605 + 250 + 250, Math.random() * 350 + 200, 175, 60, false)

    faby.y = 1
    faby.fallSpeed = 0
    faby.targetY = null
    isJumping = false
    lost = false
    backgroundPos = [0, canvas.width]
    score = 0

    function gameLoop()
    {
        if(!lost)
        {
            initializeCanvas();

            pipe1.checkCollision()
            pipe2.checkCollision()
            pipe3.checkCollision()

            updateBackground()

            updateFaby()
            
            pipe1.updatePipe()
            pipe2.updatePipe()
            pipe3.updatePipe() 

            

            drawFaby();
            pipe1.drawPipe()
            pipe2.drawPipe()
            pipe3.drawPipe()

            pipe1.updateScore()
            pipe2.updateScore()
            pipe3.updateScore()
            
            displayScore()

            requestAnimationFrame(gameLoop)
        }
        else gameOverScreen()
    }
    gameLoop();   
}


