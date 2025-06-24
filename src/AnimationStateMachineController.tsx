import type { AnimationItem } from "lottie-web";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Marker } from "./types/Animation";

export interface ControlledAnimation extends AnimationItem {
  markers: Marker[]
}

export const useControlledAnimation = (_animation: AnimationItem, autoplay: boolean): ControlledAnimation => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const animation = useMemo(() => {
    return new Proxy(_animation, {
      get(target, property, receiver) {
        if (property === 'isPaused') {
          return !isPlayingRef.current;
        }
        if (property === 'play') {
          return () => {
            setIsPlaying(true);
          }
        }
        if (property === 'pause') {
          return () => {
            setIsPlaying(false);
          }
        }
        return Reflect.get(target, property, receiver);
      }
    });
  }, [_animation]);

  useEffect(() => {
    let isRunning = true;
    let prevElapsed = 0;

    const run = (elapsed: number) => {
      if (!isRunning) return;

      if (isPlayingRef.current) {
        const START = 0;
        const END = animation.totalFrames;

        const delta = elapsed - prevElapsed;
        const advance = delta / 1000 * animation.frameRate;
        let nextFrame = (animation.currentFrame || START) + advance * animation.playDirection;
        nextFrame = Math.max(START, Math.min(nextFrame, END));

        if (nextFrame >= END) {
          if (animation.loop) {
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
