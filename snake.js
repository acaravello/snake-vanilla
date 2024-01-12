
const board = document.getElementById('game-board');
const instructionsText = document.getElementById('game-instructions');
const appLogo = document.getElementById('app-logo');
const score = document.getElementById('score');
const highScore = document.getElementById('high-score-all-time');
const gridSize = 20;
let gameSpeedDelay = 150;
let highScorePlayed = 0;
let snake = [{ x: 10, y: 10 }];
let gameStarted = false;
let food = generateFood();
let direction = 'right';
let gameInterval;

function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
}

function generateFood() {
    if (gameStarted) {
        const x = Math.floor(Math.random() * gridSize) + 1;
        const y = Math.floor(Math.random() * gridSize) + 1;
        return { x, y }
    } 
    else {
        return null;
    }
}

function drawSnake() {
    snake.forEach(segment => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.classList.add(className);
    return element;
}

function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

function drawFood() {
    const foodElement = createGameElement('div', 'food');
    if(food) {
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

function move() {
    const head = { ...snake[0] };
    switch(direction) {
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++
            break;
        default:
            head.x++;
            break;
    }
    snake.unshift(head);
    if(food && (head.x === food.x && head.y === food.y)) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            updateScore();
            move();
            checkCollisions();
            draw();
        }, gameSpeedDelay)
    } else {
        snake.pop();
    }
}

function startGame() {
    gameStarted = true;
    food = generateFood();
    instructionsText.style.display = 'none';
    appLogo.style.display = 'none';
    gameInterval = setInterval(()=> {
        move();
        checkCollisions();
        draw();
    }, gameSpeedDelay);
}

function onListenKeyPress(event) {
    if(!gameStarted && (event.code === 'Space' || event.key === ' ')) {
        startGame();
    } else {
        switch(event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

function increaseSpeed() {
    if(gameSpeedDelay > 70) {
        gameSpeedDelay -= 5;
    }
}

function checkCollisions() {
    const headSnake = snake[0];
    if(headSnake.x < 1 || headSnake.x > gridSize || headSnake.y < 1 || headSnake.y > gridSize) {
        resetGame();
    }
    snake.filter((el,index) => index > 0).forEach(element => {
        if((headSnake.x === element.x) && (headSnake.y === element.y)) {
            resetGame();
        } 
    })
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    updateScore();
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 150;
    
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function updateHighScore() {
    const currentScore = snake.length - 1;
    if(currentScore > highScorePlayed) {
        highScorePlayed = currentScore;
        highScore.textContent = highScorePlayed.toString().padStart(3, '0');
    }
    highScore.style.display = 'block';
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionsText.style.display = 'block';
    appLogo.style.display = 'block';
}

document.addEventListener('keydown', onListenKeyPress);
