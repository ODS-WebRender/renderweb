// Reusable Header & Footer Components for Old Dog Systems
// This file eliminates 300+ lines of code duplication across pages

export function getHeader(currentPage = 'home') {
  return `
    <header class="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <nav class="nav-glass mx-auto flex max-w-6xl items-center justify-between px-4 py-3 mt-2 rounded-2xl">
        <div class="flex items-center gap-3">
          <a href="./index.html" class="flex items-center gap-3">
            <img
              src="./images/dog-logo.png"
              alt="Old Dog Systems Logo"
              title="Old Dog Systems"
              class="h-16 w-16 rounded-2xl object-cover border border-slate-700/60 ring-1 ring-slate-600/30 shadow-lg bg-slate-900/40"
            />
            <div class="flex flex-col">
              <span data-brand class="text-lg font-bold tracking-tight text-slate-100 leading-snug"></span>
              <span class="text-[11px] uppercase tracking-[0.18em] text-slate-400">Old Dog · New Tricks</span>
            </div>
          </a>
        </div>

        <!-- Desktop nav -->
        <div class="hidden items-center gap-8 text-sm font-medium text-slate-200 md:flex">
          <a href="./index.html" class="nav-underline ${currentPage === 'home' ? 'text-sky-400' : ''}" aria-current="${currentPage === 'home' ? 'page' : 'false'}">Home</a>

          <!-- Media mega -->
          <div class="relative group">
            <button type="button" class="inline-flex items-center gap-1 nav-underline ${currentPage === 'media' ? 'text-sky-400' : ''}">
              <span>Media</span>
              <span class="text-xs text-slate-400">▾</span>
            </button>
            <div class="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition duration-150 ease-out absolute left-1/2 -translate-x-1/2 mt-4 w-[540px]">
              <div class="mega-panel card-glass p-5 shadow-2xl border border-slate-700/60">
                <div class="mb-4 flex items-center justify-between gap-4 text-xs text-slate-400">
                  <div class="flex items-center gap-2">
                    <span class="tag-pill px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-300">Podcast Arm</span>
                    <span>Long-form, founder-grade conversations.</span>
                  </div>
                  <a href="./media.html" class="inline-flex items-center gap-1 text-sky-300 hover:text-sky-200">
                    View Media House
                    <span class="text-[10px]">↗</span>
                  </a>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <a href="./media.html#business-on-purpose" class="rounded-xl border border-slate-700/70 bg-slate-900/70 p-3 hover:border-sky-500/70 hover:bg-slate-900/90 transition-colors">
                    <div class="mb-1 flex items-center justify-between gap-3">
                      <span class="text-slate-50">Business on Purpose</span>
                      <span class="tag-pill px-2 py-0.5 text-[10px] text-sky-300">Flagship</span>
                    </div>
                    <p class="text-xs text-slate-400">Operational clarity for owners building durable systems.</p>
                  </a>
                  <a href="./media.html#when-life-bites" class="rounded-xl border border-slate-700/70 bg-slate-900/70 p-3 hover:border-sky-500/70 hover:bg-slate-900/90 transition-colors">
                    <div class="mb-1 flex items-center justify-between gap-3">
                      <span class="text-slate-50">When Life Bites</span>
                      <span class="tag-pill px-2 py-0.5 text-[10px] text-fuchsia-300">Human</span>
                    </div>
                    <p class="text-xs text-slate-400">Resilient founders navigating grief, pressure, and high-stakes seasons.</p>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Products mega (consolidated Software + Offerings) -->
          <div class="relative group">
            <button type="button" class="inline-flex items-center gap-1 nav-underline ${currentPage === 'products' ? 'text-sky-400' : ''}">
              <span>Products</span>
              <span class="text-xs text-slate-400">▾</span>
            </button>
            <div class="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition duration-150 ease-out absolute left-1/2 -translate-x-1/2 mt-4 w-[800px]">
              <div class="mega-panel card-glass p-5 shadow-2xl border border-slate-700/60">
                <!-- Studio Section -->
                <div class="mb-5">
                  <div class="mb-3 flex items-center justify-between text-xs">
                    <div class="flex items-center gap-2 text-slate-400">
                      <span class="tag-pill px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-300">Flagship</span>
                      <span>Media & content systems</span>
                    </div>
                  </div>
                  <a href="./studio.html" class="flex items-start gap-3 rounded-xl border border-sky-500/60 bg-slate-900/80 p-3 hover:border-sky-400 hover:bg-slate-900 transition-colors">
                    <div class="mt-0.5 h-8 w-8 rounded-lg bg-sky-500/15 ring-1 ring-sky-400/40 flex items-center justify-center text-sky-300 text-xs">α</div>
                    <div class="text-sm">
                      <div class="flex items-center gap-2">
                        <span class="text-slate-50">Rough Diamond Studio</span>
                        <span class="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-500/40">Alpha</span>
                      </div>
                      <p class="mt-1 text-xs text-slate-400">Audio podcasting and content systems built for teams that ship weekly.</p>
                    </div>
                  </a>
                </div>

                <!-- Enterprise Solutions Grid -->
                <div>
                  <div class="mb-3 text-xs font-semibold text-slate-400 uppercase tracking-[0.15em]">Enterprise Solutions</div>
                  <div class="grid grid-cols-3 gap-3">
                    <a href="./cpm-ai.html" class="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-slate-900/50 p-3 hover:border-amber-400 hover:bg-slate-900 transition-colors">
                      <div class="text-lg">🏗️</div>
                      <div class="text-sm"><div class="font-semibold text-amber-300">CPM-AI Suite</div><p class="text-xs text-slate-400 mt-1">Construction automation</p></div>
                    </a>
                    <a href="./propaI-pro.html" class="flex items-start gap-2 rounded-lg border border-emerald-500/40 bg-slate-900/50 p-3 hover:border-emerald-400 hover:bg-slate-900 transition-colors">
                      <div class="text-lg">🏘️</div>
                      <div class="text-sm"><div class="font-semibold text-emerald-300">PropAI-Pro</div><p class="text-xs text-slate-400 mt-1">Property management</p></div>
                    </a>
                    <a href="./small-ai-toolkit.html" class="flex items-start gap-2 rounded-lg border border-purple-500/40 bg-slate-900/50 p-3 hover:border-purple-400 hover:bg-slate-900 transition-colors">
                      <div class="text-lg">💼</div>
                      <div class="text-sm"><div class="font-semibold text-purple-300">Small-AI Toolkit</div><p class="text-xs text-slate-400 mt-1">SME productivity</p></div>
                    </a>
                    <a href="./buildenv-ai-academy.html" class="flex items-start gap-2 rounded-lg border border-blue-500/40 bg-slate-900/50 p-3 hover:border-blue-400 hover:bg-slate-900 transition-colors">
                      <div class="text-lg">📘</div>
                      <div class="text-sm"><div class="font-semibold text-blue-300">BuildEnv Academy</div><p class="text-xs text-slate-400 mt-1">AI training & upskilling</p></div>
                    </a>
                    <a href="./revenue-engine.html" class="flex items-start gap-2 rounded-lg border border-green-500/40 bg-slate-900/50 p-3 hover:border-green-400 hover:bg-slate-900 transition-colors">
                      <div class="text-lg">💰</div>
                      <div class="text-sm"><div class="font-semibold text-green-300">Revenue Engine</div><p class="text-xs text-slate-400 mt-1">Monetization systems</p></div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a href="./shop.html" class="nav-underline ${currentPage === 'shop' ? 'text-sky-400' : ''}">Shop</a>

          <a href="./dashboard.html" class="nav-underline ${currentPage === 'dashboard' ? 'text-sky-400' : ''}">Dashboard</a>
          <a href="./index.html#about" class="nav-underline">About</a>
        </div>

        <!-- Mobile trigger -->
        <button type="button" class="inline-flex items-center justify-center rounded-full border border-slate-700/70 p-2 text-slate-200 md:hidden" aria-label="Open navigation" onclick="document.getElementById('mobile-nav').classList.toggle('hidden')">
          <span class="block h-0.5 w-4 rounded-full bg-slate-200 mb-0.5"></span>
          <span class="block h-0.5 w-4 rounded-full bg-slate-400 mb-0.5"></span>
          <span class="block h-0.5 w-3 rounded-full bg-slate-500"></span>
        </button>
      </nav>

      <!-- Mobile nav -->
      <div id="mobile-nav" class="mx-auto mt-2 hidden max-w-6xl px-4 pb-3 md:hidden">
        <div class="nav-glass rounded-2xl p-4 text-sm text-slate-100 space-y-3">
          <a href="./index.html" class="block">Home</a>
          <a href="./media.html" class="block">Media</a>
          <div class="border-t border-slate-700/50 pt-2 mt-2">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-[0.15em] mb-2">Products</p>
            <a href="./studio.html" class="block text-sm ml-2">Rough Diamond Studio</a>
            <a href="./cpm-ai.html" class="block text-sm ml-2">CPM-AI Suite</a>
            <a href="./propaI-pro.html" class="block text-sm ml-2">PropAI-Pro</a>
            <a href="./small-ai-toolkit.html" class="block text-sm ml-2">Small-AI Toolkit</a>
            <a href="./buildenv-ai-academy.html" class="block text-sm ml-2">BuildEnv Academy</a>
            <a href="./revenue-engine.html" class="block text-sm ml-2">Revenue Engine</a>
          </div>
          <a href="./shop.html" class="block">Shop</a>
          <a href="./dashboard.html" class="block">Dashboard</a>
          <a href="./index.html#about" class="block">About</a>
          <div class="border-t border-slate-700/50 pt-2 mt-2">
            <a href="./studio.html#alpha-access" class="block text-xs text-emerald-400 hover:text-emerald-300">Get Alpha Access</a>
          </div>
        </div>
      </div>
    </header>
  `;
}

export function getFooter() {
  return `
    <footer class="border-t border-slate-800/80 py-6">
      <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:flex-row">
        <p>
          © <span id="footer-year"></span>
          <span data-brand></span>. All rights reserved.
        </p>
        <div class="flex items-center gap-4">
          <a href="./index.html#about" class="hover:text-slate-300">About</a>
          <a href="./shop.html" class="hover:text-slate-300">Shop</a>
          <a href="./studio.html#alpha-access" class="hover:text-slate-300">Alpha Access</a>
        </div>
      </div>
    </footer>
  `;
}

// Helper functions for shared functionality
export function initializeComponents() {
  // Set footer year
  const yearElement = document.getElementById('footer-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Apply branding
  import('./constants.js').then(module => {
    if (module.applyBranding) {
      module.applyBranding();
    }
  }).catch(err => console.error('Error loading branding:', err));
}
