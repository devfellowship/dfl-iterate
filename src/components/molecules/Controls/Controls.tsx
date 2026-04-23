import React from 'react';

interface ControlsProps {
  onBack: () => void;
  onNext: () => void;
  question: string;
  answer: string;
  onAnswerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCardSelect?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  cards?: string[];
}

const Controls: React.FC<ControlsProps> = ({ onBack, onNext, question, answer, onAnswerChange, onSubmit, onCardSelect, cards }) => {
  return (
    <div className="flex flex-col flex-none p-5 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-gray-800">Controles:</h3>
      <button 
        onClick={onBack} 
        className="w-full mb-2 bg-green-500 text-white border-none py-2 rounded"
      >
        Step Back
      </button>
      <button 
        onClick={onNext} 
        className="w-full mb-2 bg-blue-500 text-white border-none py-2 rounded"
      >
        Step Forward
      </button>
      <h4 className="text-gray-600">{question}</h4>
      <input
        type="text"
        value={answer}
        onChange={onAnswerChange}
        placeholder="Digite sua resposta"
        className="w-full mb-2 p-2 rounded border border-gray-300"
      />
      {cards && onCardSelect && (
        <select
          onChange={onCardSelect}
          className="w-full mb-2 p-2 rounded border border-gray-300"
        >
          <option value="">Selecione uma carta</option>
          {cards.map((card, index) => (
            <option key={index} value={card}>{card}</option>
          ))}
        </select>
      )}
      <button 
        onClick={onSubmit} 
        className="w-full bg-blue-700 text-white border-none py-2 rounded"
      >
        Enviar Resposta
      </button>
    </div>
  );
};

export default Controls;