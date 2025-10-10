'use client';

import { RichTextEditor as MantineRichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { useEffect, useState, useRef } from 'react';
import { plainTextToHtml, isHtmlContent } from '@/lib/sanitizeHtml';
import ColorPicker from './ColorPicker';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  label?: string;
  minHeight?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  fontFamily?: string;
}

// Custom extension for font size
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.fontSize) {
            return {};
          }
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
});

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  label,
  minHeight = '150px',
  disabled = false,
  autoFocus = false,
  fontFamily,
}: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextStyle,
      FontSize,
      Color,
    ],
    content: '',
    editable: !disabled,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none px-4 py-3',
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Get current text color
  const currentColor = editor?.getAttributes('textStyle').color || '#000000';

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update editor content when value prop changes
  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();
    let newContent = value;

    // Convert plain text to HTML if needed
    if (value && !isHtmlContent(value)) {
      newContent = plainTextToHtml(value);
    }

    // Only update if content has actually changed to avoid cursor jumps
    if (currentContent !== newContent) {
      editor.commands.setContent(newContent || '<p></p>');
    }
  }, [value, editor]);

  // Update editable state when disabled prop changes
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  // Auto-focus editor when mounted
  useEffect(() => {
    if (!editor || !autoFocus || disabled) return;
    editor.chain().focus().run();
  }, [editor, autoFocus, disabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className="animate-pulse">
        {label && (
          <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
        )}
        <div className="h-48 bg-gray-100 rounded-bauhaus-sm border-2 border-gray-300"></div>
      </div>
    );
  }

  return (
    <div className={`rich-text-editor ${disabled ? 'opacity-60' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <MantineRichTextEditor
        editor={editor}
        classNames={{
          root: `border-2 rounded-bauhaus-sm overflow-hidden bauhaus-transition ${
            disabled
              ? 'border-gray-300 bg-gray-50'
              : editor.isFocused
              ? 'border-bauhaus-blue shadow-bauhaus-sm'
              : 'border-gray-300 hover:border-gray-400'
          }`,
          toolbar: 'bg-gray-50 border-b-2 border-gray-300 p-2',
          content: `bg-white ${disabled ? 'cursor-not-allowed' : 'cursor-text'}`,
        }}
      >
        {!disabled && (
          <MantineRichTextEditor.Toolbar sticky stickyOffset={0}>
            <MantineRichTextEditor.ControlsGroup>
              <MantineRichTextEditor.Bold />
              <MantineRichTextEditor.Italic />
              <MantineRichTextEditor.Underline />
            </MantineRichTextEditor.ControlsGroup>

            <MantineRichTextEditor.ControlsGroup>
              <MantineRichTextEditor.H1 />
              <MantineRichTextEditor.H2 />
              <MantineRichTextEditor.H3 />
            </MantineRichTextEditor.ControlsGroup>

            <MantineRichTextEditor.ControlsGroup>
              <MantineRichTextEditor.BulletList />
              <MantineRichTextEditor.OrderedList />
            </MantineRichTextEditor.ControlsGroup>

            <MantineRichTextEditor.ControlsGroup>
              {/* Custom Text Color Picker */}
              <div className="relative inline-block" ref={colorPickerRef}>
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 rounded-bauhaus-sm bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 bauhaus-transition focus:outline-none focus:ring-2 focus:ring-bauhaus-blue flex items-center gap-1"
                  title="Text Color"
                  aria-label="Text color picker"
                  aria-expanded={showColorPicker}
                  aria-haspopup="dialog"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 21h10M12 3v1m0 0v15m0-15l-4 4m4-4l4 4"
                    />
                  </svg>
                  <div
                    className="w-4 h-4 rounded border border-gray-400"
                    style={{ backgroundColor: currentColor }}
                    aria-hidden="true"
                  />
                </button>

                {showColorPicker && (
                  <div className="absolute z-50 mt-1 left-0">
                    <ColorPicker
                      label="Text Color"
                      value={currentColor}
                      onChange={(color) => {
                        editor.chain().focus().setColor(color).run();
                      }}
                    />
                  </div>
                )}
              </div>
            </MantineRichTextEditor.ControlsGroup>

            <MantineRichTextEditor.ControlsGroup>
              <MantineRichTextEditor.Undo />
              <MantineRichTextEditor.Redo />
            </MantineRichTextEditor.ControlsGroup>
          </MantineRichTextEditor.Toolbar>
        )}

        <MantineRichTextEditor.Content
          aria-label={label || 'Rich text editor'}
        />
      </MantineRichTextEditor>

      <style jsx global>{`
        .mantine-RichTextEditor-content .ProseMirror {
          min-height: ${minHeight};
          max-height: 400px;
          overflow-y: auto;
          ${fontFamily ? `font-family: var(--font-${fontFamily.toLowerCase().replace(/\s+/g, '-')});` : ''}
        }

        .mantine-RichTextEditor-content .ProseMirror:focus {
          outline: none;
        }

        .mantine-RichTextEditor-content .ProseMirror p {
          margin: 0.5em 0;
        }

        .mantine-RichTextEditor-content .ProseMirror p:first-child {
          margin-top: 0;
        }

        .mantine-RichTextEditor-content .ProseMirror p:last-child {
          margin-bottom: 0;
        }

        .mantine-RichTextEditor-content .ProseMirror strong,
        .mantine-RichTextEditor-content .ProseMirror b {
          font-weight: 700;
        }

        .mantine-RichTextEditor-content .ProseMirror em,
        .mantine-RichTextEditor-content .ProseMirror i {
          font-style: italic;
        }

        .mantine-RichTextEditor-content .ProseMirror u {
          text-decoration: underline;
        }

        .mantine-RichTextEditor-content .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }

        .mantine-RichTextEditor-content .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }

        .mantine-RichTextEditor-content .ProseMirror h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }

        .mantine-RichTextEditor-content .ProseMirror ul,
        .mantine-RichTextEditor-content .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }

        .mantine-RichTextEditor-content .ProseMirror li {
          margin: 0.25em 0;
        }

        .mantine-RichTextEditor-content .ProseMirror blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: #4b5563;
        }

        .mantine-RichTextEditor-content .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
          font-size: 0.9em;
        }

        .mantine-RichTextEditor-content .ProseMirror pre {
          background-color: #1f2937;
          color: #f3f4f6;
          padding: 1em;
          border-radius: 6px;
          overflow-x: auto;
          margin: 1em 0;
        }

        .mantine-RichTextEditor-content .ProseMirror pre code {
          background: none;
          color: inherit;
          padding: 0;
        }

        /* Custom scrollbar */
        .mantine-RichTextEditor-content .ProseMirror::-webkit-scrollbar {
          width: 8px;
        }

        .mantine-RichTextEditor-content .ProseMirror::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .mantine-RichTextEditor-content .ProseMirror::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .mantine-RichTextEditor-content .ProseMirror::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Placeholder styling */
        .mantine-RichTextEditor-content .ProseMirror p.is-editor-empty:first-child::before {
          content: '${placeholder}';
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }

        /* Override Mantine default styles to match Bauhaus design */
        .mantine-RichTextEditor-control {
          border: 2px solid #d1d5db;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .mantine-RichTextEditor-control:hover {
          border-color: #9ca3af;
          background-color: #f9fafb;
        }

        .mantine-RichTextEditor-control[data-active] {
          background-color: #3b82f6;
          color: white;
          border-color: #000000;
        }

        .mantine-RichTextEditor-controlsGroup {
          gap: 4px;
        }
      `}</style>
    </div>
  );
}
