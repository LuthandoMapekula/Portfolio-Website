document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website loaded');
    loadRecentWork();
    initSmoothScroll();
    setTimeout(initWordCycle, 1500);
});

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
        <img src="${project.thumbnail}" alt="${escapeHTML(project.title)} Thumbnail" class="project-thumb">
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