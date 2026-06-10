/* ============================================================
   projects.js — Loads from projects.json (GitHub hosted)
   No backend needed. Add/remove via admin panel.
============================================================ */
const Projects = (() => {
  const JSON_URL = '/projects.json';
  let allProjects = [];

  const grid = () => document.getElementById('projectGrid');

  async function load() {
    const g = grid();
    if (g) g.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px;
        color:#94a3b8;font-size:.85rem;letter-spacing:.1em;
        font-family:'Barlow Condensed',sans-serif;text-transform:uppercase;">
        Loading projects…
      </div>`;
    try {
      const res = await fetch(`${JSON_URL}?t=${Date.now()}`); // bust cache
      allProjects = res.ok ? await res.json() : [];
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
      g.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#94a3b8;">
          <div style="font-size:2rem;margin-bottom:12px;">🏗️</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:.85rem;
            letter-spacing:.1em;text-transform:uppercase;">Projects coming soon</div>
        </div>`;
      return;
    }
    g.innerHTML = projects.map(p => `
      <div class="project-item" data-category="${p.category}">
        <img src="${p.image}" alt="${p.title}" loading="lazy"
             onerror="this.parentElement.style.display='none'" />
        <div class="project-overlay">
          <div>
            <div class="project-title">${p.title}</div>
            <div class="project-tag">${p.category.charAt(0).toUpperCase()+p.category.slice(1)}</div>
          </div>
        </div>
      </div>`).join('');
  }

  function filter(category) {
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.filter === category);
    });
    const filtered = category === 'all'
      ? allProjects
      : allProjects.filter(p => p.category === category);
    render(filtered);
  }

  function updateFilterButtons() {
    const cats = [...new Set(allProjects.map(p => p.category))];
    const row = document.querySelector('.filter-row');
    if (!row) return;
    row.innerHTML = `<button class="filter-btn active" data-filter="all" 
        onclick="Projects.filter('all')">All Work</button>` +
      cats.map(c => `<button class="filter-btn" data-filter="${c}" 
        onclick="Projects.filter('${c}')">${c.charAt(0).toUpperCase()+c.slice(1)}</button>`
      ).join('');
  }

  document.addEventListener('DOMContentLoaded', load);
  return { filter, load };
})();
