import { Activity } from "@/types";
import { ActivityType, ActivityStatus } from "@/enums";

const dummyActivity: Activity = {
  id: 'test-BestOption',
  lessonId: 'test',
  order: 1,
  type: ActivityType.BEST_IMPLEMENTATION,
  title: 'Dummy fix 01', 
  objective: '',
  instructions: 'What is the best implementation',
  targetFiles: ['file.ts'],
  status: ActivityStatus.CURRENT,
  bestOption: [
    {
        id: 'opt-1',
        code: 'function sum(a, b) { return a + b; }',
        explanation: 'Simples e legível',
    },
    {
        id: 'opt-2',
        code: 'const sum = (a, b) => a + b;',
        explanation: 'Arrow function, mais concisa',
    },
  ],
  correctImplementationId: 'opt-2',
};