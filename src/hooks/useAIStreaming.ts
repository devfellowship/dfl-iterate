import { useState, useCallback, useRef } from 'react';
import { delay } from '@/utils/delay';

export function useAIStreaming() {
  const [text, setText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef(false);

  const streamText = useCallback(async (fullText: string, delayMs = 20) => {
    abortRef.current = false;
    setIsStreaming(true);
    setText('');

    for (let i = 0; i < fullText.length; i++) {
      if (abortRef.current) break;
      await delay(delayMs);
      setText(prev => prev + fullText[i]);
    }

    setIsStreaming(false);
  }, []);

  const stopStreaming = useCallback(() => {
    abortRef.current = true;
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    setText('');
    setIsStreaming(false);
    abortRef.current = false;
  }, []);

  return { text, isStreaming, streamText, stopStreaming, reset };
}
