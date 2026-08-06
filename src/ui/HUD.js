import { audioEngine } from '../engine/Audio.js';

export class HUD {
  constructor(world, modal) {
    this.world = world;
    this.modal = modal;

    this.container = document.createElement('div');
    this.container.id = 'hud-container';
    this.container.className = 'fixed inset-0 pointer-events-none z-40 flex flex-col justify-between p-4 font-sans text-white';

    this.container.innerHTML = `
      <!-- Top Navigation & Teleport Header -->
      <div class="flex items-center justify-between pointer-events-auto">
        
        <!-- BAAP Logo & Telemetry Status -->
        <div class="flex items-center space-x-3 bg-slate-950/80 border border-purple-500/30 px-4 py-2 rounded-2xl backdrop-blur-md shadow-lg">
          <img src="/images/logo.png" alt="BAAP Logo" class="w-8 h-8 rounded-full border border-purple-400" />
          <div>
            <div class="text-sm font-black tracking-wider text-purple-300">BAAP FLIGHT 3D</div>
            <div id="status-badge" class="text-[10px] font-mono text-cyan-400 flex items-center space-x-1">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>TELEMETRY ONLINE</span>
            </div>
          </div>
        </div>

        <!-- Quick Teleport Navbar -->
        <div class="hidden md:flex items-center space-x-2 bg-slate-950/80 border border-purple-500/30 p-1.5 rounded-2xl backdrop-blur-md shadow-lg">
          <button data-station="start" class="teleport-btn px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-purple-900/40 rounded-xl transition">
            🚀 Home
          </button>
          <button data-station="about" class="teleport-btn px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-purple-900/40 rounded-xl transition">
            🛰️ About
          </button>
          <button data-station="timeline" class="teleport-btn px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-purple-900/40 rounded-xl transition">
            📜 Timeline
          </button>
          <button data-station="gallery" class="teleport-btn px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-purple-900/40 rounded-xl transition">
            🖼️ Gallery
          </button>
          <button data-station="resources" class="teleport-btn px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-purple-900/40 rounded-xl transition">
            💻 Tech Lab
          </button>
          <button data-station="merch" class="teleport-btn px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-purple-900/40 rounded-xl transition">
            👕 Merch
          </button>
          <button data-station="blog" class="teleport-btn px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-purple-900/40 rounded-xl transition">
            📰 Blog
          </button>
        </div>

        <!-- Audio & Settings HUD Controls -->
        <div class="flex items-center space-x-2 pointer-events-auto">
          <button id="audio-toggle" class="p-2.5 bg-slate-950/80 border border-purple-500/30 rounded-2xl backdrop-blur-md text-slate-300 hover:text-white hover:bg-purple-900/40 transition">
            🔊 Sound: ON
          </button>
          <button id="reader-mode-btn" class="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-2xl shadow-lg border border-purple-300/40 transition">
            📖 Full Reader Mode
          </button>
        </div>
      </div>

      <!-- Station Arrival Prompt Banner (Center) -->
      <div id="station-prompt" class="hidden self-center pointer-events-auto animate-bounce mb-8">
        <button id="open-station-btn" class="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-base rounded-full shadow-[0_0_30px_rgba(0,245,212,0.5)] border border-white/40 flex items-center space-x-2">
          <span>⚡ ARRIVED AT STATION:</span>
          <span id="prompt-station-name" class="font-extrabold underline">ABOUT BAAP</span>
          <span>(PRESS E / CLICK HERE)</span>
        </button>
      </div>

      <!-- Bottom Flight Telemetry Dashboard & Mobile Controls -->
      <div class="flex items-end justify-between">
        
        <!-- Left: Telemetry Gauges -->
        <div class="bg-slate-950/85 border border-purple-500/30 p-4 rounded-2xl backdrop-blur-md shadow-lg pointer-events-auto space-y-2 w-64">
          <div class="flex items-center justify-between text-xs text-purple-300 font-mono font-bold border-b border-purple-500/20 pb-1">
            <span>FLIGHT TELEMETRY</span>
            <span id="telemetry-mode" class="text-cyan-400">READY</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <div class="text-[10px] text-slate-400">ALTITUDE</div>
              <div id="gauge-altitude" class="text-lg font-black text-white">0 m</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400">VELOCITY</div>
              <div id="gauge-speed" class="text-lg font-black text-cyan-400">0 m/s</div>
            </div>
          </div>
          <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-purple-500/20">
            <div id="boost-bar" class="bg-gradient-to-r from-purple-500 to-cyan-400 h-full w-0 transition-all"></div>
          </div>
          <div class="text-[10px] text-slate-400 font-mono text-center">
            KEYS: WASD / Arrows = Fly • Shift = Turbo • Space = Brake
          </div>
        </div>

        <!-- Right: Mobile Touch Controls (Visible on Touch devices) -->
        <div class="md:hidden flex space-x-3 pointer-events-auto">
          <button id="touch-thrust" class="w-16 h-16 rounded-full bg-purple-600/80 active:bg-purple-400 border border-purple-300 text-white font-bold text-xs flex items-center justify-center shadow-lg">
            THRUST
          </button>
          <button id="touch-boost" class="w-16 h-16 rounded-full bg-cyan-600/80 active:bg-cyan-400 border border-cyan-300 text-white font-bold text-xs flex items-center justify-center shadow-lg">
            BOOST
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);

    this.bindEvents();
    this.currentStation = null;
  }

  bindEvents() {
    // Teleport Buttons
    const buttons = this.container.querySelectorAll('.teleport-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const stationId = btn.dataset.station;
        const targetStation = this.world.stations.stations.find(s => s.id === stationId);
        if (targetStation) {
          this.world.rocket.teleportTo({
            x: targetStation.pos.x,
            y: 3,
            z: targetStation.pos.z + 8
          });
          audioEngine.playBoostSound();
          this.modal.open(stationId);
        }
      });
    });

    // Audio Toggle
    const audioBtn = this.container.querySelector('#audio-toggle');
    audioBtn.addEventListener('click', () => {
      const isMuted = audioEngine.toggleMute();
      audioBtn.innerText = isMuted ? '🔇 Sound: OFF' : '🔊 Sound: ON';
    });

    // Reader Mode Button
    const readerBtn = this.container.querySelector('#reader-mode-btn');
    readerBtn.addEventListener('click', () => {
      this.modal.open('about');
    });

    // Station Open Button
    const openBtn = this.container.querySelector('#open-station-btn');
    openBtn.addEventListener('click', () => {
      if (this.currentStation) {
        this.modal.open(this.currentStation.id);
      }
    });

    // Keydown for 'E' key to open station modal
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'e' || e.key === 'E') && this.currentStation && !this.modal.isOpen) {
        this.modal.open(this.currentStation.id);
      }
    });

    // Touch Buttons
    const touchThrust = this.container.querySelector('#touch-thrust');
    const touchBoost = this.container.querySelector('#touch-boost');

    if (touchThrust) {
      touchThrust.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.world.rocket.keys.forward = true;
      });
      touchThrust.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.world.rocket.keys.forward = false;
      });
    }

    if (touchBoost) {
      touchBoost.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.world.rocket.keys.boost = true;
      });
      touchBoost.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.world.rocket.keys.boost = false;
      });
    }
  }

  update() {
    // 1. Update Telemetry displays
    const altEl = this.container.querySelector('#gauge-altitude');
    const spdEl = this.container.querySelector('#gauge-speed');
    const boostBar = this.container.querySelector('#boost-bar');
    const statusMode = this.container.querySelector('#telemetry-mode');

    if (altEl && spdEl && this.world.rocket) {
      altEl.innerText = `${Math.round(this.world.rocket.altitude)} m`;
      spdEl.innerText = `${Math.round(this.world.rocket.speed * 3.6)} km/h`;

      if (this.world.rocket.isBoosting) {
        statusMode.innerText = 'TURBO NITRO';
        statusMode.className = 'text-purple-400 font-extrabold animate-pulse';
        boostBar.style.width = '100%';
      } else if (this.world.rocket.speed > 1) {
        statusMode.innerText = 'IN FLIGHT';
        statusMode.className = 'text-cyan-400';
        boostBar.style.width = `${Math.min(100, this.world.rocket.speed * 4)}%`;
      } else {
        statusMode.innerText = 'LANDED';
        statusMode.className = 'text-green-400';
        boostBar.style.width = '0%';
      }
    }

    // 2. Station Arrival Banner updates
    const promptBanner = this.container.querySelector('#station-prompt');
    const promptName = this.container.querySelector('#prompt-station-name');

    if (this.world.activeStation) {
      this.currentStation = this.world.activeStation;
      promptName.innerText = this.currentStation.title;
      promptBanner.classList.remove('hidden');
    } else {
      this.currentStation = null;
      promptBanner.classList.add('hidden');
    }
  }
}
