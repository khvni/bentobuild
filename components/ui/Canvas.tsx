'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuilderStore } from '@/store/useBuilderStore';
import { Block } from '@/types/block.types';
import HeroBlock from '@/components/blocks/HeroBlock';
import TextBlock from '@/components/blocks/TextBlock';
import ImageBlock from '@/components/blocks/ImageBlock';

function SortableBlock({ block }: { block: Block }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'hero':
        return <HeroBlock block={block} />;
      case 'text':
        return <TextBlock block={block} />;
      case 'image':
        return <ImageBlock block={block} />;
      default:
        return null;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-4">
      {renderBlock()}
    </div>
  );
}

export default function Canvas() {
  const { blocks, reorderBlocks } = useBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      const newBlocks = arrayMove(blocks, oldIndex, newIndex).map((block, index) => ({
        ...block,
        order: index,
      }));
      reorderBlocks(newBlocks);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-8">
        {blocks.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl mb-2">Your canvas is empty</p>
            <p className="text-sm">Drag blocks from the palette to get started</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              {blocks.map((block) => (
                <SortableBlock key={block.id} block={block} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
