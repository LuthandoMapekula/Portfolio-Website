document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website loaded');
    loadRecentWork();
    initSmoothScroll();
    initFeaturedAccordion();
    setTimeout(initWordCycle, 1500);
});

// Featured Project horizontal accordion (click-to-expand volumes)
function initFeaturedAccordion() {
    const accordion = document.getElementById('featuredAccordion');
    if (!accordion) return;

    const topLabel = document.getElementById('accordionTopLabel');
    const bottomLabel = document.getElementById('accordionBottomLabel');
    const artstationLink = document.getElementById('accordionArtstationLink');
    const panes = accordion.querySelectorAll('.accordion-pane');

    function activate(pane) {
        panes.forEach(p => {
            const isActive = p === pane;
            p.classList.toggle('active', isActive);
            p.setAttribute('aria-expanded', String(isActive));
        });

        if (topLabel) topLabel.textContent = pane.dataset.title || '';
        if (bottomLabel) bottomLabel.textContent = pane.dataset.plates || '';
        if (artstationLink && pane.dataset.artstation) {
            artstationLink.href = pane.dataset.artstation;
            artstationLink.setAttribute('aria-label', `View ${pane.dataset.title} on ArtStation`);
        }
    }

    panes.forEach(pane => {
        pane.addEventListener('click', () => {
            if (pane.classList.contains('active')) return;
            activate(pane);
        });
        pane.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!pane.classList.contains('active')) activate(pane);
            }
        });
    });
}

// Smooth scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if(target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Escape HTML
function escapeHTML(str) {
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
}

// Render project card
function renderProjectCard(project) {
    return `
        <span class="project-status ${project.statusClass}">${escapeHTML(project.status)}</span>
        ${project.milestone ? `<div class="project-milestone">${escapeHTML(project.milestone)}</div>` : ''}
        <h3>${escapeHTML(project.title)}</h3>
        <div class="project-category">${escapeHTML(project.category)}</div>
        <p>${escapeHTML(project.description)}</p>
        <a href="${project.link}" class="btn">View Details</a>
    `;
}

// Load projects dynamically
async function loadRecentWork() {
    const container = document.getElementById('recent-work-container');
    if (!container) return;

    try {
        // Try multiple relative paths based on common structures
        const paths = ['js/projects.json', '../js/projects.json', '../../js/projects.json'];
        let response = null;
        
        for (const path of paths) {
            try {
                const res = await fetch(path);
                if (res.ok) {
                    response = res;
                    break;
                }
            } catch (e) {
                // Ignore fetch errors for individual paths
            }
        }

        if (!response) {
            throw new Error('Projects JSON not found in expected paths.');
        }

        const projects = await response.json();

        const cards = container.querySelectorAll('.card[data-project-id]');
        if (cards.length === 0) {
            console.warn('No project placeholders found in recent-work-container.');
            return;
        }

        cards.forEach((card, index) => {
            const projectId = card.dataset.projectId;
            const project = projects[projectId];

            if (!project) {
                console.warn(`Missing project in JSON: ${projectId}`);
                card.innerHTML = `<p style="color:#ff6b6b;">Project not found: ${projectId}</p>`;
                return;
            }

            card.classList.add('fade-in');
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = renderProjectCard(project);
        });

    } catch (err) {
        console.error('Error loading projects:', err);
    }
}


/* Word Cycling Animation (Positive vs Negative, Synced) */
function initWordCycle() {
    const cycleElements = document.querySelectorAll('.cycle-word');

    const fillerSets = {
        positive: ["design", "artistry", "structure", "vision", "patience", "practice", "attention to detail", "intent", "discipline", "precision"],
        negative: ["noise", "chaos", "glitch", "accidental", "random", "imitation", "lack of consistency", "confusion", "distraction", "error"]
    };

    const maxCycles = 14;
    const intervalMs = 500;

    cycleElements.forEach(el => {
        const finalWord = el.dataset.final;
        const setKey = el.dataset.set; // "positive" | "negative"
        const fillerWords = fillerSets[setKey] || fillerSets.positive;

        let cycles = 0;

        const interval = setInterval(() => {
            el.textContent = fillerWords[Math.floor(Math.random() * fillerWords.length)];
            cycles++;

            if (cycles >= maxCycles) {
                clearInterval(interval);
                el.textContent = finalWord;
                el.classList.add('cycle-done');
            }
        }, intervalMs);
    });
}

// Toggle collapsible project details
document.addEventListener("click", (e) => {
    const toggle = e.target.closest("[data-toggle]");
    if (!toggle) return;

    const id = toggle.dataset.toggle;
    const details = document.getElementById(`project-details-${id}`);

    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));

    details.hidden = expanded;
});