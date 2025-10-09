'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * useAnnouncer Hook
 *
 * Creates an ARIA live region for announcing dynamic content changes to screen readers.
 * Useful for notifying users about async operations, status updates, etc.
 *
 * @param politeness - 'polite' (waits for user to finish) or 'assertive' (interrupts immediately)
 *
 * @example
 * const { announce } = useAnnouncer('polite');
 * announce('Block added successfully');
 */
export function useAnnouncer(politeness: 'polite' | 'assertive' = 'polite') {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    // Create live region if it doesn't exist
    let liveRegion = document.getElementById('a11y-announcer');

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-announcer';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', politeness);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    } else {
      liveRegion.setAttribute('aria-live', politeness);
    }

    if (announcement) {
      liveRegion.textContent = announcement;

      // Clear announcement after a delay
      const timeout = setTimeout(() => {
        setAnnouncement('');
        if (liveRegion) {
          liveRegion.textContent = '';
        }
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [announcement, politeness]);

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
  }, []);

  return { announce };
}
