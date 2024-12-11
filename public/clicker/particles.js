const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize canvas when window resizes
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
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

animate();