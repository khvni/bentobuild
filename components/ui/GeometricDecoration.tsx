'use client';

import { motion } from 'framer-motion';

interface GeometricDecorationProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  variant?: 'circle' | 'square' | 'triangle' | 'rectangle';
  color?: 'red' | 'yellow' | 'blue' | 'black';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

const colorMap = {
  red: '#E63946',
  yellow: '#F1C40F',
  blue: '#2563EB',
  black: '#000000',
};

const sizeMap = {
  sm: 40,
  md: 60,
  lg: 80,
  xl: 120,
};

const positionClasses = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-right': 'bottom-0 right-0',
};

export default function GeometricDecoration({
  position,
  variant = 'circle',
  color = 'red',
  size = 'md',
  animated = true,
}: GeometricDecorationProps) {
  const colorValue = colorMap[color];
  const sizeValue = sizeMap[size];

  const renderShape = () => {
    const baseStyle = {
      backgroundColor: colorValue,
    };

    switch (variant) {
      case 'circle':
        return (
          <div
            className="rounded-full"
            style={{
              ...baseStyle,
              width: `${sizeValue}px`,
              height: `${sizeValue}px`,
            }}
          />
        );

      case 'square':
        return (
          <div
            className="rounded-bauhaus-sm"
            style={{
              ...baseStyle,
              width: `${sizeValue}px`,
              height: `${sizeValue}px`,
            }}
          />
        );

      case 'triangle':
        const triangleStyle = position.includes('top')
          ? {
              borderLeft: `${sizeValue / 2}px solid transparent`,
              borderRight: `${sizeValue / 2}px solid transparent`,
              borderBottom: `${sizeValue}px solid ${colorValue}`,
            }
          : {
              borderLeft: `${sizeValue / 2}px solid transparent`,
              borderRight: `${sizeValue / 2}px solid transparent`,
              borderTop: `${sizeValue}px solid ${colorValue}`,
            };

        return (
          <div
            style={{
              width: 0,
              height: 0,
              ...triangleStyle,
            }}
          />
        );

      case 'rectangle':
        const isVertical = position.includes('left') || position.includes('right');
        return (
          <div
            className="rounded-bauhaus-sm"
            style={{
              ...baseStyle,
              width: isVertical ? `${sizeValue / 2}px` : `${sizeValue * 1.5}px`,
              height: isVertical ? `${sizeValue * 1.5}px` : `${sizeValue / 2}px`,
            }}
          />
        );

      default:
        return null;
    }
  };

  const getAnimationProps = () => {
    if (!animated) return {};

    const animations = {
      'top-left': {
        initial: { x: -20, y: -20, opacity: 0, rotate: -45 },
        animate: { x: 0, y: 0, opacity: 0.9, rotate: 0 },
      },
      'top-right': {
        initial: { x: 20, y: -20, opacity: 0, rotate: 45 },
        animate: { x: 0, y: 0, opacity: 0.9, rotate: 0 },
      },
      'bottom-left': {
        initial: { x: -20, y: 20, opacity: 0, rotate: -45 },
        animate: { x: 0, y: 0, opacity: 0.9, rotate: 0 },
      },
      'bottom-right': {
        initial: { x: 20, y: 20, opacity: 0, rotate: 45 },
        animate: { x: 0, y: 0, opacity: 0.9, rotate: 0 },
      },
    };

    return animations[position];
  };

  return (
    <motion.div
      className={`absolute ${positionClasses[position]} pointer-events-none z-10`}
      aria-hidden="true"
      {...getAnimationProps()}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {renderShape()}
    </motion.div>
  );
}
