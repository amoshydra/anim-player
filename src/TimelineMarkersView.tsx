import { css, cx } from "@linaria/core";
import { styled } from "@linaria/react";
import type { AnimationSegment } from "lottie-web";
import type { Marker } from "./types/Animation";


export interface TimelineMarkersViewProps {
  markers: Marker[];
  duration: number;
  onMarkerClick: (marker: Marker) => void;
  segments: AnimationSegment[] ;
}

export const TimelineMarkersView = ({ markers, duration, onMarkerClick, segments }: TimelineMarkersViewProps) => {
  return (
    <div className={cx(cssTimelineContainer)}>
      {
        segments.map((segment, index) => (
          <MarkerCurrentlyPlayingSegment
            key={segment.join(",") + ":" + index}
            style={{
              '--startTime': `${segment[0] / duration * 100}%`,
              '--endTime': `${segment[1] / duration * 100}%`,
              height: `calc(${Math.max(100 - index * 5, 0)}%)`,
            }}
          >
            {segments.length === 1 ? "" : index + 1}
          </MarkerCurrentlyPlayingSegment>
        ))
      }
      <div>
        {
          markers.map(marker => {
            return (
              <Marker
                key={marker.payload.name}
                style={{
                  '--width': `${marker.duration / duration * 100}%`,
                  '--left': `${marker.time / duration * 100}%`
                }}
                onPointerDown={e => {
                  e.stopPropagation();
                  onMarkerClick(marker);
                }}
              >
                <MarkerLabel>
                  <strong>{marker.payload.name}</strong>
                  <code>{marker.time}</code>
                  <code>{marker.time + marker.duration}</code>
                </MarkerLabel>
              </Marker>
            )
          })
        }
      </div>
    </div>
  )
}

const colorPalette  = [
  "#fbf8cc",
  "#fde4cf",
  "#ffcfd2",
  "#f1c0e8",
  "#cfbaf0",
  "#a3c4f3",
  "#90dbf4",
  "#8eecf5",
  "#98f5e1",
  "#b9fbc0",
]

const MarkerCurrentlyPlayingSegment = styled.div<{ style: {
  '--startTime': string;
  '--endTime': string;
}}>`
  bottom: 0;
  left: var(--startTime);
  right: calc(100% - var(--endTime));
  background: #e0e0e0;
  opacity: 0.25;
  &:first-child {
    background: #c0dfff;
    opacity: 0.5;
  }


  border-left-style: solid;
  border-right-style: solid;
  border-width: 1px;
  border-color: #909090;
  position: absolute;
  pointer-events: none;
`;

const Marker = styled.div<{ style: {
  '--width': string;
  '--left': string;
}}>`
  user-select: none;
  position: relative;

  width: var(--width);
  margin-left: var(--left);
  padding: 0.25rem 0.5rem;
  font-family: monospace;
  font-size: 0.8rem;
  line-height: 1.5;
  overflow: visible;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 0.25rem;
  ${
    colorPalette
      .map((color, index) => {
        return `
          &:nth-child(${index + 1}n) {
            background: ${color};
          }
        `;
      })
      .join('\n')
  }

  transition-property: filter;
  transition-duration: 0.1s;
  &:hover {
    filter: saturate(1.5);
  }
  &:active {
    filter: saturate(2.2);
  }
`;

const MarkerLabel = styled.div`
  pointer-events: none;
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  justify-content: space-between;
  > *:first-child {
    grid-column: span 2;
  }
  > *:last-child {
    text-align: right
  }
`;

const cssTimelineContainer = css`
  width: 100%;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`;
