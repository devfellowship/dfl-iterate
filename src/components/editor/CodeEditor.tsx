import Editor from '@monaco-editor/react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
  highlightLines?: number[];
}

export function CodeEditor({
  value,
  onChange,
  language = 'typescript',
  readOnly = false,
  height = '400px',
  highlightLines = [],
}: CodeEditorProps) {
  const handleEditorChange = (newValue: string | undefined) => {
    if (onChange && newValue !== undefined) {
      onChange(newValue);
    }
  };

  return (
    <div className="editor-container">
      <Editor
        height={height}
        language={language === 'typescript' ? 'typescript' : language}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          automaticLayout: true,
          tabSize: 2,
          bracketPairColorization: { enabled: true },
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            useShadows: false,
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
        beforeMount={(monaco) => {
          // Define custom theme
          monaco.editor.defineTheme('iterate-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'comment', foreground: '6A9955' },
              { token: 'keyword', foreground: 'C586C0' },
              { token: 'string', foreground: 'CE9178' },
              { token: 'number', foreground: 'B5CEA8' },
              { token: 'type', foreground: '4EC9B0' },
            ],
            colors: {
              'editor.background': '#1e1e1e',
              'editor.foreground': '#d4d4d4',
              'editor.lineHighlightBackground': '#2a2a2a',
              'editorLineNumber.foreground': '#858585',
              'editorLineNumber.activeForeground': '#f39325',
              'editor.selectionBackground': '#f3932540',
              'editor.inactiveSelectionBackground': '#f3932520',
            },
          });
        }}
        onMount={(editor, monaco) => {
          monaco.editor.setTheme('iterate-dark');
          
          // Highlight specific lines if provided
          if (highlightLines.length > 0) {
            editor.createDecorationsCollection(
              highlightLines.map(line => ({
                range: new monaco.Range(line, 1, line, 1),
                options: {
                  isWholeLine: true,
                  className: 'highlighted-line',
                  glyphMarginClassName: 'highlighted-glyph',
                  linesDecorationsClassName: 'highlighted-line-decoration',
                },
              }))
            );
          }
        }}
      />
    </div>
  );
}
