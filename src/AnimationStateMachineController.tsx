import type { AnimationItem } from "lottie-web";
import { useEffect, useMemo, useRef, useState } from "react";

export const useControlledAnimation = (_animation: AnimationItem, autoplay: boolean) => {
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
        const delta = elapsed - prevElapsed;
        const advance = delta / 1000 * animation.frameRate;
        let nextFrame = (animation.currentFrame || 0) + advance * animation.playDirection;

        if (nextFrame > animation.totalFrames) {
          if (animation.loop) {
            nextFrame = 0;
          } else {
            nextFrame = animation.totalFrames;
            animation.goToAndStop(nextFrame, true);
          }
        } else if (nextFrame < 0) {
          if (animation.loop) {
            nextFrame = animation.totalFrames;
          } else {
            nextFrame = 0;
            animation.goToAndStop(nextFrame, true);
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
  return animation;
}
