//Flappy Bird game using javascript canvas

//Getting constants
const canvas = document.getElementById("canv");
const context = canvas.getContext("2d");
const beginBtn = document.getElementById("btn")
const jumpBtn = document.getElementById("jumpbtn")
beginBtn.addEventListener("click", begin)

//Setting the canvas size
canvas.height = 700
canvas.width = 600
let isJumping = false
const gravity = 0.8


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
    jumpSpeed: 25,  
    targetY: null,
}

//Pipe object
class pipes
{
    constructor(x, height, interval, width)
    {
        this.x = x
        this.height = height
        this.interval = interval
        this.width = width
    }
    drawPipe()
    {
        context.fillStyle = "#42f560"
        //top and bottom pipes
        context.fillRect(this.x, 0, this.width, canvas.height - this.height - this.interval)
        context.fillRect(this.x, canvas.height - this.height, this.width, this.height)   
    }
    
    updatePipe()
    {
        let speed = 3
        this.x -= speed
        if(this.x <= -50)
        { 
            this.x += 250 + 250 + 250
            this.height = Math.random() * 450 + 30
        }
    }
}

//Jump trigger, using a button for now
document.addEventListener("keydown", jump)


//function to clear and prepare canvas
function initializeCanvas()
{
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "rgb(52, 177, 182)"
    context.fillRect(0, 0, canvas.width, canvas.height)   
}


//jump function
function jump(e)
{
    if(e.key == "a" && isJumping == false)
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
}


//self explanatory
function drawFaby()
{
    context.fillStyle = "#ecf542"
    context.fillRect(faby.x, faby.y, faby.width, faby.height)
}

//know when game over
function checkFail() 
{
    //check forwards
    if((faby.x + faby.width <= ((pipe1.x) || (pipe2.x) || (pipe3.x))) && (faby.y <= ((pipe1.height) || (pipe2.height) || (pipe3.height))))
    {
        alert("done")
    }
}

let pipe1 = new pipes(605, Math.random() * 350 + 205, 175, 60)
let pipe2 = new pipes(605 + 250, Math.random() * 350 + 200, 175, 60)
let pipe3 = new pipes(605 + 250 + 250, Math.random() * 350 + 200, 175, 60)
//game loop; Update, draw and loop
function begin()
{
   
    function gameLoop()
    {
        initializeCanvas();
        updateFaby();
        pipe1.updatePipe()
        pipe2.updatePipe()
        pipe3.updatePipe()
        drawFaby();
        pipe1.drawPipe()
        pipe2.drawPipe()
        pipe3.drawPipe()
        

        
        requestAnimationFrame(gameLoop)
    }
    gameLoop();
    
}


