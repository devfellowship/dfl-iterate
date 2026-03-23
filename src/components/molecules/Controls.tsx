import React from 'react';

interface ControlsProps {
  onBack: () => void;
  onNext: () => void;
  question: string;
  answer: string;
  onAnswerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onBack, onNext, question, answer, onAnswerChange, onSubmit }) => {
  return (
    <div style={{ flex: 0.3, padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <h3 style={{ color: '#333' }}>Controles:</h3>
      <button onClick={onBack} style={{ width: '100%', marginBottom: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px', borderRadius: '5px' }}>Step Back</button>
      <button onClick={onNext} style={{ width: '100%', marginBottom: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '10px', borderRadius: '5px' }}>Step Forward</button>
      <h4 style={{ color: '#555' }}>{question}</h4>
      <input
        type="text"
        value={answer}
        onChange={onAnswerChange}
        placeholder="Digite sua resposta"
        style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      <button onClick={onSubmit} style={{ width: '100%', backgroundColor: '#008CBA', color: 'white', border: 'none', padding: '10px', borderRadius: '5px' }}>Enviar Resposta</button>
    </div>
  );
};

export default Controls;
