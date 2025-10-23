import { useState } from 'react';
import { Component } from '@/types/canvas.types';

/**
 * Hook for managing AI generation modal state
 *
 * Provides centralized state management for the GenerateModal component.
 * Tracks which component is being generated and modal open/close state.
 *
 * @returns Modal state and control functions
 *
 * @example
 * ```typescript
 * const { isOpen, activeComponent, openModal, closeModal } = useGenerateModal();
 *
 * // Open modal for a specific component
 * openModal(component, sectionId);
 *
 * // Close modal
 * closeModal();
 *
 * // Render modal conditionally
 * {isOpen && activeComponent && (
 *   <GenerateModal
 *     component={activeComponent.component}
 *     sectionId={activeComponent.sectionId}
 *     onClose={closeModal}
 *   />
 * )}
 * ```
 */
export function useGenerateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<{
    component: Component;
    sectionId: string;
  } | null>(null);

  /**
   * Open the generation modal for a specific component
   *
   * @param component - Component to generate content for
   * @param sectionId - ID of the section containing the component
   */
  const openModal = (component: Component, sectionId: string) => {
    setActiveComponent({ component, sectionId });
    setIsOpen(true);
  };

  /**
   * Close the generation modal
   *
   * Resets modal state and clears active component
   */
  const closeModal = () => {
    setIsOpen(false);
    setActiveComponent(null);
  };

  return {
    isOpen,
    activeComponent,
    openModal,
    closeModal,
  };
}
