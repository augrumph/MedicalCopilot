import { Variants, Transition } from 'framer-motion';

/**
 * Animation Variants Library for Medical Copilot
 * Centralized animation configurations for consistent UI/UX
 */

// ============================================================================
// LIST ANIMATIONS (Stagger effects)
// ============================================================================

export const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1
    }
  }
};

export const listItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

// ============================================================================
// FADE ANIMATIONS
// ============================================================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

// ============================================================================
// SCALE ANIMATIONS
// ============================================================================

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

// ============================================================================
// SLIDE ANIMATIONS
// ============================================================================

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

// ============================================================================
// BUTTON HOVER VARIANTS (Moderate intensity)
// ============================================================================

export const buttonHover = {
  default: {
    scale: 1.01,
    y: -1,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  },
  large: {
    scale: 1.02,
    y: -2,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  },
  subtle: {
    scale: 1.005,
    y: -0.5,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  }
};

export const buttonTap = {
  default: {
    scale: 0.98,
    y: 0,
    transition: { duration: 0.1 }
  },
  large: {
    scale: 0.97,
    y: 0,
    transition: { duration: 0.1 }
  }
};

// ============================================================================
// CARD HOVER VARIANTS
// ============================================================================

export const cardHover = {
  static: {
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 }
  },
  interactive: {
    y: -4,
    scale: 1.005,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
  elevated: {
    y: -6,
    scale: 1.01,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

// ============================================================================
// SPRING CONFIGURATIONS
// ============================================================================

export const springs = {
  gentle: {
    type: "spring" as const,
    stiffness: 200,
    damping: 20
  },
  bouncy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 17
  },
  snappy: {
    type: "spring" as const,
    stiffness: 500,
    damping: 25
  },
  smooth: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30
  }
};

// ============================================================================
// EASING CURVES
// ============================================================================

export const easings = {
  easeOutCubic: [0.33, 1, 0.68, 1] as [number, number, number, number],
  easeInOutCubic: [0.65, 0, 0.35, 1] as [number, number, number, number],
  anticipate: [0.43, 0.13, 0.23, 0.96] as [number, number, number, number]
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a custom hover state with specified parameters
 */
export const createHoverState = (
  scale: number = 1.02,
  y: number = -2,
  shadow?: string
): Record<string, any> => ({
  scale,
  y,
  ...(shadow && { boxShadow: shadow }),
  transition: { type: "spring", stiffness: 400, damping: 25 }
});

/**
 * Create a custom tap state
 */
export const createTapState = (scale: number = 0.98): Record<string, any> => ({
  scale,
  transition: { duration: 0.1 }
});

/**
 * Create stagger animation for list children
 */
export const createStagger = (
  staggerDelay: number = 0.07,
  childDelay: number = 0.1
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: childDelay
    }
  }
});

/**
 * Compose animation properties
 */
export const composeAnimation = (
  hover?: any,
  tap?: any,
  transition?: Transition
) => ({
  whileHover: hover,
  whileTap: tap,
  transition: transition || { duration: 0.2 }
});
