import React from 'react';
import StepThrough from '../components/StepThrough';
import { sampleActivity } from '../data/sampleActivity';

const Home: React.FC = () => {
  const handleSubmit = (answers: Record<number, string>) => {
    console.log("Respostas enviadas:", answers);
  };

  return (
    <div>
      <h1>Simulador de Execução de Código</h1>
      <StepThrough activity={sampleActivity} onSubmit={handleSubmit} />
    </div>
  );
};

export default Home;
