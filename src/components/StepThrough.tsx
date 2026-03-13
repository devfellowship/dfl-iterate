import React, { useState } from "react";
import { Activity } from "../types/Activity";

interface StepThroughProps {
  activity: Activity;
  onSubmit: (answers: Record<number, string>) => void;
}

const StepThrough: React.FC<StepThroughProps> = ({ activity, onSubmit }) => {
  const codeLines = activity.aiGeneratedCode.split("\n");

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const step = activity.steps[stepIndex];

  const handleNext = () => {
    if (stepIndex < activity.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const updateAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [stepIndex]: value
    });
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "monospace" }}>

      {/* Código */}
      <div style={{ width: "40%", padding: 20, borderRight: "1px solid #ccc" }}>
        <h2>Código</h2>

        {codeLines.map((line, i) => {
          const lineNumber = i + 1;
          const isCurrent = lineNumber === step.lineNumber;

          return (
            <div
              key={i}
              style={{
                background: isCurrent ? "#ffeeba" : "transparent",
                padding: "5px"
              }}
            >
              <span style={{ color: "#888", marginRight: 10 }}>
                {lineNumber}
              </span>
              {line}
            </div>
          );
        })}
      </div>

      {/* Variáveis */}
      <div style={{ width: "30%", padding: 20, borderRight: "1px solid #ccc" }}>
        <h2>Variáveis</h2>

        {step.variables ? (
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Variável</th>
                <th>Valor</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(step.variables).map(([name, value]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{JSON.stringify(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhuma variável</p>
        )}
      </div>

      {/* Controles */}
      <div style={{ width: "30%", padding: 20 }}>
        <h2>Pergunta</h2>

        <p>{step.question}</p>

        <input
          type="text"
          value={answers[stepIndex] || ""}
          onChange={(e) => updateAnswer(e.target.value)}
          placeholder="Digite a resposta"
          style={{
            width: "100%",
            padding: 10,
            fontSize: 16,
            marginBottom: 20
          }}
        />

        <div style={{ display: "flex", gap: 10 }}>

          <button
            onClick={handleBack}
            disabled={stepIndex === 0}
            style={{ padding: "10px 20px", fontSize: 16 }}
          >
            Step Back
          </button>

          <button
            onClick={handleNext}
            disabled={stepIndex === activity.steps.length - 1}
            style={{ padding: "10px 20px", fontSize: 16 }}
          >
            Step Forward
          </button>

        </div>

        <button
          onClick={handleSubmit}
          style={{
            marginTop: 30,
            padding: "12px",
            width: "100%",
            fontSize: 18
          }}
        >
          Enviar Respostas
        </button>

        <p style={{ marginTop: 20 }}>
          Step {stepIndex + 1} / {activity.steps.length}
        </p>
      </div>

    </div>
  );
};

export default StepThrough;