//Flappy Bird game using javascript canvas

//Getting constants
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
beginBtn.addEventListener("click", begin)


//Setting the canvas size
canvas.height = 700
canvas.width = 600
const gravity = 0.6
const backgroundSpeed = 0.75
let isJumping = false
let lost = false
let backgroundPos = [0, canvas.width]
let score = 0
let currentFaby = fabySprites[0]



//bird object
let faby = 
{
    //Faby's spawn position
    y: 1,
    x: canvas.width * 0.1,
    fallSpeed: 0,
    //Faby's Size
    width: 25,
    height: 25,
    //Update position and speed
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

//Pipe object
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
        //top and bottom pipes
        // context.fillRect(this.x, 0, this.width, canvas.height - this.height - this.interval)
        // context.fillRect(this.x, canvas.height - this.height, this.width, this.height)   

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
            //alert("Game Over");
            //location.reload(); // Reload to restart the game
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

    //context.fillRect(0, 0, canvas.width, canvas.height)  
    //context.drawImage(background1, 0, 0, canvas.width, canvas.height)
    //background outside the canvas
    //context.drawImage(background2, canvas.width, 0, canvas.width, canvas.height)
}

//jump function
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
        console.log("fall speed = " + faby.fallSpeed, "targetY = " +faby.targetY, "Y position = " +faby.y, "Gravity = " +gravity)
    }   
}

//Function to update faby's position including gravity
function updateFaby() 
{
    if(isJumping)
    {
        if (faby.y  <= 0) 
        {
            faby.y = 0;
            isJumping = false
            faby.targetY = null
            faby.fallSpeed = 0; // Reset fall speed when hitting the ground
        } else if (faby.y > faby.targetY)
        {
            faby.y -= faby.jumpSpeed / 3
        } else
        {
            isJumping = false
            faby.fallSpeed = 0;
            faby.targetY = null
            console.log("fall speed = " + faby.fallSpeed, "targetY = " +faby.targetY, "Y position = " +faby.y, "Gravity = " +gravity)
        }
    } else if (faby.y + faby.height < canvas.height) 
    {
        // Update fall speed incrementally
        faby.fallSpeed += gravity;

        // Update position using the current fall speed
        faby.y += faby.fallSpeed;

        // Prevent the bird from overshooting the bottom of the canvas
        if (faby.y + faby.height > canvas.height) 
        {
            faby.y = canvas.height - faby.height;
            faby.fallSpeed = 0; // Reset fall speed when hitting the ground
        }
    }

    faby.frameCount++;

    if (faby.frameCount % 10 === 0) 
    { // change 5 to a higher number to flap slower
        faby.spriteIndex = (faby.spriteIndex + 1) % fabySprites.length;
        currentFaby = fabySprites[faby.spriteIndex];
    }
}

//Function to cause background to scroll
function updateBackground()
{
    backgroundPos[0] -= backgroundSpeed;
    backgroundPos[1] -= backgroundSpeed;

    // Reset the first background when it moves out of view
    if (backgroundPos[0] <= -canvas.width) 
    {
        backgroundPos[0] = backgroundPos[1] + canvas.width;
    }

    // Reset the second background when it moves out of view
    if (backgroundPos[1] <= -canvas.width) {
        backgroundPos[1] = backgroundPos[0] + canvas.width;
    }

    context.drawImage(background1, backgroundPos[0], 0, canvas.width, canvas.height)
    //background outside the canvas
    context.drawImage(background2, backgroundPos[1], 0, canvas.width, canvas.height)
}

//self explanatory
function drawFaby()
{
    context.fillStyle = "#ecf542"
    //context.fillRect(faby.x, faby.y, faby.width, faby.height)
    context.drawImage(currentFaby, faby.x, faby.y, faby.width, faby.height)
}

//Game over screen
function gameOverScreen()
{
    context.fillStyle = "#ecf542"
    context.fontFamily = "Exo"
    context.font = "90px Exo"
    context.fillText("Game Over", 90, 200)
}

function displayScore()
{
    context.fillStyle = "#ecf542"
    context.fontFamily = "Exo"
    context.font = "30px Exo"
    context.fillText(`Score: ${score}`, 10, 40)
}

//game loop; Update, draw and loop
function begin()
{
    let pipe1 = new pipes(605, Math.random() * 350 + 205, 175, 60, false)
    let pipe2 = new pipes(605 + 250, Math.random() * 350 + 200, 175, 60, false)
    let pipe3 = new pipes(605 + 250 + 250, Math.random() * 350 + 200, 175, 60, false)

    faby.y = 1
    fallSpeed = 0
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


