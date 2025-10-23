'use client';

import React from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { Type } from 'lucide-react';
import SectionEditor from './editors/SectionEditor';
import ComponentEditor from './editors/ComponentEditor';

export default function BlockEditorPanel() {
  const { page, selectedBlockId, selectBlock } = useBuilderStore();

  if (!selectedBlockId || !page) {
    return (
      <aside className="w-80 bg-gray-50 border-l-4 border-black p-6 overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-bauhaus-lg flex items-center justify-center mb-4">
            <Type className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="bauhaus-h4 text-gray-900 mb-2">No Selection</h3>
          <p className="text-sm text-gray-600">
            Click a section or component to edit its properties
          </p>
        </div>
      </aside>
    );
  }

  // Find selected item
  const selectedSection = page.sections.find(s => s.id === selectedBlockId);
  if (selectedSection) {
    return (
      <aside className="w-80 bg-gray-50 border-l-4 border-black overflow-y-auto">
        <SectionEditor section={selectedSection} onClose={() => selectBlock(null)} />
      </aside>
    );
  }

  // Find selected component
  let selectedComponent = null;
  let parentSectionId = '';

  for (const section of page.sections) {
    const component = section.children.find(c => c.id === selectedBlockId);
    if (component) {
      selectedComponent = component;
      parentSectionId = section.id;
      break;
    }
  }

  if (selectedComponent) {
    return (
      <aside className="w-80 bg-gray-50 border-l-4 border-black overflow-y-auto">
        <ComponentEditor
          component={selectedComponent}
          sectionId={parentSectionId}
          onClose={() => selectBlock(null)}
        />
      </aside>
    );
  }

  return null;
}
