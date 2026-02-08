// ===== HERO SECTION ANIMATIONS =====

function initHeroAnimations() {
  const animated = document.querySelectorAll(".hero-animate");

  function reveal() {
    animated.forEach(el => {
      const rect = el.getBoundingClientRect();
      if(rect.top < window.innerHeight - 80) {
        el.classList.add("visible");
      }
    });
  }

  // Initial reveal after intro
  setTimeout(() => {
    reveal();
  }, 300);
  
  // Reveal on scroll
  window.addEventListener("scroll", reveal);
}
