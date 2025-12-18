import { useReducedMotion } from 'framer-motion';
import { Transition } from 'framer-motion';

/**
 * Custom hook to manage animations with accessibility support
 * Respects user's prefers-reduced-motion preference
 */
export const useAnimations = () => {
  const prefersReducedMotion = useReducedMotion();

  // ============================================================================
  // HOVER ANIMATIONS
  // ============================================================================

  const hoverAnimation = prefersReducedMotion
    ? {}
    : {
        scale: 1.02,
        transition: { duration: 0.2 }
      };

  const hoverAnimationSubtle = prefersReducedMotion
    ? {}
    : {
        scale: 1.005,
        transition: { duration: 0.2 }
      };

  const hoverAnimationLarge = prefersReducedMotion
    ? {}
    : {
        scale: 1.03,
        y: -2,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      };

  // ============================================================================
  // TAP ANIMATIONS
  // ============================================================================

  const tapAnimation = prefersReducedMotion
    ? {}
    : {
        scale: 0.98,
        transition: { duration: 0.1 }
      };

  const tapAnimationLarge = prefersReducedMotion
    ? {}
    : {
        scale: 0.97,
        transition: { duration: 0.1 }
      };

  // ============================================================================
  // FADE ANIMATIONS
  // ============================================================================

  const fadeInAnimation = prefersReducedMotion
    ? { opacity: 1 }
    : {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
      };

  const fadeInInitial = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 0, y: 20 };

  // ============================================================================
  // CARD ANIMATIONS
  // ============================================================================

  const cardHoverAnimation = prefersReducedMotion
    ? {}
    : {
        y: -4,
        scale: 1.005,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      };

  // ============================================================================
  // LIST ANIMATIONS
  // ============================================================================

  const listContainerVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 }
      }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.07,
            delayChildren: 0.1
          }
        }
      };

  const listItemVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 }
      }
    : {
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
  // SPRING TRANSITIONS
  // ============================================================================

  const springTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 400, damping: 25 };

  const gentleSpring: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 200, damping: 20 };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  /**
   * Get animation props conditionally based on reduced motion preference
   */
  const getAnimationProps = (
    hover?: any,
    tap?: any,
    transition?: Transition
  ) => {
    if (prefersReducedMotion) {
      return {};
    }
    return {
      whileHover: hover,
      whileTap: tap,
      transition: transition || { duration: 0.2 }
    };
  };

  /**
   * Get transition duration (0 if reduced motion is preferred)
   */
  const getDuration = (duration: number) => {
    return prefersReducedMotion ? 0 : duration;
  };

  // ============================================================================
  // RETURN VALUES
  // ============================================================================

  return {
    // Flags
    shouldAnimate: !prefersReducedMotion,
    prefersReducedMotion,

    // Hover animations
    hoverAnimation,
    hoverAnimationSubtle,
    hoverAnimationLarge,

    // Tap animations
    tapAnimation,
    tapAnimationLarge,

    // Fade animations
    fadeInAnimation,
    fadeInInitial,

    // Card animations
    cardHoverAnimation,

    // List animations
    listContainerVariants,
    listItemVariants,

    // Transitions
    springTransition,
    gentleSpring,

    // Utility functions
    getAnimationProps,
    getDuration
  };
};

/**
 * Hook for conditional animation rendering
 * Returns empty object if reduced motion is preferred, otherwise returns the provided animation
 */
export const useConditionalAnimation = <T extends Record<string, any>>(
  animation: T
): T | Record<string, never> => {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? {} : animation;
};
