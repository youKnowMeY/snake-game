const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let food = {};
let dx = 1;
let dy = 0;
let score = 0;
let gameInterval;
let gameSpeed = 150;
let gameRunning = false;

// 初始化游戏
function initGame() {
    snake = [
        { x: 5, y: 5 }
    ];
    score = 0;
    scoreElement.textContent = score;
    dx = 1;
    dy = 0;
    generateFood();
    if (gameInterval) {
        clearInterval(gameInterval);
    }
}

// 生成食物
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    // 确保食物不会出现在蛇身上
    for (let part of snake) {
        if (food.x === part.x && food.y === part.y) {
            generateFood();
            break;
        }
    }
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // 绘制蛇
    ctx.fillStyle = 'green';
    for (let part of snake) {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    }
}

// 更新游戏状态
function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // 检查是否撞墙
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;

    // 检查是否撞到自己
    for (let part of snake) {
        if (head.x === part.x && head.y === part.y) {
            gameOver();
            return;
        }
    }

    // 移动蛇
    snake.unshift(head);

    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

// 游戏结束
function gameOver() {
    clearInterval(gameInterval);
    gameRunning = false;
    startBtn.textContent = '重新开始';
    alert(`游戏结束！得分：${score}`);
}

// 游戏主循环
function gameLoop() {
    update();
    draw();
}

// 开始游戏
function startGame() {
    if (gameRunning) {
        return;
    }
    gameRunning = true;
    initGame();
    startBtn.textContent = '游戏中';
    gameInterval = setInterval(gameLoop, gameSpeed);
}

// 按键控制
document.addEventListener('keydown', (event) => {
    if (!gameRunning) {
        return;
    }
    
    switch (event.key) {
        case 'ArrowUp':
            if (dy !== 1) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

// 触摸控制（针对移动设备）
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    event.preventDefault();
});

canvas.addEventListener('touchmove', (event) => {
    if (!gameRunning) return;

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平移动
        if (deltaX > 0 && dx !== -1) {
            dx = 1;
            dy = 0;
        } else if (deltaX < 0 && dx !== 1) {
            dx = -1;
            dy = 0;
        }
    } else {
        // 垂直移动
        if (deltaY > 0 && dy !== -1) {
            dx = 0;
            dy = 1;
        } else if (deltaY < 0 && dy !== 1) {
            dx = 0;
            dy = -1;
        }
    }
    
    event.preventDefault();
});

// 绑定开始按钮事件
startBtn.addEventListener('click', startGame);
