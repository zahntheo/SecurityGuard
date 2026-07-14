/* Particle identity cloud adapted from the supplied PSUI attention-catcher prototype. */
(() => {
  "use strict";
  const TEAL = [0, 212, 170];
  const PURPLE = [123, 97, 255];
  const RED = [239, 68, 68];
  const AMBER = [245, 158, 11];
  const TOKENS = [
    "Anna K. Müller", "ID L01X 4492 887", "DE89 3704 •••• 0532",
    "Hauptstr. 12, Berlin", "+49 171 ••• 4821", "passport: C4F92K",
    "DOB 14.02.1998", "SCHUFA 97.2%", "€3,200 / month", "IBAN exposed",
    "signature ✎", "tax-id 55 170 99", "home address", "card •••• 8842"
  ];

  const mix = (a, b, t) => a.map((value, index) => Math.round(value + (b[index] - value) * t));

  function init(canvas, options = {}) {
    if (!canvas || canvas.dataset.cloudReady) return;
    canvas.dataset.cloudReady = "true";
    const context = canvas.getContext("2d");
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let cell = 10;
    let particles = [];
    let labels = [];
    let exposed = 0;
    let cycleStart = 0;
    let frame = 0;

    function buildPortrait() {
      const buffer = document.createElement("canvas");
      const brush = buffer.getContext("2d");
      buffer.width = width;
      buffer.height = height;
      const size = Math.min(width, height) * (width < 640 ? .62 : .48);
      centerX = width / 2;
      centerY = height * .32;
      cell = Math.max(7, Math.round(size / 46));

      const shade = (x, y, radiusX, radiusY, light, dark) => {
        const gradient = brush.createRadialGradient(x - radiusX * .28, y - radiusY * .34, radiusX * .08, x, y, Math.max(radiusX, radiusY) * 1.08);
        gradient.addColorStop(0, light);
        gradient.addColorStop(1, dark);
        brush.fillStyle = gradient;
        brush.beginPath();
        brush.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
        brush.fill();
      };

      shade(centerX, centerY - size * .3, size * .17, size * .215, "#fff", "#34425a");
      brush.fillStyle = "#8799b7";
      brush.fillRect(centerX - size * .065, centerY - size * .17, size * .13, size * .15);
      const torso = brush.createLinearGradient(0, centerY, 0, centerY + size * .62);
      torso.addColorStop(0, "#eef3fb");
      torso.addColorStop(.55, "#7d93b8");
      torso.addColorStop(1, "#33405a");
      brush.fillStyle = torso;
      brush.beginPath();
      brush.moveTo(centerX - size * .35, centerY + size * .62);
      brush.lineTo(centerX - size * .42, centerY + size * .2);
      brush.quadraticCurveTo(centerX - size * .36, centerY, centerX - size * .14, centerY - size * .05);
      brush.quadraticCurveTo(centerX, centerY, centerX + size * .14, centerY - size * .05);
      brush.quadraticCurveTo(centerX + size * .36, centerY, centerX + size * .42, centerY + size * .2);
      brush.lineTo(centerX + size * .35, centerY + size * .62);
      brush.closePath();
      brush.fill();

      const pixels = brush.getImageData(0, 0, width, height).data;
      const targets = [];
      let minX = width;
      let maxX = 0;
      for (let y = cell >> 1; y < height; y += cell) {
        for (let x = cell >> 1; x < width; x += cell) {
          const offset = (y * width + x) * 4;
          if (pixels[offset + 3] < 90) continue;
          const brightness = (pixels[offset] * .299 + pixels[offset + 1] * .587 + pixels[offset + 2] * .114) / 255;
          targets.push({ x, y, brightness });
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
        }
      }
      particles = targets.map((target) => ({
        homeX: target.x,
        homeY: target.y,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        leak: 0,
        brightness: target.brightness,
        phase: Math.random() * Math.PI * 2,
        color: mix(TEAL, PURPLE, (target.x - minX) / Math.max(1, maxX - minX))
      }));
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      buildPortrait();
    }

    function leak() {
      let count = 0;
      const amount = 26 + Math.floor(Math.random() * 22);
      while (count < amount) {
        const particle = particles[Math.floor(Math.random() * particles.length)];
        if (!particle || particle.leak) continue;
        const dx = particle.x - centerX;
        const dy = particle.y - centerY;
        const distance = Math.hypot(dx, dy) || 1;
        const speed = 1.4 + Math.random() * 2.6;
        particle.vx = dx / distance * speed + Math.random() - .5;
        particle.vy = dy / distance * speed + Math.random() - .9;
        particle.leak = 60 + Math.floor(Math.random() * 70);
        count++;
      }
      exposed += count;
      const angle = Math.random() * Math.PI * 2;
      labels.push({
        x: centerX + Math.cos(angle) * Math.min(width, height) * .18,
        y: centerY + Math.sin(angle) * Math.min(width, height) * .16,
        vx: Math.cos(angle) * (1 + Math.random()),
        vy: Math.sin(angle) * .8 - .25,
        text: TOKENS[Math.floor(Math.random() * TOKENS.length)],
        age: 0,
        max: 160 + Math.floor(Math.random() * 70)
      });
      if (labels.length > 14) labels.shift();
      options.onExpose?.(exposed);
    }

    function draw(time) {
      requestAnimationFrame(draw);
      if (!cycleStart) cycleStart = time;
      const loop = options.loopMs || 30000;
      if (time - cycleStart >= loop) {
        cycleStart = time;
        exposed = 0;
        labels = [];
        options.onExpose?.(0);
      }
      const progress = (time - cycleStart) / loop;
      frame++;
      context.globalCompositeOperation = "source-over";
      context.fillStyle = "rgba(6,9,15,.27)";
      context.fillRect(0, 0, width, height);
      const swayX = Math.sin(time * .0003) * 12;
      const swayY = Math.cos(time * .00026) * 9;

      particles.forEach((particle) => {
        if (particle.leak > 0) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vx *= .99;
          particle.vy = particle.vy * .99 + .004;
          particle.leak--;
          const color = mix(RED, AMBER, .5 + Math.sin(particle.phase + frame * .05) * .25);
          context.fillStyle = `rgba(${color.join(",")},${Math.max(0, particle.leak / 130)})`;
          context.fillRect(particle.x, particle.y, cell * .65, cell * .65);
          if (!particle.leak) {
            particle.x = particle.homeX;
            particle.y = particle.homeY;
          }
          return;
        }
        particle.x += (particle.homeX + swayX * .4 - particle.x) * .2;
        particle.y += (particle.homeY + swayY * .4 - particle.y) * .2;
        const twinkle = .86 + .14 * Math.sin(particle.phase + frame * .03);
        const color = particle.color.map((channel) => Math.floor(channel * particle.brightness * twinkle));
        context.fillStyle = `rgba(${color.join(",")},${.5 + .5 * particle.brightness})`;
        const pixel = cell * (.32 + .5 * particle.brightness);
        context.fillRect(particle.x - pixel / 2, particle.y - pixel / 2, pixel, pixel);
      });

      context.font = "600 13px 'JetBrains Mono', monospace";
      context.textAlign = "center";
      labels = labels.filter((label) => {
        label.age++;
        label.x += label.vx;
        label.y += label.vy;
        const life = label.age / label.max;
        if (life >= 1) return false;
        context.fillStyle = `rgba(255,140,140,${Math.sin(Math.PI * life) * .9})`;
        context.fillText(label.text, label.x, label.y);
        return true;
      });

      if (!reduceMotion && progress > .14 && frame % Math.max(11, Math.round(30 - progress * 20)) === 0) leak();
    }

    window.addEventListener("resize", resize);
    resize();
    if (reduceMotion) particles.forEach((particle) => { particle.x = particle.homeX; particle.y = particle.homeY; });
    requestAnimationFrame(draw);
  }

  window.PSUICloud = { init };
})();
