export type StepVariableValue = string | number | boolean | null;

export interface Step {
  lineNumber: number;     
  question: string;        
  correctAnswer: string;   
  variables?: Record<string, StepVariableValue>; 
}

