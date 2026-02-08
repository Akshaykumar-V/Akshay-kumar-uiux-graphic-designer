/**
 * Flowing Menu - Vanilla JavaScript Implementation
 * Creates an interactive menu with animated marquee on hover
 */

class FlowingMenu {
  constructor(options = {}) {
    this.items = options.items || [];
    this.speed = options.speed || 15;
    this.textColor = options.textColor || '#ffffff';
    this.bgColor = options.bgColor || '#282828';
    this.marqueeBgColor = options.marqueeBgColor || '#FE4516';
    this.marqueeTextColor = options.marqueeTextColor || '#ffffff';
    this.borderColor = options.borderColor || 'rgba(255, 255, 255, 0.1)';
    this.featured = options.featured || 0;
    this.repetitions = 4;
    this.animations = new Map();
  }

  /**
   * Initialize the menu
   */
  init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }

    this.container = container;
    this.render();
    this.attachEventListeners();
  }

  /**
   * Render the menu HTML
   */
  render() {
    const menuHtml = `
      <div class="menu-wrap">
        <nav class="menu">
          ${this.items
            .map(
              (item, idx) => `
            <div class="menu__item ${idx === this.featured ? 'featured' : ''}" data-index="${idx}">
              <a class="menu__item-link" href="${item.link}" style="color: ${this.textColor}">
                ${item.text}
              </a>
              <div class="marquee" style="background-color: ${this.marqueeBgColor}">
                <div class="marquee__inner-wrap">
                  <div class="marquee__inner" data-marquee="${idx}">
                    ${this.generateMarqueeContent(item.text, item.image)}
                  </div>
                </div>
              </div>
            </div>
          `
            )
            .join('')}
        </nav>
      </div>
    `;

    this.container.innerHTML = menuHtml;
  }

  /**
   * Generate marquee content with repeated text and images
   */
  generateMarqueeContent(text, image) {
    let content = '';
    for (let i = 0; i < this.repetitions; i++) {
      content += `
        <div class="marquee__part" style="color: ${this.marqueeTextColor}">
          <span>${text}</span>
          <div class="marquee__img" style="background-image: url('${image}')"></div>
        </div>
      `;
    }
    return content;
  }

  /**
   * Attach event listeners to menu items
   */
  attachEventListeners() {
    const menuItems = this.container.querySelectorAll('.menu__item');

    menuItems.forEach((item, idx) => {
      item.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, item, idx));
      item.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, item, idx));
    });
  }

  /**
   * Calculate which edge the mouse is closest to
   */
  findClosestEdge(mouseX, mouseY, width, height) {
    const topEdgeDist = this.distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = this.distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  }

  /**
   * Calculate distance between two points
   */
  distMetric(x, y, x2, y2) {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  }

  /**
   * Handle mouse enter - animate marquee in
   */
  handleMouseEnter(event, item, idx) {
    const marquee = item.querySelector('.marquee');
    const marqueeInner = item.querySelector('.marquee__inner');

    if (!marquee || !marqueeInner) return;

    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const edge = this.findClosestEdge(x, y, rect.width, rect.height);

    // Kill existing animation if any
    if (this.animations.has(idx)) {
      const anim = this.animations.get(idx);
      anim.forEach((a) => a.cancel());
    }

    const animations = [];

    // Animate marquee in from edge
    const marqueeAnim = marquee.animate(
      [
        { transform: edge === 'top' ? 'translateY(-101%)' : 'translateY(101%)' },
        { transform: 'translateY(0%)' }
      ],
      { duration: 600, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
    );
    animations.push(marqueeAnim);

    // Animate inner element
    const innerAnim = marqueeInner.animate(
      [
        { transform: edge === 'top' ? 'translateY(101%)' : 'translateY(-101%)' },
        { transform: 'translateY(0%)' }
      ],
      { duration: 600, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
    );
    animations.push(innerAnim);

    // Setup continuous marquee scroll
    this.setupMarqueeScroll(marqueeInner, idx);

    this.animations.set(idx, animations);
  }

  /**
   * Handle mouse leave - animate marquee out
   */
  handleMouseLeave(event, item, idx) {
    const marquee = item.querySelector('.marquee');
    const marqueeInner = item.querySelector('.marquee__inner');

    if (!marquee || !marqueeInner) return;

    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const edge = this.findClosestEdge(x, y, rect.width, rect.height);

    // Kill existing animation
    if (this.animations.has(idx)) {
      const anim = this.animations.get(idx);
      anim.forEach((a) => a.cancel());
    }

    const animations = [];

    // Animate marquee out
    const marqueeAnim = marquee.animate(
      [
        { transform: 'translateY(0%)' },
        { transform: edge === 'top' ? 'translateY(-101%)' : 'translateY(101%)' }
      ],
      { duration: 600, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
    );
    animations.push(marqueeAnim);

    // Animate inner element out
    const innerAnim = marqueeInner.animate(
      [
        { transform: 'translateY(0%)' },
        { transform: edge === 'top' ? 'translateY(101%)' : 'translateY(-101%)' }
      ],
      { duration: 600, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
    );
    animations.push(innerAnim);

    // Reset transform
    marqueeInner.style.transform = 'translateX(0)';

    this.animations.set(idx, animations);
  }

  /**
   * Setup continuous marquee scroll animation
   */
  setupMarqueeScroll(marqueeInner, idx) {
    // Kill existing scroll animation if any
    if (this.animations.has(`scroll-${idx}`)) {
      const scrollAnim = this.animations.get(`scroll-${idx}`);
      scrollAnim.cancel();
    }

    const marqueeContent = marqueeInner.querySelector('.marquee__part');
    if (!marqueeContent) return;

    const contentWidth = marqueeContent.offsetWidth;
    if (contentWidth === 0) return;

    // Create continuous scroll animation
    const scrollAnim = marqueeInner.animate(
      [
        { transform: 'translateX(0px)' },
        { transform: `translateX(-${contentWidth}px)` }
      ],
      {
        duration: this.speed * 1000,
        iterations: Infinity,
        easing: 'linear'
      }
    );

    this.animations.set(`scroll-${idx}`, scrollAnim);
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FlowingMenu;
}
