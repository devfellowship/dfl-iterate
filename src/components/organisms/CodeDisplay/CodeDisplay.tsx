import React from 'react';

interface CodeDisplayProps {
  code: string;
  currentLine: number;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, currentLine }) => {
  return (
    <div className="flex-none p-5 border-r border-gray-300">
      <pre className="whitespace-pre-wrap">
        {code.split('\n').map((line, index) => (
          <div key={index} className={index === currentLine ? 'bg-blue-100' : 'bg-transparent'}>
            {line}
          </div>
        ))}
      </pre>
    </div>
  );
};

export default CodeDisplay;