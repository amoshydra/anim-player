import { useEffect, useState } from 'react';
import { AnimationControls } from './AnimationControls';
import { TimeDisplay } from './TimeDisplay';
import { Timeline } from './Timeline';
import type { ControlledAnimation } from './classes/EnhancedLottiePlayer';

export interface AnimationControllerProps {
  animation: ControlledAnimation;
}

const pickProperties = {
  'totalFrames': 0,
  'isPaused': 0,
  'loop': 0,
  'currentFrame': 0,
  'segments': 0,
  'markers': 0,
} as const;
type Keys = keyof typeof pickProperties;
const properties = Object.keys(pickProperties) as Keys[];

const useRenderData = (animation: ControlledAnimation) => {
  const getData = ()  =>
    Object.fromEntries(properties.map(key => [key, animation[key]])) as Pick<ControlledAnimation, Keys>
  ;
  const [renderData, setRenderData] = useState(getData());
  useEffect(() => {
    let cancelled = false;
    let num = 0;
    const handler = () => {
      if (cancelled) return;
      setRenderData(getData());
      requestAnimationFrame(handler)
    };
    requestAnimationFrame(handler)
    return () => {
      cancelled = true;
      cancelAnimationFrame(num);
    }
  }, [animation])
  return renderData;
}

export const AnimationController = ({ animation: instance }: AnimationControllerProps) => {
  const [isPlayingBeforeScrub, setIsPlayingBeforeScrub] = useState<boolean>(false);
  const renderData = useRenderData(instance);

  const duration = renderData.totalFrames || -1;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: "space-between" }}>
        <AnimationControls
          isPaused={!!renderData.isPaused}
          loop={!!renderData.loop}
          onLoopChange={(isLooping) => instance.setLoop(isLooping)}
          onPause={() => instance.pause()}
          onPlay={() => instance.play()}
        />
        <TimeDisplay currentTime={renderData.currentFrame} duration={duration} />
      </div>
      <Timeline
        duration={duration}
        currentTime={renderData.currentFrame}
        //
        onSeek={(time: number) => {
          if (renderData) {
            const firstSegment = renderData.segments[0];
            if (firstSegment) {
              const isInSegment = firstSegment[0] <= time && time <= firstSegment[1];
              if (!isInSegment) {
              // clear segments
                instance.playSegments([], true);
              }
            }
            instance?.goToAndStop(Math.floor(time), true);
          }
        }}
        onScrub={(isScrubbing) => {
          if (isScrubbing) {
            setIsPlayingBeforeScrub(!renderData.isPaused);
            instance.pause();
          } else {
            if (isPlayingBeforeScrub) {
              instance.play();
            }
          }
        }}
        //
        isPlaying={!renderData.isPaused}
        onPlaybackChange={(shouldPlay) => {
          if (shouldPlay) {
            instance.play();
          } else {
            instance.pause();
          }
        }}
        //
        isLooping={!!renderData.loop}
        onLoopChange={(shouldLoop) => {
          instance.setLoop(shouldLoop);
        }}
        //
        markers={renderData.markers}
        onMarkerClick={(marker) => {
          if (!marker) {
            // clear segments
            instance.playSegments([], true);
            return;
          }

          const lastSegment = renderData.segments[renderData.segments.length - 1];
          if (lastSegment) {
            const isSegmentEqualMarker = marker.time === lastSegment[0] && (marker.duration + marker.time) === lastSegment[1];
            if (isSegmentEqualMarker) {
              // don't queue marker if it is being played as current segment
              return;
            }
          }

          instance.enqueueSegments(
            [
              [marker.time, marker.time + marker.duration],
            ],
          );
        }}
        //
        segments={renderData.segments}
      />
    </>
  );
};
