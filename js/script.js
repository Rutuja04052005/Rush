/* ==========================================
   AKASH'S BIRTHDAY WEBSITE SCRIPT (FINAL EDITION)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM ELEMENTS ---
  const bookCover = document.getElementById('book-cover');
  const coverOpenBtn = document.getElementById('cover-open-btn');
  const bgMusic1 = document.getElementById('bg-music-1');
  const bgMusic2 = document.getElementById('bg-music-2');
  const musicController = document.getElementById('music-controller');
  const musicStatus = document.getElementById('music-status');
  const musicTitle = document.getElementById('music-title');
  const volumeSlider = document.getElementById('volume-slider');

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  const cakeContainer = document.getElementById('cake-container');
  const flames = document.querySelectorAll('.candle-flame');
  const cakeInstruction = document.getElementById('cake-instruction');

  // Floating Navbar & Progress Tracker Elements
  const navbar = document.getElementById('navbar');
  const navMusicBtn = document.getElementById('nav-music-btn');
  const navMusicText = navMusicBtn ? navMusicBtn.querySelector('.nav-music-text') : null;
  const navMusicEq = navMusicBtn ? navMusicBtn.querySelector('.nav-music-eq') : null;
  const navSurpriseBtn = document.getElementById('nav-surprise-btn');
  const friendshipProgressBar = document.getElementById('friendship-progress-bar');
  const friendshipProgressText = document.getElementById('friendship-progress-text');
  const navItems = document.querySelectorAll('.navbar .nav-item');

  // Chapter 5: Voice Cassette
  const cassettePlayer = document.getElementById('cassette-player');
  const voicePlayBtn = document.getElementById('voice-play-btn');
  const waveBars = document.querySelectorAll('.soundwave-bar');
  const transcriptText = document.getElementById('transcript-text');

  // Chapter 6: Secret Letter
  const envelopeContainer = document.getElementById('secret-envelope-container');

  // Chapter 7: Cake Cutting Ceremony (Upgraded 5-Step Elements)
  const ceremonyCakeContainer = document.getElementById('ceremony-cake-container');
  const cakeKnife = document.getElementById('cake-knife');
  const ceremonyFlames = document.querySelectorAll('.ceremony-flame');
  const surpriseBoxSection = document.getElementById('surprise-box');
  const cakeCeremonySec = document.getElementById('cake-ceremony');
  const ceremonyCanvas = document.getElementById('ceremony-canvas');
  const ceremonyStageCard = document.getElementById('ceremony-stage-card');

  // Loader Elements
  const loader = document.getElementById('loading-screen');
  const progressBar = document.getElementById('progress-bar');
  const progressPercent = document.getElementById('progress-percentage');

  // --- STATE CONTROLS ---
  let isMusicPlaying = false;
  let birthdayCountdownInterval = null;
  let isVoicePlaying = false;
  let voiceTimeout = null;
  let waveInterval = null;
  let fireworkInterval = null;
  let isEnvelopeOpened = false;
  let ceremonyStep = 1;
  let synthAudioCtx = null;
  let synthTimeout = null;
  let continuousConfettiInterval = null;
  let continuousHeartsInterval = null;

  // Happy Birthday Chiptune Melody Notes & Frequencies
  const notes = {
    'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25,
    'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99
  };

  const melody = [
    { note: 'G4', dur: 0.35 }, { note: 'G4', dur: 0.15 }, { note: 'A4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'C5', dur: 0.5 }, { note: 'B4', dur: 1.0 },
    { note: 'G4', dur: 0.35 }, { note: 'G4', dur: 0.15 }, { note: 'A4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'D5', dur: 0.5 }, { note: 'C5', dur: 1.0 },
    { note: 'G4', dur: 0.35 }, { note: 'G4', dur: 0.15 }, { note: 'G5', dur: 0.5 }, { note: 'E5', dur: 0.5 }, { note: 'C5', dur: 0.5 }, { note: 'B4', dur: 0.5 }, { note: 'A4', dur: 1.0 },
    { note: 'F5', dur: 0.35 }, { note: 'F5', dur: 0.15 }, { note: 'E5', dur: 0.5 }, { note: 'C5', dur: 0.5 }, { note: 'D5', dur: 0.5 }, { note: 'C5', dur: 1.2 }
  ];

  // --- 0. PREMIUM ANNOUNCED LOADING SCREEN ---
  if (loader) {
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

      // Initialize Loader Particle Canvas
      const loaderCanvas = document.getElementById('loader-canvas');
      let loaderAnimId;
      if (loaderCanvas) {
        const lctx = loaderCanvas.getContext('2d');
        let loaderWidth = (loaderCanvas.width = window.innerWidth);
        let loaderHeight = (loaderCanvas.height = window.innerHeight);

        window.addEventListener('resize', () => {
          if (loaderCanvas && loaderCanvas.parentNode) {
            loaderWidth = loaderCanvas.width = window.innerWidth;
            loaderHeight = loaderCanvas.height = window.innerHeight;
          }
        });

        // Define particle classes
        class GoldOrb {
          constructor() {
            this.reset();
            this.y = Math.random() * loaderHeight;
          }
          reset() {
            this.x = Math.random() * loaderWidth;
            this.y = loaderHeight + 50;
            this.size = Math.random() * 40 + 20; // soft large orbs
            this.speedY = Math.random() * 0.35 + 0.1;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.14 + 0.04;
            this.wobble = Math.random() * 100;
            this.wobbleSpeed = Math.random() * 0.01 + 0.005;
          }
          update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.wobble) * this.speedX;
            this.wobble += this.wobbleSpeed;
            if (this.y < -50 || this.opacity <= 0) {
              this.reset();
            }
          }
          draw() {
            lctx.save();
            const grad = lctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            grad.addColorStop(0, `rgba(212, 175, 55, ${this.opacity})`);
            grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
            lctx.fillStyle = grad;
            lctx.beginPath();
            lctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            lctx.fill();
            lctx.restore();
          }
        }

        class GoldSpark {
          constructor() {
            this.reset();
            this.y = Math.random() * loaderHeight;
          }
          reset() {
            this.x = Math.random() * loaderWidth;
            this.y = loaderHeight + 10;
            this.size = Math.random() * 2.2 + 1; // sharp small spark
            this.speedY = Math.random() * 1.4 + 0.6;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.75 + 0.2;
            this.decay = Math.random() * 0.002 + 0.001;
            this.wobble = Math.random() * 100;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
          }
          update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.wobble) * 0.4;
            this.wobble += this.wobbleSpeed;
            this.opacity -= this.decay;
            if (this.y < -10 || this.opacity <= 0) {
              this.reset();
            }
          }
          draw() {
            lctx.save();
            lctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
            lctx.shadowBlur = Math.random() * 5 + 3;
            lctx.shadowColor = '#ffd700';
            lctx.beginPath();
            const r = this.size;
            lctx.moveTo(this.x, this.y - r);
            lctx.quadraticCurveTo(this.x, this.y, this.x + r, this.y);
            lctx.quadraticCurveTo(this.x, this.y, this.x, this.y + r);
            lctx.quadraticCurveTo(this.x, this.y, this.x - r, this.y);
            lctx.quadraticCurveTo(this.x, this.y, this.x, this.y - r);
            lctx.closePath();
            lctx.fill();
            lctx.restore();
          }
        }

        class HeartParticle {
          constructor() {
            this.reset();
            this.y = Math.random() * loaderHeight;
          }
          reset() {
            this.x = Math.random() * loaderWidth;
            this.y = loaderHeight + 20;
            this.size = Math.random() * 10 + 5; // soft glowing hearts
            this.speedY = Math.random() * 0.75 + 0.35;
            this.speedX = (Math.random() - 0.5) * 0.35;
            this.opacity = Math.random() * 0.55 + 0.25;
            this.decay = Math.random() * 0.0015 + 0.0005;
            this.wobble = Math.random() * 100;
            this.wobbleSpeed = Math.random() * 0.02 + 0.008;

            const roll = Math.random();
            if (roll < 0.45) {
              this.color = `rgba(255, 51, 102, ${this.opacity})`; // crimson-pink
            } else if (roll < 0.8) {
              this.color = `rgba(255, 105, 180, ${this.opacity})`; // hot pink
            } else {
              this.color = `rgba(212, 175, 55, ${this.opacity})`; // gold
            }
          }
          update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.wobble) * 0.4;
            this.wobble += this.wobbleSpeed;
            this.opacity -= this.decay;
            if (this.y < -20 || this.opacity <= 0) {
              this.reset();
            }
          }
          draw() {
            lctx.save();
            lctx.fillStyle = this.color;
            if (this.color.includes('255, 51') || this.color.includes('255, 105')) {
              lctx.shadowBlur = 6;
              lctx.shadowColor = '#ff3366';
            } else {
              lctx.shadowBlur = 6;
              lctx.shadowColor = '#ffd700';
            }

            lctx.beginPath();
            const x = this.x;
            const y = this.y;
            const size = this.size;

            lctx.moveTo(x, y + size / 4);
            lctx.quadraticCurveTo(x, y, x + size / 2, y);
            lctx.quadraticCurveTo(x + size, y, x + size, y + size / 3);
            lctx.quadraticCurveTo(x + size, y + size * 2 / 3, x + size / 2, y + size);
            lctx.lineTo(x, y + size * 1.1);
            lctx.lineTo(x - size / 2, y + size);
            lctx.quadraticCurveTo(x - size, y + size * 2 / 3, x - size, y + size / 3);
            lctx.quadraticCurveTo(x - size, y, x - size / 2, y);
            lctx.quadraticCurveTo(x, y, x, y + size / 4);
            lctx.closePath();
            lctx.fill();
            lctx.restore();
          }
        }

        const orbs = [];
        const sparks = [];
        const hearts = [];
        const cinematicParticles = [];
        const maxOrbs = 12;
        const maxSparks = 45;
        const maxHearts = 35;

        class CinematicParticle {
          constructor(x, y, type, layerConfig) {
            this.x = x;
            this.y = y;
            this.type = type;
            this.opacity = 1;
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * (layerConfig.vMax - layerConfig.vMin) + layerConfig.vMin;
            this.vx = Math.cos(angle) * velocity;
            this.vy = Math.sin(angle) * velocity;
            this.drag = layerConfig.drag;
            
            this.size = Math.random() * (layerConfig.sMax - layerConfig.sMin) + layerConfig.sMin;
            this.color = layerConfig.colors ? layerConfig.colors[Math.floor(Math.random() * layerConfig.colors.length)] : null;
            this.emojiChar = layerConfig.emojis ? layerConfig.emojis[Math.floor(Math.random() * layerConfig.emojis.length)] : '';
            
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * layerConfig.rotSpeed;
            this.driftVx = (Math.random() - 0.5) * layerConfig.drift;
            this.driftVy = layerConfig.driftY + (Math.random() * layerConfig.driftYVar);
            this.decay = layerConfig.decayMin + Math.random() * layerConfig.decayVar;
          }
          
          update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= this.drag;
            this.vy *= this.drag;
            
            // Post-explosion drift
            if (Math.abs(this.vx) < 0.5 && Math.abs(this.vy) < 0.5) {
              this.x += this.driftVx;
              this.y += this.driftVy;
              this.opacity -= this.decay;
            }
            
            this.rotation += this.rotationSpeed;
          }
        }
        
        window.triggerCinematicExplosion = function(x, y) {
          const overlay = document.createElement('div');
          overlay.className = 'loader-cinematic-overlay';
          overlay.style.position = 'absolute';
          overlay.style.inset = '0';
          overlay.style.pointerEvents = 'none';
          overlay.style.overflow = 'hidden';
          overlay.style.zIndex = '999';
          
          const loaderScreen = document.getElementById('loading-screen');
          if (loaderScreen) {
            loaderScreen.appendChild(overlay);
          } else {
            document.body.appendChild(overlay);
          }

          const canvas = document.createElement('canvas');
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          overlay.appendChild(canvas);

          const ctx = canvas.getContext('2d');
          const cinematicParticles = [];

          const layers = [
            { type: 'heart', count: 150, vMin: 15, vMax: 30, drag: 0.98, sMin: 15, sMax: 25, colors: ['#ff4d6d'], rotSpeed: 2, drift: 1, driftY: -1, driftYVar: 0.5, decayMin: 0.008, decayVar: 0.005 },
            { type: 'heart', count: 400, vMin: 20, vMax: 50, drag: 0.97, sMin: 8, sMax: 14, colors: ['#ff4d6d', '#ff6b81', '#ff8fa3'], rotSpeed: 4, drift: 1.5, driftY: -1.5, driftYVar: 1, decayMin: 0.01, decayVar: 0.006 },
            { type: 'heart', count: 2500, vMin: 30, vMax: 80, drag: 0.96, sMin: 3, sMax: 6, colors: ['#ffb3c6', '#ffd6e0', '#ffffff'], rotSpeed: 6, drift: 2, driftY: -2, driftYVar: 1.5, decayMin: 0.012, decayVar: 0.008 },
            { type: 'sparkle', count: 1800, vMin: 40, vMax: 110, drag: 0.95, sMin: 1, sMax: 3, colors: ['#ffd700', '#ffec8b', '#ffffff'], rotSpeed: 10, drift: 3, driftY: -1, driftYVar: 2, decayMin: 0.015, decayVar: 0.008 },
            { type: 'petal', count: 500, vMin: 20, vMax: 45, drag: 0.97, sMin: 6, sMax: 12, colors: ['#d92b4b', '#f3556d'], rotSpeed: 8, drift: 2.5, driftY: 0.5, driftYVar: 1, decayMin: 0.01, decayVar: 0.005 },
            { type: 'dust', count: 3000, vMin: 10, vMax: 65, drag: 0.95, sMin: 0.5, sMax: 2, colors: ['rgba(255,180,200,0.6)', 'rgba(255,215,120,0.6)'], rotSpeed: 0, drift: 1.5, driftY: -0.5, driftYVar: 1, decayMin: 0.012, decayVar: 0.008 }
          ];

          layers.forEach(layer => {
            for (let i = 0; i < layer.count; i++) {
              cinematicParticles.push(new CinematicParticle(x, y, layer.type, layer));
            }
          });

          let animId;
          function animateOverlay() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = cinematicParticles.length - 1; i >= 0; i--) {
              let p = cinematicParticles[i];
              p.update();
              
              if (p.opacity <= 0) {
                cinematicParticles.splice(i, 1);
                continue;
              }
              
              ctx.save();
              ctx.globalAlpha = p.opacity;
              ctx.fillStyle = p.color || '#fff';
              ctx.translate(p.x, p.y);
              ctx.rotate((p.rotation * Math.PI) / 180);
              
              if (p.type === 'emoji') {
                ctx.font = `${p.size}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(p.emojiChar, 0, 0);
              } else if (p.type === 'heart' || p.type === 'petal') {
                ctx.beginPath();
                const s = p.size;
                ctx.moveTo(0, s/4);
                ctx.quadraticCurveTo(0, 0, s/2, 0);
                ctx.quadraticCurveTo(s, 0, s, s/3);
                ctx.quadraticCurveTo(s, s*2/3, s/2, s);
                ctx.lineTo(0, s*1.1);
                ctx.lineTo(-s/2, s);
                ctx.quadraticCurveTo(-s, s*2/3, -s, s/3);
                ctx.quadraticCurveTo(-s, 0, -s/2, 0);
                ctx.quadraticCurveTo(0, 0, 0, s/4);
                ctx.closePath();
                ctx.fill();
              } else if (p.type === 'sparkle') {
                ctx.shadowBlur = 4;
                ctx.shadowColor = p.color;
                ctx.beginPath();
                const r = p.size;
                ctx.moveTo(0, -r);
                ctx.quadraticCurveTo(0, 0, r, 0);
                ctx.quadraticCurveTo(0, 0, 0, r);
                ctx.quadraticCurveTo(0, 0, -r, 0);
                ctx.quadraticCurveTo(0, 0, 0, -r);
                ctx.closePath();
                ctx.fill();
              } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fill();
              }
              ctx.restore();
            }

            if (cinematicParticles.length > 0) {
              animId = requestAnimationFrame(animateOverlay);
            } else {
              overlay.remove();
            }
          }
          animateOverlay();
        };

        window.triggerEmojiExplosion = function(x, y) {
          const overlay = document.createElement('div');
          overlay.className = 'loader-cinematic-overlay';
          overlay.style.position = 'absolute';
          overlay.style.inset = '0';
          overlay.style.pointerEvents = 'none';
          overlay.style.overflow = 'hidden';
          overlay.style.zIndex = '999';
          
          const loaderScreen = document.getElementById('loading-screen');
          if (loaderScreen) {
            loaderScreen.appendChild(overlay);
          } else {
            document.body.appendChild(overlay);
          }

          const canvas = document.createElement('canvas');
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          overlay.appendChild(canvas);

          const ctx = canvas.getContext('2d');
          const cinematicParticles = [];

          const layers = [
            { type: 'emoji', count: 40, vMin: 20, vMax: 50, drag: 0.97, sMin: 30, sMax: 60, emojis: ['🐼', '🌻', '🧸', '💖'], rotSpeed: 4, drift: 1.5, driftY: -1.5, driftYVar: 1, decayMin: 0.01, decayVar: 0.006 },
            { type: 'heart', count: 150, vMin: 15, vMax: 40, drag: 0.98, sMin: 15, sMax: 30, colors: ['#ff4d6d', '#ff6b81'], rotSpeed: 2, drift: 1, driftY: -1, driftYVar: 0.5, decayMin: 0.008, decayVar: 0.005 },
            { type: 'sparkle', count: 500, vMin: 30, vMax: 80, drag: 0.95, sMin: 2, sMax: 6, colors: ['#ffd700', '#ffec8b', '#ffffff'], rotSpeed: 10, drift: 3, driftY: -1, driftYVar: 2, decayMin: 0.015, decayVar: 0.008 }
          ];

          layers.forEach(layer => {
            for (let i = 0; i < layer.count; i++) {
              cinematicParticles.push(new CinematicParticle(x, y, layer.type, layer));
            }
          });

          let animId;
          function animateOverlay() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = cinematicParticles.length - 1; i >= 0; i--) {
              let p = cinematicParticles[i];
              p.update();
              
              if (p.opacity <= 0) {
                cinematicParticles.splice(i, 1);
                continue;
              }
              
              ctx.save();
              ctx.globalAlpha = p.opacity;
              ctx.fillStyle = p.color || '#fff';
              ctx.translate(p.x, p.y);
              ctx.rotate((p.rotation * Math.PI) / 180);
              
              if (p.type === 'emoji') {
                ctx.font = `${p.size}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(p.emojiChar, 0, 0);
              } else if (p.type === 'heart' || p.type === 'petal') {
                ctx.beginPath();
                const s = p.size;
                ctx.moveTo(0, s/4);
                ctx.quadraticCurveTo(0, 0, s/2, 0);
                ctx.quadraticCurveTo(s, 0, s, s/3);
                ctx.quadraticCurveTo(s, s*2/3, s/2, s);
                ctx.lineTo(0, s*1.1);
                ctx.lineTo(-s/2, s);
                ctx.quadraticCurveTo(-s, s*2/3, -s, s/3);
                ctx.quadraticCurveTo(-s, 0, -s/2, 0);
                ctx.quadraticCurveTo(0, 0, 0, s/4);
                ctx.closePath();
                ctx.fill();
              } else if (p.type === 'sparkle') {
                ctx.shadowBlur = 4;
                ctx.shadowColor = p.color;
                ctx.beginPath();
                const r = p.size;
                ctx.moveTo(0, -r);
                ctx.quadraticCurveTo(0, 0, r, 0);
                ctx.quadraticCurveTo(0, 0, 0, r);
                ctx.quadraticCurveTo(0, 0, -r, 0);
                ctx.quadraticCurveTo(0, 0, 0, -r);
                ctx.closePath();
                ctx.fill();
              } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fill();
              }
              ctx.restore();
            }

            if (cinematicParticles.length > 0) {
              animId = requestAnimationFrame(animateOverlay);
            } else {
              overlay.remove();
            }
          }
          animateOverlay();
        };

        for (let i = 0; i < maxOrbs; i++) orbs.push(new GoldOrb());
        for (let i = 0; i < maxSparks; i++) sparks.push(new GoldSpark());
        for (let i = 0; i < maxHearts; i++) hearts.push(new HeartParticle());

        function animateLoader() {
          if (!loader || loader.style.display === 'none') {
            cancelAnimationFrame(loaderAnimId);
            return;
          }
          lctx.clearRect(0, 0, loaderWidth, loaderHeight);

          orbs.forEach(orb => {
            orb.update();
            orb.draw();
          });

          sparks.forEach(spark => {
            spark.update();
            spark.draw();
          });

          hearts.forEach(heart => {
            heart.update();
            heart.draw();
          });

          loaderAnimId = requestAnimationFrame(animateLoader);
        }
        animateLoader();
      }

      // Check autoplay policies by trying to play music immediately
      let autoplayBlocked = false;
      if (bgMusic1) {
        bgMusic1.volume = 0;
        const playPromise = bgMusic1.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            autoplayBlocked = false;
          }).catch(error => {
            console.log("Autoplay blocked by browser:", error);
            autoplayBlocked = true;
          });
        } else {
          autoplayBlocked = false;
        }
      }

      // Simulate progress over 3.5 seconds
      let progress = 0;
      const stepDuration = 30;
      const durationFactor = 3500;
      const loadingInterval = setInterval(() => {
        progress += (100 / (durationFactor / stepDuration));
        if (progress > 100) progress = 100;

        const roundedProgress = Math.floor(progress);
        if (progressBar) progressBar.style.width = roundedProgress + '%';
        if (progressPercent) progressPercent.innerText = roundedProgress + '%';

        if (progress >= 100) {
          clearInterval(loadingInterval);
          onLoadingComplete();
        }
      }, stepDuration);

      function onLoadingComplete() {
        // 1400ms: Glow begins
        setTimeout(() => {
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
              progressBar.classList.add('progress-glow', 'progress-crack');
            }
          }, 1400);
          
          // 2100ms: Heart appears
          setTimeout(() => {
            const heartUnderlay = document.querySelector('.loader-heart-underlay');
            if (heartUnderlay) {
              heartUnderlay.style.opacity = '1';
              heartUnderlay.style.transform = 'scale(1)';
              heartUnderlay.style.transition = 'opacity 400ms ease, transform 400ms ease';
            }
          }, 2100);
          
          // 2500ms: Heartbeat 1
          setTimeout(() => {
            const heartUnderlay = document.querySelector('.loader-heart-underlay');
            if (heartUnderlay) {
              heartUnderlay.classList.remove('heartbeat');
              void heartUnderlay.offsetWidth;
              heartUnderlay.classList.add('heartbeat');
            }
          }, 2500);
          
          // 3000ms: Heartbeat 2
          setTimeout(() => {
            const heartUnderlay = document.querySelector('.loader-heart-underlay');
            if (heartUnderlay) {
              heartUnderlay.classList.remove('heartbeat');
              void heartUnderlay.offsetWidth;
              heartUnderlay.classList.add('heartbeat');
            }
          }, 3000);
          
          // 3400ms: Explosion
          setTimeout(() => {
            // Apply a smooth fade out to existing UI instead of instant hide
            const elementsToFade = [
              document.querySelector('.loader-heart-underlay'),
              document.querySelector('.loader-progress-container'),
              document.getElementById('progress-percentage'),
              document.querySelector('.loader-typing-text')
            ];
            
            elementsToFade.forEach(el => {
              if (el) {
                el.style.transition = 'opacity 2000ms ease-out';
                el.style.opacity = '0';
              }
            });
            
            // Bloom Effect (placed securely in the overlay so it doesn't affect main layout)
            const bloom = document.createElement('div');
            bloom.style.position = 'absolute';
            bloom.style.inset = '0';
            bloom.style.background = 'linear-gradient(45deg, rgba(255,130,180,.18), rgba(255,215,120,.08))';
            bloom.style.opacity = '0';
            bloom.style.transition = 'opacity 250ms ease-out';
            bloom.style.pointerEvents = 'none';
            bloom.style.zIndex = '999';
            
            const loaderScreen = document.getElementById('loading-screen');
            if (loaderScreen) loaderScreen.appendChild(bloom);
            else document.body.appendChild(bloom);
            
            void bloom.offsetWidth;
            bloom.style.opacity = '1';
            setTimeout(() => {
              bloom.style.opacity = '0';
              setTimeout(() => bloom.remove(), 250);
            }, 250);
            
            if (typeof window.triggerCinematicExplosion === 'function') {
              let originX = window.innerWidth / 2;
              let originY = window.innerHeight / 2;
              
              const heartUnderlay = document.querySelector('.loader-heart-underlay');
              if (heartUnderlay) {
                const rect = heartUnderlay.getBoundingClientRect();
                originX = rect.left + rect.width / 2;
                originY = rect.top + rect.height / 2;
              }
              window.triggerCinematicExplosion(originX, originY);
            }
          }, 3400);
          
          // 4300ms: (No-op) Previous background blur was removed for layout stability
          
          // 6500ms: Glass password panel rises
          setTimeout(() => {
            const statusWrap = document.querySelector('.loader-status-wrap');
            if (statusWrap) {
              statusWrap.style.display = 'none';
            }
            
            const lockPanel = document.getElementById('loader-lock-panel');
            if (lockPanel) {
              lockPanel.style.display = 'flex';
              lockPanel.style.opacity = '0';
              // Removed scale/blur to prevent layout shifts/performance hits on flex items
              lockPanel.style.transform = 'translateY(50px)';
              lockPanel.style.transition = 'opacity 900ms cubic-bezier(.22,1,.36,1), transform 900ms cubic-bezier(.22,1,.36,1)';
              
              void lockPanel.offsetWidth;
              
              lockPanel.style.opacity = '1';
              lockPanel.style.transform = 'translateY(0)';
            }
          }, 6500);
          
          // 7400ms: Lock icon animates
          setTimeout(() => {
            const lockIcon = document.querySelector('.lock-icon-wrap');
            if (lockIcon) lockIcon.classList.add('lock-bounce');
          }, 7400);
          
          // 7900ms: Typing effect
          setTimeout(() => {
            const lockTitle = document.querySelector('.lock-title');
            if (lockTitle) lockTitle.classList.add('typing-title');
          }, 7900);
          
          // 8500ms: Ready for password
          setTimeout(() => {
            const lockInput = document.getElementById('lock-passcode-input');
            const submitBtn = document.getElementById('lock-submit-btn');
            const errorMsg = document.getElementById('lock-error-msg');
            const hintBtn = document.getElementById('lock-hint-btn');
            const hintText = document.getElementById('lock-hint-text');

            if (lockInput) {
              lockInput.focus();
              lockInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, ''); // strip non-digits
                if (value.length > 2) {
                  value = value.substring(0, 2) + '\\' + value.substring(2);
                }
                if (value.length > 5) {
                  value = value.substring(0, 5) + '\\' + value.substring(5, 9);
                }
                e.target.value = value;
              });

              lockInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  validateCode();
                }
              });
            }

            if (submitBtn) {
              submitBtn.addEventListener('click', validateCode);
            }

            if (hintBtn && hintText) {
              hintBtn.addEventListener('click', () => {
                if (hintText.style.display === 'none') {
                  hintText.style.display = 'block';
                  hintBtn.textContent = 'Hide hint 🤫';
                } else {
                  hintText.style.display = 'none';
                  hintBtn.textContent = 'Need a hint? ✨';
                }
              });
            }

            function validateCode() {
              const rawVal = lockInput.value.trim();
              const normalized = rawVal.replace(/\D/g, '');

              const correct = (
                normalized === '9112024' ||
                normalized === '09112024' ||
                normalized === '1192024' ||
                normalized === '11092024' ||
                rawVal === '9\\11\\2024' ||
                rawVal === '9/11/2024'
              );

              if (correct) {
                if (typeof playMelodicChime === 'function') playMelodicChime();
                const lockPanel = document.getElementById('loader-lock-panel');
                if (lockPanel) lockPanel.classList.add('unlocked');
                if (errorMsg) {
                  errorMsg.style.color = '#cfa83c';
                  errorMsg.textContent = 'Correct date! Unlocking... 🔓';
                }

                if (typeof window.triggerEmojiExplosion === 'function') window.triggerEmojiExplosion(window.innerWidth / 2, window.innerHeight / 2);

                localStorage.setItem('website_unlocked', 'true');

                setTimeout(() => {
                  autoplayBlocked = false;
                  if (typeof enterSiteWithMusic === 'function') enterSiteWithMusic();
                }, 1200);
              } else {
                if (typeof playErrorSound === 'function') playErrorSound();
                const lockPanel = document.getElementById('loader-lock-panel');
                if (lockPanel) lockPanel.classList.add('error-shake');
                if (errorMsg) {
                  errorMsg.style.color = '#ff3366';
                  errorMsg.textContent = "The key doesn't fit... Try another special date! 🗝️";
                }

                setTimeout(() => {
                  if (lockPanel) lockPanel.classList.remove('error-shake');
                }, 500);
              }
            }
          }, 8500);
      }

      function proceedToSite() {
        if (autoplayBlocked) {
          // Hide progress elements
          const progressContainer = document.querySelector('.loader-progress-container');
          if (progressContainer) {
            progressContainer.style.opacity = '0';
            setTimeout(() => { progressContainer.style.display = 'none'; }, 500);
          }
          if (progressPercent) {
            progressPercent.style.opacity = '0';
            setTimeout(() => { progressPercent.style.display = 'none'; }, 500);
          }

          // Display stylish Tap to Enter button
          const enterBtn = document.getElementById('tap-to-enter-btn');
          if (enterBtn) {
            enterBtn.style.display = 'block';
            enterBtn.style.opacity = '0';
            enterBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
              enterBtn.style.opacity = '1';
              enterBtn.style.transform = 'scale(1)';
            }, 300);

            enterBtn.addEventListener('click', () => {
              enterSiteWithMusic();
            });
          }
        } else {
          enterSite();
        }
      }

      function enterSiteWithMusic() {
        toggleMusic(true); // force play music
        enterSite();
      }

      function enterSite() {
        if (loaderAnimId) cancelAnimationFrame(loaderAnimId);

        // Add reveal-active class to body to zoom and fade in homepage contents
        document.body.classList.add('reveal-active');

        // Smooth transition fade-out
        loader.classList.add('fade-out');

        // Re-enable scrolling
        document.body.style.overflow = '';

        // Start countdown and show nav
        initCountdown();
        if (navbar) navbar.classList.add('visible');

        // If autoplay succeeded, fade in audio
        if (!autoplayBlocked && bgMusic1) {
          isMusicPlaying = true;
          if (musicStatus) musicStatus.textContent = 'Sound On';
          if (navMusicText) navMusicText.textContent = 'Mute';
          if (navMusicEq) navMusicEq.classList.add('playing');
          if (musicController) musicController.classList.add('playing');
          fadeAudio(bgMusic1, 0.3, 2000);
        }

        setTimeout(() => {
          loader.style.display = 'none';
        }, 1500); // matches new 1.5s CSS transition duration
      }
    }

  // --- 0.1 HERO DYNAMIC PARTICLE GENERATOR ---
  const heroParticles = document.getElementById('hero-particles-container');
  if (heroParticles) {
    const symbols = ['🎈', '✨', '⭐', '💖', '🎁', '🎉'];
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('span');
      p.className = 'hero-particle';
      p.innerText = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 90 + 5 + '%';
      p.style.fontSize = (Math.random() * 1.4 + 0.9) + 'rem';
      p.style.animationDelay = (Math.random() * 6) + 's';
      p.style.animationDuration = (Math.random() * 7 + 7) + 's';
      const animType = ['float-up', 'drift', 'sparkle'][Math.floor(Math.random() * 3)];
      p.classList.add(animType);
      heroParticles.appendChild(p);
    }
  }

  // Step Panels
  const panelStep1 = document.getElementById('panel-step-1');
  const panelStep2 = document.getElementById('panel-step-2');
  const panelStep3 = document.getElementById('panel-step-3');
  const panelStep4 = document.getElementById('panel-step-4');
  const panelStep5 = document.getElementById('panel-step-5');

  // Step Buttons
  const btnLightCandles = document.getElementById('btn-light-candles');
  const btnWishMade = document.getElementById('btn-wish-made');
  const btnBlowCandles = document.getElementById('btn-blow-candles');
  const btnCutCake = document.getElementById('btn-cut-cake');
  const btnCelebrationDone = document.getElementById('btn-celebration-done');
  const wishCountdownNumber = document.getElementById('wish-countdown-number');

  // Chapter 8: Surprise Gift Box
  const giftBox = document.getElementById('gift-box');

  // Extra: 3D Memory Book
  const bookPages = document.querySelectorAll('.book-page');
  const bookPrevBtn = document.getElementById('book-prev-btn');
  const bookNextBtn = document.getElementById('book-next-btn');
  let currentBookPage = 0;

  // Photo Wall Lightbox & Filters
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-card');


  // --- 1. WELCOME PAGE CELEBRATE INTERACTION ---
  const btnCelebrateNow = document.getElementById('btn-celebrate-now');
  if (btnCelebrateNow) {
    btnCelebrateNow.addEventListener('click', () => {
      playMelodicChime();
      toggleMusic(true);
    });
  }

  // --- 2. HEART CURSOR TRAIL ---
  let lastMouseX = 0;
  let lastMouseY = 0;
  const trailThrottling = 8; // Only spawn heart every X pixels moved
  let distanceMoved = 0;

  document.addEventListener('mousemove', (e) => {
    const x = e.pageX;
    const y = e.pageY;

    const dx = x - lastMouseX;
    const dy = y - lastMouseY;
    distanceMoved += Math.sqrt(dx * dx + dy * dy);

    lastMouseX = x;
    lastMouseY = y;

    if (distanceMoved >= trailThrottling) {
      spawnHeartTrail(x, y);
      distanceMoved = 0;
    }
  });

  function spawnHeartTrail(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart-trail';

    // Random subtle pink color variance
    const colorVariance = ['#f7a0b0', '#efa3cf', '#df9edb', '#f9c2d1'];
    heart.style.backgroundColor = colorVariance[Math.floor(Math.random() * colorVariance.length)];

    // Set position
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    // Random rotate angle
    const angle = Math.random() * 20 - 10;
    heart.style.transform = `translate(-50%, -50%) rotate(${45 + angle}deg)`;

    document.body.appendChild(heart);

    // Remove after animation finishes
    setTimeout(() => {
      heart.remove();
    }, 1200);
  }

  // --- 3. BACKGROUND CANVAS Engine: Pressed Leaves/Petals & Ending Fireworks ---
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  let splashParticles = [];
  let fireworkExplosions = [];
  let isFireworksEnabled = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Floating background pressed leaves (with parallax z-depth)
  class LeafParticle {
    constructor() {
      const types = ['rose-petal', 'lavender-petal', 'leaf', 'gold-sparkle', 'paper-confetti', 'heart'];
      this.type = types[Math.floor(Math.random() * types.length)];

      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height; // Scatter at load

      // Parallax depth coefficient
      this.z = Math.random() * 1.0 + 0.5; // z: 0.5 to 1.5

      this.baseSize = Math.random() * 6 + 4;
      this.size = this.baseSize * this.z;

      this.speedY = (Math.random() * 0.8 + 0.35) * this.z;
      this.speedX = (Math.random() - 0.5) * 0.25 * this.z;
      this.opacity = (Math.random() * 0.3 + 0.25) * (this.z / 1.5);

      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 0.8;

      if (this.type === 'rose-petal') {
        const roseColors = ['#f3556d', '#ff4d6d', '#d92b4b'];
        this.color = roseColors[Math.floor(Math.random() * roseColors.length)];
      } else if (this.type === 'lavender-petal') {
        const lavenderColors = ['#d1addb', '#e5c0e8', '#b491d2'];
        this.color = lavenderColors[Math.floor(Math.random() * lavenderColors.length)];
      } else if (this.type === 'leaf') {
        const leafColors = ['#8ea876', '#a1b285', '#b5c09e'];
        this.color = leafColors[Math.floor(Math.random() * leafColors.length)];
      } else if (this.type === 'gold-sparkle') {
        this.color = '#f7d560';
        this.size = (Math.random() * 3 + 1.5) * this.z;
      } else if (this.type === 'paper-confetti') {
        const confettiColors = ['#f8b3c4', '#d1addb', '#8ea876', '#dfb846', '#3498db'];
        this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      } else if (this.type === 'heart') {
        this.color = '#ff4d6d';
        this.size = (Math.random() * 5 + 3) * this.z;
      }

      this.wobble = Math.random() * 0.05;
      this.wobbleSpeed = Math.random() * 0.01;
      this.wobbleVal = 0;
    }

    update() {
      this.y += this.speedY;
      this.wobbleVal += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobbleVal) * 0.2;
      this.rotation += this.rotationSpeed;

      if (this.y > canvas.height + 50) {
        this.y = -50;
        this.x = Math.random() * canvas.width;
        this.z = Math.random() * 1.0 + 0.5;
        this.size = this.baseSize * this.z;
        this.speedY = (Math.random() * 0.8 + 0.35) * this.z;
        this.opacity = (Math.random() * 0.3 + 0.25) * (this.z / 1.5);
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      if (this.type === 'rose-petal' || this.type === 'lavender-petal') {
        drawPetal(ctx, 0, 0, this.size);
      } else if (this.type === 'leaf') {
        drawLeaf(ctx, 0, 0, this.size);
      } else if (this.type === 'gold-sparkle') {
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#f7d560';
        drawSparkleStar(ctx, 0, 0, this.size);
      } else if (this.type === 'heart') {
        drawHeartShape(ctx, 0, 0, this.size);
      } else {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      }
      ctx.restore();
    }
  }

  // Splashing confetti particle class (upgraded with shapes, sparkles, hearts)
  class SplashConfetti {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 12 + 6;
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 8 + 3;
      this.vx = Math.cos(angle) * velocity;
      this.vy = Math.sin(angle) * velocity - 3;
      this.gravity = 0.2;
      this.opacity = 1;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 10 - 5;

      const shapes = ['petal', 'circle', 'square', 'heart', 'sparkle'];
      this.shape = shapes[Math.floor(Math.random() * shapes.length)];

      const colors = ['#f8b3c4', '#d1addb', '#8ea876', '#dfb846', '#fae6e9', '#ff4d6d'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.opacity -= 0.015;
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      if (this.shape === 'petal') {
        drawPetal(ctx, 0, 0, this.size);
      } else if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.shape === 'heart') {
        drawHeartShape(ctx, 0, 0, this.size);
      } else if (this.shape === 'sparkle') {
        ctx.shadowBlur = 4;
        ctx.shadowColor = this.color;
        drawSparkleStar(ctx, 0, 0, this.size);
      } else {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.75);
      }
      ctx.restore();
    }
  }

  // Transient Sparkle Particle Class for emitters
  class CanvasSparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 2;
      this.vx = (Math.random() - 0.5) * 1.0;
      this.vy = Math.random() * 0.6 + 0.2; // float down
      this.opacity = 1.0;
      this.decay = Math.random() * 0.02 + 0.015;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 4 - 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.opacity -= this.decay;
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = '#f7d560';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#f7d560';
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      drawSparkleStar(ctx, 0, 0, this.size);
      ctx.restore();
    }
  }

  // Firework sparkles
  class FireworkSpark {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 6 + 2;
      this.vx = Math.cos(angle) * velocity;
      this.vy = Math.sin(angle) * velocity;
      this.gravity = 0.05;
      this.color = color;
      this.opacity = 1;
      this.decay = Math.random() * 0.015 + 0.01;
    }

    update() {
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.opacity -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function launchFirework(x, y) {
    const colors = ['#f1c40f', '#e74c3c', '#9b59b6', '#2ecc71', '#3498db', '#f39c12'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];
    const count = 55;
    for (let i = 0; i < count; i++) {
      fireworkExplosions.push(new FireworkSpark(x, y, chosenColor));
    }
  }

  function drawPetal(c, x, y, size) {
    c.beginPath();
    c.moveTo(x, y);
    c.bezierCurveTo(x - size, y - size, x - size * 1.3, y + size / 2, x, y + size);
    c.bezierCurveTo(x + size * 1.3, y + size / 2, x + size, y - size, x, y);
    c.closePath();
    c.fill();
  }

  function drawLeaf(c, x, y, size) {
    c.beginPath();
    c.moveTo(x, y);
    c.quadraticCurveTo(x + size, y - size / 2, x + size, y);
    c.quadraticCurveTo(x + size, y + size / 2, x, y);
    c.closePath();
    c.fill();
  }

  function drawSparkleStar(c, x, y, r) {
    c.beginPath();
    c.moveTo(x, y - r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.quadraticCurveTo(x, y, x, y + r);
    c.quadraticCurveTo(x, y, x - r, y);
    c.quadraticCurveTo(x, y, x, y - r);
    c.closePath();
    c.fill();
  }

  function drawHeartShape(c, x, y, size) {
    c.beginPath();
    c.moveTo(x, y + size / 4);
    c.quadraticCurveTo(x, y, x + size / 2, y);
    c.quadraticCurveTo(x + size, y, x + size, y + size / 3);
    c.quadraticCurveTo(x + size, y + size * 2 / 3, x + size / 2, y + size);
    c.lineTo(x, y + size * 1.2);
    c.lineTo(x - size / 2, y + size);
    c.quadraticCurveTo(x - size, y + size * 2 / 3, x - size, y + size / 3);
    c.quadraticCurveTo(x - size, y, x - size / 2, y);
    c.quadraticCurveTo(x, y, x, y + size / 4);
    c.closePath();
    c.fill();
  }

  // Populate background particles (Responsive count)
  const particleCount = window.innerWidth < 768 ? 35 : 70;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new LeafParticle());
  }

  function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw splashes
    splashParticles.forEach((sp, idx) => {
      sp.update();
      sp.draw();
      if (sp.opacity <= 0) splashParticles.splice(idx, 1);
    });

    // Draw fireworks
    fireworkExplosions.forEach((f, idx) => {
      f.update();
      f.draw();
      if (f.opacity <= 0) fireworkExplosions.splice(idx, 1);
    });

    // Emit active navbar tab sparkles dynamically in viewport
    if (Math.random() < 0.12) {
      const activeNav = document.querySelector('.navbar .nav-item.active');
      if (activeNav) {
        const rect = activeNav.getBoundingClientRect();
        const px = rect.left + Math.random() * rect.width;
        const py = rect.top + Math.random() * rect.height;
        splashParticles.push(new CanvasSparkle(px, py));
      }
    }

    // Emit visible RUSH logo gold sparkles
    if (Math.random() < 0.10) {
      const visibleLogos = document.querySelectorAll('.rush-logo');
      visibleLogos.forEach(logo => {
        const rect = logo.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const px = rect.left + Math.random() * rect.width;
          const py = rect.top + Math.random() * rect.height;
          splashParticles.push(new CanvasSparkle(px, py));
        }
      });
    }

    // Emit visible birthday title sparkles (around birthday title ✨)
    if (Math.random() < 0.12) {
      const visibleTitles = document.querySelectorAll('.hero-title');
      visibleTitles.forEach(title => {
        const rect = title.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const px = rect.left + Math.random() * rect.width;
          const py = rect.top + Math.random() * rect.height;
          splashParticles.push(new CanvasSparkle(px, py));
        }
      });
    }

    requestAnimationFrame(drawCanvas);
  }
  drawCanvas();

  function triggerSplash(x, y, count = 85) {
    for (let i = 0; i < count; i++) {
      splashParticles.push(new SplashConfetti(x, y));
    }
  }

  // --- BACKGROUND MUSIC SYSTEM VARIABLES ---
  let currentSong = 1;
  let userVolume = 0.3; // Default starting volume (30%)
  let fadeInterval = null;

  // Set initial volumes
  if (bgMusic1) bgMusic1.volume = userVolume;
  if (bgMusic2) bgMusic2.volume = 0;

  function fadeAudio(audio, targetVolume, durationMs = 2000, onComplete = null) {
    if (!audio) return;

    clearInterval(fadeInterval);
    const step = 0.02;
    const intervalTime = 50; // Update every 50ms

    // Ensure the audio is playing if we are fading in
    if (targetVolume > 0 && audio.paused && isMusicPlaying) {
      audio.volume = 0;
      audio.play().catch(e => console.log("Fade-in play blocked", e));
    }

    fadeInterval = setInterval(() => {
      let currentVal = audio.volume;
      if (currentVal < targetVolume) {
        currentVal = Math.min(targetVolume, currentVal + step);
      } else if (currentVal > targetVolume) {
        currentVal = Math.max(targetVolume, currentVal - step);
      }

      audio.volume = currentVal;

      if (currentVal === targetVolume) {
        clearInterval(fadeInterval);
        if (targetVolume === 0 && !audio.paused) {
          audio.pause();
        }
        if (onComplete) onComplete();
      }
    }, intervalTime);
  }

  function switchSong(songNum) {
    const fromAudio = currentSong === 1 ? bgMusic1 : bgMusic2;
    const toAudio = songNum === 1 ? bgMusic1 : bgMusic2;
    currentSong = songNum;

    // Update UI title
    if (musicTitle) {
      musicTitle.textContent = songNum === 1 ? "Tenu Sang Rakhna" : "Nacha Meri Jaan";
    }

    // Update Album Art
    const albumImg = document.getElementById('music-album-img');
    if (albumImg) {
      albumImg.src = songNum === 1 ? 'assets/images/unbreakable-bond.jpeg' : 'assets/images/my.jpeg';
    }

    if (isMusicPlaying) {
      // Fade out current song over 3 seconds (3000ms)
      if (fromAudio && !fromAudio.paused) {
        fadeAudio(fromAudio, 0, 3000, () => {
          // Fade in new song
          if (toAudio) {
            toAudio.currentTime = 0;
            const targetVol = songNum === 1 ? 0.3 : 0.7;
            userVolume = targetVol;
            if (volumeSlider) volumeSlider.value = targetVol;
            fadeAudio(toAudio, targetVol, 1500);
          }
        });
      } else {
        // Just play target song
        if (toAudio) {
          toAudio.currentTime = 0;
          const targetVol = songNum === 1 ? 0.3 : 0.7;
          userVolume = targetVol;
          if (volumeSlider) volumeSlider.value = targetVol;
          toAudio.volume = targetVol;
          toAudio.play().catch(e => console.log(e));
        }
      }
    } else {
      // Just adjust volumes and tracks without playing
      if (fromAudio) fromAudio.pause();
      if (toAudio) {
        const targetVol = songNum === 1 ? 0.3 : 0.7;
        userVolume = targetVol;
        if (volumeSlider) volumeSlider.value = targetVol;
        toAudio.volume = targetVol;
      }
    }
  }

  function setMusicVolume(val) {
    userVolume = val;
    const activeAudio = currentSong === 1 ? bgMusic1 : bgMusic2;
    if (activeAudio) {
      activeAudio.volume = val;
    }
  }

  // --- 4. AMBIENT MUSIC ENGINE ---
  function toggleMusic(playForce = null) {
    const activeAudio = currentSong === 1 ? bgMusic1 : bgMusic2;
    if (!activeAudio) return;

    if (playForce !== null) {
      isMusicPlaying = !playForce;
    }

    if (isMusicPlaying) {
      activeAudio.pause();
      isMusicPlaying = false;
      musicStatus.textContent = 'Sound Off';
      if (navMusicText) navMusicText.textContent = 'Play';
      if (navMusicEq) navMusicEq.classList.remove('playing');
      musicController.classList.remove('playing');
    } else {
      const targetVol = currentSong === 1 ? 0.3 : 0.7;
      userVolume = targetVol;
      if (volumeSlider) volumeSlider.value = targetVol;

      activeAudio.volume = 0; // Fade in from 0
      activeAudio.play().then(() => {
        isMusicPlaying = true;
        musicStatus.textContent = 'Sound On';
        if (navMusicText) navMusicText.textContent = 'Mute';
        if (navMusicEq) navMusicEq.classList.add('playing');
        musicController.classList.add('playing');

        fadeAudio(activeAudio, targetVol, 2000);
      }).catch(err => {
        console.log("Audio block active", err);
        isMusicPlaying = false;
        musicStatus.textContent = 'Sound Off';
        if (navMusicText) navMusicText.textContent = 'Play';
        if (navMusicEq) navMusicEq.classList.remove('playing');
        musicController.classList.remove('playing');
      });
    }
  }

  if (navMusicBtn) {
    navMusicBtn.addEventListener('click', () => toggleMusic());
  }

  // Bind play/pause to specific music button to not interfere with volume slider clicks
  const musicBtn = document.getElementById('music-btn');
  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }

  // Expand controller on mobile click (for tap support to see slider)
  if (musicController) {
    musicController.addEventListener('click', (e) => {
      if (e.target === musicController || e.target === musicStatus || e.target.classList.contains('music-info')) {
        musicController.classList.toggle('expanded');
      }
    });
  }

  // Volume slider event listeners
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      e.stopPropagation();
      setMusicVolume(parseFloat(e.target.value));
    });
    volumeSlider.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Web Audio Synth Chimes
  let audioCtx = null;
  function playMelodicChime() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch (e) {
      console.log('Chime sound blocked');
    }
  }

  function playErrorSound() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.3);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.log('Error sound blocked');
    }
  }

  // --- 5. COUNTDOWN TIMER MATHS ---
  function initCountdown() {
    const targetMonth = 6; // July
    const targetDay = 5;

    function updateTimer() {
      const now = new Date();
      const isBirthday = (now.getMonth() === targetMonth && now.getDate() === targetDay);
      const timerWrapper = document.getElementById('countdown-timer-wrapper');
      const specialBanner = document.getElementById('birthday-special-banner');

      if (isBirthday) {
        if (timerWrapper) timerWrapper.style.display = 'none';
        if (specialBanner) specialBanner.style.display = 'block';
      } else {
        if (timerWrapper) timerWrapper.style.display = 'flex';
        if (specialBanner) specialBanner.style.display = 'none';

        let currentYear = now.getFullYear();
        let targetDate = new Date(currentYear, targetMonth, targetDay, 0, 0, 0);

        if (now > targetDate) {
          targetDate = new Date(currentYear + 1, targetMonth, targetDay, 0, 0, 0);
        }

        const diff = targetDate - now;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(s).padStart(2, '0');

        if (secondsEl && secondsEl.parentElement) {
          secondsEl.parentElement.classList.add('pulse');
          setTimeout(() => secondsEl.parentElement.classList.remove('pulse'), 200);
        }
      }
    }

    updateTimer();
    birthdayCountdownInterval = setInterval(updateTimer, 1000);
    if (window.triggerHomepageDecorations) window.triggerHomepageDecorations();
  }

  // --- 6. SVG CAKE CANDLE BLOW INTERACTION ---
  let candlesLit = true;
  if (cakeContainer) {
    cakeContainer.addEventListener('click', () => {
      if (!candlesLit) return;

      playMelodicChime();

      flames.forEach(flame => {
        flame.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        flame.style.opacity = '0';
        flame.style.transform = 'scale(0) translateY(-10px)';
      });

      const rect = cakeContainer.getBoundingClientRect();
      triggerSplash(rect.left + rect.width / 2, rect.top + rect.height / 3, 40);

      if (cakeInstruction) {
        cakeInstruction.textContent = "🌸 Wishes made! Happy Birthday Akash! 🌸";
        cakeInstruction.style.color = 'var(--accent-gold)';
      }
      candlesLit = false;
    });
  }

  // --- 7. PHOTO WALL LIGHTBOX & FILTERING ---
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'inline-block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1) rotate(var(--orig-rot, 0deg))';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8) rotate(0deg)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Pre-save photo rotations
  galleryItems.forEach((item, index) => {
    const rotations = [-3, 4, -1.5, 3.5, -4, 2];
    const rot = rotations[index % rotations.length];
    item.style.setProperty('--orig-rot', `${rot}deg`);
  });

  // Lightbox Modal
  galleryCards.forEach(card => {
    if (card.classList.contains('corkboard-card')) {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const caption = card.querySelector('.polaroid-caption').textContent;

        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
      });
    }
  });

  lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });


  // --- 9. CHAPTER 5: CASSETTE PLAYER & SPEECH SYNTH ---
  const voiceTranscriptLines = [
    { time: 0, text: "Hi Akash! 🌸 Happy Birthday! 🎂" },
    { time: 3, text: "I made this digital scrapbook just for you..." },
    { time: 6, text: "To celebrate all our amazing memories, laughter, and travel logs..." },
    { time: 10, text: "You are such an irreplaceable brother and friend in my life." },
    { time: 14, text: "I hope you enjoy every single page of this album. 💖" },
    { time: 18, text: "Have the most wonderful day. Happy Birthday, Akash! 🎉" }
  ];

  function startWaveVisuals() {
    waveInterval = setInterval(() => {
      waveBars.forEach(bar => {
        const height = Math.random() * 28 + 4;
        bar.style.height = `${height}px`;
      });
    }, 100);
  }

  function stopWaveVisuals() {
    clearInterval(waveInterval);
    waveBars.forEach(bar => {
      bar.style.height = '4px';
    });
  }

  function speakVoiceNarrator() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const fullText = "Hi Akash! Happy Birthday! I made this digital scrapbook just for you to celebrate all our amazing memories, laughter, and travel logs. You are such an irreplaceable brother and friend in my life. I hope you enjoy every single page of this album. Have the most wonderful day. Happy Birthday, Akash!";
      const utterance = new SpeechSynthesisUtterance(fullText);

      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice =>
        voice.name.includes('Google UK English Female') ||
        voice.name.includes('Zira') ||
        voice.name.includes('Samantha') ||
        (voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female'))
      );
      if (femaleVoice) utterance.voice = femaleVoice;

      utterance.pitch = 1.05;
      utterance.rate = 0.95;

      utterance.onend = () => {
        stopVoicePlayer();
      };
      window.speechSynthesis.speak(utterance);
    }
  }

  function stopSpeechNarrator() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  function animateTranscript() {
    let timer = 0;

    function runSync() {
      if (!isVoicePlaying) return;

      const activeLine = voiceTranscriptLines.find(line => {
        const index = voiceTranscriptLines.indexOf(line);
        const next = voiceTranscriptLines[index + 1];
        return timer >= line.time && (!next || timer < next.time);
      });

      if (activeLine) {
        transcriptText.textContent = activeLine.text;
      }

      timer++;
      if (timer > 22) {
        stopVoicePlayer();
      } else {
        voiceTimeout = setTimeout(runSync, 1000);
      }
    }

    runSync();
  }

  function stopVoicePlayer() {
    isVoicePlaying = false;
    if (cassettePlayer) cassettePlayer.classList.remove('playing');
    if (voicePlayBtn) voicePlayBtn.textContent = "Play Voice Note ▶";
    if (transcriptText) transcriptText.textContent = "Click Play to hear my voice message... 📻";
    stopWaveVisuals();
    stopSpeechNarrator();
    clearTimeout(voiceTimeout);

    // Restore ambient music volume to target level
    const activeAudio = currentSong === 1 ? bgMusic1 : bgMusic2;
    const targetVol = currentSong === 1 ? 0.3 : 0.7;
    if (activeAudio) activeAudio.volume = targetVol;
  }

  if (voicePlayBtn) {
    voicePlayBtn.addEventListener('click', () => {
      if (isVoicePlaying) {
        stopVoicePlayer();
      } else {
        isVoicePlaying = true;
        if (cassettePlayer) cassettePlayer.classList.add('playing');
        voicePlayBtn.textContent = "Pause Voice Note ⏸";

        // Lower ambient music volume during voice message
        const activeAudio = currentSong === 1 ? bgMusic1 : bgMusic2;
        if (activeAudio) activeAudio.volume = 0.08;

        startWaveVisuals();
        speakVoiceNarrator();
        animateTranscript();
      }
    });
  }

  // --- 10. CHAPTER 6: SECRET LETTER ---
  if (envelopeContainer) {
    envelopeContainer.addEventListener('click', () => {
      if (isEnvelopeOpened) return;

      playMelodicChime();
      envelopeContainer.classList.add('open');
      isEnvelopeOpened = true;

      const letterSection = document.getElementById('secret-letter');
      if (letterSection) {
        letterSection.classList.add('envelope-opened');
      }

      const rect = envelopeContainer.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      setTimeout(() => {
        triggerSplash(x, y, 90);
        setTimeout(() => triggerSplash(x - 180, y - 60, 45), 200);
        setTimeout(() => triggerSplash(x + 180, y - 60, 45), 400);
      }, 450);
    });
  }

  // Open letter polaroid images in lightbox zoom modal
  const letterPhotos = document.querySelectorAll('.letter-polaroid img');
  if (letterPhotos && lightbox) {
    letterPhotos.forEach(photo => {
      photo.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent clicks from bubbling to envelope
        const caption = e.target.getAttribute('alt') || "Memory";
        lightboxImg.src = e.target.src;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
      });
    });
  }

  // --- 11. CHAPTER 7: CAKE CUTTING CEREMONY ---

  // Hide ceremony wicks on page load
  ceremonyFlames.forEach(flame => {
    flame.style.opacity = '0';
    flame.style.transform = 'scale(0)';
    flame.style.transformOrigin = 'center bottom';
  });

  function goToStep(step) {
    // 1. Update stepper progress visually
    for (let i = 1; i <= 5; i++) {
      const indicator = document.getElementById(`step-${i}-indicator`);
      const connector = document.getElementById(`connector-${i}`);
      if (indicator) {
        if (i === step) {
          indicator.classList.add('active');
          indicator.classList.remove('completed');
        } else if (i < step) {
          indicator.classList.remove('active');
          indicator.classList.add('completed');
        } else {
          indicator.classList.remove('active');
          indicator.classList.remove('completed');
        }
      }
      if (connector) {
        if (i < step) {
          connector.classList.add('completed');
        } else {
          connector.classList.remove('completed');
        }
      }
    }

    // 2. Transition panels smoothly
    const oldPanel = document.querySelector('.ceremony-step-panel.active');
    const newPanel = document.getElementById(`panel-step-${step}`);

    if (oldPanel && newPanel && oldPanel !== newPanel) {
      oldPanel.classList.remove('show-active');
      setTimeout(() => {
        oldPanel.classList.remove('active');

        newPanel.classList.add('active');
        setTimeout(() => {
          newPanel.classList.add('show-active');
        }, 30);
      }, 400);
    }

    ceremonyStep = step; // sync with navbar checks
  }

  // --- STEP 1: LIGHT CANDLES ---
  btnLightCandles.addEventListener('click', () => {
    btnLightCandles.disabled = true;

    ceremonyFlames.forEach((flame, index) => {
      setTimeout(() => {
        playMelodicChime();
        flame.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        flame.style.opacity = '1';
        flame.style.transform = 'scale(1)';

        // Spawn gold sparkles around flame
        const rect = flame.getBoundingClientRect();
        const fx = rect.left + rect.width / 2;
        const fy = rect.top + rect.height / 2;
        for (let i = 0; i < 30; i++) {
          splashParticles.push(new CanvasSparkle(fx, fy));
        }
        triggerSplash(fx, fy, 15);

        if (index === ceremonyFlames.length - 1) {
          setTimeout(() => {
            // Transition background to dark night
            if (cakeCeremonySec) cakeCeremonySec.classList.add('ceremony-active');
            goToStep(2);
            startStep2Wish();
          }, 1200);
        }
      }, index * 500);
    });
  });

  // --- STEP 2: MAKE A WISH ---
  function startStep2Wish() {
    const stageCard = document.getElementById('ceremony-stage-card');
    const stars = [];

    // Spawn pulsing background stars
    const starCount = 15;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'glowing-star';
      star.style.left = `${Math.random() * 90 + 5}%`;
      star.style.top = `${Math.random() * 65 + 15}%`;
      const size = Math.random() * 8 + 5;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      stageCard.appendChild(star);
      stars.push(star);
    }

    let secondsLeft = 5;
    wishCountdownNumber.textContent = secondsLeft;

    const interval = setInterval(() => {
      secondsLeft--;
      wishCountdownNumber.textContent = secondsLeft;

      if (secondsLeft <= 0) {
        clearInterval(interval);
        wishCountdownNumber.textContent = "✨ Close your eyes, make a wish, and blow out the candles.";
        wishCountdownNumber.style.fontSize = "1.3rem";
        wishCountdownNumber.style.color = "var(--ink-purple)";

        btnWishMade.disabled = false;
        btnWishMade.style.animation = 'pulse-active 1.5s infinite';
      }
    }, 1000);

    btnWishMade.addEventListener('click', () => {
      btnWishMade.disabled = true;
      btnWishMade.style.animation = 'none';

      // Clear stars
      stars.forEach(s => s.remove());

      // 1. Wind blow visual lines
      const stageCard = document.getElementById('ceremony-stage-card');
      const puffCount = 5;
      for (let i = 0; i < puffCount; i++) {
        setTimeout(() => {
          const puff = document.createElement('div');
          puff.className = 'wind-puff';
          puff.style.top = `${30 + (i * 12)}%`;
          puff.style.animationDelay = `${i * 100}ms`;
          stageCard.appendChild(puff);
          setTimeout(() => puff.remove(), 1200);
        }, i * 80);
      }

      // 2. Flicker flames
      ceremonyFlames.forEach(flame => {
        flame.classList.add('flicker');
      });

      // 3. Extinguish one-by-one
      setTimeout(() => {
        ceremonyFlames.forEach((flame, index) => {
          setTimeout(() => {
            flame.classList.remove('flicker');
            flame.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            flame.style.opacity = '0';
            flame.style.transform = 'scale(0) translateY(-8px)';

            // Precise positioning relative to 3-tier cake
            if (index === 0) spawnSmoke(42.0, 13.6);
            else if (index === 1) spawnSmoke(50.0, 11.4);
            else if (index === 2) spawnSmoke(57.5, 13.6);

            if (index === ceremonyFlames.length - 1) {
              // Trigger confetti splash & balloon rise
              const rect = stageCard.getBoundingClientRect();
              triggerSplash(rect.left + rect.width / 2, rect.top + rect.height / 2, 100);
              spawnCeremonyBalloons();

              setTimeout(() => {
                goToStep(3);
              }, 1200);
            }
          }, index * 450);
        });
      }, 600);
    }, { once: true });
  }

  // Helper function to spawn floating balloons in the background of the ceremony
  function spawnCeremonyBalloons() {
    const section = document.getElementById('cake-ceremony');
    if (!section) return;
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const balloon = document.createElement('div');
        balloon.className = 'floating-balloon-decor';
        const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#f1c40f', '#3498db', '#9b59b6', '#e67e22', '#2ecc71'];
        balloon.style.left = Math.random() * 90 + 5 + '%';
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 20 + 35;
        balloon.style.width = size + 'px';
        balloon.style.height = (size * 1.3) + 'px';
        balloon.style.animationDuration = (Math.random() * 6 + 6) + 's';

        const string = document.createElement('div');
        string.className = 'balloon-string';
        balloon.appendChild(string);

        section.appendChild(balloon);
        setTimeout(() => balloon.remove(), 12000);
      }, i * 150);
    }
  }

  // --- STEP 3: CONTINUE TO CAKE CUTTING ---
  btnBlowCandles.addEventListener('click', () => {
    goToStep(4);
  });

  // --- STEP 4: CUT THE CAKE ---
  btnCutCake.addEventListener('click', () => {
    btnCutCake.disabled = true;

    // Zoom in card
    ceremonyStageCard.classList.add('zoomed');

    // Animate knife
    cakeKnife.classList.add('slicing');
    playCuttingSound();

    setTimeout(() => {
      // Split cake
      ceremonyCakeContainer.classList.add('cut');

      const rect = ceremonyCakeContainer.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;
      const midY = rect.top + rect.height / 2;

      // Crumbs and heart burst
      triggerSplash(midX, midY, 110);
      triggerHeartBurst(midX + window.scrollX, midY + window.scrollY);

      setTimeout(() => {
        cakeKnife.style.opacity = '0';
        goToStep(5);
        switchSong(2); // Smoothly transition to Nacha Meri Jaan (Song 2)
        startStep5Celebration();
      }, 1500);
    }, 650);
  });

  // --- STEP 5: GRAND CELEBRATION ---
  function startStep5Celebration() {
    isFireworksEnabled = true;
    startEndingFireworks();
    playHappyBirthdaySynth();

    // Continuous screen confetti
    continuousConfettiInterval = setInterval(() => {
      const rx = Math.random() * window.innerWidth;
      const ry = Math.random() * (window.innerHeight * 0.45);
      triggerSplash(rx, ry, 28);
    }, 1000);

    // Continuous floating hearts
    continuousHeartsInterval = setInterval(() => {
      const rx = Math.random() * window.innerWidth;
      const ry = window.innerHeight + 50;
      spawnFloatingHeart(rx, ry);
    }, 700);

    btnCelebrationDone.addEventListener('click', (e) => {
      e.preventDefault();
      playMelodicChime();

      // Unlock Surprise Box Section (ready for later chapters)
      surpriseBoxSection.classList.remove('locked-section');
      surpriseBoxSection.classList.add('unlocked-section');

      const wishesSec = document.getElementById('birthday-wishes');
      if (wishesSec) {
        wishesSec.scrollIntoView({ behavior: 'smooth' });
      }
    }, { once: true });
  }

  function spawnFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart-trail';
    heart.style.position = 'fixed';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.backgroundColor = '#ff4d6d';
    heart.style.zIndex = '9999';
    heart.style.pointerEvents = 'none';
    heart.style.animation = 'none';
    document.body.appendChild(heart);

    const duration = Math.random() * 4000 + 3500;
    const horizontalDrift = (Math.random() - 0.5) * 160;
    let startTime = null;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;

      if (progress < 1) {
        const currentY = y - progress * (window.innerHeight + 100);
        const currentX = x + Math.sin(progress * Math.PI * 4) * horizontalDrift * progress;
        const currentOpacity = 1 - progress;
        const scale = 1.0 + progress * 0.5;

        heart.style.left = `${currentX}px`;
        heart.style.top = `${currentY}px`;
        heart.style.opacity = currentOpacity;
        heart.style.transform = `translate(-50%, -50%) rotate(45deg) scale(${scale})`;

        requestAnimationFrame(animate);
      } else {
        heart.remove();
      }
    }
    requestAnimationFrame(animate);
  }

  function playHappyBirthdaySynth() {
    try {
      if (!synthAudioCtx) {
        synthAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      const tempo = 120;
      const beatDuration = 60 / tempo;
      let time = synthAudioCtx.currentTime + 0.1;

      melody.forEach(item => {
        const freq = notes[item.note];
        const dur = item.dur * beatDuration * 1.5;

        const osc = synthAudioCtx.createOscillator();
        const gain = synthAudioCtx.createGain();
        osc.connect(gain);
        gain.connect(synthAudioCtx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.0, time);
        gain.gain.linearRampToValueAtTime(0.12, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur - 0.05);

        osc.start(time);
        osc.stop(time + dur);

        time += dur;
      });

      const totalMelodyDuration = melody.reduce((acc, item) => acc + (item.dur * beatDuration * 1.5), 0);
      synthTimeout = setTimeout(() => {
        if (ceremonyStep === 5) playHappyBirthdaySynth();
      }, totalMelodyDuration * 1000 + 1000);

    } catch (e) {
      console.log('Synth music blocked', e);
    }
  }

  function spawnSmoke(leftPct, topPct) {
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const smoke = document.createElement('div');
        smoke.className = 'smoke-particle';
        smoke.style.left = `${leftPct}%`;
        smoke.style.top = `${topPct}%`;

        const size = Math.random() * 8 + 4;
        smoke.style.width = `${size}px`;
        smoke.style.height = `${size}px`;

        const driftX = (Math.random() - 0.5) * 35;
        smoke.style.setProperty('--drift-x', `${driftX}px`);

        ceremonyCakeContainer.appendChild(smoke);

        setTimeout(() => {
          smoke.remove();
        }, 1500);
      }, i * 120);
    }
  }

  function triggerHeartBurst(x, y) {
    for (let i = 0; i < 24; i++) {
      const heart = document.createElement('div');
      heart.className = 'heart-trail';
      heart.style.backgroundColor = '#ff4d6d';
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;

      const angle = (i / 24) * Math.PI * 2 + (Math.random() * 0.15);
      const velocity = Math.random() * 6 + 3.5;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 1.5;

      heart.style.position = 'absolute';
      heart.style.zIndex = '99999';
      document.body.appendChild(heart);

      let posX = x;
      let posY = y;
      let opacity = 1;
      let scale = 1.0;

      const animateHeart = () => {
        posX += vx;
        posY += vy;
        opacity -= 0.02;
        scale += 0.015;

        heart.style.left = `${posX}px`;
        heart.style.top = `${posY}px`;
        heart.style.opacity = opacity;
        heart.style.transform = `translate(-50%, -50%) rotate(45deg) scale(${scale})`;

        if (opacity > 0) {
          requestAnimationFrame(animateHeart);
        } else {
          heart.remove();
        }
      };
      requestAnimationFrame(animateHeart);
    }
  }

  function playCuttingSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 4.0;

      const gain = ctx.createGain();

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.35);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      noise.start(now);
      noise.stop(now + 0.45);

      // Squish low sine sound
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, now + 0.08);
      osc.frequency.linearRampToValueAtTime(55, now + 0.35);

      oscGain.gain.setValueAtTime(0.18, now + 0.08);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.start(now + 0.08);
      osc.stop(now + 0.4);
    } catch (e) {
      console.log('Cutting sound synthesis blocked', e);
    }
  }

  // --- 12. CHAPTER 8: BIRTHDAY SURPRISE ---
  let isBoxOpen = false;
  giftBox.addEventListener('click', () => {
    if (isBoxOpen) return;

    playMelodicChime();
    giftBox.classList.add('shaking');

    setTimeout(() => {
      giftBox.classList.remove('shaking');
      giftBox.classList.add('open');
      isBoxOpen = true;

      const rect = giftBox.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      triggerSplash(x, y, 110);

      isFireworksEnabled = true;
      startEndingFireworks();
    }, 700);
  });

  function startEndingFireworks() {
    if (fireworkInterval) clearInterval(fireworkInterval);

    fireworkInterval = setInterval(() => {
      if (!isFireworksEnabled) return;
      const x = Math.random() * canvas.width;
      const y = Math.random() * (canvas.height * 0.65) + 50;
      launchFirework(x, y);
    }, 1400);
  }

  // --- 12. 3D MEMORY BOOK FLIP PAGES ---
  function updateBookPages(turningIndex = null) {
    bookPages.forEach((page, index) => {
      if (index < currentBookPage) {
        page.classList.add('flipped');
        page.style.zIndex = index + 1; // Flipped: ascending z-index (newer on top)
      } else {
        page.classList.remove('flipped');
        page.style.zIndex = bookPages.length - index; // Unflipped: descending z-index (current active on top)
      }

      // Elevate active turning page to topmost z-index during rotation
      if (index === turningIndex) {
        page.style.zIndex = 100;
      }
    });
  }

  // Initial update to synchronize z-indices on page load
  updateBookPages();

  let isBookAnimating = false;

  bookNextBtn.addEventListener('click', () => {
    if (isBookAnimating) return;
    if (currentBookPage < bookPages.length) {
      playMelodicChime();
      isBookAnimating = true;
      const turningIndex = currentBookPage;
      currentBookPage++;
      updateBookPages(turningIndex);

      setTimeout(() => {
        updateBookPages();
        isBookAnimating = false;
      }, 800);
    }
  });

  bookPrevBtn.addEventListener('click', () => {
    if (isBookAnimating) return;
    if (currentBookPage > 0) {
      playMelodicChime();
      isBookAnimating = true;
      const turningIndex = currentBookPage - 1;
      currentBookPage--;
      updateBookPages(turningIndex);

      setTimeout(() => {
        updateBookPages();
        isBookAnimating = false;
      }, 800);
    }
  });

  // Touch/Swipe horizontal gesture navigation support for mobile devices
  const bookElement = document.getElementById('book');
  if (bookElement) {
    let touchStartX = 0;
    let touchStartY = 0;

    bookElement.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    bookElement.addEventListener('touchend', (e) => {
      if (isBookAnimating) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;

      // Ensure horizontal swipe meets threshold
      if (Math.abs(dx) > 50 && Math.abs(dy) < 40) {
        if (dx < 0) {
          // Swipe left -> Next Page
          if (currentBookPage < bookPages.length) {
            playMelodicChime();
            isBookAnimating = true;
            const turningIndex = currentBookPage;
            currentBookPage++;
            updateBookPages(turningIndex);
            setTimeout(() => {
              updateBookPages();
              isBookAnimating = false;
            }, 800);
          }
        } else {
          // Swipe right -> Prev Page
          if (currentBookPage > 0) {
            playMelodicChime();
            isBookAnimating = true;
            const turningIndex = currentBookPage - 1;
            currentBookPage--;
            updateBookPages(turningIndex);
            setTimeout(() => {
              updateBookPages();
              isBookAnimating = false;
            }, 800);
          }
        }
      }
    }, { passive: true });
  }


  // --- 14. SCROLL REVEALS & MUSIC FADE OUT ---
  const scrollElements = document.querySelectorAll(
    '.timeline-item, .countdown-card, .wishes-card, .secret-envelope-container, .cassette-player, .gift-box, .book-container, .special-card'
  );

  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  };

  const displayScrollElement = (element) => {
    if (element.style.opacity !== '1') {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0) scale(1) rotate(var(--orig-rot, 0deg))';
      element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        if (x > 0 && y > 0 && y < window.innerHeight) {
          triggerSplash(x, y, window.innerWidth < 768 ? 12 : 25);
        }
      }, 100);
    }
  };

  const hideScrollElement = (element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(35px)';
  };

  scrollElements.forEach(hideScrollElement);

  const handleScrollEvents = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.25)) {
        displayScrollElement(el);
      }
    });

    const endingSec = document.getElementById('ending-screen');
    const endingRect = endingSec.getBoundingClientRect();
    if (endingRect.top < window.innerHeight && endingRect.bottom > 0) {
      isFireworksEnabled = true;
      if (!fireworkInterval) startEndingFireworks();
    } else if (!isBoxOpen) {
      isFireworksEnabled = false;
    }

    const endingTop = endingRect.top;
    const activeAudio = currentSong === 1 ? bgMusic1 : bgMusic2;
    if (activeAudio) {
      if (endingTop < window.innerHeight) {
        const fadeRatio = Math.max(0, endingTop / window.innerHeight);
        activeAudio.volume = fadeRatio * (currentSong === 1 ? 0.3 : 0.7);
      } else if (!isVoicePlaying) {
        activeAudio.volume = currentSong === 1 ? 0.3 : 0.7;
      }
    }
  };

  // --- NAVBAR SCROLL PROGRESS & ACTIVE TABS ---
  const sections = [
    { id: 'hero', index: 0 },
    { id: 'cake-ceremony', index: 1 },
    { id: 'birthday-wishes', index: 2 },
    { id: 'why-special', index: 3 },
    { id: 'journey', index: 4 },
    { id: 'favorite-memory', index: 5 },
    { id: 'photo-wall', index: 6 },
    { id: 'memory-book', index: 7 },
    { id: 'secret-letter', index: 8 },
    { id: 'ending-screen', index: 9 }
  ];

  const trackActiveSection = () => {
    let currentActiveIndex = 0;
    const scrollPosition = window.scrollY + 200;

    sections.forEach((sec) => {
      const element = document.getElementById(sec.id);
      if (element) {
        if (scrollPosition >= element.offsetTop) {
          currentActiveIndex = sec.index;
        }
      }
    });

    if (navItems.length > 0) {
      const halfCount = navItems.length / 2; // Split desktop and mobile link lists
      navItems.forEach((item, idx) => {
        const itemIndex = idx % halfCount;
        if (currentActiveIndex > 0 && itemIndex === (currentActiveIndex - 1)) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  };

  const updateScrollProgress = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const scrolled = (window.scrollY / totalHeight) * 100;
      if (friendshipProgressBar) friendshipProgressBar.style.width = `${scrolled}%`;
      if (friendshipProgressText) friendshipProgressText.textContent = `${Math.round(scrolled)}%`;
    }
  };

  if (navSurpriseBtn) {
    navSurpriseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('surprise-box');
      if (target) {
        if (target.classList.contains('locked-section')) {
          const cakeSec = document.getElementById('cake-ceremony');
          if (cakeSec) cakeSec.scrollIntoView({ behavior: 'smooth' });
          const msg = document.getElementById('ceremony-message');
          if (msg) {
            msg.textContent = "Blow out the candles and cut the cake first to unlock! 🎂";
            msg.style.color = '#e74c3c';
            setTimeout(() => {
              msg.style.color = 'var(--ink-purple)';
              if (ceremonyStep === 1) {
                msg.textContent = "Make a Birthday Wish, Akash 💖";
              } else if (ceremonyStep === 2) {
                msg.textContent = "Your wish has been sent to the stars ✨";
              }
            }, 2500);
          }
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // --- 15. MOBILE NAVIGATION TOGGLE & TRAIL ACTIONS ---
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (navToggleBtn && mobileNav) {
    navToggleBtn.addEventListener('click', () => {
      const expanded = navToggleBtn.getAttribute('aria-expanded') === 'true';
      navToggleBtn.setAttribute('aria-expanded', !expanded);
      navToggleBtn.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });

    // Close mobile nav when clicking any link
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggleBtn.setAttribute('aria-expanded', 'false');
        navToggleBtn.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // Heart cursor trail logic on canvas
  let mouseThrottle = 0;

  window.addEventListener('mousemove', (e) => {
    mouseThrottle++;
    if (mouseThrottle % 3 !== 0) return; // rate limit for 60 FPS performance

    const x = e.clientX;
    const y = e.clientY;

    splashParticles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -Math.random() * 0.8 - 0.4, // float upwards
      size: Math.random() * 6 + 3,
      color: '#ff4d6d',
      opacity: 1.0,
      decay: Math.random() * 0.02 + 0.02,
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= this.decay;
      },
      draw() {
        if (this.opacity <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        drawHeartShape(ctx, 0, 0, this.size);
        ctx.restore();
      }
    });
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length === 0) return;
    mouseThrottle++;
    if (mouseThrottle % 4 !== 0) return;

    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;

    splashParticles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -Math.random() * 0.8 - 0.4,
      size: Math.random() * 6 + 3,
      color: '#ff4d6d',
      opacity: 1.0,
      decay: Math.random() * 0.02 + 0.02,
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= this.decay;
      },
      draw() {
        if (this.opacity <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        drawHeartShape(ctx, 0, 0, this.size);
        ctx.restore();
      }
    });
  });

  const handleScrollEventsAndProgress = () => {
    handleScrollEvents();
    trackActiveSection();
    updateScrollProgress();

    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', handleScrollEventsAndProgress);

  // --- ENDING SCREEN SLIDESHOW ---
  const slideContainer = document.querySelector('.ending-slideshow-container');
  if (slideContainer) {
    const slides = slideContainer.querySelectorAll('.slide');
    const prevBtn = slideContainer.querySelector('.slide-ctrl-btn.prev');
    const nextBtn = slideContainer.querySelector('.slide-ctrl-btn.next');
    let currentSlideIdx = 0;
    let slideTimer = null;

    function showSlide(index) {
      slides.forEach(s => s.classList.remove('active'));

      currentSlideIdx = (index + slides.length) % slides.length;
      slides[currentSlideIdx].classList.add('active');
    }

    function startAutoSlide() {
      stopAutoSlide();
      slideTimer = setInterval(() => {
        showSlide(currentSlideIdx + 1);
      }, 4000);
    }

    function stopAutoSlide() {
      if (slideTimer) clearInterval(slideTimer);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(currentSlideIdx - 1);
        startAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showSlide(currentSlideIdx + 1);
        startAutoSlide();
      });
    }

    startAutoSlide();
  }

  // --- 13. HOMEPAGE BALLOONS & CONFETTI DECORATIONS ---
  let isHomepageDecorated = false;

  function spawnFloatingBalloons() {
    if (isHomepageDecorated) return;
    const hero = document.getElementById('hero');
    if (!hero) return;

    // Spawn 1 balloon every 2.2 seconds
    setInterval(() => {
      const balloon = document.createElement('div');
      balloon.className = 'floating-balloon-decor';

      const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#f1c40f', '#3498db', '#9b59b6', '#e67e22', '#2ecc71'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      balloon.style.left = Math.random() * 90 + 5 + '%';
      balloon.style.backgroundColor = randomColor;

      // Random width/height to make it look organic
      const size = Math.random() * 20 + 30; // 30px to 50px
      balloon.style.width = size + 'px';
      balloon.style.height = (size * 1.3) + 'px';

      // Random animation duration & delay
      balloon.style.animationDuration = (Math.random() * 8 + 8) + 's'; // 8s to 16s

      // String hook representation
      const string = document.createElement('div');
      string.className = 'balloon-string';
      balloon.appendChild(string);

      hero.appendChild(balloon);

      // Remove balloon after animation ends
      setTimeout(() => {
        balloon.remove();
      }, 16000);
    }, 2200);
  }

  function startHomepageConfetti() {
    if (isHomepageDecorated) return;
    const hero = document.getElementById('hero');
    if (!hero) return;

    setInterval(() => {
      const confetti = document.createElement('div');
      confetti.className = 'homepage-confetti';

      const colors = ['#ff4d6d', '#ff758f', '#f1c40f', '#3498db', '#9b59b6', '#2ecc71', '#e67e22'];
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.width = Math.random() * 6 + 6 + 'px';
      confetti.style.height = Math.random() * 10 + 6 + 'px';
      confetti.style.animationDuration = Math.random() * 3 + 3 + 's'; // 3s to 6s
      confetti.style.opacity = Math.random() * 0.7 + 0.3;

      hero.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 6000);
    }, 450);
  }

  // Helper trigger called inside initCountdown
  window.triggerHomepageDecorations = () => {
    spawnFloatingBalloons();
    startHomepageConfetti();
    isHomepageDecorated = true;
  };

  // --- 14. MEMORY WALL PREMIUM EFFECTS ENGINE ---
  const photoWall = document.getElementById('photo-wall');
  if (photoWall) {
    // Dynamically insert the effects canvas
    const pCanvas = document.createElement('canvas');
    pCanvas.className = 'photo-wall-effects-canvas';
    pCanvas.style.position = 'absolute';
    pCanvas.style.top = '0';
    pCanvas.style.left = '0';
    pCanvas.style.width = '100%';
    pCanvas.style.height = '100%';
    pCanvas.style.pointerEvents = 'none';
    pCanvas.style.zIndex = '1';

    photoWall.style.position = 'relative'; // Ensure container positioning
    photoWall.prepend(pCanvas);

    const pctx = pCanvas.getContext('2d');
    let pw = pCanvas.width = photoWall.offsetWidth;
    let ph = pCanvas.height = photoWall.offsetHeight;

    const resizeCanvas = () => {
      if (pCanvas && pCanvas.parentNode) {
        pw = pCanvas.width = photoWall.offsetWidth;
        ph = pCanvas.height = photoWall.offsetHeight;
      }
    };
    window.addEventListener('resize', resizeCanvas);

    // Resize after a short delay to account for scrollbar changes on load
    setTimeout(resizeCanvas, 1000);

    class BokehLight {
      constructor() {
        this.reset();
        this.y = Math.random() * ph;
      }
      reset() {
        this.x = Math.random() * pw;
        this.y = ph + Math.random() * 80;
        this.size = Math.random() * 60 + 40;
        this.speedY = Math.random() * 0.25 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.12;
        this.opacity = Math.random() * 0.12 + 0.04;
        this.color = Math.random() < 0.5 ? '255, 215, 0' : '255, 100, 100'; // warm gold or amber-red
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < -this.size) this.reset();
      }
      draw() {
        pctx.save();
        const grad = pctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        pctx.fillStyle = grad;
        pctx.beginPath();
        pctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pctx.fill();
        pctx.restore();
      }
    }

    class DustParticle {
      constructor() {
        this.reset();
        this.y = Math.random() * ph;
      }
      reset() {
        this.x = Math.random() * pw;
        this.y = ph + 10;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = Math.random() * 0.4 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.35 + 0.1;
        this.wobble = Math.random() * 100;
        this.wobbleSpeed = Math.random() * 0.015 + 0.005;
      }
      update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.wobble) * 0.12;
        this.wobble += this.wobbleSpeed;
        if (this.y < -10) this.reset();
      }
      draw() {
        pctx.save();
        pctx.fillStyle = `rgba(255, 248, 220, ${this.opacity})`;
        pctx.beginPath();
        pctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pctx.fill();
        pctx.restore();
      }
    }

    class GoldenSparkle {
      constructor() {
        this.reset();
        this.y = Math.random() * ph;
      }
      reset() {
        this.x = Math.random() * pw;
        this.y = ph + 10;
        this.size = Math.random() * 3 + 1.5;
        this.speedY = Math.random() * 0.7 + 0.25;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.65 + 0.15;
        this.decay = Math.random() * 0.0025 + 0.001;
        this.wobble = Math.random() * 100;
        this.wobbleSpeed = Math.random() * 0.025 + 0.01;
      }
      update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.wobble) * 0.25;
        this.wobble += this.wobbleSpeed;
        this.opacity -= this.decay;
        if (this.y < -10 || this.opacity <= 0) this.reset();
      }
      draw() {
        pctx.save();
        pctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
        pctx.shadowBlur = 5;
        pctx.shadowColor = '#ffd700';
        pctx.beginPath();
        const r = this.size;
        pctx.moveTo(this.x, this.y - r);
        pctx.quadraticCurveTo(this.x, this.y, this.x + r, this.y);
        pctx.quadraticCurveTo(this.x, this.y, this.x, this.y + r);
        pctx.quadraticCurveTo(this.x, this.y, this.x - r, this.y);
        pctx.quadraticCurveTo(this.x, this.y, this.x, this.y - r);
        pctx.closePath();
        pctx.fill();
        pctx.restore();
      }
    }

    class HeartParticle {
      constructor() {
        this.reset();
        this.y = Math.random() * ph;
      }
      reset() {
        this.x = Math.random() * pw;
        this.y = ph + 20;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 0.55 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.decay = Math.random() * 0.0018 + 0.0004;
        this.wobble = Math.random() * 100;
        this.wobbleSpeed = Math.random() * 0.02 + 0.004;
        this.color = Math.random() < 0.65 ? '255, 105, 180' : '255, 51, 102'; // pink or crimson red
      }
      update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.wobble) * 0.3;
        this.wobble += this.wobbleSpeed;
        this.opacity -= this.decay;
        if (this.y < -20 || this.opacity <= 0) this.reset();
      }
      draw() {
        pctx.save();
        pctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        pctx.shadowBlur = 4;
        pctx.shadowColor = '#ff3366';
        pctx.beginPath();
        const x = this.x;
        const y = this.y;
        const size = this.size;
        pctx.moveTo(x, y + size / 4);
        pctx.quadraticCurveTo(x, y, x + size / 2, y);
        pctx.quadraticCurveTo(x + size, y, x + size, y + size / 3);
        pctx.quadraticCurveTo(x + size, y + size * 2 / 3, x + size / 2, y + size);
        pctx.lineTo(x, y + size * 1.1);
        pctx.lineTo(x - size / 2, y + size);
        pctx.quadraticCurveTo(x - size, y + size * 2 / 3, x - size, y + size / 3);
        pctx.quadraticCurveTo(x - size, y, x - size / 2, y);
        pctx.quadraticCurveTo(x, y, x, y + size / 4);
        pctx.closePath();
        pctx.fill();
        pctx.restore();
      }
    }

    const wallParticles = [];
    const maxBokeh = 10;
    const maxDust = 30;
    const maxSparkles = 15;
    const maxHearts = 15;

    for (let i = 0; i < maxBokeh; i++) wallParticles.push(new BokehLight());
    for (let i = 0; i < maxDust; i++) wallParticles.push(new DustParticle());
    for (let i = 0; i < maxSparkles; i++) wallParticles.push(new GoldenSparkle());
    for (let i = 0; i < maxHearts; i++) wallParticles.push(new HeartParticle());

    let isWallVisible = false;
    const wallObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isWallVisible = entry.isIntersecting;
      });
    }, { threshold: 0.02 });
    wallObserver.observe(photoWall);

    function animatePhotoWall() {
      if (isWallVisible) {
        pctx.clearRect(0, 0, pw, ph);
        wallParticles.forEach(p => {
          p.update();
          p.draw();
        });
      }
      requestAnimationFrame(animatePhotoWall);
    }
    animatePhotoWall();
  }

  // Scroll Fade-in trigger for the Corkboard Grid
  const corkboardGrid = document.getElementById('gallery-grid');
  if (corkboardGrid) {
    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          corkboardGrid.classList.add('visible');
          gridObserver.unobserve(corkboardGrid);
        }
      });
    }, { threshold: 0.08 });
    gridObserver.observe(corkboardGrid);
  }

  // 3D Tilt effect on Hover
  const corkCards = document.querySelectorAll('.corkboard-card');
  corkCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none'; // Instant tracking response
    });
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xc = rect.width / 2;
      const yc = rect.height / 2;

      const angleX = (yc - y) / 10; // Max tilt 10deg
      const angleY = (x - xc) / 10;

      card.style.transform = `perspective(800px) scale(1.08) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
      card.style.boxShadow = `
        ${-angleY * 1.5}px ${angleX * 1.5}px 35px rgba(0, 0, 0, 0.35), 
        0 0 25px rgba(212, 175, 55, 0.7)
      `;
      card.style.zIndex = '15';
    });
    card.addEventListener('mouseleave', () => {
      // Smoothly transition card back to resting sway animation state
      card.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      card.style.transform = '';
      card.style.boxShadow = '';
      card.style.zIndex = '';
    });
  });

  // Initial trigger
  setTimeout(handleScrollEventsAndProgress, 500);
});
