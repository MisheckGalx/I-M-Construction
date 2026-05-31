/* ============================================================
   projects.js — Dynamic projects from API + filter + lightbox
============================================================ */
const Projects = (() => {
  const API_URL = 'https://im-construction-api.onrender.com/api/projects';
  const LOCAL   = 'http://127.0.0.1:10000/api/projects';
  const BASE    = 'https://im-construction-api.onrender.com';
  let allProjects = [];
  let currentFilter = 'all';

  const grid = () => document.getElementById('projectGrid');

  // Empty state — shown when no projects uploaded yet
  const EMPTY_STATE = `
    <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#94a3b8;">
      <div style="font-size:2.5rem;margin-bottom:16px;">🏗️</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:1rem;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;">No projects yet</div>
      <div style="font-size:.85rem;">Projects uploaded via the admin panel will appear here.</div>
    </div>`;

  async function load() {
    try {
      let res = await fetch(API_URL).catch(() => fetch(LOCAL));
      if (res.ok) {
        const json = await res.json();
        allProjects = json.data.projects || [];
      } else {
        allProjects = [];
      }
    } catch(_) {
      allProjects = [];
    }
    render(allProjects);
    updateFilterButtons();
  }

  function render(projects) {
    const g = grid();
    if (!g) return;
    if (!projects.length) {
      g.innerHTML = EMPTY_STATE;
      return;
    }
    g.innerHTML = projects.map(p => {
      const img = p.image.startsWith('http') || p.image.startsWith('assets')
        ? p.image
        : `${BASE}${p.image}`;
      return `
        <div class="project-item" data-category="${p.category}">
          <img src="${img}" alt="${p.title}" loading="lazy"
               onerror="this.src='assets/images/projects/project-1.jpg'" />
          <div class="project-overlay">
            <div>
              <div class="project-title">${p.title}</div>
              <div class="project-tag">${p.category.charAt(0).toUpperCase()+p.category.slice(1)}</div>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  function filter(category) {
    currentFilter = category;
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.filter === category);
    });
    const filtered = category === 'all'
      ? allProjects
      : allProjects.filter(p => p.category === category);
    render(filtered);
  }

  function updateFilterButtons() {
    // Get unique categories from loaded projects
    const cats = [...new Set(allProjects.map(p => p.category))];
    const row = document.querySelector('.filter-row');
    if (!row) return;
    row.innerHTML = `<button class="filter-btn active" data-filter="all" onclick="Projects.filter('all')">All Work</button>` +
      cats.map(c => `<button class="filter-btn" data-filter="${c}" onclick="Projects.filter('${c}')">${c.charAt(0).toUpperCase()+c.slice(1)}</button>`).join('');
  }

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', load);

  return { filter, load };
})();
