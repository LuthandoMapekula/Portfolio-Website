document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website loaded');

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

