'use client';

import { useEffect, useRef } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';

/**
 * Component that hydrates the Zustand store from localStorage on mount
 * Should be included once in the app layout or root component
 */
export function StateHydrator() {
  const hydrate = useBuilderStore((state) => state.hydrate);
  const hasHydrated = useRef(false);

  useEffect(() => {
    // Only hydrate once
    if (!hasHydrated.current) {
      hydrate();
      hasHydrated.current = true;
    }
  }, [hydrate]);

  return null;
}
