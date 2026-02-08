// ===== MAGNETIC CURSOR =====
(function() {
  const dot = document.getElementById('cursorDot');
  const circle = document.getElementById('cursorCircle');
  if (!dot || !circle) return;

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let circleX = 0, circleY = 0;
  let magnetX = 0, magnetY = 0;
  let isMagnetic = false;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth animation loop for both dot and circle
  function animate() {
    // Dot follows with slight smoothing
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;
    dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;

    // Circle follows with more lag for smooth trailing
    if (isMagnetic) {
      circleX += (magnetX - circleX) * 0.15;
      circleY += (magnetY - circleY) * 0.15;
    } else {
      circleX += (mouseX - circleX) * 0.1;
      circleY += (mouseY - circleY) * 0.1;
    }
    circle.style.transform = `translate(${circleX - 20}px, ${circleY - 20}px)`;

    requestAnimationFrame(animate);
  }
  animate();

  // Interactive elements
  const interactiveEls = document.querySelectorAll('a, button, .service-card, .skill-tag, .hire-me-badge, .social-icon, .view-project-btn, .nav-btn');

  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      circle.classList.add('hover');
      isMagnetic = true;
    });

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      magnetX = rect.left + rect.width / 2;
      magnetY = rect.top + rect.height / 2;
    });

    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      circle.classList.remove('hover');
      isMagnetic = false;
    });
  });

  // Text elements - bigger cursor effect
  const textEls = document.querySelectorAll('h1, h2, h3, .hero-title, .projects-title, .cta-title');
  textEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      circle.classList.add('text-hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      circle.classList.remove('text-hover');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.classList.add('hidden');
    circle.classList.add('hidden');
  });
  document.addEventListener('mouseenter', () => {
    dot.classList.remove('hidden');
    circle.classList.remove('hidden');
  });
})();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// ===== SKILL TAGS SCROLL-LINKED FALLING ANIMATION =====
function initSkillTagsScrollAnimation() {
  const skillTagsSection = document.querySelector('.hero-skills-section');
  const skillTags = document.querySelectorAll('.skill-tag');
  
  if (!skillTagsSection || skillTags.length === 0) return;

  let animationStarted = false;

  window.addEventListener('scroll', () => {
    const sectionRect = skillTagsSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Check if section is in viewport
    if (sectionRect.top < windowHeight && sectionRect.bottom > 0) {
      if (!animationStarted) {
        skillTags.forEach(tag => tag.classList.add('visible'));
        animationStarted = true;
      }

      // Calculate scroll progress for this section (0 to 1)
      const sectionTop = sectionRect.top;
      const scrollProgress = Math.max(0, (windowHeight - sectionTop) / windowHeight);
      
      // Apply falling effect based on scroll progress
      skillTags.forEach((tag, index) => {
        const staggerDelay = index * 0.08; // Stagger each tag
        const fallProgress = Math.max(0, scrollProgress - staggerDelay);
        
        // Fall from -50px to 0px based on scroll
        const translateY = -50 + (fallProgress * 50);
        tag.style.transform = `translateY(${translateY}px)`;
      });
    }
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initSkillTagsScrollAnimation);

// ===== TYPING ANIMATION FOR QUOTE TEXT =====
function initQuoteTypingAnimation() {
  const quoteText = document.querySelector('.quote-text');
  if (!quoteText) return;

  const fullText = quoteText.getAttribute('data-text');
  if (!fullText) return;

  let charIndex = 0;

  const typeCharacter = () => {
    if (charIndex < fullText.length) {
      quoteText.textContent = fullText.substring(0, charIndex + 1);
      charIndex++;
      
      // Remove old cursor
      const oldCursor = quoteText.querySelector('.quote-cursor');
      if (oldCursor) oldCursor.remove();
      
      // Add cursor while typing
      const cursorSpan = document.createElement('span');
      cursorSpan.className = 'quote-cursor';
      quoteText.appendChild(cursorSpan);
      
      setTimeout(typeCharacter, 50); // Typing speed
    } else {
      // Remove cursor when done
      const cursor = quoteText.querySelector('.quote-cursor');
      if (cursor) cursor.remove();
    }
  };

  // Start typing after title animation completes (~5.3s)
  // Title starts at 3.9s, 16 chars * 50ms stagger = 750ms + 600ms duration = 5.25s + buffer
  setTimeout(() => {
    typeCharacter();
  }, 5300);
}

// Initialize typing animation on DOM load
document.addEventListener('DOMContentLoaded', initQuoteTypingAnimation);

// ===== ROTATING TEXT ANIMATION FOR HERO TITLE =====
function initRotatingText() {
  const container = document.getElementById('rotatingText');
  if (!container) return;

  const texts = [
    'UI/UX Designer',
    'Digital Product Designer',
    'UI/UX & Visual Designer',
    'Interface & Visual Designer'
  ];

  const rotationInterval = 7000;
  const staggerDuration = 30; // ms between each character
  let currentIndex = 0;

  function createChars(text) {
    container.innerHTML = '';
    return text.split('').map((char, i) => {
      const span = document.createElement('span');
      span.className = char === ' ' ? 'char space' : 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.transitionDelay = `${i * staggerDuration}ms`;
      container.appendChild(span);
      return span;
    });
  }

  function animateIn(chars) {
    requestAnimationFrame(() => {
      chars.forEach(char => char.classList.add('animate-in'));
    });
  }

  function animateOut(chars) {
    return new Promise(resolve => {
      chars.forEach(char => {
        char.classList.remove('animate-in');
        char.classList.add('animate-out');
      });
      const totalDelay = chars.length * staggerDuration + 400;
      setTimeout(resolve, totalDelay);
    });
  }

  async function rotate() {
    // Create and animate in
    const chars = createChars(texts[currentIndex]);
    await new Promise(r => setTimeout(r, 50));
    animateIn(chars);

    // Wait for display duration
    await new Promise(r => setTimeout(r, rotationInterval));

    // Animate out
    await animateOut(chars);

    // Next text
    currentIndex = (currentIndex + 1) % texts.length;
    rotate();
  }

  // Start after intro animation (4s delay)
  setTimeout(() => rotate(), 4000);
}

document.addEventListener('DOMContentLoaded', initRotatingText);

// ===== SERVICES SECTION SCROLL ANIMATION =====
function initServicesAnimation() {
  const serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate each card with stagger
        serviceCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('visible');
          }, index * 150); // 150ms stagger between cards
        });
        // Stop observing after animation
        observer.unobserve(entry.target.closest('.services-container'));
      }
    });
  }, {
    threshold: 0.8
  });

  const servicesContainer = document.querySelector('.services-container');
  if (servicesContainer) {
    observer.observe(servicesContainer);
  }
}

