import { Variants } from 'framer-motion';

/**
 * Animação para entrada de cards com stagger
 */
export const cardEntry: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

/**
 * Animação para hover de card
 */
export const cardHover: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    y: -8,
    scale: 1.01,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
  tap: {
    scale: 0.98,
  },
};

/**
 * Animação para transição de nodes (Otimizada para ambiente hospitalar)
 */
export const nodeTransition: Variants = {
  initial: {
    opacity: 0,
    x: 10,
    scale: 0.99,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.1,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    x: -10,
    scale: 0.99,
    transition: {
      duration: 0.075,
    },
  },
};

/**
 * Animação para toggle de filtros
 */
export const filterToggle: Variants = {
  inactive: {
    scale: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  active: {
    scale: 1,
    backgroundColor: 'rgba(140, 0, 255, 0.1)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  },
};

/**
 * Animação para preenchimento de barra de progresso
 */
export const progressFill = {
  initial: { width: '0%' },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

/**
 * Animação de pulse/glow para itens críticos
 */
export const pulseGlow: Variants = {
  initial: {
    boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.7)',
  },
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(220, 38, 38, 0.7)',
      '0 0 0 10px rgba(220, 38, 38, 0)',
      '0 0 0 0 rgba(220, 38, 38, 0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
};

/**
 * Animação shimmer para loading states
 */
export const shimmer: Variants = {
  initial: {
    backgroundPosition: '-200% 0',
  },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Animação de sucesso (burst)
 */
export const successBurst: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
    rotate: -180,
  },
  visible: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

/**
 * Animação de erro (shake)
 */
export const errorShake: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
    },
  },
};

/**
 * Animação para chips de filtros ativos
 */
export const filterChip: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Variantes para stagger de lista (Otimizada para velocidade)
 */
export const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.015,
    },
  },
};

export const listItem: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.08,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Animação para fade in com scale
 */
export const fadeInScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Animação para overlay de hover em cards
 */
export const overlayFade: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Spring transition configuration (reutilizável)
 */
export const springConfig = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 24,
};

/**
 * Spring transition suave
 */
export const gentleSpring = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 20,
};

/**
 * Spring transition bouncy
 */
export const bouncySpring = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 17,
};
