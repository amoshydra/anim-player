import React from 'react';
import { LuMinus, LuPause, LuPlay, LuRepeat } from 'react-icons/lu';
import { IconButton } from './ComponentButtons';

export interface AnimationControlsProps {
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  loop: boolean;
  onLoopChange: (b: boolean) => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({ isPaused, onPlay, onPause, loop, onLoopChange }) => {
  return (
    <div style={{ display: 'inline-flex', gap: '8px' }}>
      {isPaused ? (
        <IconButton onClick={onPlay}>
          <LuPlay />
        </IconButton>
      ) : (
        <IconButton onClick={onPause}>
          <LuPause />
        </IconButton>
      )}
      <IconButton
        onClick={() => {
          const shouldLoop = !loop;
          onLoopChange(shouldLoop);
        }}
      >
        {loop ? <LuMinus /> : <LuRepeat />}
      </IconButton>
    </div>
  );
};
