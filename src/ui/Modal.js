import { SITE_CONTENT } from '../data/siteContent.js';

export class Modal {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'modal-overlay';
    this.container.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md opacity-0 pointer-events-none transition-all duration-300';
    
    this.container.innerHTML = `
      <div id="modal-card" class="relative w-full max-w-4xl max-h-[85vh] bg-slate-950/90 border border-purple-500/40 rounded-2xl shadow-[0_0_50px_rgba(155,93,229,0.25)] flex flex-col overflow-hidden text-white transform scale-95 transition-transform duration-300">
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-purple-500/20 bg-purple-950/30">
          <div class="flex items-center space-x-3">
            <span id="modal-badge" class="px-3 py-1 text-xs font-bold tracking-widest text-purple-300 uppercase bg-purple-900/60 rounded-full border border-purple-500/30">
              MISSION DATA
            </span>
            <h2 id="modal-title" class="text-2xl font-bold tracking-tight text-white">
              Station Title
            </h2>
          </div>
          <button id="modal-close" class="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 hover:bg-purple-900/50 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Body Content (Scrollable) -->
        <div id="modal-body" class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Dynamic Content Injected Here -->
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-between p-4 border-t border-purple-500/20 bg-slate-900/50 text-xs text-slate-400">
          <span>BAAP FLIGHT SYSTEM V3.2 • BATTLEFIELD HIGH SCHOOL</span>
          <button id="modal-footer-close" class="px-4 py-2 text-sm font-semibold text-purple-300 bg-purple-950 hover:bg-purple-900 rounded-lg border border-purple-500/40 transition">
            Close Panel
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);

    this.isOpen = false;
    this.closeBtn = this.container.querySelector('#modal-close');
    this.footerCloseBtn = this.container.querySelector('#modal-footer-close');

    this.closeBtn.addEventListener('click', () => this.close());
    this.footerCloseBtn.addEventListener('click', () => this.close());

    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open(stationId) {
    const bodyEl = this.container.querySelector('#modal-body');
    const titleEl = this.container.querySelector('#modal-title');
    const badgeEl = this.container.querySelector('#modal-badge');

    let htmlContent = '';

    if (stationId === 'about' || stationId === 'start') {
      const data = SITE_CONTENT.about;
      titleEl.innerText = data.title;
      badgeEl.innerText = data.badge;

      htmlContent = `
        <div class="space-y-6">
          <p class="text-lg text-purple-200/90 leading-relaxed font-light">${data.description}</p>
          
          <!-- Stats Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            ${data.stats.map(s => `
              <div class="p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl text-center">
                <div class="text-2xl font-black text-purple-400">${s.value}</div>
                <div class="text-xs text-slate-400 uppercase tracking-wider mt-1">${s.label}</div>
              </div>
            `).join('')}
          </div>

          <!-- Mission statement -->
          <div class="p-5 bg-gradient-to-r from-purple-900/40 to-slate-900 border-l-4 border-purple-500 rounded-r-xl">
            <h3 class="text-xs uppercase font-bold tracking-widest text-purple-400">Core Mission</h3>
            <p class="mt-2 text-slate-200 italic">"${data.mission}"</p>
          </div>

