'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBuilderStore } from '@/store/useBuilderStore';
import BlockWrapper from '@/components/ui/BlockWrapper';
import GeometricDecoration from '@/components/ui/GeometricDecoration';

export default function Canvas() {
  const { blocks } = useBuilderStore();

  const { setNodeRef } = useDroppable({
    id: 'canvas-droppable',
  });

  return (
    <div
      className="flex-1 bg-gray-100 overflow-y-auto relative bauhaus-grid-bg"
      role="region"
      aria-label="Website canvas - drag and drop blocks here"
    >
      {/* Corner Geometric Decorations */}
      <div className="sticky top-0 left-0 w-full h-0 pointer-events-none z-10" aria-hidden="true">
        <GeometricDecoration position="top-left" variant="square" color="yellow" size="md" />
        <GeometricDecoration position="top-right" variant="circle" color="blue" size="lg" />
      </div>

      <div
        id="main-canvas"
        ref={setNodeRef}
        className="max-w-5xl mx-auto p-8 pl-16 min-h-full relative"
        aria-label="Website blocks canvas"
      >
        {blocks.length === 0 ? (
          <div className="text-center py-32" role="status" aria-live="polite">
            {/* Empty State with Bauhaus Design */}
            <div className="relative inline-block">
              {/* Geometric decorations around empty state */}
              <div
                className="absolute -top-8 -left-8 w-16 h-16 bg-bauhaus-red rounded-bauhaus-sm opacity-20"
                aria-hidden="true"
              ></div>
              <div
                className="absolute -bottom-6 -right-6 w-12 h-12 bg-bauhaus-yellow rounded-full opacity-20"
                aria-hidden="true"
              ></div>
              <div
                className="absolute top-1/2 -left-12 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-bauhaus-blue opacity-20"
                aria-hidden="true"
              ></div>

              <div className="bg-white p-12 rounded-bauhaus-lg shadow-bauhaus-lg border-4 border-black relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-bauhaus-md flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <p className="bauhaus-h3 text-gray-900 mb-3">Empty Canvas</p>
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
                  Drag blocks to start building
                </p>

                {/* Decorative accent line */}
                <div
                  className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-bauhaus-red via-bauhaus-yellow to-bauhaus-blue"
                  aria-hidden="true"
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div role="list" aria-label={`${blocks.length} blocks on canvas`}>
              {blocks.map((block) => (
                <BlockWrapper key={block.id} block={block} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}
