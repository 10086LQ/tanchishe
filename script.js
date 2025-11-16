// 游戏配置
const config = {
    gridSize: 20,
    initialSpeed: 150,
    speedIncrease: 5,
    foodValue: 10
};

// 游戏状态
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameLoop;
let gameSpeed = config.initialSpeed;
let isGameOver = false;

// 获取DOM元素
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-btn');
const upButton = document.getElementById('up');
const downButton = document.getElementById('down');
const leftButton = document.getElementById('left');
const rightButton = document.getElementById('right');

// 初始化游戏
function initGame() {
    // 重置游戏状态
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    gameSpeed = config.initialSpeed;
    isGameOver = false;
    
    // 更新分数显示
    scoreElement.textContent = score;
    
    // 隐藏游戏结束画面
    gameOverElement.style.display = 'none';
    
    // 生成食物
    generateFood();
    
    // 开始游戏循环
    startGameLoop();
}

// 生成食物
function generateFood() {
    // 避免食物生成在蛇身上
    let overlapping;
    do {
        overlapping = false;
        food = {
            x: Math.floor(Math.random() * config.gridSize),
            y: Math.floor(Math.random() * config.gridSize)
        };
        
        // 检查是否与蛇重叠
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                overlapping = true;
                break;
            }
        }
    } while (overlapping);
}

// 开始游戏循环
function startGameLoop() {
    // 清除之前的游戏循环
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    
    // 设置新的游戏循环
    gameLoop = setInterval(() => {
        if (!isGameOver) {
            update();
            draw();
        }
    }, gameSpeed);
}

// 更新游戏状态
function update() {
    // 更新方向
    direction = nextDirection;
    
    // 获取蛇头位置
    const head = { x: snake[0].x, y: snake[0].y };
    
    // 根据方向移动蛇头
    switch (direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }
    
    // 检查游戏结束条件
    // 1. 撞墙
    if (head.x < 0 || head.x >= config.gridSize || 
        head.y < 0 || head.y >= config.gridSize) {
        gameOver();
        return;
    }
    
    // 2. 撞到自己
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver();
            return;
        }
    }
    
    // 将新头加入蛇身
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        // 加分
        score += config.foodValue;
        scoreElement.textContent = score;
        
        // 增加游戏速度
        gameSpeed = Math.max(50, gameSpeed - config.speedIncrease);
        startGameLoop();
        
        // 生成新食物
        generateFood();
    } else {
        // 移除尾部
        snake.pop();
    }
}

// 绘制游戏画面
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 计算单元格大小
    const cellWidth = canvas.width / config.gridSize;
    const cellHeight = canvas.height / config.gridSize;
    
    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        
        // 蛇头使用不同颜色
        if (i === 0) {
            ctx.fillStyle = '#2E7D32';
        } else {
            ctx.fillStyle = '#4CAF50';
        }
        
        // 绘制蛇身
        ctx.fillRect(
            segment.x * cellWidth,
            segment.y * cellHeight,
            cellWidth - 1,
            cellHeight - 1
        );
    }
    
    // 绘制食物
    ctx.fillStyle = '#F44336';
    ctx.beginPath();
    ctx.arc(
        food.x * cellWidth + cellWidth / 2,
        food.y * cellHeight + cellHeight / 2,
        cellWidth / 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// 游戏结束
function gameOver() {
    isGameOver = true;
    clearInterval(gameLoop);
    
    // 显示游戏结束画面
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
}

// 处理键盘控制
function handleKeyDown(e) {
    // 防止页面滚动
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
    
    // 根据按键设置方向，确保不能直接反向移动
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') {
                nextDirection = 'up';
            }
            break;
        case 'ArrowDown':
            if (direction !== 'up') {
                nextDirection = 'down';
            }
            break;
        case 'ArrowLeft':
            if (direction !== 'right') {
                nextDirection = 'left';
            }
            break;
        case 'ArrowRight':
            if (direction !== 'left') {
                nextDirection = 'right';
            }
            break;
        case ' ': // 空格键重新开始游戏
            if (isGameOver) {
                initGame();
            }
            break;
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 键盘控制
    document.addEventListener('keydown', handleKeyDown);
    
    // 触屏/按钮控制
    upButton.addEventListener('click', () => {
        if (direction !== 'down') {
            nextDirection = 'up';
        }
    });
    
    downButton.addEventListener('click', () => {
        if (direction !== 'up') {
            nextDirection = 'down';
        }
    });
    
    leftButton.addEventListener('click', () => {
        if (direction !== 'right') {
            nextDirection = 'left';
        }
    });
    
    rightButton.addEventListener('click', () => {
        if (direction !== 'left') {
            nextDirection = 'right';
        }
    });
    
    // 重新开始按钮
    restartButton.addEventListener('click', initGame);
}

// 初始化
function init() {
    setupEventListeners();
    initGame();
}

// 当页面加载完成后初始化游戏
window.addEventListener('load', init);