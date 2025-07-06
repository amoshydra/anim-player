import { css, cx } from '@linaria/core';
import type { AnimationSegment } from 'lottie-web';
import { useEffect, useRef, useState } from 'react';
import { TimelineMarkersView } from './TimelineMarkersView';
import type { Marker } from './types/Animation';

interface TimelineProps {
  duration: number;
  currentTime: number;
  //
  onSeek: (time: number) => void;
  onScrub: (b: boolean) => void;
  //
  isPlaying: boolean;
  onPlaybackChange: (b: boolean) => void;
  //
  isLooping: boolean;
  onLoopChange: (b: boolean) => void;
  //
  markers: Marker[];
  onMarkerClick: (marker: Marker | null) => void;
  //
  segments: AnimationSegment[];
}

export const Timeline = ({
  duration,
  currentTime,
  //
  onSeek,
  onScrub,
  //
  isPlaying,
  onPlaybackChange,
  //
  isLooping,
  onLoopChange,
  //
  markers,
  onMarkerClick,
  //
  segments,
}: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseEnter, setMouseEnter] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      "pointermove",
      (e) => {
        if (timelineRef.current) {
          if (mouseEnter || mouseDown) {
            const rect = timelineRef.current.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const newTime = percent * duration;
            const clampedTime = Math.min(Math.max(0, newTime), duration);

            setCursor(clampedTime);
            if (mouseDown) {
              onSeek(clampedTime);
              if (newTime === clampedTime) {
                vibrate();
              }
            }
          }
        }
      },
      { signal: controller.signal }
    );
    return () => {
      controller.abort();
    };
  }, [duration, mouseDown, mouseEnter, onSeek]);

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      "pointerup",
      () => {
        if (mouseDown) {
          onSeek(cursor);
          setMouseDown(false);
          onScrub(false);
        }
      },
      { signal: controller.signal }
    );
    return () => {
      controller.abort();
    };
  }, [cursor, onSeek, onScrub]);

  // Keybindings functionality
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const processed = !(() => {
        if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) {
          return true;
        }

        if (e.key.match(/^[0-9]$/)) {
          if (e.key === "0") {
            onMarkerClick(null);
          }
          const markerIndex = parseInt(e.key, 10) - 1;
          const marker = markers[markerIndex];
          if (marker) {
            onMarkerClick(marker);
          }
          return;
        }

        switch (e.key.toLowerCase()) {
          case " ":
            onPlaybackChange(!isPlaying);
            return;
          case "arrowright": {
            onPlaybackChange(false);
            const firstFrame = segments[0][0];
            const lastFrame = segments[0][1];
            let t = currentTime + 1;
            if (t > lastFrame) {
              if (isLooping) {
                t = firstFrame
              } else {
                t = Math.min(t, lastFrame)
              }
            }
            onSeek(t);
            setCursor(t);
            return;
          }
          case "arrowleft": {
            onPlaybackChange(false);
            const firstFrame = segments[0][0];
            const lastFrame = segments[0][1];
            let t = currentTime - 1;
            if (t < firstFrame) {
              if (isLooping) {
                t = lastFrame
              } else {
                t = Math.max(t, firstFrame)
              }
            }
            onSeek(t);
            setCursor(t);
            return;
          }
          case "l": // L key for toggle loop
            onLoopChange(!isLooping);
            return;
        }
        return true;
      })();
      if (processed) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isPlaying, cursor, currentTime, duration, isLooping]);

  return (
    <div className={cssTimelineContainer}>
      <div
        tabIndex={0}
        className={cssTimeline}
        ref={timelineRef}
        onPointerEnter={() => setMouseEnter(true)}
        onPointerLeave={() => setMouseEnter(false)}
        onPointerDown={() => {
          setMouseDown(true);
          onScrub(true);
        }}
      >
        <TimelineMarkersView
          duration={duration}
          markers={markers}
          onMarkerClick={onMarkerClick}
          segments={segments}
        />
        <div
          className={cx(cssTimelineIndicator, cssTimelineIndicatorCaretTime)}
          style={{ left: `${(cursor / duration) * 100}%` }}
        />
        <div
          className={cx(cssTimelineIndicator, cssTimelineIndicatorCurrentTime)}
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />
      </div>
    </div>
  );
};

const vibrate = 'vibrate' in navigator ? () => navigator.vibrate(1) : () => {};

const cssTimelineContainer = css`
  width: 100%;
  margin-top: 20px;
  cursor: ew-resize;
  touch-action: none;
  padding: 1rem;
  border: 1px solid var(--borderColor);
`;

const cssTimeline = css`
  position: relative;
  background-color: none;
  padding-top: calc(var(--interactive-size) * 1.5);
  width: 100%;
`;

const cssTimelineIndicator = css`
  inset: 0;
  position: absolute;
  height: 100%;
  width: 1.1px;
  pointer-events: none;
`;
const cssTimelineIndicatorCurrentTime = css`
  background-color: #4caf5099;
`;
const cssTimelineIndicatorCaretTime = css`
  background-color: #3d3d3d99;
`;
