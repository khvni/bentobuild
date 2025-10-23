'use client';

import React from 'react';
import CanvasPalette from '@/components/canvas/CanvasPalette';
import ReactFlowCanvas from '@/components/canvas/ReactFlowCanvas';
import { Info, Zap, MousePointer2 } from 'lucide-react';

export default function CanvasDemoPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="relative flex items-center justify-between px-8 py-5 border-b-4 border-black bg-white shadow-bauhaus-md">
        <div>
          <h1 className="bauhaus-h2 uppercase tracking-wider">
            <span className="text-black">Canvas </span>
            <span className="text-bauhaus-red">Demo</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Drag-and-drop system for building websites visually
          </p>
        </div>

        {/* Info Button */}
        <button
          className="flex items-center gap-2 px-4 py-2 bg-bauhaus-blue text-white rounded-bauhaus-md shadow-bauhaus-sm hover:shadow-bauhaus-md bauhaus-transition font-bold uppercase text-sm"
          onClick={() => {
            const instructions = document.getElementById('instructions');
            if (instructions) {
              instructions.classList.toggle('hidden');
            }
          }}
        >
          <Info className="w-4 h-4" />
          Instructions
        </button>

        {/* Accent Line */}
        <div className="absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-bauhaus-red via-bauhaus-yellow to-bauhaus-blue" />
      </header>

      {/* Instructions Panel (Hidden by default) */}
      <div
        id="instructions"
        className="hidden bg-bauhaus-yellow border-b-4 border-black p-6"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="bauhaus-h3 mb-4">How to Use the Canvas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-bauhaus-md shadow-bauhaus-sm border-2 border-black">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-bauhaus-red rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h3 className="font-bold text-lg">Add Sections</h3>
              </div>
              <p className="text-sm text-gray-700">
                Drag section templates from the palette onto the canvas. Sections are the
                main containers for your content.
              </p>
            </div>

            <div className="bg-white p-4 rounded-bauhaus-md shadow-bauhaus-sm border-2 border-black">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-bauhaus-yellow rounded-full flex items-center justify-center text-black font-bold">
                  2
                </div>
                <h3 className="font-bold text-lg">Add Components</h3>
              </div>
              <p className="text-sm text-gray-700">
                Drag components (text, buttons, images, etc.) onto the canvas. They will
                be added to the nearest section.
              </p>
            </div>

            <div className="bg-white p-4 rounded-bauhaus-md shadow-bauhaus-sm border-2 border-black">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-bauhaus-blue rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h3 className="font-bold text-lg">Arrange & Edit</h3>
              </div>
              <p className="text-sm text-gray-700">
                Move sections around by dragging. Click on sections to edit their
                properties and rearrange components.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-white p-4 rounded-bauhaus-md shadow-bauhaus-sm border-2 border-black">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-bauhaus-yellow" />
              Pro Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <MousePointer2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-bauhaus-blue" />
                <span>
                  <strong>Add sections first:</strong> You need at least one section before
                  you can add components
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MousePointer2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-bauhaus-blue" />
                <span>
                  <strong>Drop position matters:</strong> Sections appear where you drop
                  them, components go to the nearest section
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MousePointer2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-bauhaus-blue" />
                <span>
                  <strong>Use the controls:</strong> Zoom in/out and pan around the canvas
                  using the bottom-left controls
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <CanvasPalette />
        <ReactFlowCanvas />
      </div>
    </div>
  );
}
