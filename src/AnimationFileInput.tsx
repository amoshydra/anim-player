import { css } from '@linaria/core';
import React, { useState } from 'react';

export interface AnimationFileInputProps {
  onFileChange: (url: string) => void;
}

export const AnimationFileInput: React.FC<AnimationFileInputProps> = ({ onFileChange }) => {
  return (
    <AnimationFileButton
      onFileChange={(content) => {
        console.log(content);
        onFileChange(content[0]);
      }}
    />
  )
};


interface AnimationFileButtonProps {
  onFileChange: (url: string[]) => void;
}
const AnimationFileButton: React.FC<AnimationFileButtonProps> = ({ onFileChange }) => {
  const [loading, setLoading] = useState(false);
  return (
    <label className={cssButton} tabIndex={0}>
      {loading ? "Processing..." : "Load your own animation"}
      <input
        type="file"
        style={{ display: "none" }}
        accept=".json,.zip,.lottie"
        onChange={async (e) => {
          setLoading(true);
          try {
            const file = e.target.files?.[0];
            if (!file) return;

            if (file.name.endsWith(".json")) {
              // Handle JSON files
              const blobUrl = URL.createObjectURL(file);
              onFileChange([blobUrl]);
              return;
            }
            
            if (!(file.name.endsWith(".zip") || file.name.endsWith(".lottie"))) {
              console.warn("Unsupported file format");
              alert("Unsupported file format. Please upload a .json or .zip file.");
              return;
            }
            // Handle ZIP files
            try {
              const arrayBuffer = await file.arrayBuffer();
              const uint8Array = new Uint8Array(arrayBuffer);
              const { default: JSZip } = await import('jszip/dist/jszip.min.js');
              const unzippedFiles = await JSZip.loadAsync(uint8Array);
              const jsonFileNames = Object.keys(unzippedFiles.files)
                .filter(name => {
                  if (!name.endsWith('.json')) return false
                  if (name.startsWith('animations/') || name.startsWith('a/')) return true;
                  return false;
                });
              if (jsonFileNames.length) {
                const blobs: string[] = []
                for (const fileName of jsonFileNames) {
                  const jsonBlob = await unzippedFiles.file(fileName)!.async('blob');
                  const blobUrl = URL.createObjectURL(jsonBlob);
                  blobs.push(blobUrl);
                }
                onFileChange(blobs);
              } else {
                console.warn("No JSON file found in ZIP");
                alert("No Lottie animation JSON file found in the ZIP archive.");
                return;
              }
            } catch (error) {
              console.error("Error processing ZIP file:", error);
              alert("Failed to process ZIP file. Please try again.");
              return;
            }
          } finally {
            setLoading(false);
          }
        }}
      />
    </label>
  )
};

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
