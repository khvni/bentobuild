'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect } from 'react';
import { createEditorExtensions } from '@/lib/tiptapExtensions';
import { plainTextToHtml, isHtmlContent } from '@/lib/sanitizeHtml';
import EditorToolbar from './EditorToolbar';

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

/**
 * Headless Tiptap rich text editor
 * Inherits all styles from parent container for true WYSIWYG experience
 */
export default function TiptapEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  disabled = false,
  autoFocus = false,
  className = '',
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // Prevent SSR hydration issues
    extensions: createEditorExtensions(placeholder),
    content: '',
    editable: !disabled,
    editorProps: {
      attributes: {
        class: `tiptap focus:outline-none ${className}`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (!editor || !value) {
      if (editor && !value) {
        editor.commands.setContent('<p></p>');
      }
      return;
    }

    const currentContent = editor.getHTML();
    let newContent = value;

    // Convert plain text to HTML if needed (backward compatibility)
    if (!isHtmlContent(value)) {
      newContent = plainTextToHtml(value);
    }

    // Only update if content has actually changed to avoid cursor jumps
    if (currentContent !== newContent) {
      editor.commands.setContent(newContent);
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
    editor.commands.focus('end');
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
        <div className="h-24 bg-gray-100/50 rounded-bauhaus-sm border-2 border-gray-300/50"></div>
      </div>
    );
  }

  return (
    <div className={`tiptap-editor ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text'}`}>
      {/* BubbleMenu toolbar appears on text selection */}
      {!disabled && <EditorToolbar editor={editor} />}

      {/* Editor content - inherits ALL parent styles */}
      <EditorContent editor={editor} />
    </div>
  );
}
