import React from 'react';

interface CodeDisplayProps {
  code: string;
  currentLine: number;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, currentLine }) => {
  return (
    <div style={{ flex: 0.4, padding: '20px', borderRight: '1px solid #ccc' }}>
      <pre>
        {code.split('\n').map((line, index) => (
          <div key={index} style={{ background: index === currentLine ? '#e0f7fa' : 'transparent' }}>
            {line}
          </div>
        ))}
      </pre>
    </div>
  );
};

export default CodeDisplay;
