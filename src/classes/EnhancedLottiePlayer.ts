import lottie, { type AnimationConfigWithData, type AnimationConfigWithPath, type AnimationItem, type AnimationSegment, type RendererType } from "lottie-web";
import type { Marker } from "../types/Animation";

export interface ControlledAnimation extends AnimationItem {
  markers: Marker[]
  segments: AnimationSegment[];
  enqueueSegments (segments: AnimationSegment[], dropUnplayedSegments?: boolean): void;
}

export class EnhancedLottiePlayer<T extends RendererType = 'svg'> {
  config: AnimationConfigWithPath<T> | AnimationConfigWithData<T>;
  instance: ControlledAnimation;

  segments: AnimationSegment[] = [];
  isPlaying = false;
  prevElapsed = 0;
  isRunning = true

  constructor(config: AnimationConfigWithPath<T> | AnimationConfigWithData<T>) {
    this.config = config;

    const _animation = lottie.loadAnimation({
      ...config,
      autoplay: false, // we will control this ourselves
    });

    const m = this;
;   m.isPlaying = config.autoplay || false;

    // Setup animation runner
    const runAnimation = (elapsed: number) => {
      if (!m.isRunning) return;

      if (!animation.isPaused) {
        const marker = animation.segments[0]

        const START = marker[0];
        const END = marker[1];

        const delta = elapsed - m.prevElapsed;
        const advance = delta / 1000 * animation.frameRate;
        let nextFrame = (animation.currentFrame || START) + advance * animation.playDirection;
        nextFrame = Math.max(START, Math.min(nextFrame, END + 1));

        if (nextFrame > END) {
          if (animation.segments.length > 1) {
            animation.segments.shift();
            nextFrame = animation.segments[0][0];
          } else if (animation.loop) {
            nextFrame = START;
          } else {
            animation.pause();
          }
        } else if (nextFrame < START) {
          if (animation.loop) {
            nextFrame = END;
          } else {
            animation.pause();
          }
        }
        // @ts-expect-error - this is a private method
        animation.setCurrentRawFrameValue(nextFrame);
      }

      m.prevElapsed = elapsed;
      requestAnimationFrame(runAnimation);
    };

    const animation = new Proxy(_animation, {
      get(target, property, receiver) {
        if (property === 'isPaused') {
          return !m.isPlaying;
        }
        if (property === 'segments') {
          if (m.segments.length === 0) {
            return [[0, animation.totalFrames]]
          }
          return m.segments;
        }
        if (property === 'autoplay') {
          return config.autoplay ?? false;
        }

        // methods
        if (property === 'play') {
          return () => {
            m.isPlaying = true;
            requestAnimationFrame(runAnimation);
          }
        }
        if (property === 'pause') {
          return () => {
            m.isPlaying = false;
          }
        }
        if (property === 'enqueueSegments') {
          m.isPlaying = true;
          return (incomingSegments: AnimationSegment[], dropUnPlayedSegment = false): void => {
            const existingSegments = m.segments.slice(0, dropUnPlayedSegment ? 1 : m.segments.length);
            m.segments = [...existingSegments, ...incomingSegments];
          }
        }
        return Reflect.get(target, property, receiver);
      }
    }) as ControlledAnimation;
    this.instance = animation;


    if (config.autoplay) {
      requestAnimationFrame(runAnimation);
    }
  }

  destroy(name?: string) {
    this.instance.destroy(name);
  }
}
