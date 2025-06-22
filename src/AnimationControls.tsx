import { type AnimationItem } from 'lottie-web';
import React from 'react';

export interface AnimationControlsProps {
  isPaused: AnimationItem["isPaused"]
  onPlay: () => void;
  onPause: () => void;
  loop: AnimationItem["loop"]
  onLoopChange: (b: boolean) => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({ isPaused, onPlay, onPause, loop, onLoopChange }) => {
  return (
    <div>
      {
        isPaused
          ? <button onClick={() => onPlay()}>Play</button>
          : <button onClick={() => onPause()}>Pause</button>
      }
      <button
        onClick={() => {
          const shouldLoop = !loop;
          onLoopChange(shouldLoop);
        }}
      >Toggle Loop</button>
    </div>
  );
};
