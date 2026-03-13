import { Activity } from "../types/Activity";

export const sampleActivity: Activity = {
  type: "STEP_THROUGH",

  aiGeneratedCode: `
let x = 5
let y = 2
x = x + y
console.log(x)
`.trim(),

  steps: [
    {
      lineNumber: 1,
      question: "Qual o valor de x após esta linha?",
      correctAnswer: "5",
      variables: { x: 5 }
    },

    {
      lineNumber: 2,
      question: "Qual o valor de y agora?",
      correctAnswer: "2",
      variables: { x: 5, y: 2 }
    },

    {
      lineNumber: 3,
      question: "Qual o valor de x agora?",
      correctAnswer: "7",
      variables: { x: 7, y: 2 }
    }
  ]
};