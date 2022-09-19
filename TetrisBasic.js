let canvas;
let ctx;
let gBArrayHeight = 20;
let gBArrayWidth = 12;

// Starting point for Tetromino
let startX = 4;
let startY = 0;

let score = 0;
let level = 1;
let winOrLose = "Playing...";
let tetrisLogo;

let stoppedShapeArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));
let curTetromino = [[1,0], [0,1], [1,1], [2,1]];

let tetrominos = [];
let tetrominoColors = ["purple", "#00CED1", "#6495ED", "#FEDC56", "orange", "green", "#DC143C"];
let curTetrominoColor;

let gameBoardArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;

class Coordinates {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

document.addEventListener("DOMContentLoaded", SetupCanvas);

function CreateCoordinateArray() {
    let i = 0, j = 0;
    for(let y = 9; y <= 446; y += 23) {
        for(let x = 11; x <= 264; x += 23) {
            coordinateArray[i][j] = new Coordinates(x,y);
            i++;
        }
        j++;
        i = 0;
    }
}

function SetupCanvas() {
    canvas = document.getElementById("my-canvas");
    ctx = canvas.getContext("2d");
    canvas.width = 936;
    canvas.height = 956;

    ctx.scale(2,2);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "black";
    ctx.strokeRect(8, 8, 280, 462);

    tetrisLogo = new Image(161, 54);
    tetrisLogo.src = "tetrislogo.png";
    // tetrisLogo.onLoad = DrawTetrisLogo();
    window.onload = function() { // Original line above wouldn't work - not sure why???
        DrawTetrisLogo();
    }

    ctx.fillStyle = "black";
    ctx.font = "16px Arial";

    ctx.fillText("Score", 300, 98);
    ctx.strokeRect(300, 107, 161, 24);
    ctx.fillText(score.toString(), 310, 125);

    ctx.fillText("Level", 300, 160);
    ctx.strokeRect(300, 171, 161, 24);
    ctx.fillText(level.toString(), 310, 189);

    ctx.fillText("Message", 300, 284);
    ctx.strokeRect(300, 296, 161, 28);
    SetMessage("Good Luck!");

    ctx.fillText("Status", 300, 221);
    ctx.strokeRect(300, 232, 161, 28);
    SetStatus(winOrLose);

    ctx.fillStyle = "black";
    ctx.fillText("CONTROLS", 300, 354);
    ctx.strokeRect(300, 366, 161, 104);
    ctx.font = "16px Arial";
    ctx.fillText("A / \u21E6 : Move Left", 310, 388);
    ctx.fillText("D / \u21E8 : Move Right", 310, 413);
    ctx.fillText("S / \u21E9 : Move Down", 310, 438);
    ctx.fillText("E / \u21E7 : Rotate Right", 310, 463);

    document.addEventListener("keydown", HandleKeyPress);

    CreateTetrominos();
    CreateTetromino();

    CreateCoordinateArray();
    DrawTetromino();
}

function SetStatus(status) {
    
    // Clear existing status
    ctx.clearRect(300, 232, 161, 28);
    ctx.strokeRect(300, 232, 161, 28);

    if (status === "Playing...") {
        ctx.fillStyle = "green";
    } else if (status === "Game Over!") {
        SetMessage("Sorry.");
        ctx.fillStyle = "#DC143C";
    } else {
        ctx.fillStyle = "black";
    }
    ctx.fillText(status, 310, 252);
}

function SetMessage(message) {

    // Clear existing message
    ctx.clearRect(300, 296, 161, 28);
    ctx.strokeRect(300, 296, 161, 28);

    if (message === "Bonus Points!") {
        ctx.fillStyle = "#DC143C";
    } else {
        ctx.fillStyle = "black";
    }
    ctx.fillText(message, 310, 316);
}

function DrawTetrisLogo() {
    ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
}

function DrawTetromino() {
    for(let i = 0; i < curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 1;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function HandleKeyPress(key) {
    if(winOrLose != "Game Over!") {
        // A key, left arrow (Left)
        if(key.keyCode === 65 || key.keyCode === 37) { 
            direction = DIRECTION.LEFT;
            if (!HittingTheWall() && !CheckForVerticalCollision() && !CheckForHorizontalCollision()) {
                DeleteTetromino();
                startX--;
                DrawTetromino();
            }
        // D key, right arrow (Right)
        } else if (key.keyCode === 68 || key.keyCode === 39) { 
            direction = DIRECTION.RIGHT;
            if (!HittingTheWall() && !CheckForVerticalCollision() && !CheckForHorizontalCollision()) {       
                DeleteTetromino();
                startX++;
                DrawTetromino();  
            }
        // S key, down arrow (Down)
        } else if (key.keyCode === 83 || key.keyCode === 40) { 
            MoveTetrominoDown();
        // E key, up arrow (Rotate)
        } else if (key.keyCode === 69 || key.keyCode === 38) { 
            RotateTetromino();
        }
    }
}

function MoveTetrominoDown() {
    direction = DIRECTION.DOWN;
    if (!CheckForVerticalCollision() && !CheckForHorizontalCollision()) {
        DeleteTetromino();
        startY++;
        DrawTetromino();  
    }
}

window.setInterval(function() {
    if (winOrLose != "Game Over!") {
        MoveTetrominoDown();
    }
}, 1000);


function DrawTetromino() {
    for (let i = 0; i < curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 1;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function DeleteTetromino() {
    for (let i = 0; i < curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 0;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = "white";
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

function CreateTetrominos() {
    // Push T
    tetrominos.push([[1,0], [0,1], [1,1], [2,1]]); 
    // Push I
    tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
    // Push J
    tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
    // Push Square
    tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
    // Push L
    tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
    // Push S
    tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
    // Push Z
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}

function CreateTetromino() {
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    curTetromino = tetrominos[randomTetromino];
    curTetrominoColor = tetrominoColors[randomTetromino];
}

function HittingTheWall(){
    for (let i = 0; i < curTetromino.length; i++) {
        let newX = curTetromino[i][0] + startX;
        if (newX <= 0 && direction === DIRECTION.LEFT) {
            return true;
        } else if (newX >= 11 && direction === DIRECTION.RIGHT) {
            return true;
        } 
    }
    return false;
}

function CheckForVerticalCollision() {
    let tetrominoCopy = curTetromino;
    let collision = false;
    for(let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        if (direction === DIRECTION.DOWN) {
            y++;
        }

        // Collision with stopped piece
        if (typeof stoppedShapeArray[x][y+1] === "string") { // string indicates it's holding a color, i.e. stopped square there
            DeleteTetromino();
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }
        // Collision with bottom of game board
        if (y >= 20) {
            collision = true;
            break;
        }
    }
  
    if (collision) {
        // This contols the top of the board
        if (startY <= 2) {
            winOrLose = "Game Over!";
            ctx.fillStyle = "white";
            ctx.fillRect(310, 242, 140, 30);
            SetStatus(winOrLose);
        } else {
            for (let i = 0; i < tetrominoCopy.length; i++) {
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                stoppedShapeArray[x][y] = curTetrominoColor;
            }
            CheckForCompletedRows();
            CreateTetromino();
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }
    }
    
}

function CheckForHorizontalCollision() {
    let tetrominoCopy = curTetromino;
    let collision = false;

    // Cycle through the tetromino squares
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;

        if (direction === DIRECTION.LEFT) {
            x--;
        } else if (direction === DIRECTION.RIGHT) {
            x++;
        }
        var stoppedShapeVal = stoppedShapeArray[x][y];

        // If it is a string we know there is a stopped square there
        if (typeof stoppedShapeVal === "string") {
            collision = true;
            break;
        }
    }
    return collision;
}

function CheckForCompletedRows() {
    let rowsToDelete = 0;
    let startOfDeletion = 0;
    for (y = 0; y < gBArrayHeight; y++) {
        let completed = true;
        for(x = 0; x < gBArrayWidth; x++) {
            let square = stoppedShapeArray[x][y];
            if(square === 0 || (typeof square === "undefined")){
                completed = false;
                break;
            }
        }
        if (completed) {
            if(startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;
            for(let i = 0; i < gBArrayWidth; i++) {
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                ctx.fillStyle = "white";
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
    if (rowsToDelete > 0) {

        ctx.fillStyle = "white";
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = "black";
        ctx.fillText(score.toString(), 310, 125);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);

        // 100 point bonus for 4 row combo
        if (rowsToDelete === 4) {
            score += 100;
            SetStatus("Bonus Points!");
        } else {
            score += rowsToDelete * 10;
        }
    }

}

function MoveAllRowsDown (rowsToDelete, startOfDeletion) {
    for (var i = startOfDeletion - 1; i >= 0; i--) {
        for (var x = 0; x < gBArrayWidth; x++) {
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];
            if (typeof square === "string") {
                nextSquare = square;
                gameBoardArray[x][y2] = 1;
                stoppedShapeArray[x][y2] = square;
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0;
                stoppedShapeArray[x][i] = 0;
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = "white";
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}

function RotateTetromino () {

    let newRotation = [];
    let tetrominoCopy = curTetromino;
    let curTetrominoBU;

    for (let i = 0; i < tetrominoCopy.length; i++) {

        // Backup tetromino in case of errors
        curTetrominoBU = [...curTetromino];

        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    DeleteTetromino();

    // Try drawing tetromino with rotation coordinates
    try {
        curTetromino = newRotation;
        DrawTetromino();
    } 
    // If there is an error draw backup instead
    catch (e) {
        if (e instanceof TypeError) {
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
         }
    }
}

function GetLastSquareX() {
    let lastX = 0;
    for (let i = 0; i < curTetromino.length; i++) {
        let square = curTetromino[i];
        if (square[0] > lastX) {
            lastX = square[0];
        }   
    }
    return lastX;
}