// Initialize services animation on DOM load
document.addEventListener('DOMContentLoaded', initServicesAnimation);

// ===== ABOUT SECTION STATS & BUTTONS ANIMATION =====
function initAboutStatsAnimation() {
  const statItems = document.querySelectorAll('.stat-item');
  const aboutButtons = document.querySelectorAll('.about-btn');
  
  if (statItems.length === 0 && aboutButtons.length === 0) return;

  const aboutSection = document.querySelector('.about');
  if (!aboutSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate stats with stagger
        statItems.forEach((stat, index) => {
          setTimeout(() => {
            stat.classList.add('visible');
            
            // Count-up animation for numbers
            const numberElement = stat.querySelector('.stat-number');
            if (numberElement) {
              const text = numberElement.textContent;
              const number = parseInt(text);
              animateCountUp(numberElement, number, 1500);
            }
          }, index * 150); // 150ms stagger
        });

        // Animate buttons with stagger
        aboutButtons.forEach((btn, index) => {
          setTimeout(() => {
            btn.classList.add('visible');
          }, statItems.length * 150 + index * 100); // After stats finish
        });

        // Stop observing after animation
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.8
  });

  observer.observe(aboutSection);
}

// Count-up animation for numbers
function animateCountUp(element, finalNumber, duration = 1500) {
  let startNumber = 0;
  const startTimestamp = Date.now();

  const updateNumber = () => {
    const elapsed = Date.now() - startTimestamp;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentNumber = Math.floor(startNumber + (finalNumber - startNumber) * easeOut);
    
    element.textContent = currentNumber + '+';
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = finalNumber + '+';
    }
  };

  updateNumber();
}

// Initialize about stats animation on DOM load
document.addEventListener('DOMContentLoaded', initAboutStatsAnimation);

// CTA Slider Functionality
const ctaSlider = document.getElementById('ctaSlider');
const sliderHandle = ctaSlider.querySelector('.cta-slider-handle');
const sliderFill = ctaSlider.querySelector('.cta-slider-fill');
const sliderRect = ctaSlider.getBoundingClientRect();
let isSliding = false;
let sliderWidth = ctaSlider.offsetWidth;

sliderHandle.addEventListener('mousedown', () => {
  isSliding = true;
});

document.addEventListener('mouseup', () => {
  isSliding = false;
  if (parseFloat(sliderFill.style.width) >= 95) {
    sliderFill.style.width = '100%';
    sliderHandle.style.left = (sliderWidth - 55) + 'px';
    ctaSlider.classList.add('active');
    window.open('https://wa.me/919019021939?text=Hi%20Akshay!%20I%20visited%20your%20portfolio%20and%20I%27d%20like%20to%20discuss%20a%20project%20with%20you.', '_blank');
  } else {
    sliderFill.style.width = '0%';
    sliderHandle.style.left = '5px';
    ctaSlider.classList.remove('active');
  }
});

document.addEventListener('mousemove', (e) => {
  if (!isSliding) return;
  
  const rect = ctaSlider.getBoundingClientRect();
  let x = e.clientX - rect.left;
  
  if (x < 5) x = 5;
  if (x > sliderWidth - 55) x = sliderWidth - 55;
  
  sliderHandle.style.left = x + 'px';
  
  const fillPercent = ((x - 5) / (sliderWidth - 60)) * 100;
  sliderFill.style.width = fillPercent + '%';
  
  if (fillPercent >= 95) {
    ctaSlider.classList.add('active');
  } else {
    ctaSlider.classList.remove('active');
  }
});

// Add hover effects to buttons
const buttons = document.querySelectorAll('.nav-btn, .skill-tag');
buttons.forEach(button => {
  button.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px)';
  });
  button.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});

// Social icons are now <a> tags with direct links — no JS needed

// Add parallax effect to semicircle
window.addEventListener('scroll', function() {
  const circle = document.querySelector('.hero-semicircle');
  if (!circle) return;
  const scrolled = window.pageYOffset;
  circle.style.transform = `translateX(-50%) translateY(${scrolled * 0.3}px)`;
});
