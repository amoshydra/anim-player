import { css, cx } from '@linaria/core';
import { useEffect, useRef, useState } from 'react';

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
  onLoopChange
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
            const time = Math.min(Math.max(0, percent * duration), duration);

            setCursor(time);
            if (mouseDown) {
              onSeek(time);
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
        onSeek(cursor);
        setMouseDown(false);
        onScrub(false);
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
      switch (e.key.toLowerCase()) {
        case " ":
          onPlaybackChange(!isPlaying);
          break;
        case "arrowright": {
          onPlaybackChange(false);
          const t = Math.min(currentTime + 1, duration);
          onSeek(t);
          setCursor(t);
          break;
        }
        case "arrowleft": {
          onPlaybackChange(false);
          const t = Math.max(currentTime - 1, 0);
          onSeek(t);
          setCursor(t);
          break;
        }
        case "l": // L key for toggle loop
          onLoopChange(!isLooping);
          break;
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
        className={cssTimeline}
        ref={timelineRef}
        onPointerEnter={() => setMouseEnter(true)}
        onPointerLeave={() => setMouseEnter(false)}
        onPointerDown={() => {
          setMouseDown(true);
          onScrub(true);
        }}
      >
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


const cssTimelineContainer = css`
  width: 100%;
  background-color: #f0f0f0;
  margin-top: 20px;
  cursor: ew-resize;
`;

const cssTimeline = css`
  position: relative;
  height: 40px;
  width: 100%;
`;

const cssTimelineIndicator = css`
  inset: 0;
  position: absolute;
  height: 100%;
  width: 1px;
`;
const cssTimelineIndicatorCurrentTime = css`
  background-color: #4caf5099;
`;
const cssTimelineIndicatorCaretTime = css`
  background-color: #3d3d3d99;
`;
