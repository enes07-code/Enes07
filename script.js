/* ========== DATA ========== */
const collections = [
  {
    title: "Velvet Soft",
    meta: "24 gif • 1.2k",
    badge: "HD",
    desc: "Yumuşak pembe tonlar, akışkan hareketler ve yüksek kalite gif koleksiyonu.",
    gradient: "linear-gradient(160deg, #ff6b9d 0%, #c44569 100%)"
  },
  {
    title: "Blush Flow",
    meta: "18 gif • 890",
    badge: "Yeni",
    desc: "Işık oyunları ve yavaş geçişli animasyonlar.",
    gradient: "linear-gradient(160deg, #ff8fb8 0%, #ff4d8d 100%)"
  },
  {
    title: "Silk Wave",
    meta: "31 gif • 2.4k",
    badge: "",
    desc: "İpek gibi akan formlar ve derin pembe gölgeler.",
    gradient: "linear-gradient(160deg, #ffb3d1 0%, #ff6b9d 100%)"
  },
  {
    title: "Rose Pulse",
    meta: "12 gif • 3.1k",
    badge: "Hot",
    desc: "Nabız gibi atan neon-pembe efektler.",
    gradient: "linear-gradient(160deg, #ff4d8d 0%, #9b2d5a 100%)"
  },
  {
    title: "Petal Drift",
    meta: "27 gif • 1.7k",
    badge: "",
    desc: "Yüzen taç yaprakları ve soft blur.",
    gradient: "linear-gradient(160deg, #ff9ec4 0%, #e05a8a 100%)"
  },
  {
    title: "Neon Bloom",
    meta: "15 gif • 4.2k",
    badge: "4K",
    desc: "Parlak neon vurgular ve 4K kalite.",
    gradient: "linear-gradient(160deg, #ff6b9d 0%, #ff2e6d 100%)"
  }
];

/* ========== RENDER CARDS ========== */
const grid = document.getElementById("grid");

collections.forEach((item, i) => {
  const card = document.createElement("div");
  card.className = "card";
  card.style.animationDelay = `${i * 0.08}s`;
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-bg" style="background:${item.gradient}"></div>
      <div class="card-overlay"></div>
      \( {item.badge ? `<div class="badge"> \){item.badge}</div>` : ""}
      <div class="card-info">
        <div class="card-title">${item.title}</div>
        <div class="card-meta">${item.meta}</div>
      </div>
    </div>
  `;
  card.addEventListener("click", () => openViewer(i));
  grid.appendChild(card);
});

/* Staggered entrance */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".card").forEach(card => observer.observe(card));

/* ========== 3D TILT + PARALLAX ON CARDS ========== */
document.querySelectorAll(".card").forEach(card => {
  const inner = card.querySelector(".card-inner");

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    inner.style.transform = `rotateX(\( {rotateX}deg) rotateY( \){rotateY}deg) scale3d(1.03,1.03,1.03)`;
  });

  card.addEventListener("mouseleave", () => {
    inner.style.transform = "rotateX(0) rotateY(0) scale3d(1,1,1)";
  });

  // Touch tilt (light)
  card.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const rect = card.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    inner.style.transform = `rotateX(\( {rotateX}deg) rotateY( \){rotateY}deg)`;
  }, { passive: true });

  card.addEventListener("touchend", () => {
    inner.style.transform = "rotateX(0) rotateY(0)";
  });
});

/* ========== GLOBAL MOUSE / TOUCH PARALLAX (BLOBS) ========== */
const blobs = document.querySelectorAll(".blob");
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

function updateParallax() {
  currentX += (mouseX - currentX) * 0.06;
  currentY += (mouseY - currentY) * 0.06;

  blobs.forEach(blob => {
    const speed = parseFloat(blob.dataset.speed) || 0.04;
    const x = currentX * speed * 80;
    const y = currentY * speed * 80;
    blob.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });

  requestAnimationFrame(updateParallax);
}
updateParallax();

window.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

window.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  mouseX = (t.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (t.clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

/* ========== PARTICLES ========== */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 2.2 + 0.6;
    this.speedX = (Math.random() - 0.5) * 0.35;
    this.speedY = (Math.random() - 0.5) * 0.35;
    this.opacity = Math.random() * 0.35 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 150, 190, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 55; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ========== VIEWER ========== */
const viewer = document.getElementById("viewer");
const viewerBg = document.getElementById("viewerBg");
const viewerTitle = document.getElementById("viewerTitle");
const viewerDesc = document.getElementById("viewerDesc");

function openViewer(index) {
  const item = collections[index];
  viewerBg.style.background = item.gradient;
  viewerTitle.textContent = item.title;
  viewerDesc.textContent = item.desc;
  viewer.classList.add("open");
}

document.getElementById("closeViewer").addEventListener("click", () => {
  viewer.classList.remove("open");
});

viewer.addEventListener("click", (e) => {
  if (e.target === viewer) viewer.classList.remove("open");
});

/* ========== TABS ========== */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
  });
});

/* ========== HEADER HIDE ON SCROLL ========== */
const main = document.getElementById("main");
const header = document.getElementById("header");
let lastScroll = 0;

main.addEventListener("scroll", () => {
  const current = main.scrollTop;
  if (current > lastScroll && current > 60) {
    header.style.transform = "translateY(-100%)";
    header.style.opacity = "0";
  } else {
    header.style.transform = "translateY(0)";
    header.style.opacity = "1";
  }
  lastScroll = current;
});

/* iOS overscroll prevention */
document.body.addEventListener("touchmove", (e) => {
  if (!e.target.closest("main") && !e.target.closest(".viewer")) {
    e.preventDefault();
  }
}, { passive: false });
