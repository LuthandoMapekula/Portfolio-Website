document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website loaded');

    // Load dynamic projects first
    loadRecentWork();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
 
    // Add more interactive logic here as needed
    setTimeout(initWordCycle, 1500);
});

/* Dynamic Project Loader */
async function loadRecentWork() {
    const container = document.getElementById('recent-work-container');
    if (!container) return; // Exit if the section isn't on the current page

    try {
        let response = await fetch('../js/projects.json');
        
        if (!response.ok) {
            response = await fetch('js/projects.json');
        }
        const projectData = await response.json();

        // Look for cards with a specific project ID
        document.querySelectorAll('.card[data-project-id]').forEach(card => {
            const id = card.getAttribute('data-project-id');
            const project = projectData[id];

            if (project) {
                // Injects the HTML structure automatically
                card.innerHTML = `
                    <span class="project-status ${project.statusClass}">${project.status}</span>
                    ${project.milestone ? `<div style="font-size: 0.75rem; color: #ffc107; margin-bottom: 5px;">${project.milestone}</div>` : ''}
                    <h3>${project.title}</h3>
                    <div style="margin: var(--spacing-sm) 0;">
                        <span style="font-size: 0.8rem; border: 1px solid var(--text-secondary); padding: 2px 8px; border-radius: 12px;">${project.category}</span>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--spacing-md)">${project.description}</p>
                    <div style="display: flex; gap: var(--spacing-sm);">
                        <a href="${project.link}" class="btn">View Details</a>
                    </div>
                `;
            }
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

/* Word Cycling Animation */
function initWordCycle() {
    const cycleElements = document.querySelectorAll('.cycle-word');
    const fillerWords = ["design", "chaos", "artistry", "glitch", "structure", "noise", "vision", "code"];

    cycleElements.forEach(el => {
        const finalWord = el.getAttribute('data-final');
        let cycles = 0;
        const maxCycles = 15; // Number of flips before settling

        const interval = setInterval(() => {
            el.textContent = fillerWords[Math.floor(Math.random() * fillerWords.length)];
            cycles++;

            if (cycles >= maxCycles) {
                clearInterval(interval);
                el.textContent = finalWord;
            }
        }, 500);
    });
}

/* Gallery Modal Logic */
// Toggle collapsible project details
function toggleProjectDetails(projectId) {
    const details = document.getElementById('project-details-' + projectId);
    if (details) {
        details.classList.toggle('open');
    }
}

