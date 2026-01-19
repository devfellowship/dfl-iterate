import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
  highlightLines?: number[];
  fontSize?: number;
}

export function CodeEditor({
  value,
  onChange,
  language = 'typescript',
  readOnly = false,
  height = '400px',
  highlightLines = [],
  fontSize = 15,
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
          fontSize,
          lineHeight: fontSize * 1.6,
          fontFamily: "'JetBrains Mono', monospace",
          fontLigatures: true,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          automaticLayout: true,
          tabSize: 2,
          bracketPairColorization: { enabled: true },
          scrollbar: {
            vertical: 'auto',
            horizontal: 'hidden',
            useShadows: false,
            verticalScrollbarSize: 8,
          },
        }}
        beforeMount={(monaco) => {
          // Define custom theme
          monaco.editor.defineTheme('iterate-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'comment', foreground: '6A9955' },
              { token: 'keyword', foreground: 'F39325' },
              { token: 'string', foreground: 'CE9178' },
              { token: 'number', foreground: 'B5CEA8' },
              { token: 'type', foreground: '4EC9B0' },
            ],
            colors: {
              'editor.background': '#0a0a0a',
              'editor.foreground': '#fafafa',
              'editor.lineHighlightBackground': '#1a1a1a',
              'editorLineNumber.foreground': '#6b7280',
              'editorLineNumber.activeForeground': '#f39325',
              'editor.selectionBackground': '#f3932544',
              'editor.inactiveSelectionBackground': '#f3932520',
              'editorCursor.foreground': '#f39325',
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
