import type { AnimationItem, AnimationSegment } from "lottie-web";
import { useEffect, useMemo } from "react";
import type { Marker } from "./types/Animation";

export interface ControlledAnimation extends AnimationItem {
  markers: Marker[]
  segments: AnimationSegment[];
}

export const useControlledAnimation = (_animation: AnimationItem, autoplay: boolean): ControlledAnimation => {
  const animation = useMemo(() => {
    let segments: AnimationSegment[] = [];
    let isPlaying = autoplay;

    return new Proxy(_animation, {
      get(target, property, receiver) {
        if (property === 'isPaused') {
          return !isPlaying;
        }
        if (property === 'play') {
          return () => {
            isPlaying = true;
          }
        }
        if (property === 'pause') {
          return () => {
            isPlaying = false;
          }
        }
        if (property === 'segments') {
          if (segments.length === 0) {
            return [[0, animation.totalFrames]]
          }
          return segments;
        }
        if (property === 'playSegments') {
          isPlaying = true;
          return (_segments: AnimationSegment | AnimationSegment[], forced = false): void => {
            const incomingSegments = ((): AnimationSegment[] => {
              if (_segments.length === 0) return [];

              const firstElement = _segments[0];
              if (typeof firstElement === "number") {
                return [_segments] as AnimationSegment[];
              }
              return _segments as AnimationSegment[];
            })();

            if (forced) {
              segments = incomingSegments;
              return;
            }

            // @TODO implement exit and entry animation
            segments = [
              ...segments, // drop unplayed segment
              ...incomingSegments
            ];
          }
        }
        return Reflect.get(target, property, receiver);
      }
    });
  }, [_animation, autoplay]) as ControlledAnimation;

  useEffect(() => {
    let isRunning = true;
    let prevElapsed = 0;

    const run = (elapsed: number) => {
      if (!isRunning) return;

      if (!animation.isPaused) {
        const marker = animation.segments[0]

        const START = marker[0];
        const END = marker[1];

        const delta = elapsed - prevElapsed;
        const advance = delta / 1000 * animation.frameRate;
        let nextFrame = (animation.currentFrame || START) + advance * animation.playDirection;
        nextFrame = Math.max(START, Math.min(nextFrame, END));

        if (nextFrame >= END) {
          if (animation.segments.length > 1) {
            animation.segments.shift();
            nextFrame = animation.segments[0][0];
          } else if (animation.loop) {
            nextFrame = START;
          } else {
            animation.pause();
          }
        } else if (nextFrame <= START) {
          if (animation.loop) {
            nextFrame = END;
          } else {
            animation.pause();
          }
        }
        // @ts-expect-error - this is a private method
        animation.setCurrentRawFrameValue(nextFrame);
      }

      prevElapsed = elapsed;
      requestAnimationFrame(run);
    };
    run(0);

    return () => {
      isRunning = false;
    }
  }, [animation]);
  return animation as ControlledAnimation;
}
