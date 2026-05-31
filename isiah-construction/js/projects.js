/* ============================================================
   projects.js — Dynamic projects from API + filter + lightbox
============================================================ */
const Projects = (() => {
  const API_URL = 'https://im-construction-api.onrender.com/api/projects';
  const LOCAL   = 'http://127.0.0.1:5000/api/projects';
  let allProjects = [];
  let currentFilter = 'all';

  const grid = () => document.getElementById('projectGrid');

  // Static fallback projects (shown if API fails)
  const STATIC = [
    { id:1, title:'Commercial Build — Sandton',      category:'construction', image:'assets/images/projects/project-1.jpg' },
    { id:2, title:'Premium Driveway — Centurion',    category:'paving',       image:'assets/images/projects/project-2.jpg' },
    { id:3, title:'Structural Build — Pretoria',     category:'construction', image:'assets/images/projects/project-3.jpg' },
    { id:4, title:'Full Home Renovation — Midrand',  category:'renovation',   image:'assets/images/projects/project-4.jpg' },
    { id:5, title:'Plumbing Upgrade — Joburg',       category:'renovation',   image:'assets/images/projects/project-5.jpg' },
    { id:6, title:'Industrial Site — Midvaal',       category:'construction', image:'assets/images/projects/project-6.jpg' },
    { id:7, title:'Courtyard Paving — Soweto',       category:'paving',       image:'assets/images/projects/project-7.jpg' },
    { id:8, title:'Luxury Estate — Dainfern',        category:'construction', image:'assets/images/projects/project-8.jpg' },
    { id:9, title:'Garden Pathway — Randburg',       category:'paving',       image:'assets/images/projects/project-9.jpg' },
  ];

  async function load() {
    try {
      // Try live API first, fallback to local
      let res = await fetch(API_URL).catch(() => fetch(LOCAL));
      if (res.ok) {
        const json = await res.json();
        allProjects = json.data.projects.length > 0 ? json.data.projects : STATIC;
      } else {
        allProjects = STATIC;
      }
    } catch(_) {
      allProjects = STATIC;
    }
    render(allProjects);
    updateFilterButtons();
  }

  function render(projects) {
    const g = grid();
    if (!g) return;
    if (!projects.length) {
      g.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:40px;">No projects found.</div>';
      return;
    }
    g.innerHTML = projects.map(p => {
      const img = p.image.startsWith('http') || p.image.startsWith('assets')
        ? p.image
        : `https://im-construction-api.onrender.com${p.image}`;
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
