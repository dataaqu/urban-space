import { Variants, Transition } from 'framer-motion';

// ===================================
// TRANSITION PRESETS
// ===================================

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const smoothTransition: Transition = {
  type: 'tween',
  ease: [0.19, 1, 0.22, 1], // expo.out
  duration: 0.6,
};

export const quickTransition: Transition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.3,
};

// ===================================
// FADE ANIMATIONS
// ===================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: smoothTransition,
  },
};

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

// ===================================
// SLIDE ANIMATIONS
// ===================================

export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
};

export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
};

// ===================================
// SCALE ANIMATIONS
// ===================================

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
};

export const scaleInCenter: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
};

// ===================================
// STAGGER CONTAINER
// ===================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// ===================================
// STAGGER CHILDREN
// ===================================

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

export const staggerItemScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
};

// ===================================
// SCROLL REVEAL ANIMATIONS
// ===================================

export const scrollReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween',
      ease: [0.19, 1, 0.22, 1],
      duration: 0.8,
    },
  },
};

export const scrollRevealLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'tween',
      ease: [0.19, 1, 0.22, 1],
      duration: 0.8,
    },
  },
};

export const scrollRevealRight: Variants = {
  hidden: {
    opacity: 0,
    x: 80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'tween',
      ease: [0.19, 1, 0.22, 1],
      duration: 0.8,
    },
  },
};

// ===================================
// PARALLAX ANIMATIONS
// ===================================

export const parallaxUp = (distance: number = 50): Variants => ({
  hidden: { y: distance },
  visible: { y: -distance },
});

export const parallaxDown = (distance: number = 50): Variants => ({
  hidden: { y: -distance },
  visible: { y: distance },
});

// ===================================
// HOVER ANIMATIONS
// ===================================

export const hoverScale = {
  scale: 1.02,
  transition: quickTransition,
};

export const hoverScaleLarge = {
  scale: 1.05,
  transition: quickTransition,
};

export const tapScale = {
  scale: 0.98,
};

export const hoverLift = {
  y: -8,
  transition: quickTransition,
};

// ===================================
// TEXT ANIMATIONS
// ===================================

export const textReveal: Variants = {
  hidden: {
    opacity: 0,
    y: '100%',
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'tween',
      ease: [0.19, 1, 0.22, 1],
      duration: 0.8,
    },
  },
};

export const letterStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export const letterItem: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
};

// ===================================
// IMAGE ANIMATIONS
// ===================================

export const imageReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'tween',
      ease: [0.19, 1, 0.22, 1],
      duration: 1,
    },
  },
};

export const imageZoom: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.6,
      ease: [0.19, 1, 0.22, 1],
    },
  },
};

// ===================================
// CARD ANIMATIONS
// ===================================

export const cardHover: Variants = {
  rest: {
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
  },
  hover: {
    y: -8,
    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(212, 160, 39, 0.1)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
};

// ===================================
// LINE ANIMATIONS
// ===================================

export const lineExpand: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      type: 'tween',
      ease: [0.19, 1, 0.22, 1],
      duration: 0.6,
    },
  },
};

export const lineExpandVertical: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: {
      type: 'tween',
      ease: [0.19, 1, 0.22, 1],
      duration: 0.6,
    },
  },
};

// ===================================
// NAVIGATION ANIMATIONS
// ===================================

export const navItem: Variants = {
  rest: {
    opacity: 0.8,
  },
  hover: {
    opacity: 1,
    transition: quickTransition,
  },
};

export const navUnderline: Variants = {
  rest: {
    scaleX: 0,
    originX: 0,
  },
  hover: {
    scaleX: 1,
    transition: {
      type: 'tween',
      ease: [0.19, 1, 0.22, 1],
      duration: 0.3,
    },
  },
};

// ===================================
// BUTTON ANIMATIONS
// ===================================

export const buttonPress = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

export const buttonHover = {
  scale: 1.02,
  transition: quickTransition,
};

export const iconSlide: Variants = {
  rest: { x: 0 },
  hover: {
    x: 4,
    transition: quickTransition,
  },
};

export const iconBounce: Variants = {
  rest: { y: 0 },
  hover: {
    y: [-2, 2, -2],
    transition: {
      duration: 0.6,
      repeat: Infinity,
    },
  },
};

// ===================================
// UTILITY FUNCTIONS
// ===================================

export const createDelayedVariant = (
  baseVariant: Variants,
  delay: number
): Variants => {
  return {
    ...baseVariant,
    visible: {
      ...(baseVariant.visible as object),
      transition: {
        ...((baseVariant.visible as { transition?: object })?.transition || {}),
        delay,
      },
    },
  };
};

export const createStaggerDelay = (index: number, baseDelay: number = 0.1) => ({
  delay: index * baseDelay,
});

// ===================================
// VIEWPORT SETTINGS
// ===================================

export const viewportOnce = {
  once: true,
  amount: 0.2,
};

export const viewportRepeating = {
  once: false,
  amount: 0.3,
};

export const viewportFull = {
  once: true,
  amount: 0.8,
};
