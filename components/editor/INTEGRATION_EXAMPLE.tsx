/**
 * Integration Example: Block Editor Panel with ReactFlow Canvas
 *
 * This example shows how to integrate the BlockEditorPanel with the new
 * Section/Component canvas architecture.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import ReactFlowCanvas from '@/components/canvas/ReactFlowCanvas';
import CanvasPalette from '@/components/canvas/CanvasPalette';
import BlockEditorPanel from '@/components/editor/BlockEditorPanel';
import { useBuilderStore } from '@/store/useBuilderStore';

export default function CanvasPage() {
  const { selectBlock } = useBuilderStore();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b-4 border-black bg-white">
        <h1 className="bauhaus-h2 uppercase tracking-wider">
          <span className="text-black">Bento</span>
          <span className="text-bauhaus-red">blocks</span>
        </h1>
        <div className="flex items-center gap-4">
          {/* Add controls here */}
        </div>
      </header>

      {/* Main Layout: Palette | Canvas | Editor */}
      <ReactFlowProvider>
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Component Palette (240px) */}
          <CanvasPalette />

          {/* Center: ReactFlow Canvas (flex-1, grows to fill space) */}
          <ReactFlowCanvas />

          {/* Right: Block Editor Panel (320px) */}
          <BlockEditorPanel />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

/**
 * USAGE NOTES:
 *
 * 1. Selection State:
 *    - Click a section node → selectBlock(section.id) → SectionEditor appears
 *    - Click a component → selectBlock(component.id) → ComponentEditor appears
 *    - Click canvas background → selectBlock(null) → "No Selection" placeholder
 *
 * 2. Real-Time Updates:
 *    - All editor changes call updateSection() or updateComponent()
 *    - Canvas re-renders automatically via Zustand subscriptions
 *    - No save button needed - everything is instant
 *
 * 3. Section Node Click Handler Example:
 *    ```tsx
 *    const handleSectionClick = (section: Section) => {
 *      selectBlock(section.id);
 *    };
 *    ```
 *
 * 4. Component Click Handler Example:
 *    ```tsx
 *    const handleComponentClick = (component: Component) => {
 *      selectBlock(component.id);
 *    };
 *    ```
 *
 * 5. Delete Handling:
 *    - Editor panel handles delete confirmations
 *    - Automatically deselects and closes panel after deletion
 *    - Canvas updates via store subscription
 *
 * 6. Styling:
 *    - Panel: w-80 (320px), bg-gray-50, border-l-4 border-black
 *    - Palette: w-60 (240px)
 *    - Canvas: flex-1 (remaining space)
 *    - All use Bauhaus design system
 */

/**
 * ALTERNATIVE LAYOUTS:
 */

// Collapsible Editor Panel
export function CanvasPageWithCollapsibleEditor() {
  const [isEditorOpen, setIsEditorOpen] = React.useState(true);

  return (
    <div className="flex h-screen">
      <CanvasPalette />
      <ReactFlowCanvas />

      {/* Toggle button */}
      <button
        onClick={() => setIsEditorOpen(!isEditorOpen)}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border-2 border-black rounded-l-bauhaus-md px-2 py-4"
      >
        {isEditorOpen ? '→' : '←'}
      </button>

      {/* Conditional panel */}
      {isEditorOpen && <BlockEditorPanel />}
    </div>
  );
}

// Full-Width Canvas (No Palette)
export function CanvasPageFullWidth() {
  return (
    <div className="flex h-screen">
      <ReactFlowCanvas />
      <BlockEditorPanel />
    </div>
  );
}

// Modal Editor (Instead of Side Panel)
export function CanvasPageWithModalEditor() {
  const { selectedBlockId, selectBlock } = useBuilderStore();

  return (
    <div className="relative h-screen">
      <ReactFlowCanvas />

      {/* Modal overlay */}
      {selectedBlockId && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-bauhaus-lg border-4 border-black max-w-md w-full max-h-[80vh] overflow-y-auto">
            <BlockEditorPanel />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * TESTING INTEGRATION:
 *
 * 1. Import test page:
 *    ```tsx
 *    import CanvasPage from '@/components/editor/INTEGRATION_EXAMPLE';
 *    ```
 *
 * 2. Add to app router:
 *    ```tsx
 *    // app/canvas/page.tsx
 *    export { default } from '@/components/editor/INTEGRATION_EXAMPLE';
 *    ```
 *
 * 3. Navigate to /canvas
 *
 * 4. Test workflow:
 *    - Drag section from palette
 *    - Click section → editor opens
 *    - Change layout → canvas updates
 *    - Add component to section
 *    - Click component → component editor opens
 *    - Edit content → updates in real-time
 *    - Delete component → confirms and removes
 */
