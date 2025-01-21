//Flappy Bird game using javascript canvas

//Getting constants
const canvas = document.getElementById("canv");
const context = canvas.getContext("2d");
const beginBtn = document.getElementById("btn")
const jumpBtn = document.getElementById("jumpbtn")
beginBtn.addEventListener("click", begin)

//Setting the canvas size
canvas.height = 600
canvas.width = 600
let isJumping = false
let gravity = 0.6




//bird object
let faby = 
{
    //Faby's spawn position
    y: 0,
    x: canvas.width * 0.1,
    fallSpeed: 0,
    //Faby's Size
    width: 60,
    height: 60,
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
    jumpSpeed: 120,  
}

//Jump trigger, using a button for now
//jumpBtn.addEventListener("click", jump)


//function to clear and prepare canvas
function initializeCanvas()
{
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "rgb(52, 177, 182)"
    context.fillRect(0, 0, canvas.width, canvas.height)   
}


//jump function
function jump()
{
    isJumping = true
    let targetY = faby.y - faby.height * 4
    function loop()
    {
        if(faby.y > 0)
        {
            faby.y -= 6
            initializeCanvas();
            drawFaby();
            jumpAnim = requestAnimationFrame(loop)
        } else if(faby.y <= 0)
        {
            isJumping = false
            return;
        }
        if(faby.y <= targetY)
        {
            cancelAnimationFrame(jumpAnim)
            isJumping = false
        }
    }
    loop()

}


//Function to update faby's position including gravity
function updateFaby() {
    // If not below the canvas and not jumping
    if (!(faby.y + faby.height >= canvas.height) && !isJumping) {
        // Update fall speed incrementally
        faby.fallSpeed += gravity;

        // Update position using the current fall speed
        faby.y += faby.fallSpeed;

        // Prevent the bird from overshooting the bottom of the canvas
        if (faby.y + faby.height > canvas.height) {
            faby.y = canvas.height - faby.height;
            faby.fallSpeed = 0; // Reset fall speed when hitting the ground
        }
    } else {
        faby.y = canvas.height - faby.height; // Ensure bird stays on the ground
        faby.fallSpeed = 0;
    }
}



//self explanatory
function drawFaby()
{
    context.fillStyle = "#ecf542"
    context.fillRect(faby.x, faby.y, faby.width, faby.height)
}


//game loop; Update, draw and loop
function begin()
{
    
    function gameLoop()
    {
        initializeCanvas();
        updateFaby()
        drawFaby();

        //console.log("1 loop")
        requestAnimationFrame(gameLoop)
    }
    gameLoop();
    
}
