import React from 'react';

export interface TimeDisplayProps {
  currentTime: number;
  duration: number;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({ currentTime, duration }) => {
  return (
    <div>
      {currentTime.toFixed(2)} : {duration.toFixed(2)}
    </div>
  );
};
