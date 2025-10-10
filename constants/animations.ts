/**
 * Animation constants
 * Centralized animation configurations for consistent motion across the app
 */

/**
 * Animation durations (in seconds)
 */
export const ANIMATION_DURATION = {
  FAST: 0.15,
  NORMAL: 0.3,
  SLOW: 0.5,
} as const;

/**
 * Easing functions
 */
export const ANIMATION_EASING = {
  EASE_IN: [0.4, 0, 1, 1],
  EASE_OUT: [0, 0, 0.2, 1],
  EASE_IN_OUT: [0.4, 0, 0.2, 1],
  SPRING: { type: 'spring', stiffness: 300, damping: 30 },
} as const;

/**
 * Common animation variants for Framer Motion
 */
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
} as const;

/**
 * Drag transition configuration
 */
export const DRAG_TRANSITION = {
  bounceStiffness: 600,
  bounceDamping: 20,
} as const;
