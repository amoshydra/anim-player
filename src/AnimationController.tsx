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

  const duration = animation.totalFrames || -1;

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
        onSeek={(time: number) => {
          if (animation) {
            const firstSegment = animation.segments[0];
            if (firstSegment) {
              const isInSegment = firstSegment[0] <= time && time <= firstSegment[1];
              if (!isInSegment) {
                animation.playSegments([], true);
              }
            }
            animation?.goToAndStop(Math.floor(time), true);
          }
        }}
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
          if (!marker) {
            animation.playSegments([], true);
            return;
          }

          const lastSegment = animation.segments[animation.segments.length - 1];
          if (lastSegment) {
            const isSegmentEqualMarker = marker.time === lastSegment[0] && (marker.duration + marker.time) === lastSegment[1];
            if (isSegmentEqualMarker) {
              // don't queue marker if it is being played as current segment
              return;
            }
          }

          animation.playSegments(
            [
              [marker.time, marker.time + marker.duration],
            ],
          );
        }}
        //
        segments={animation.segments}
      />
    </>
  );
};
