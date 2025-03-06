let vid;
let shapeSize = 150;         // Base size of the shape (width/height of the square)
let cornerRadius = shapeSize / 2;  // Starts as half size, making it a circle
let noiseOffset = 0;         // Time offset for Perlin noise animation
let noiseAmp = 2;            // Current noise amplitude for line sway
let targetNoiseAmp = 2;      // Target noise amplitude (changes on hover)
let shapeFactor = 1.0;       // 1 = circle, 0 = full video
let easing = 0.1;            // Speed of morphing transition
let isHovering = false;

function preload() {
  vid = createVideo("juan.mp4", videoLoaded); // Load video file
  vid.hide(); // Hide default video element
}

function videoLoaded() {
  vid.loop(); // Auto-play video on loop
  vid.volume(0); // Mute video
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);              // Draw rect from center for easy rotation around center
  noStroke();                    // No stroke for the shape
}

function draw() {
  background(20, 20, 30);        // Dark background color for contrast

  // Draw the "curtain" background: vertical lines with Perlin noise offset
  stroke(100, 100, 150, 100);    // Set stroke for lines (bluish-gray with transparency)
  strokeWeight(2);
  noiseOffset += 0.005;          // Increment time for noise to animate
  noiseAmp = lerp(noiseAmp, targetNoiseAmp, 0.05); // Smoothly adjust noise effect
  
  for (let x = 0; x <= width; x += 10) {
    let noiseVal = noise(x * 0.1, noiseOffset);
    let offset = map(noiseVal, 0, 1, -noiseAmp, noiseAmp);
    line(x + offset, 0, x + offset, height);
  }

  // Determine if mouse is hovering over the shape (within radius)
  let distToCenter = dist(mouseX, mouseY, width / 2, height / 2);
  isHovering = distToCenter < shapeSize / 2;

  // Set target values based on hover state
  let targetFactor = isHovering ? 0.0 : 1.0;
  shapeFactor = lerp(shapeFactor, targetFactor, easing); // Smooth transition effect
  targetNoiseAmp = isHovering ? 5 : 2;  // Increase background movement on hover

  let shapeOpacity = map(shapeFactor, 0, 1, 0, 255); // Opacity transition

  push();
  translate(width / 2, height / 2);
  
  if (shapeFactor > 0.1) {
    // Draw morphing shape (circle to rectangle transition)
    let currentRadius = map(shapeFactor, 0, 1, 0, shapeSize / 2);
    fill(200, 220, 255, shapeOpacity);
    rect(0, 0, shapeSize, shapeSize, currentRadius);
  }
  
  if (shapeFactor < 0.9) {
    // Display the video with fade-in effect
    tint(255, 255 - shapeOpacity); 
    image(vid, -width / 2, -height / 2, width, height);
    noTint();
  }

  pop();
}