          <!-- Sub-teams Grid -->
          <div>
            <h3 class="text-xl font-bold text-white mb-4">Engineering Sub-Teams</h3>
            <div class="grid md:grid-cols-2 gap-4">
              ${data.teams.map(t => `
                <div class="p-4 bg-slate-900/80 border border-slate-800 rounded-xl hover:border-purple-500/50 transition">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="w-3 h-3 rounded-full" style="background-color: ${t.color}"></span>
                    <h4 class="font-bold text-white">${t.name}</h4>
                  </div>
                  <p class="text-sm text-slate-300 leading-relaxed">${t.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } else if (stationId === 'timeline') {
      const data = SITE_CONTENT.timeline;
      titleEl.innerText = data.title;
      badgeEl.innerText = data.badge;

      htmlContent = `
        <div class="space-y-6">
          <p class="text-slate-300">${data.subtitle}</p>
          <div class="relative border-l-2 border-purple-500/40 ml-4 space-y-8 py-2">
            ${data.events.map(ev => `
              <div class="relative pl-6">
                <span class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-purple-500 ring-4 ring-purple-950"></span>
                <div class="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xl font-black text-purple-400">${ev.year}</span>
                    <span class="px-2.5 py-0.5 text-xs font-semibold bg-purple-950 text-purple-300 border border-purple-500/30 rounded-full">${ev.tag}</span>
                  </div>
                  <h4 class="text-lg font-bold text-white">${ev.title}</h4>
                  <p class="text-sm text-slate-300">${ev.desc}</p>
                  <div class="text-xs font-mono text-cyan-400 pt-1">${ev.stats}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (stationId === 'gallery') {
      const data = SITE_CONTENT.gallery;
      titleEl.innerText = data.title;
      badgeEl.innerText = data.badge;

      htmlContent = `
        <div class="space-y-6">
          <p class="text-slate-300">${data.subtitle}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            ${data.photos.map(p => `
              <div class="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <img src="${p.image}" alt="${p.title}" class="w-full h-44 object-cover group-hover:scale-105 transition duration-500" loading="lazy"/>
                <div class="p-3 bg-slate-950">
                  <span class="text-[10px] uppercase font-bold tracking-widest text-purple-400">${p.category}</span>
                  <h4 class="text-sm font-bold text-white truncate">${p.title}</h4>
                  <p class="text-xs text-slate-400 mt-1 line-clamp-2">${p.caption}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (stationId === 'resources') {
      const data = SITE_CONTENT.resources;
      titleEl.innerText = data.title;
      badgeEl.innerText = data.badge;

      htmlContent = `
        <div class="space-y-6">
          <p class="text-slate-300">${data.subtitle}</p>
          <div class="grid md:grid-cols-2 gap-4">
            ${data.items.map(item => `
              <div class="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-semibold px-2.5 py-0.5 bg-cyan-950 text-cyan-300 rounded-full border border-cyan-500/30">${item.badge}</span>
                    <span class="text-xs text-slate-400">${item.type}</span>
                  </div>
                  <h4 class="text-base font-bold text-white">${item.title}</h4>
                  <p class="text-xs text-slate-300 mt-2 leading-relaxed">${item.desc}</p>
                </div>
                <a href="${item.link}" target="_blank" class="inline-flex items-center justify-center w-full py-2 px-4 text-xs font-bold text-purple-300 bg-purple-950 hover:bg-purple-900 border border-purple-500/40 rounded-lg transition">
                  Access File Repository →
                </a>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (stationId === 'merch') {
      const data = SITE_CONTENT.merch;
      titleEl.innerText = data.title;
      badgeEl.innerText = data.badge;

      htmlContent = `
        <div class="space-y-6">
          <p class="text-slate-300">${data.subtitle}</p>
          <div class="grid md:grid-cols-2 gap-4">
            ${data.items.map(m => `
              <div class="p-5 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="text-lg font-bold text-white">${m.title}</h4>
                    <span class="text-lg font-black text-purple-400">${m.price}</span>
                  </div>
                  <p class="text-xs text-slate-300">${m.desc}</p>
                  <div class="text-xs text-slate-400 mt-2">Color: <span class="text-purple-300">${m.color}</span></div>
                </div>
                <button onclick="alert('Order request recorded! Contact club officer for direct purchase.')" class="mt-4 w-full py-2.5 text-xs font-bold text-slate-900 bg-purple-400 hover:bg-purple-300 rounded-lg shadow-md transition">
                  Request Item
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (stationId === 'blog') {
      const data = SITE_CONTENT.blog;
      titleEl.innerText = data.title;
      badgeEl.innerText = data.badge;

      htmlContent = `
        <div class="space-y-6">
          <p class="text-slate-300">${data.subtitle}</p>
          <div class="space-y-4">
            ${data.posts.map(post => `
              <div class="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
                <div class="flex items-center justify-between text-xs text-purple-400">
                  <span>${post.category} • ${post.readTime}</span>
                  <span>${post.date}</span>
                </div>
                <h4 class="text-xl font-bold text-white">${post.title}</h4>
                <p class="text-sm text-slate-300">${post.snippet}</p>
                <div class="p-4 bg-slate-950 rounded-lg text-xs text-slate-400 font-mono leading-relaxed">${post.content}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    bodyEl.innerHTML = htmlContent;

    this.container.classList.remove('opacity-0', 'pointer-events-none');
    const card = this.container.querySelector('#modal-card');
    card.classList.remove('scale-95');
    card.classList.add('scale-100');
    this.isOpen = true;
  }

  close() {
    this.container.classList.add('opacity-0', 'pointer-events-none');
    const card = this.container.querySelector('#modal-card');
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    this.isOpen = false;
  }
}
