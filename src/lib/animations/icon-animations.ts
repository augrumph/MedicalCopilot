/**
 * Icon Animation Patterns for Medical Copilot
 * Reusable animation configurations for icons and small elements
 */

// ============================================================================
// ROTATION ANIMATIONS
// ============================================================================

export const iconAnimations = {
  /**
   * Rotate 90 degrees (e.g., for settings icon)
   */
  rotate90: {
    rotate: 90,
    transition: { duration: 0.2, ease: "easeOut" }
  },

  /**
   * Rotate 180 degrees (e.g., for chevron/arrow flip)
   */
  rotate180: {
    rotate: 180,
    transition: { duration: 0.3, ease: "easeInOut" }
  },

  /**
   * Full 360 rotation (e.g., for refresh icon)
   */
  rotate360: {
    rotate: 360,
    transition: { duration: 0.4, ease: "easeInOut" }
  },

  // ============================================================================
  // SCALE ANIMATIONS
  // ============================================================================

  /**
   * Scale up (e.g., for emphasis on hover)
   */
  scale: {
    scale: 1.2,
    transition: { duration: 0.2, type: "spring", stiffness: 300, damping: 20 }
  },

  /**
   * Subtle scale (more gentle)
   */
  scaleSubtle: {
    scale: 1.1,
    transition: { duration: 0.2, type: "spring", stiffness: 300, damping: 20 }
  },

  /**
   * Scale down (e.g., for tap feedback)
   */
  scaleDown: {
    scale: 0.9,
    transition: { duration: 0.1 }
  },

  // ============================================================================
  // BOUNCE ANIMATIONS
  // ============================================================================

  /**
   * Bounce effect (e.g., for hearts, stars, likes)
   */
  bounce: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.4, ease: "easeInOut" }
  },

  /**
   * Gentle bounce
   */
  bounceGentle: {
    scale: [1, 1.1, 1],
    y: [0, -4, 0],
    transition: { duration: 0.5, ease: "easeInOut" }
  },

  // ============================================================================
  // SHAKE ANIMATIONS
  // ============================================================================

  /**
   * Shake horizontally (e.g., for delete/trash icon on hover, errors)
   */
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  },

  /**
   * Subtle shake
   */
  shakeSubtle: {
    x: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.3 }
  },

  // ============================================================================
  // SLIDE ANIMATIONS
  // ============================================================================

  /**
   * Slide right (e.g., for arrow/chevron on hover)
   */
  slideRight: {
    x: 4,
    transition: { duration: 0.2, ease: "easeOut" }
  },

  /**
   * Slide left
   */
  slideLeft: {
    x: -4,
    transition: { duration: 0.2, ease: "easeOut" }
  },

  /**
   * Slide up
   */
  slideUp: {
    y: -4,
    transition: { duration: 0.2, ease: "easeOut" }
  },

  /**
   * Slide down
   */
  slideDown: {
    y: 4,
    transition: { duration: 0.2, ease: "easeOut" }
  },

  // ============================================================================
  // PULSE ANIMATIONS
  // ============================================================================

  /**
   * Continuous pulse (for notifications, alerts)
   */
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },

  /**
   * Gentle pulse
   */
  pulseGentle: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },

  // ============================================================================
  // SPIN ANIMATIONS
  // ============================================================================

  /**
   * Continuous spin (for loading spinners)
   */
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  },

  /**
   * Slower spin
   */
  spinSlow: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  },

  // ============================================================================
  // WIGGLE ANIMATIONS
  // ============================================================================

  /**
   * Wiggle rotation (playful attention grabber)
   */
  wiggle: {
    rotate: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.5 }
  },

  // ============================================================================
  // FADE ANIMATIONS
  // ============================================================================

  /**
   * Fade in with scale (for appearing checkmarks, success icons)
   */
  fadeInScale: {
    opacity: [0, 1],
    scale: [0, 1],
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  },

  /**
   * Fade in with rotation (for success checkmarks)
   */
  fadeInRotate: {
    opacity: [0, 1],
    scale: [0, 1],
    rotate: [-180, 0],
    transition: {
      duration: 0.4,
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  }
};

// ============================================================================
// ICON HOVER PATTERNS BY CONTEXT
// ============================================================================

/**
 * Predefined hover patterns for common icon types
 */
export const iconHoverPatterns = {
  settings: iconAnimations.rotate90,
  refresh: iconAnimations.rotate360,
  chevronRight: iconAnimations.slideRight,
  chevronLeft: iconAnimations.slideLeft,
  chevronUp: iconAnimations.slideUp,
  chevronDown: iconAnimations.slideDown,
  delete: iconAnimations.shakeSubtle,
  trash: iconAnimations.shakeSubtle,
  heart: iconAnimations.bounce,
  star: iconAnimations.bounce,
  check: iconAnimations.scaleSubtle,
  close: iconAnimations.rotate90,
  expand: iconAnimations.scale,
  collapse: iconAnimations.scaleDown
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a custom rotation animation
 */
export const createRotation = (degrees: number, duration: number = 0.3) => ({
  rotate: degrees,
  transition: { duration, ease: "easeOut" }
});

/**
 * Create a custom scale animation
 */
export const createScale = (scale: number, duration: number = 0.2) => ({
  scale,
  transition: { duration, type: "spring", stiffness: 300, damping: 20 }
});

/**
 * Create a custom slide animation
 */
export const createSlide = (
  axis: 'x' | 'y',
  distance: number,
  duration: number = 0.2
) => ({
  [axis]: distance,
  transition: { duration, ease: "easeOut" }
});
