// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// jarrod image
var jarrodReady = false;
var jarrodImage = new Image();
jarrodImage.onload = function () {
	jarrodReady = true;
};
jarrodImage.src = "images/jarrod.png";

// pc image
var pcReady = false;
var pcImage = new Image();
pcImage.onload = function () {
	pcReady = true;
};
pcImage.src = "images/pc.png";

// Game objects
var jarrod = {
	speed: 256 // movement in pixels per second
};
var pc = {};
var pcsCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a pc
var reset = function () {
	jarrod.x = canvas.width / 2;
	jarrod.y = canvas.height / 2;

	// Throw the pc somewhere on the screen randomly
	pc.x = 32 + (Math.random() * (canvas.width - 64));
	pc.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		jarrod.y -= jarrod.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		jarrod.y += jarrod.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		jarrod.x -= jarrod.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		jarrod.x += jarrod.speed * modifier;
	}

	// Are they touching?
	if (
		jarrod.x <= (pc.x + 32)
		&& pc.x <= (jarrod.x + 32)
		&& jarrod.y <= (pc.y + 32)
		&& pc.y <= (jarrod.y + 32)
	) {
		++pcsCaught;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (jarrodReady) {
		ctx.drawImage(jarrodImage, jarrod.x, jarrod.y);
	}

	if (pcReady) {
		ctx.drawImage(pcImage, pc.x, pc.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Grades checked: " + pcsCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
