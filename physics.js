const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

const objects = {
    ball: { radius: 20, color: 'blue', mass: 1, friction: 0.9 },
    chair: { radius: 30, color: 'brown', mass: 10, friction: 0.8 },
    car: { radius: 50, color: 'red', mass: 50, friction: 0.6 },
    balloon: { radius: 15, color: 'lightblue', mass: 0.1, friction: 0.95 },
    stone: { radius: 25, color: 'gray', mass: 5, friction: 0.85 }
};

const planetGravities = {
    earth: 9.8,
    mars: 3.7,
    jupiter: 24.8,
    moon: 1.6,
    venus: 8.87
};

let gravity = planetGravities.earth;  // default gravity (Earth)
let currentObject = objects.ball;  // default object (ball)

const objectSelect = document.getElementById('objectSelect');
const planetSelect = document.getElementById('planetSelect');
const heightDisplay = document.getElementById('heightDisplay');
const scaleList = document.getElementById('scaleList');

let object;
let maxHeight = 0;

// Ball object class
class PhysicsObject {
    constructor(x, y, objectType) {
        this.x = x;
        this.y = y;
        this.radius = objectType.radius;
        this.color = objectType.color;
        this.mass = objectType.mass;
        this.dy = 0;
        this.friction = objectType.friction;
        this.initialY = y;  // Initial position to calculate max height
        maxHeight = 0;  // Reset max height
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        if (this.y + this.radius + this.dy > canvas.height) {
            this.dy = -this.dy * this.friction;
        } else {
            this.dy += gravity * (this.mass / 10);  // gravity scaled by mass
        }

        this.y += this.dy;

        // Track the highest point
        const currentHeight = this.initialY - this.y;
        if (currentHeight > maxHeight) {
            maxHeight = currentHeight;
        }

        this.draw();
    }
}

// Create a new object instance and reset max height
function resetObject() {
    object = new PhysicsObject(400, 100, currentObject);
    maxHeight = 0;
    heightDisplay.textContent = `Max Height: 0 meters`;
}

// Update and animate the canvas
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    object.update();

    // Display max height in meters (you can convert pixels to meters as per the scale you choose)
    heightDisplay.textContent = `Max Height: ${(maxHeight / 10).toFixed(2)} meters`;

    requestAnimationFrame(animate);
}

// Event listener for object change
objectSelect.addEventListener('change', (e) => {
    currentObject = objects[e.target.value];
    resetObject();  // Reset the object and start the simulation again
});

// Event listener for planet change (gravity change)
planetSelect.addEventListener('change', (e) => {
    gravity = planetGravities[e.target.value];
});

// Create a height scale on the canvas
function createScale() {
    scaleList.innerHTML = '';
    for (let i = 0; i <= 10; i++) {
        const li = document.createElement('li');
        li.textContent = `${i * 10} meters`;
        scaleList.appendChild(li);
    }
}

// Initialize and start the animation
createScale();
resetObject();
animate();
