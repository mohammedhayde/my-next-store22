import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// React-Quill يجب تحميلها بشكل ديناميكي لمنع مشاكل SSR مع Next.js
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface LexicalEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const LexicalEditor: React.FC<LexicalEditorProps> = ({ value, onChange }) => {
  const [editorContent, setEditorContent] = useState(value);

  const handleChange = (content: string) => {
    setEditorContent(content);
    onChange(content);
  };

  return (
    <ReactQuill 
      value={editorContent} 
      onChange={handleChange} 
      theme="snow"
      modules={{
        toolbar: [
          [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
          [{size: []}],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, 
           {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image', 'video'],
          ['clean']                                         
        ],
      }}
    />
  );
};

export default LexicalEditor;
