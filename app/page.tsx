'use client';

import ContextBar from '@/components/ui/ContextBar';
import Canvas from '@/components/ui/Canvas';
import BlockPalette from '@/components/ui/BlockPalette';
import BlockEditorPanel from '@/components/ui/BlockEditorPanel';
import PreviewButton from '@/components/ui/PreviewButton';
import { HistoryControls } from '@/components/ui/HistoryControls';
import GeometricDecoration from '@/components/ui/GeometricDecoration';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useBuilderStore } from '@/store/useBuilderStore';
import { BlockType, HeroBlock, TextBlock, ImageBlock, ButtonBlock, LinkBlock, NavbarBlock, FooterBlock } from '@/types/block.types';

export default function Home() {
  const { blocks, reorderBlocks, addBlock } = useBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Check if dragging from palette
    const isPaletteItem = typeof active.id === 'string' && active.id.startsWith('palette-');

    if (isPaletteItem && (over.id === 'canvas-droppable' || blocks.some(b => b.id === over.id))) {
      // Add new block from palette
      const blockType = active.data.current?.blockType as BlockType;
      const template = active.data.current?.template;

      if (blockType && template) {
        const newBlock = {
          id: `${blockType}-${Date.now()}`,
          type: blockType,
          order: blocks.length,
          content: template.defaultContent,
        };

        if (blockType === 'hero') {
          addBlock(newBlock as HeroBlock);
        } else if (blockType === 'text') {
          addBlock(newBlock as TextBlock);
        } else if (blockType === 'image') {
          addBlock(newBlock as ImageBlock);
        } else if (blockType === 'button') {
          addBlock(newBlock as ButtonBlock);
        } else if (blockType === 'link') {
          addBlock(newBlock as LinkBlock);
        } else if (blockType === 'navbar') {
          addBlock(newBlock as NavbarBlock);
        } else if (blockType === 'footer') {
          addBlock(newBlock as FooterBlock);
        }
      }
    } else if (active.id !== over.id && !isPaletteItem) {
      // Reorder existing blocks
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newBlocks = arrayMove(blocks, oldIndex, newIndex).map((block, index) => ({
          ...block,
          order: index,
        }));
        reorderBlocks(newBlocks);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-canvas"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-bauhaus-yellow focus:text-black focus:font-bold focus:rounded-bauhaus-md focus:shadow-bauhaus-md focus:border-2 focus:border-black"
      >
        Skip to main content
      </a>

      {/* Bauhaus Header */}
      <header
        role="banner"
        className="relative flex items-center justify-between px-8 py-5 border-b-4 border-black bg-white shadow-bauhaus-md bauhaus-transition overflow-hidden"
      >
        {/* Geometric Decorations */}
        <GeometricDecoration position="top-left" variant="circle" color="red" size="sm" />
        <GeometricDecoration position="top-right" variant="square" color="blue" size="sm" />

        {/* Brand Name - Bold Bauhaus Typography */}
        <h1 className="bauhaus-h2 uppercase tracking-wider relative z-20">
          <span className="text-black">Bento</span>
          <span className="text-bauhaus-red">blocks</span>
        </h1>

        {/* Controls */}
        <div className="flex items-center gap-4 relative z-20">
          <HistoryControls />
          {/* Vertical divider */}
          <div className="h-8 w-px bg-gray-300" aria-hidden="true"></div>
          <PreviewButton />
        </div>

        {/* Accent Line */}
        <div className="absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-bauhaus-red via-bauhaus-yellow to-bauhaus-blue" aria-hidden="true"></div>
      </header>

      <ContextBar />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex flex-1 overflow-hidden relative" role="main">
          <BlockPalette />
          <Canvas />
          <BlockEditorPanel />
        </div>
      </DndContext>
    </div>
  );
}
