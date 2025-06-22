import { css } from '@linaria/core';
import React from 'react';

export interface AnimationFileInputProps {
  onFileChange: (url: string) => void;
}

export const AnimationFileInput: React.FC<AnimationFileInputProps> = ({ onFileChange }) => (
  <label className={cssButton}
        tabIndex={0}
  
  >
    Load your own animation
    <input
      type="file"
      style={{ display: "none" }}
      accept=".json,.zip,.lottie"
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.name.endsWith(".json")) {
          const blobUrl = URL.createObjectURL(file);
          onFileChange(blobUrl);
        }
        alert("not supported yet");
      }}
    />
  </label>
);

const cssButton = css`
  border: 1px solid var(--border-color);
  height: var(--interactive-size);
  border-radius: var(--icon-button-border-radius);
  display: inline-flex;
  padding: 1rem;
  justify-content: center;
  align-items: center;
  @media (hover: hover) {
    &:hover {
      background: #F9F9F9;
    }
  }
  cursor: pointer;
`;