import { useCallback, useRef } from 'react';

// Sound URLs - using free sound effects
const SOUNDS = {
  success: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  celebration: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
};

type SoundType = keyof typeof SOUNDS;

export function useSoundEffects() {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const play = useCallback((sound: SoundType, volume: number = 0.5) => {
    try {
      // Reuse or create audio element
      if (!audioRefs.current[sound]) {
        audioRefs.current[sound] = new Audio(SOUNDS[sound]);
      }
      
      const audio = audioRefs.current[sound];
      audio.volume = Math.min(1, Math.max(0, volume));
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Ignore autoplay restrictions
      });
    } catch {
      // Ignore errors
    }
  }, []);

  const playSuccess = useCallback(() => play('success', 0.4), [play]);
  const playError = useCallback(() => play('error', 0.3), [play]);
  const playClick = useCallback(() => play('click', 0.2), [play]);
  const playCelebration = useCallback(() => play('celebration', 0.5), [play]);

  return {
    play,
    playSuccess,
    playError,
    playClick,
    playCelebration,
  };
}
