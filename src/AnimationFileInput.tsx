import { css } from '@linaria/core';
import React, { useEffect, useState } from 'react';
import { GlobalDropzone } from './AnimationFileInputDropzone';

export interface AnimationFileInputProps {
  onFileChange: (url: string) => void;
  defaultFile: string;
}

export const AnimationFileInput: React.FC<AnimationFileInputProps> = ({ onFileChange, defaultFile }) => {
  return (
    <AnimationFileButton
      defaultFile={defaultFile}
      onFileChange={(content) => {
        onFileChange(content[0]);
      }}
    />
  )
};

interface AnimationFileButtonProps {
  onFileChange: (url: string[]) => void;
  defaultFile: string;
}
const AnimationFileButton: React.FC<AnimationFileButtonProps> = ({ onFileChange, defaultFile }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultFile) {
      setLoading(true);
      fetch(defaultFile).then((r) => {
        if (r.headers.get("content-type") === "application/json") {
          return r.blob().then(b => {
            const blobUrl = URL.createObjectURL(b);
            onFileChange([blobUrl]);
          })
        }
        return getUrl(r);
      }).finally(() => {
        setLoading(false);
      })
    }
  }, []);

  const getUrl = async (file?: File | Response) => {
    setLoading(true);
    try {
      if (!file) return;

      if (file instanceof File && file.name.endsWith(".json")) {
        // Handle JSON files
        const blobUrl = URL.createObjectURL(file);
        onFileChange([blobUrl]);
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
  }


  return (
    <>
      <label className={cssButton} tabIndex={0}>
        {loading ? "Processing..." : "Load your own animation"}
        <input
          type="file"
          style={{ display: "none" }}
          accept=".json,.zip,.lottie"
          onChange={(e) => {
            getUrl(e.currentTarget.files?.[0])
          }}
        />
      </label>
      <GlobalDropzone
        onFileDrop={getUrl}
      />
    </>

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
