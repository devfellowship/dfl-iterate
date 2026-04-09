import React from 'react';

interface VariablesDisplayProps {
  variables: Record<string, unknown>;
}

const VariablesDisplay: React.FC<VariablesDisplayProps> = ({ variables }) => {
  return (
    <div className="flex-none p-5">
      <h3 className="text-lg font-semibold">Variáveis:</h3>
      <ul className="list-disc pl-5">
        {variables && Object.entries(variables).map(([key, value]) => (
          <li key={key} className="text-gray-800">{`${key}: ${value}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default VariablesDisplay;