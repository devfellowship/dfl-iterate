import React from 'react';

interface VariablesDisplayProps {
  variables: Record<string, any>;
}

const VariablesDisplay: React.FC<VariablesDisplayProps> = ({ variables }) => {
  return (
    <div style={{ flex: 0.3, padding: '20px' }}>
      <h3>Variáveis:</h3>
      <ul>
        {variables && Object.entries(variables).map(([key, value]) => (
          <li key={key}>{`${key}: ${value}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default VariablesDisplay;
