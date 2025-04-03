// 坐标类型定义
interface Grid {
    x: number;
    y: number;
}

class Snake {
    body: Array<Grid>;
    direction: string;
    nextDirection: string;

    constructor() {
        this.body = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
    }

    move(food: Grid) {
        const head = { ...this.body[0] };

        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        this.body.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            return true;
        }

        this.body.pop();
        return false;
    }

    changeDirection(newDirection: string) {
        const opposites: { [key: string]: string } = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };

        if (opposites[this.direction] !== newDirection) {
            this.nextDirection = newDirection;
        }
    }

    update() {
        this.direction = this.nextDirection;
    }

    checkCollision(gridSize: number) {
        const head = this.body[0];
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            return true;
        }

        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }
}

class Game {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    gridSize: number;
    tileSize: number;
    snake: Snake;
    food: Grid;
    score: number;
    gameOver: boolean;
    intervalId: number | null;

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileSize = this.canvas.width / this.gridSize;
        this.snake = new Snake();
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
        this.intervalId = null;

        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        document.getElementById('restartButton')?.addEventListener('click', () => this.restart());
    }

    generateFood() {
        const food = {
            x: Math.floor(Math.random() * this.gridSize),
            y: Math.floor(Math.random() * this.gridSize)
        };

        // 确保食物不会生成在蛇身上
        for (const segment of this.snake.body) {
            if (food.x === segment.x && food.y === segment.y) {
                return this.generateFood();
            }
        }
        return food;
    }

    handleKeyPress(event: KeyboardEvent) {
        const keyMap: { [key: string]: string } = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'w': 'up',
            's': 'down',
            'a': 'left',
            'd': 'right'
        };

        const newDirection = keyMap[event.key];
        if (newDirection) {
            this.snake.changeDirection(newDirection);
        }
    }

    update() {
        if (this.gameOver) return;

        this.snake.update();
        const ateFood = this.snake.move(this.food);

        if (ateFood) {
            this.score += 10;
            this.food = this.generateFood();
            if (document && document.getElementById('score')) {
                document.getElementById('score').textContent = `分数: ${this.score}`;
            }
        }

        if (this.snake.checkCollision(this.gridSize)) {
            this.endGame();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制食物
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(
            this.food.x * this.tileSize,
            this.food.y * this.tileSize,
            this.tileSize,
            this.tileSize
        );

        // 绘制蛇
        this.snake.body.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#4CAF50' : '#69F0AE';
            this.ctx.fillRect(
                segment.x * this.tileSize,
                segment.y * this.tileSize,
                this.tileSize,
                this.tileSize
            );
        });
    }

    endGame() {
        this.gameOver = true;
        clearInterval(this.intervalId);
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
    }

    restart() {
        this.snake = new Snake();
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
        document.getElementById('score').textContent = '分数: 0';
        document.getElementById('gameOver').style.display = 'none';
        this.start();
    }

    start() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.intervalId = setInterval(() => {
            this.update();
            this.draw();
        }, 150);
    }
}