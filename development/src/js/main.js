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
});

/* Gallery Modal Logic */
function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Close modal if clicking outside content
window.onclick = function (event) {
    const modal = document.getElementById('project-modal');
    if (event.target == modal) {
        closeProjectModal();
    }
}
