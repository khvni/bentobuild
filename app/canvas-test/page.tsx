'use client';

import ReactFlowCanvas from '@/components/canvas/ReactFlowCanvas';
import { createSection } from '@/lib/factories/sectionFactory';
import { createHeading, createButton, createText } from '@/lib/factories/componentFactory';
import { Page } from '@/types/canvas.types';
import { useEffect } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';

export default function CanvasTestPage() {
  const { addSection, page } = useBuilderStore();

  useEffect(() => {
    // Initialize test data on mount
    if (!page || page.sections.length === 0) {
      const { setPage } = useBuilderStore.getState();

      // Create test sections
      const navbar = createSection('navbar', 0, { x: 100, y: 50 });
      navbar.layout = {
        type: 'stack',
        direction: 'horizontal',
        align: 'center',
        justify: 'space-between',
      };
      navbar.children = [createHeading('Bentoblocks', 3)];

      const hero = createSection('hero', 1, { x: 100, y: 350 });
      hero.layout = { type: 'stack', direction: 'vertical', align: 'center', gap: 24 };
      hero.children = [
        createHeading('Build Your Dream Website', 1),
        createText('Drag, drop, and publish in minutes'),
        createButton('Get Started', '/signup', 'filled'),
      ];

      const features = createSection('features', 2, { x: 100, y: 700 });
      features.layout = { type: 'grid', columns: 3, gap: 32 };
      features.children = [
        createHeading('Fast', 4),
        createHeading('Easy', 4),
        createHeading('Beautiful', 4),
      ];

      const footer = createSection('footer', 3, { x: 100, y: 1050 });
      footer.layout = { type: 'stack', direction: 'horizontal', justify: 'space-between' };

      const page: Page = {
        id: 'test-page',
        sections: [navbar, hero, features, footer],
        viewport: { zoom: 0.8, x: 0, y: 0 },
        metadata: { title: 'Test Page' },
      };

      setPage(page);
      console.log('Test sections created:', page);
    }
  }, [addSection, page]);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b-4 border-black p-4">
        <h1 className="bauhaus-h2">ReactFlow Canvas Test</h1>
        <p className="text-sm text-gray-600 mt-1">
          Testing ReactFlow integration with Bentoblocks canvas architecture
        </p>
      </header>
      <ReactFlowCanvas />
    </div>
  );
}
