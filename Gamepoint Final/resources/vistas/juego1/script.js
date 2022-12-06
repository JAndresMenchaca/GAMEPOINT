/**
 * Snake game assignment
 * 
 * The scene has been configured using grid display
 * Each cell has the same width and height (25px * 25px)
 * The main scene is 500 x 500
 * That means that there is a total of 20 cells (NUM_CELLS) both horizontally and vertically
 * 
 * Complete all required javascript code within the TODO blocks
 * On your recorded video, answer the QUESTION statements
 */

var game;


var sound = new Audio();
sound.src = "images/1.wav";

var sound1 = new Audio();
sound1.src = "images/3.mp3";


const FOOD_SQUARE = 1;
const SNAKE_SQUARE = 2;
const NUM_CELLS = 20;
const MESSAGE_POINTS = 'POINTS: ';
const MESSAGE_GAME_OVER = 'GAME OVER!!!';

// Square definition
class Square {
    // Initialize square
    constructor(row, col, type = SNAKE_SQUARE) {
        this.square = document.createElement('div');
        const style = this.square.style;
        this.row = row;
        this.col = col;
        this.type = type;

        style.gridRow = row;
        style.gridColumn = col;
        
        style.margin = '2px';
        style.width = '21px';
        style.height = '21px';
        sound.play();
    }

    // Make square visible
    addToParent(parent) {
        parent.appendChild(this.square);
    }

    // Set square type (food or snake part)
    set type(value) {
        this.square.style.backgroundColor = (value === FOOD_SQUARE) ? 'red' : '#e2e481';
    }

    // Set direction [rowOffset, colOffset]
    set squareDirection(value) {
        this.direction = value.slice();
    }

    // QUESTION: What exactly is being done in this method?
    move() {
        const style = this.square.style;

        if (this.direction === undefined) {
            throw new Error('You must provide the direction');
        }

        let offsetRow = this.direction[0];
        let offsetCol = this.direction[1];

        let newRow = this.row + offsetRow;
        let newCol = this.col + offsetCol;
        
        if (newRow < 1 || newRow > NUM_CELLS || newCol < 1 || newCol > NUM_CELLS) {
            return false;
        }

        this.row = newRow;
        this.col = newCol;

        style.gridRow = newRow;
        style.gridColumn = newCol;
        return true;
    }
}

// Main class
class SnakeGame {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
        this.startGame();

        // Bind events to current class
        let handleKeyUpEvent = this.handleKeyUp.bind(this);
        window.addEventListener('keyup', handleKeyUpEvent);
    }

    // Start the game by cleaning up the environment
    // and setting the required configuration variables and event handlers
    startGame() {
        this.gameArea.innerHTML = '';
        
        this.snake = new Array(); // The snake is actually an array of blue squares
        this.direction = [0, 1]; // QUESTION: What do the 0 and 1 values mean here?
        this.changedDirection = false;
        this.points = 0;

        // Initial message visualization
        this.setStatusMessage(MESSAGE_POINTS + this.points);

        // Start with three squares
        // placed in the first three columns of the grid
        this.snake.push(
            new Square(1, 3),
            new Square(1, 2),
            new Square(1, 1)
        );

        // Each square should be added to the scene
        this.snake.forEach((square) => {
            square.addToParent(this.gameArea);
            square.squareDirection = this.direction;
        });

        // Set default food position (black square)
        this.addFood();

        // Reset motion interval (300 ms)
        if (this.positionInterval !== undefined) {
            clearInterval(this.positionInterval);
        }

        let changeSnakePositionEvent = this.changeSnakePosition.bind(this);
        this.positionInterval = setInterval(changeSnakePositionEvent, 300);
    }

    // Randomly set food position
    addFood() {
        this.foodRow = this.getRandomPosition();
        this.foodCol = this.getRandomPosition();

        this.food = new Square(this.foodRow, this.foodCol, FOOD_SQUARE);
        this.food.addToParent(this.gameArea);
    }

    // Handle key events
    // This will define the direction of motion
    handleKeyUp(event) {
        if (event.key === "ArrowLeft" || 
            event.key === "ArrowRight" || 
            event.key === "ArrowUp" || 
            event.key === "ArrowDown") {
            this.changedDirection = true;
        }

        switch (event.key) {
            /**
             * TODO: Complete the missing javascript code
             */
            case "ArrowLeft":
                // same row, turn left
                this.direction[0] = 0;
                this.direction[1] = -1;
                break;
            case "ArrowRight":
                // same row, turn right
                this.direction[0] = 0// Complete this line
                this.direction[1] = 1// Complete this line
                break;
            case "ArrowUp":
                // same column, move up
                this.direction[0] = -1// Complete this line
                this.direction[1] = 0// Complete this line
                break;
            case "ArrowDown":
                // same column, move down
                this.direction[0] = 1;
                this.direction[1] = 0;
                break;
        }
    }

    getRandomPosition() {
        // Random position within the boundaries of the scene
        return Math.max(1, Math.floor(Math.random() * NUM_CELLS));
    }

    // Check whether the snake is approaching its food
    checkFoodNearby() {
        let head = this.snake[0];
        if (head.row + this.direction[0] === this.food.row && 
            head.col + this.direction[1] === this.food.col) {

            // TODO: Increase the number of points
            // Then, display the updated number of points on screen by calling setStatusMessage
            
            // YOUR CODE HERE (2 lines)
            this.points += 1;
            this.setStatusMessage(MESSAGE_POINTS + this.points);
            ////////////////////

            head = this.food;
            head.type = SNAKE_SQUARE;
            head.squareDirection = this.direction;

            // TODO: Place the head at the beginning of the this.snake array
            // Hint: You can use unshift

            // YOUR CODE HERE (1 line)
            this.snake.unshift(head);
            ////////
            
            
            this.addFood();
        }
    }

    setStatusMessage(message) {
        // Display the message inside of the status h2 element
        document.getElementById('status').innerHTML = message;
    }

    checkCollision() {
        let withCollisions = false;
        let tail = this.snake.filter((_, i) => i > 0);
        let head = this.snake[0];

        tail.forEach(square => {
            // TODO: Complete the if statement in order to check whether
            // there is a collision between each square and the head
            // Hint: compare row and col
            
            if ( this.food.row == this.head && this.food.col == this.head) {
                

                withCollisions = true;
                return;
            }
        })
        return withCollisions;
    }
    

    // Move the snake's head and body
    // The head is the first element in the this.snake array
    // The remaining elements are part of the body
    changeSnakePosition() {
        this.checkFoodNearby();
        
        let head = this.snake[0];
        
        let oldDirection = head.direction;
        head.squareDirection = this.direction;

        // Check whether movement is possible
        // Otherwise declare lost game
        if (!head.move() || this.checkCollision()) {
            sound1.play();
            this.setStatusMessage(MESSAGE_GAME_OVER);
            clearInterval(this.positionInterval);
            return;
        }

        let tail = this.snake.filter((_, i) => i > 0);

        // QUESTION: What are we doing here?
        tail.forEach(square => {
            let tmpDirection = square.direction;
            square.direction = oldDirection.slice();
            oldDirection = tmpDirection;

            square.move();
        });
    }

    
    
    
}

window.onload = function() {
    game = new SnakeGame();
    
}

