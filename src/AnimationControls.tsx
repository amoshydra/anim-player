import { styled } from '@linaria/react';
import React from 'react';
import { LuMinus, LuPause, LuPlay, LuRepeat } from 'react-icons/lu';

export interface AnimationControlsProps {
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  loop: boolean;
  onLoopChange: (b: boolean) => void;
}

const IconButton = styled.button`
  background: none;
  border: 1px solid var(--icon-button-border-color);
  cursor: pointer;
  width: var(--icon-button-size);
  height: var(--icon-button-size);
  display: inline-flex;
  padding: 0;
  justify-content: center;
  align-items: center;
  border-radius: var(--icon-button-border-radius);
  > svg {
    stroke: gray;
    flex-basis: 1.5rem;
    height: 1.5rem;
    width: 1.5rem;
  }
`;

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
