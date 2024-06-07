// ToolbarPlugin.tsx
import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';

type TextFormatType = 'bold' | 'italic' | 'underline'; // أنواع التنسيق الممكنة

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const applyFormat = (formatType: TextFormatType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.formatText(formatType);
      }
    });
  };

  return (
    <div className="toolbar">
      <button onClick={() => applyFormat('bold')}>Bold</button>
      <button onClick={() => applyFormat('italic')}>Italic</button>
      <button onClick={() => applyFormat('underline')}>Underline</button>
      {/* أضف الأزرار الأخرى هنا */}
    </div>
  );
};

export default ToolbarPlugin;
