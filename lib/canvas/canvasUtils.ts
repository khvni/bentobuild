import { Node, Edge } from '@xyflow/react';
import { Section, Component, Page } from '@/types/canvas.types';
import { v4 as uuid } from 'uuid';

/**
 * Convert Page structure to ReactFlow nodes and edges
 */
export function pageToReactFlow(page: Page): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  page.sections.forEach((section) => {
    // Create section node
    const sectionNode: Node = {
      id: section.id,
      type: 'section',
      position: section.position,
      data: section as unknown as Record<string, unknown>,
      draggable: true,
      selectable: true,
    };
    nodes.push(sectionNode);

    // Create component nodes (children of section)
    section.children.forEach((component) => {
      const componentNode: Node = {
        id: component.id,
        type: 'component',
        position: component.position.absolute || { x: 0, y: 0 },
        data: component as unknown as Record<string, unknown>,
        parentId: section.id, // ReactFlow's built-in nesting
        extent: 'parent', // Constrain to parent bounds
        draggable: true,
        selectable: true,
      };
      nodes.push(componentNode);
    });
  });

  return { nodes, edges };
}

/**
 * Convert ReactFlow nodes back to Page structure
 */
export function reactFlowToPage(nodes: Node[], currentPage: Page): Page {
  const sections: Section[] = [];

  // Group nodes by type
  const sectionNodes = nodes.filter(n => n.type === 'section');
  const componentNodes = nodes.filter(n => n.type === 'component');

  sectionNodes.forEach((node) => {
    const section = node.data as unknown as Section;

    // Update position from ReactFlow
    section.position = node.position;

    // Find children components
    const children = componentNodes
      .filter(cn => cn.parentId === node.id)
      .map(cn => {
        const component = cn.data as unknown as Component;
        // Update position
        if (component.position.type === 'absolute') {
          component.position.absolute = cn.position;
        }
        return component;
      });

    section.children = children;
    sections.push(section);
  });

  // Sort by order
  sections.sort((a, b) => a.order - b.order);

  return {
    ...currentPage,
    sections,
  };
}

/**
 * Calculate section positions based on order
 */
export function calculateSectionPositions(sections: Section[]): Section[] {
  return sections.map((section, index) => ({
    ...section,
    position: {
      x: 100,
      y: index * 450 + 100, // 450px spacing between sections
    },
  }));
}

/**
 * Get viewport bounds for fitting all sections
 */
export function getViewportBounds(sections: Section[]): { x: number; y: number; width: number; height: number } {
  if (sections.length === 0) {
    return { x: 0, y: 0, width: 1000, height: 1000 };
  }

  const minX = Math.min(...sections.map(s => s.position.x));
  const minY = Math.min(...sections.map(s => s.position.y));
  const maxX = Math.max(...sections.map(s => s.position.x + 800)); // Assume 800px width
  const maxY = Math.max(...sections.map(s => s.position.y + 300)); // Assume 300px height

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
