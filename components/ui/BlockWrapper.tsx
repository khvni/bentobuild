'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from '@/types/block.types';
import { useBlockActions } from '@/hooks/useBlockActions';
import HeroBlock from '@/components/blocks/HeroBlock';
import TextBlock from '@/components/blocks/TextBlock';
import ImageBlock from '@/components/blocks/ImageBlock';
import ButtonBlock from '@/components/blocks/ButtonBlock';
import LinkBlock from '@/components/blocks/LinkBlock';
import NavbarBlock from '@/components/blocks/NavbarBlock';
import FooterBlock from '@/components/blocks/FooterBlock';

interface BlockWrapperProps {
  block: Block;
}

export default function BlockWrapper({ block }: BlockWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const { handleDelete, handleDuplicate, handleSelect, isSelected } = useBlockActions();
  const selected = isSelected(block.id);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'hero':
        return <HeroBlock block={block} />;
      case 'text':
        return <TextBlock block={block} />;
      case 'image':
        return <ImageBlock block={block} />;
      case 'button':
        return <ButtonBlock block={block} />;
      case 'link':
        return <LinkBlock block={block} />;
      case 'navbar':
        return <NavbarBlock block={block} />;
      case 'footer':
        return <FooterBlock block={block} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative mb-4 group ${selected ? 'ring-4 ring-yellow-400 rounded-lg' : ''}`}
      onClick={() => handleSelect(block.id)}
      role="listitem"
      aria-label={`${block.type} block`}
      data-block-type={block.type}
      data-block-id={block.id}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className={`absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-12 bg-gray-300 hover:bg-gray-400 rounded-l-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-bauhaus-blue ${
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        aria-label={`Drag to reorder ${block.type} block`}
        title="Drag to reorder (use keyboard arrow keys)"
      >
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9h8M8 15h8"
          />
        </svg>
      </button>

      {/* Action Controls */}
      <div
        className={`absolute -top-3 right-4 flex gap-2 transition-opacity ${
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'
        }`}
        role="toolbar"
        aria-label="Block actions"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDuplicate(block);
          }}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label={`Duplicate ${block.type} block`}
          title="Duplicate"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(block.id);
          }}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
          aria-label={`Delete ${block.type} block`}
          title="Delete"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Block Content */}
      <div>
        {renderBlock()}
      </div>
    </div>
  );
}
