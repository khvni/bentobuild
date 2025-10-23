'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useBuilderStore } from '@/store/useBuilderStore';
import { Eye, ExternalLink, Download, Loader2, ChevronDown } from 'lucide-react';
import { exportToHTML } from '@/lib/export/htmlExporter';
import { validatePageForExport, canExport } from '@/lib/export/exportValidator';

export default function PreviewButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { page, blocks, contextPrompt } = useBuilderStore();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handlePreview = async () => {
    setShowMenu(false);

    // Use new Page architecture if available
    if (page && canExport(page)) {
      await handleNewPreview();
    } else if (blocks && blocks.length > 0) {
      // Fallback to old Block-based preview
      await handleLegacyPreview();
    } else {
      alert('Add some sections or blocks to your canvas first!');
    }
  };

  const handleNewPreview = async () => {
    if (!page) return;

    // Validate page
    const validation = validatePageForExport(page);
    if (!validation.valid) {
      alert(`Cannot preview:\n\n${validation.errors.join('\n')}`);
      return;
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      console.warn('Preview warnings:', validation.warnings);
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/export-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer');
      } else {
        alert('Preview failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Preview error:', error);
      alert('Network error: Could not create preview');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLegacyPreview = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks, contextPrompt }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.open(data.url, '_blank', 'noopener,noreferrer');
      } else {
        alert(data.error || 'Failed to create preview');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    setShowMenu(false);

    if (!page || !canExport(page)) {
      alert('Add some sections to your canvas first!');
      return;
    }

    // Validate page
    const validation = validatePageForExport(page);
    if (!validation.valid) {
      alert(`Cannot export:\n\n${validation.errors.join('\n')}`);
      return;
    }

    try {
      // Export to HTML
      const html = exportToHTML(page);

      // Create blob and download
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${page.metadata?.title || 'bentoblocks-site'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show success message with warnings if any
      if (validation.warnings.length > 0) {
        console.warn('Export warnings:', validation.warnings);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export HTML');
    }
  };

  const hasContent = (page && canExport(page)) || (blocks && blocks.length > 0);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isLoading || !hasContent}
        className={`bauhaus-button px-6 py-3 rounded-bauhaus-md font-bold text-sm uppercase tracking-wide border-2 bauhaus-transition flex items-center gap-2 ${
          isLoading || !hasContent
            ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
            : 'bg-blue-600 text-white border-black shadow-bauhaus-md hover:shadow-bauhaus-lg hover:bg-blue-700 active:scale-95'
        }`}
        title={hasContent ? "Preview or export your site" : "Add content first"}
        aria-label="Preview Menu"
        aria-expanded={showMenu}
        aria-haspopup="true"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="hidden sm:inline">Creating...</span>
          </>
        ) : (
          <>
            <Eye className="w-5 h-5" />
            <span className="hidden sm:inline">Preview</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {showMenu && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white border-2 border-black rounded-bauhaus-md shadow-bauhaus-lg overflow-hidden z-50"
          role="menu"
          aria-orientation="vertical"
        >
          <button
            onClick={handlePreview}
            className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 text-sm font-semibold transition-colors"
            role="menuitem"
          >
            <ExternalLink className="w-5 h-5 text-bauhaus-blue" />
            <div>
              <div className="font-bold">Open Preview</div>
              <div className="text-xs text-gray-500">View in new tab</div>
            </div>
          </button>

          <div className="border-t-2 border-gray-200" />

          <button
            onClick={handleDownload}
            className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3 text-sm font-semibold transition-colors"
            role="menuitem"
          >
            <Download className="w-5 h-5 text-bauhaus-red" />
            <div>
              <div className="font-bold">Download HTML</div>
              <div className="text-xs text-gray-500">Save as standalone file</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
