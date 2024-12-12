const canvas = document.querySelector('canvas');
const canva = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const ctxx = canva.getContext('2d');
canvas.width = window.innerWidth;
canva.width = window.innerWidth;
canvas.height = window.innerHeight;
canva.height = window.innerHeight;

// Resize canvas when window resizes
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canva.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canva.height = window.innerHeight;
});

const particleImage = new Image();
particleImage.src = 'https://gmspace.netlify.app/images/logo.png'; // Replace with your image URL

class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2;
      this.speedX = (Math.random() - 0.5) * 10;
      this.speedY = (Math.random() - 0.5) * 10;
      this.alpha = 1; // Opacity
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= 0.01; // Fade out
      this.size = this.size / 1.02
    }

    draw() {
      ctx.globalAlpha = this.alpha; // Apply fading
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = '#17ff8e';
      ctx.fill();
    }
  }

const particles = [];

function handleParticles() {
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    // Remove particles when invisible
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleParticles();
  requestAnimationFrame(animate);
}

async function clickParticles(e) {
    const centerX = e.pageX
    const centerY = e.pageY
  
    // Generate particles
    for (let i = 0; i < 30; i++) {
      particles.push(new Particle(centerX, centerY));
    }
}

function multiplierta() {
  const btn = document.getElementById('btn');
  const targetFontSize = 1; // Target font size in px
  let fontSize = 100; // Start with a large size
  let angle = Math.PI / 4; // Initial rotation angle (45 degrees in radians)
  let oscillation = 0; // For back-and-forth rotation
  let oscillationSpeed = 0.1; // Speed of oscillation
  // Clear the canvas
  ctxx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate position above the button
  const btnRect = btn.getBoundingClientRect();
  const x = btnRect.right + btnRect.width / 2;
  const y = btnRect.top - 10; // Adjust to place it above

  // Oscillation for slight rotation
  oscillation += oscillationSpeed;
  const currentAngle = angle + Math.sin(oscillation) * Math.PI / 36; // Oscillate ±5 degrees

  // Gradually reduce font size
  fontSize = fontsize/100
  console.log(fontSize)

  // Draw the text
  ctxx.save();
  ctxx.translate(x, y); // Move to position
  ctxx.rotate(currentAngle); // Rotate the text
  ctxx.font = `${fontSize}px Arial`;
  ctxx.fillStyle = 'white';
  ctxx.textAlign = 'center';
  ctxx.fillText(text, 0, 0);
  ctxx.restore();

  // Stop animation if font size has reached the target size
  if (fontSize > targetFontSize || Math.abs(Math.sin(oscillation)) > 0.01) {
      requestAnimationFrame(multiplierta);
  }
}
function multipliert(text) {
  window.text = text
  multiplierta()
}
animate();