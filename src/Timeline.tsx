import React, { useEffect, useRef, useState } from 'react'
import './Timeline.css'

interface TimelineProps {
  duration: number
  onSeek: (time: number) => void
  onScrub: (b: boolean) => void
  currentTime: number
}

const Timeline: React.FC<TimelineProps> = ({ duration, onSeek, onScrub, currentTime }) => {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseEnter, setMouseEnter] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener("pointermove", (e) => {
      if (timelineRef.current) {
        if (mouseEnter || mouseDown) {
          const rect = timelineRef.current.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width
          const time = Math.min(Math.max(0, percent * duration), duration);
          
          setCursor(time);
          if (mouseDown) {
            onSeek(time);
          }
        }
      }
    }, {
      signal: controller.signal
    });
    return () => {
      controller.abort();
    }
  }, [mouseDown, mouseEnter]);
  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener("pointerup", () => {
      onSeek(cursor);
      setMouseDown(false);
      onScrub(false);
    }, {
      signal: controller.signal
    });
    return () => {
      controller.abort();
    }
  }, [cursor]);

  return (
    <div className="timeline-container">
      <div
        ref={timelineRef}
        className="timeline"
        onPointerEnter={() => {
          setMouseEnter(true);
        }}
        onPointerLeave={() => {
          setMouseEnter(false);
        }}
        onPointerDown={() => {
          setMouseDown(true);
          onScrub(true);
        }}
      >
        <div className="timeline-indicator timeline-indicator__current-time" style={{ left: `${(currentTime / duration) * 100}%` }}></div>
        <div className="timeline-indicator timeline-indicator__caret-time" style={{ left: `${(cursor / duration) * 100}%` }}></div>
      </div>
    </div>
  )
}

export default Timeline
