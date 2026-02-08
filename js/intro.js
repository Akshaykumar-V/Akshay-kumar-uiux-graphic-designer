// ===== INTRO ANIMATION SCRIPT =====

// Hide intro and show main content with animations
function initIntro() {
  setTimeout(() => {
    const introSection = document.getElementById('intro');
    if (introSection) {
      introSection.classList.add('hidden');
    }
  }, 3000); // 3 seconds for intro animation
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initIntro);
