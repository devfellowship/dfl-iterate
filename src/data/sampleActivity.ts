import { Activity, ActivityType } from '../types/Activity';

export const sampleActivity: Activity = {
  type: ActivityType.STEP_THROUGH,
  aiGeneratedCode: `let x = 5;\nlet y = 10;\nlet z = x + y;\nconsole.log(z);`,
  steps: [
    {
      lineNumber: 1,
      question: "Qual o valor de X agora?",
      correctAnswer: "5",
      variables: { x: 5, y: 0, z: 0 },
    },
    {
      lineNumber: 2,
      question: "Qual o valor de Y agora?",
      correctAnswer: "10",
      variables: { x: 5, y: 10, z: 0 },
    },
    {
      lineNumber: 3,
      question: "Qual o valor de Z agora?",
      correctAnswer: "15",
      variables: { x: 5, y: 10, z: 15 },
    },
  ],
};
