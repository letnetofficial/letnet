/**
 * LetNet Website Animations
 * - Interactive Network Canvas (Connected Nodes: People, Ideas, Tech, Business, Opportunities)
 * - Concept Counters with IntersectionObserver
 * - Full prefers-reduced-motion support
 */

class NetworkAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.keyNodes = [];
    this.mouse = { x: -1000, y: -1000, radius: 160 };
    this.animationFrameId = null;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // The 5 core pillars of LetNet
    this.anchorLabels = [
      { text: "People", color: "#20E0C2" },
      { text: "Ideas", color: "#7CFFF0" },
      { text: "Technology", color: "#35BFFF" },
      { text: "Businesses", color: "#5DD0E8" },
      { text: "Opportunities", color: "#A8FFF4" }
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse tracking (only within canvas bounds)
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    // Touch support for mobile interaction
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.touches[0].clientX - rect.left;
        this.mouse.y = e.touches[0].clientY - rect.top;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    // Listen for reduced motion preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      if (this.isReducedMotion) {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.drawStatic();
      } else {
        this.animate();
      }
    });

    this.createNodes();

    if (this.isReducedMotion) {
      this.drawStatic();
    } else {
      this.animate();
    }
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    this.width = this.canvas.width = parent.clientWidth;
    this.height = this.canvas.height = parent.clientHeight;

    if (this.nodes.length > 0) {
      this.createNodes();
    }
  }

  createNodes() {
    this.nodes = [];
    this.keyNodes = [];

    // Scale node count by screen width (max 65 for performance)
    const count = Math.min(65, Math.floor((this.width * this.height) / 16000));
    
    // Regular network nodes
    for (let i = 0; i < count; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 1.2,
        baseAlpha: Math.random() * 0.45 + 0.25
      });
    }

    // Key Anchor Nodes (LetNet core formula)
    const padding = Math.min(100, this.width * 0.15);
    const availableWidth = this.width - padding * 2;
    const availableHeight = this.height - padding * 2;

    this.anchorLabels.forEach((anchor, i) => {
      const angle = (i / this.anchorLabels.length) * Math.PI * 2;
      const rx = (availableWidth / 2) * 0.75;
      const ry = (availableHeight / 2) * 0.65;
      const cx = this.width / 2 + Math.cos(angle) * rx;
      const cy = this.height / 2 + Math.sin(angle) * ry;

      const keyNode = {
        x: Math.max(padding, Math.min(this.width - padding, cx + (Math.random() - 0.5) * 40)),
        y: Math.max(padding, Math.min(this.height - padding, cy + (Math.random() - 0.5) * 40)),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 4,
        pulse: 0,
        pulseSpeed: 0.03 + i * 0.005,
        label: anchor.text,
        color: anchor.color,
        isAnchor: true
      };

      this.keyNodes.push(keyNode);
      this.nodes.push(keyNode);
    });
  }

  drawConnections() {
    const maxDist = Math.min(140, this.width * 0.25);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const lineColor = isDark ? "32, 224, 194" : "0, 138, 136";

    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * (isDark ? 0.22 : 0.18);
          this.ctx.beginPath();
          this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
          this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
          this.ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
          this.ctx.lineWidth = (this.nodes[i].isAnchor || this.nodes[j].isAnchor) ? 1.2 : 0.7;
          this.ctx.stroke();
        }
      }

      // Mouse interactive connection
      const mdx = this.nodes[i].x - this.mouse.x;
      const mdy = this.nodes[i].y - this.mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < this.mouse.radius) {
        const mAlpha = (1 - mdist / this.mouse.radius) * 0.4;
        this.ctx.beginPath();
        this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.strokeStyle = `rgba(32, 224, 194, ${mAlpha})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
    }
  }

  drawNodes() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

    this.nodes.forEach(node => {
      if (node.isAnchor) {
        // Glowing aura
        node.pulse += node.pulseSpeed;
        const pulseRadius = node.radius + Math.sin(node.pulse) * 3 + 4;
        
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = isDark ? `rgba(32, 224, 194, 0.15)` : `rgba(0, 138, 136, 0.12)`;
        this.ctx.fill();

        // Node center
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = node.color;
        this.ctx.shadowColor = node.color;
        this.ctx.shadowBlur = isDark ? 12 : 6;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        // Label
        this.ctx.font = '600 12px "Plus Jakarta Sans", system-ui, sans-serif';
        this.ctx.fillStyle = isDark ? '#F2FFFC' : '#062128';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(node.label, node.x, node.y - 12);

      } else {
        // Regular node
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        const nodeColor = isDark ? `rgba(124, 200, 210, ${node.baseAlpha})` : `rgba(0, 90, 100, ${node.baseAlpha})`;
        this.ctx.fillStyle = nodeColor;
        this.ctx.fill();
      }
    });
  }

  update() {
    this.nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      // Bounce gracefully off borders
      if (node.x <= 0 || node.x >= this.width) node.vx *= -1;
      if (node.y <= 0 || node.y >= this.height) node.vy *= -1;

      // Gentle mouse interaction (smooth subtle push)
      const dx = node.x - this.mouse.x;
      const dy = node.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90 && dist > 0) {
        const force = (90 - dist) / 90 * 0.4;
        node.x += (dx / dist) * force;
        node.y += (dy / dist) * force;
      }
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawConnections();
    this.drawNodes();
    this.update();
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  drawStatic() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawConnections();
    this.drawNodes();
  }
}

/**
 * Concept Counter Animation
 * Animates numerical placeholders and concept metrics smoothly on scroll
 */
function initConceptCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600; // ms
        const startTime = performance.now();

        function updateNumber(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeOut * target);
          el.textContent = current.toLocaleString() + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateNumber);
          } else {
            el.textContent = target.toLocaleString() + suffix;
          }
        }

        requestAnimationFrame(updateNumber);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counterElements.forEach(el => observer.observe(el));
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('network-canvas')) {
    new NetworkAnimation('network-canvas');
  }
  initConceptCounters();
});
