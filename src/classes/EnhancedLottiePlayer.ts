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
  realTotalFrames: number = 0;
  completed: boolean = false;

  constructor(config: AnimationConfigWithPath<T> | AnimationConfigWithData<T>) {
    this.config = config;

    const _animation = lottie.loadAnimation(config);

    const m = this;
    const animation = new Proxy(_animation, {
      get(target, property, receiver) {
        if (property === 'play') {
          m.completed = false;
          return Reflect.get(target, property, receiver);
        }
        if (property === 'segments') {
          if (m.segments.length === 0) {
            return [[0, m.realTotalFrames]]
          }
          return m.segments;
        }

        if (property === 'enqueueSegments') {
          return (incomingSegments: AnimationSegment[], dropUnPlayedSegment = false): void => {
            const existingSegments = m.segments.slice(0, dropUnPlayedSegment ? 1 : m.segments.length);
            m.segments = [...existingSegments, ...incomingSegments];
          }
        }
        return Reflect.get(target, property, receiver);
      }
    }) as ControlledAnimation;
    this.instance = animation;

    _animation.addEventListener("config_ready", () => {
      this.realTotalFrames = animation.totalFrames;
    });
    _animation.addEventListener("enterFrame", ({ currentTime }) => {
      this._renderFrame({ currentTime })
    });
    // handle when playback reached the last marker, we will resume playback if there are more segments to play
    _animation.addEventListener("complete", () => {
      if (this.segments.length > 0) {
        // @TODO: for actual usage, we may need to suprress this if there are indeed more segment to play
        const [start] = this.segments[0];
        if (!this.completed) {
          animation.goToAndPlay(start);
        }
        if (this.segments.length > 1) {
          animation.goToAndPlay(start);
        }
      }
    })
  }

  _renderFrame({ currentTime }: { currentTime: number }) {
    const segments = this.instance.segments;
    const marker = segments[0]

    const [start, _end] = marker;
    const end = _end - 1;

    let nextFrame = currentTime;
    nextFrame = Math.max(start, Math.min(nextFrame, end));

    if (nextFrame >= end) {
      if (segments.length > 1) {
        // drop current segment
        this.segments.shift();
        // play next segment's start
        const next = segments[0];
        nextFrame = next[0];
      } else {
        nextFrame = start;
        if (!this.instance.loop) {
          this.completed = true;
        }
      }
    } else if (nextFrame < start) {
      nextFrame = end;
      if (!this.instance.loop) {
        this.completed = true;
      }
    }

    if (this.completed) {
      if (!this.instance.isPaused) {
        this.instance.stop();
      }
    }
    this.instance.currentRawFrame = nextFrame;
  }

  destroy(name?: string) {
    this.instance.destroy(name);
  }
}
