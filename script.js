/**
 * SIDC.AI - Triad Portfolio Controller
 * Mobile-First 45-Second Experience
 */

class TriadController {
  constructor() {
    this.screens = document.querySelectorAll('.screen');
    this.progressIndicator = document.getElementById('mobile-progress');
    this.currentScreen = 1;

    this.init();
  }

  init() {
    this.setupScrollObserver();
    this.setupTriadInteractions();
  }

  setupScrollObserver() {
    const options = {
      root: null,
      threshold: 0.5 // Trigger when 50% visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add in-view class for animations
          entry.target.classList.add('in-view');

          // Update progress indicator
          const screenNumber = entry.target.dataset.screen;
          if (screenNumber) {
            this.currentScreen = parseInt(screenNumber);
            this.updateProgress();
          }
        }
      });
    }, options);

    this.screens.forEach(screen => {
      observer.observe(screen);
    });
  }

  updateProgress() {
    if (this.progressIndicator) {
      const total = this.screens.length;
      this.progressIndicator.textContent = `0${this.currentScreen} / 0${total}`;
    }
  }

  setupTriadInteractions() {
    // Triad node hover effects
    const triadNodes = document.querySelectorAll('.triad-node-circle');
    const triadCards = document.querySelectorAll('.triad-card');

    triadNodes.forEach((node, index) => {
      node.addEventListener('mouseenter', () => {
        if (triadCards[index]) {
          triadCards[index].style.transform = 'scale(1.02)';
          triadCards[index].style.borderColor = 'var(--accent)';
        }
      });

      node.addEventListener('mouseleave', () => {
        if (triadCards[index]) {
          triadCards[index].style.transform = 'scale(1)';
          triadCards[index].style.borderColor = 'var(--gray-2)';
        }
      });
    });

    // Card click to highlight corresponding node
    triadCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        // Remove active class from all
        triadCards.forEach(c => c.classList.remove('active'));
        triadNodes.forEach(n => n.classList.remove('active'));

        // Add active class to clicked
        card.classList.add('active');
        if (triadNodes[index]) {
          triadNodes[index].classList.add('active');
        }
      });
    });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.triadController = new TriadController();
  console.log('Triad Portfolio loaded.');
});