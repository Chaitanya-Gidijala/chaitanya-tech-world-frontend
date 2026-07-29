import React, { useRef, useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import './CodeEditor.css';

// Suppress harmless Monaco Editor promise cancellation warnings caused by React StrictMode double-mounting
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.type === 'cancelation' && event.reason.msg === 'operation is manually canceled') {
      event.preventDefault();
    }
  });
}

export default function CodeEditor({ code, activeLine, readOnly = false, language = 'java', height = '100%', theme = 'dark' }) {
  const monaco = useMonaco();
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);

  // Setup custom theme once monaco is loaded
  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('traceflow-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: 'c792ea' },
          { token: 'type', foreground: 'ffcb6b' },
          { token: 'string', foreground: 'c3e88d' },
          { token: 'number', foreground: 'f78c6c' },
          { token: 'comment', foreground: '546e7a', fontStyle: 'italic' },
        ],
        colors: {
          'editor.background': '#0f1115',
          'editor.foreground': '#a6accd',
          'editorLineNumber.foreground': '#3a3f58',
          'editorLineNumber.activeForeground': '#a6accd',
        }
      });
      
      monaco.editor.defineTheme('traceflow-light', {
        base: 'vs',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: '895dfa' },
          { token: 'type', foreground: 'd97706' },
          { token: 'string', foreground: '10b981' },
          { token: 'number', foreground: 'ef4444' },
          { token: 'comment', foreground: '9ca3af', fontStyle: 'italic' },
        ],
        colors: {
          'editor.background': '#ffffff',
          'editor.foreground': '#374151',
          'editorLineNumber.foreground': '#9ca3af',
          'editorLineNumber.activeForeground': '#111827',
        }
      });
    }
  }, [monaco]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Handle active line highlighting
  useEffect(() => {
    if (!editorRef.current || !monaco) return;

    if (activeLine === undefined || activeLine === null) {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
      return;
    }

    const decs = [
      {
        range: new monaco.Range(activeLine, 1, activeLine, 1),
        options: {
          isWholeLine: true,
          className: 'active-line-highlight',
          marginClassName: 'active-line-margin'
        }
      }
    ];

    decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, decs);
    editorRef.current.revealLineInCenterIfOutsideViewport(activeLine);
  }, [activeLine, monaco]);

  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="tf-code-editor-container" style={{ height }}>
      <Editor
        height="100%"
        language={language}
        value={code}
        theme={theme === 'light' ? 'traceflow-light' : 'traceflow-dark'}
        options={{
          readOnly: readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: isMobile ? 12 : 14,
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          lineHeight: isMobile ? 20 : 24,
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            alwaysConsumeMouseWheel: false,
          },
          renderLineHighlight: 'none', // We'll handle custom active line
          renderIndentGuides: false,
          matchBrackets: 'never',
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}
