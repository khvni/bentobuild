'use client';

import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  NodeChange,
  EdgeChange,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  ReactFlowProvider,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { useBuilderStore } from '@/store/useBuilderStore';
import { Section, Component, ComponentType } from '@/types/canvas.types';
import { createSection } from '@/lib/factories/sectionFactory';
import {
  createHeading,
  createText,
  createButton,
  createImage,
  createLink,
  createSpacer,
  createDivider,
} from '@/lib/factories/componentFactory';
import SectionNode from './nodes/SectionNode';
import ComponentNode from './nodes/ComponentNode';

// Import custom node types
const nodeTypes = {
  section: SectionNode,
  component: ComponentNode,
};

function ReactFlowCanvas() {
  const { page, updateSection, addSection, addComponent } = useBuilderStore();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { screenToFlowPosition } = useReactFlow();

  // Sync nodes from Zustand store
  useEffect(() => {
    if (!page) return;

    const reactFlowNodes: Node[] = page.sections.map((section) => ({
      id: section.id,
      type: 'section',
      position: section.position,
      data: section as unknown as Record<string, unknown>,
    }));

    setNodes(reactFlowNodes);
  }, [page]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));

      // Sync position changes back to store
      changes.forEach((change) => {
        if (change.type === 'position' && change.position && !change.dragging) {
          updateSection(change.id, {
            position: change.position,
          });
        }
      });
    },
    [updateSection]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  // Helper function to create components by type
  const createComponentByType = (type: ComponentType): Component => {
    switch (type) {
      case 'heading':
        return createHeading('New Heading', 2);
      case 'text':
        return createText('New text content');
      case 'button':
        return createButton('Click Me', '#', 'filled');
      case 'image':
        return createImage('https://via.placeholder.com/800x400', 'Placeholder');
      case 'link':
        return createLink('Learn More', '#');
      case 'spacer':
        return createSpacer(40);
      case 'divider':
        return createDivider();
      default:
        return createText('Unknown component');
    }
  };

  // Handle drag-and-drop from palette
  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;

    if (!active.data.current) return;

    const dragData = active.data.current;

    // Get drop position from mouse position
    const activator = event.activatorEvent as MouseEvent | PointerEvent | null;
    const dropPosition = screenToFlowPosition({
      x: activator?.clientX || 0,
      y: activator?.clientY || 0,
    });

    if (dragData.type === 'section') {
      // Create new section
      const sectionCount = page?.sections.length || 0;
      const newSection = createSection(dragData.variant, sectionCount, dropPosition);
      addSection(newSection);
    } else if (dragData.type === 'component') {
      // Find which section to add component to
      // For now, add to the last section or show message if no sections
      if (!page || page.sections.length === 0) {
        alert('Please add a section first before adding components');
        return;
      }

      // Get the section closest to drop position
      const targetSection = page.sections.reduce(
        (closest, section) => {
          const distance = Math.sqrt(
            Math.pow(section.position.x - dropPosition.x, 2) +
              Math.pow(section.position.y - dropPosition.y, 2)
          );
          if (!closest || distance < closest.distance) {
            return { section, distance };
          }
          return closest;
        },
        null as { section: Section; distance: number } | null
      );

      if (targetSection) {
        const component = createComponentByType(dragData.componentType);
        addComponent(targetSection.section.id, component);
      }
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex-1 bg-gray-100 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[20, 20]}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          minZoom={0.2}
          maxZoom={1.5}
          className="bauhaus-grid-bg"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
          <Controls
            className="bg-white border-2 border-black rounded-lg shadow-bauhaus-md"
            showInteractive={false}
          />
          <Panel
            position="top-left"
            className="bg-white border-2 border-black rounded-lg p-2 shadow-bauhaus-sm"
          >
            <div className="text-xs font-bold uppercase">Canvas</div>
            <div className="text-xs text-gray-600">{nodes.length} nodes</div>
          </Panel>
        </ReactFlow>
      </div>
    </DndContext>
  );
}

// Wrap with ReactFlowProvider
export default function ReactFlowCanvasWrapper() {
  return (
    <ReactFlowProvider>
      <ReactFlowCanvas />
    </ReactFlowProvider>
  );
}
