import React from 'react';
import { useT } from '@/i18n/LangContext';

interface VariablesDisplayProps {
  variables: Record<string, unknown>;
}

const VariablesDisplay: React.FC<VariablesDisplayProps> = ({ variables }) => {
  const { t } = useT();
  return (
    <div className="flex-none p-5">
      <h3 className="text-lg font-semibold">{t('molecules.variablesDisplay.title')}</h3>
      <ul className="list-disc pl-5">
        {variables && Object.entries(variables).map(([key, value]) => (
          <li key={key} className="text-gray-800">{`${key}: ${value}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default VariablesDisplay;