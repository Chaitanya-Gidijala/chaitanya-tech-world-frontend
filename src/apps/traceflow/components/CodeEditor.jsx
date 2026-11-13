import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

// Suppress harmless Monaco Editor promise cancellation warnings caused by React StrictMode double-mounting
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.type === 'cancelation' && event.reason.msg === 'operation is manually canceled') {
      event.preventDefault();
    }
  });
}

/**
 * Registers the Traceflow editor themes. Passed to <Editor beforeMount> so the
 * themes exist before the first render (otherwise Monaco falls back to white "vs").
 */
function defineThemes(monaco) {
  monaco.editor.defineTheme('traceflow-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'b4a3ff' },
      { token: 'type', foreground: 'ffcb6b' },
      { token: 'string', foreground: '86efac' },
      { token: 'number', foreground: 'fca5a5' },
      { token: 'comment', foreground: '6b7190', fontStyle: 'italic' },
    ],
    colors: {
      'editor.background': '#0d0f1a',
      'editor.foreground': '#d4d8e8',
      'editorLineNumber.foreground': '#3d4260',
      'editorLineNumber.activeForeground': '#aab0c6',
    },
  });

  monaco.editor.defineTheme('traceflow-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '5b3df5' },
      { token: 'type', foreground: 'b25e09' },
      { token: 'string', foreground: '12805c' },
      { token: 'number', foreground: 'd0302f' },
      { token: 'comment', foreground: '8a90aa', fontStyle: 'italic' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#2a2f45',
      'editorLineNumber.foreground': '#b4b9cc',
      'editorLineNumber.activeForeground': '#0b0d1a',
    },
  });
}

export default function CodeEditor({ code, activeLine, readOnly = false, language = 'java', height = '100%', theme = 'dark' }) {
  // Kept in state (not a ref) so the highlight effect re-runs once the editor mounts —
  // otherwise opening the code view mid-run shows no active line.
  const [instance, setInstance] = useState(null);
  const decorationsRef = useRef([]);

  const handleEditorDidMount = (editor, monaco) => {
    setInstance({ editor, monaco });
  };

  // Handle active line highlighting
  useEffect(() => {
    if (!instance) return;
    const { editor, monaco } = instance;

    if (activeLine === undefined || activeLine === null) {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
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

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, decs);
    editor.revealLineInCenterIfOutsideViewport(activeLine);
  }, [activeLine, instance]);

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
        beforeMount={defineThemes}
        options={{
          readOnly: readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: isMobile ? 12 : 14,
          fontFamily: '"Geist Mono", "JetBrains Mono", ui-monospace, monospace',
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
