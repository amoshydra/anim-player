import type { AnimationItem } from 'lottie-web';
import { useState } from 'react';
import { AnimationControls } from './AnimationControls';
import { useControlledAnimation } from './AnimationStateMachineController';
import { TimeDisplay } from './TimeDisplay';
import { Timeline } from './Timeline';

export interface AnimationControllerProps {
  animation: AnimationItem;
  autoPlay: boolean;
}
export const AnimationController = ({ animation: _animation, autoPlay }: AnimationControllerProps) => {
  const animation = useControlledAnimation(_animation, autoPlay);
  const [isPlayingBeforeScrub, setIsPlayingBeforeScrub] = useState<boolean>(false);

  const handleSeek = (time: number) => {
    if (animation) {
      animation?.goToAndStop(Math.floor(time), true);
    }
  };

  const duration = animation?.getDuration(true) || -1;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: "space-between" }}>
        <AnimationControls
          isPaused={!!animation.isPaused}
          loop={!!animation.loop}
          onLoopChange={(shouldLoop) => animation.setLoop(shouldLoop)}
          onPause={() => animation.pause()}
          onPlay={() => animation.play()} />
        <TimeDisplay currentTime={animation.currentFrame} duration={duration} />
      </div>
      <Timeline
        duration={duration}
        currentTime={animation.currentFrame}
        //
        onSeek={handleSeek}
        onScrub={(isScrubbing) => {
          if (isScrubbing) {
            setIsPlayingBeforeScrub(!animation.isPaused);
            animation.pause();
          } else {
            if (isPlayingBeforeScrub) {
              animation.play();
            }
          }
        }}
        //
        isPlaying={!animation.isPaused}
        onPlaybackChange={(shouldPlay) => {
          if (shouldPlay) {
            animation.play();
          } else {
            animation.pause();
          }
        }}
        //
        isLooping={!!animation.loop}
        onLoopChange={(shouldLoop) => {
          animation.setLoop(shouldLoop);
        }}
        //
        markers={animation.markers}
        onMarkerClick={(marker) => {
          console.log(marker);
        }} />
    </>
  );
};
