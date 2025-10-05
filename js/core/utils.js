/**
 * Utility functions for English Grammar Games
 * Shared helper functions used across all exercise types
 */

const Utils = {
  /**
   * Normalize text for comparison (lowercase, trim, remove extra spaces, punctuation)
   * @param {string} text - Text to normalize
   * @returns {string} - Normalized text
   */
  normalizeText(text) {
    if (typeof text !== 'string') return '';

    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[.,!?;:'"]/g, '');
  },

  /**
   * Compare two strings with normalization
   * @param {string} str1 - First string
   * @param {string} str2 - Second string
   * @returns {boolean} - True if strings match
   */
  compareAnswers(str1, str2) {
    return this.normalizeText(str1) === this.normalizeText(str2);
  },

  /**
   * Check if user answer matches any accepted answer
   * @param {string} userAnswer - User's answer
   * @param {Array<string>} acceptedAnswers - Array of accepted answers
   * @returns {boolean} - True if answer is correct
   */
  validateAnswer(userAnswer, acceptedAnswers) {
    if (!Array.isArray(acceptedAnswers)) {
      acceptedAnswers = [acceptedAnswers];
    }

    const normalized = this.normalizeText(userAnswer);
    return acceptedAnswers.some(answer =>
      this.normalizeText(answer) === normalized
    );
  },

  /**
   * Shuffle array (Fisher-Yates algorithm)
   * @param {Array} array - Array to shuffle
   * @returns {Array} - Shuffled array (new array, doesn't mutate original)
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * Create HTML element with attributes and content
   * @param {string} tag - HTML tag name
   * @param {Object} attributes - Element attributes {class, id, etc.}
   * @param {string|HTMLElement|Array} content - Element content
   * @returns {HTMLElement} - Created element
   */
  createElement(tag, attributes = {}, content = null) {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'class') {
        element.className = value;
      } else if (key === 'dataset') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else {
        element.setAttribute(key, value);
      }
    });

    if (content !== null) {
      if (typeof content === 'string') {
        element.textContent = content;
      } else if (Array.isArray(content)) {
        content.forEach(child => {
          if (child instanceof HTMLElement) {
            element.appendChild(child);
          }
        });
      } else if (content instanceof HTMLElement) {
        element.appendChild(content);
      }
    }

    return element;
  },

  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} - Debounced function
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Format time in seconds to MM:SS
   * @param {number} seconds - Time in seconds
   * @returns {string} - Formatted time string
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  /**
   * Calculate percentage
   * @param {number} value - Current value
   * @param {number} total - Total value
   * @returns {number} - Percentage (0-100)
   */
  calculatePercentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  },

  /**
   * Get star rating based on score percentage
   * @param {number} percentage - Score percentage (0-100)
   * @returns {number} - Number of stars (0-3)
   */
  getStarRating(percentage) {
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  },

  /**
   * Show toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type of toast (success, error, info)
   * @param {number} duration - Duration in ms (default 3000)
   */
  showToast(message, type = 'info', duration = 3000) {
    const TOAST_TYPES = {
      SUCCESS: 'success',
      ERROR: 'error',
      INFO: 'info'
    };

    const toast = this.createElement('div', {
      class: `toast toast--${type} fade-in`
    }, message);

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} - Escaped text
   */
  escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Deep clone object (simple implementation)
   * @param {Object} obj - Object to clone
   * @returns {Object} - Cloned object
   */
  cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Generate unique ID
   * @returns {string} - Unique ID
   */
  generateId() {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Check if string is empty or whitespace only
   * @param {string} str - String to check
   * @returns {boolean} - True if empty
   */
  isEmpty(str) {
    return !str || str.trim().length === 0;
  },

  /**
   * Highlight text in a string (wrap in span)
   * @param {string} text - Full text
   * @param {string} highlight - Text to highlight
   * @returns {string} - HTML string with highlighted text
   */
  highlightText(text, highlight) {
    if (!highlight || !text) return this.escapeHTML(text);

    const escapedText = this.escapeHTML(text);
    const escapedHighlight = this.escapeHTML(highlight);
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');

    return escapedText.replace(regex, '<mark>$1</mark>');
  },

  /**
   * Play sound effect
   * @param {string} soundName - Name of sound file (correct, wrong, complete)
   */
  playSound(soundName) {
    const SOUND_ENABLED_KEY = 'soundEnabled';
    const soundEnabled = localStorage.getItem(SOUND_ENABLED_KEY);

    if (soundEnabled === 'false') return;

    try {
      const audio = new Audio(`../sound/${soundName}.mp3`);
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Silently fail if audio can't play
      });
    } catch (error) {
      // Silently fail if sound file doesn't exist
    }
  },

  /**
   * Animate element with CSS class
   * @param {HTMLElement} element - Element to animate
   * @param {string} animationClass - CSS animation class
   * @param {Function} callback - Callback after animation
   */
  animate(element, animationClass, callback = null) {
    element.classList.add(animationClass);

    const handleAnimationEnd = () => {
      element.classList.remove(animationClass);
      element.removeEventListener('animationend', handleAnimationEnd);
      if (callback) callback();
    };

    element.addEventListener('animationend', handleAnimationEnd);
  },

  /**
   * Scroll to element smoothly
   * @param {HTMLElement} element - Element to scroll to
   * @param {number} offset - Offset in pixels
   */
  scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  },

  /**
   * Check if element is in viewport
   * @param {HTMLElement} element - Element to check
   * @returns {boolean} - True if in viewport
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Parse template string with placeholders
   * Template: "Hello _1_, you are _2_ years old"
   * Data: ['John', 25]
   * Result: "Hello John, you are 25 years old"
   * @param {string} template - Template string with _1_, _2_, etc.
   * @param {Array} data - Array of values to replace
   * @returns {string} - Parsed string
   */
  parseTemplate(template, data) {
    let result = template;
    data.forEach((value, index) => {
      const placeholder = `_${index + 1}_`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });
    return result;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
