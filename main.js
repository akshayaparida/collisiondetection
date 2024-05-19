// Setup canvas
const canvas = document.querySelector("canvas"); // Get the canvas element
const ctx = canvas.getContext("2d"); // Get the 2D drawing context
const width = (canvas.width = window.innerWidth); // Set canvas width to window width
const height = (canvas.height = window.innerHeight); // Set canvas height to window height

// Get reference to the ball count paragraph
const para = document.querySelector('p'); // Get the paragraph element
let count = 0; // Initialize ball count

// Function to generate a random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random color
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Define the Shape class
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x; // x-coordinate
    this.y = y; // y-coordinate
    this.velX = velX; // Velocity along the x-axis
    this.velY = velY; // Velocity along the y-axis
  }
}

// Define the Ball class that extends Shape
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY); // Call the constructor of Shape
    this.color = color; // Ball color
    this.size = size; // Ball size
    this.exists = true; // Flag to determine if the ball exists
  }

  // Method to draw the ball
  draw() {
    if (this.exists) {
      ctx.beginPath(); // Start drawing path
      ctx.fillStyle = this.color; // Set fill color
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // Draw circle
      ctx.fill(); // Fill the circle
    }
  }

  // Method to update ball position
  update() {
    if (this.exists) {
      // Check if the ball hits the canvas boundaries
      if (this.x + this.size >= width || this.x - this.size <= 0) {
        this.velX = -this.velX; // Reverse velocity along x-axis
      }
      if (this.y + this.size >= height || this.y - this.size <= 0) {
        this.velY = -this.velY; // Reverse velocity along y-axis
      }
      // Update ball position
      this.x += this.velX;
      this.y += this.velY;
    }
  }

  // Method to detect collision with other balls
  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB(); // Change color on collision
        }
      }
    }
  }
}

// Define the EvilCircle class that extends Shape
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20); // Call the constructor of Shape
    this.color = 'white'; // Circle color
    this.size = 10; // Circle size

    // Event listener for arrow keys to move the circle
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }

  // Method to draw the circle
  draw() {
    ctx.beginPath(); // Start drawing path
    ctx.lineWidth = 3; // Set line width
    ctx.strokeStyle = this.color; // Set stroke color
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // Draw circle
    ctx.stroke(); // Stroke the circle
  }

  // Method to check if the circle hits the canvas boundaries
  checkBounds() {
    if (this.x + this.size >= width || this.x - this.size <= 0) {
      this.x = this.x < width / 2 ? this.size : width - this.size;
    }
    if (this.y + this.size >= height || this.y - this.size <= 0) {
      this.y = this.y < height / 2 ? this.size : height - this.size;
    }
  }

  // Method to detect collision with balls and eliminate them
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false; // Remove the ball from existence
          count--; // Decrease ball count
          para.textContent = `Ball count: ${count}`; // Update ball count display
        }
      }
    }
  }
}

const balls = [];

// Create balls
while (balls.length < 25) {
  const size = random(10, 20); // Random size for the ball
  const ball = new Ball(
    random(0 + size, width - size), // Random x-coordinate within canvas boundaries
    random(0 + size, height - size), // Random y-coordinate within canvas boundaries
    random(-7, 7), // Random velocity along x-axis
    random(-7, 7), // Random velocity along y-axis
    randomRGB(), // Random color
    size // Size of the ball
  );
  balls.push(ball); // Add ball to the array
  count++; // Increase ball count
  para.textContent = `Ball count: ${count}`; // Update ball count display
}

const evilCircle = new EvilCircle(random(0, width), random(0, height)); // Create an EvilCircle object

// Function to animate the canvas
function loop() {
  ctx.fillStyle = 'rgb(0, 0, 0, 0.25)'; // Set fill style with transparency
  ctx.fillRect(0, 0, width, height); // Fill canvas with black color with transparency

  // Loop through all balls
  for (const ball of balls) {
    if (ball.exists) {
      ball.draw(); // Draw the ball
      ball.update(); // Update ball position
      ball.collisionDetect(); // Detect collision with other balls
    }
  }

  evilCircle.draw(); // Draw the evil circle
  evilCircle.checkBounds(); // Check if the evil circle hits canvas boundaries
  evilCircle.collisionDetect(); // Detect collision between the evil circle and balls

  requestAnimationFrame(loop); // Request next frame
}

loop(); // Start the animation
