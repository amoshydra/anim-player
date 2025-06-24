import { styled } from "@linaria/react";
import { useEffect, useState } from "react";

export interface GlobalDropzoneProps {
  onFileDrop: (file: File) => void;
}

export const GlobalDropzone = ({ onFileDrop }: GlobalDropzoneProps) => {
  const [state, setState] = useState("");
  useEffect(() => {
    const dragend = () => {
      setState("");
    };
    
    const dragover = (e: DragEvent) => {
      setState("over");
      e.preventDefault();
      e.stopPropagation();
    };

    const drop = async (e: DragEvent) => {
      setState("");
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        onFileDrop(file);
      }
    };

    const ab = new AbortController();

    window.addEventListener('dragleave', dragend, { signal: ab.signal });
    window.addEventListener('dragover', dragover, { signal: ab.signal });
    window.addEventListener('drop', drop, { signal: ab.signal });

    return () => {
      ab.abort();
    };
  }, []);

  return (
    <DropZoneEffect
      data-drop-state={state}
    >
      Drop file here
    </DropZoneEffect>
  )
}

const DropZoneEffect = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  background: rgba(240, 240, 240, 1);
  transition-property: backdrop-filter, opacity;
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;
  opacity: 0;

  font-size: 2rem;

  display: flex;
  justify-content: center;
  align-items: center;
  &[data-drop-state="over"] {
    opacity: 0.9;
    backdrop-filter: blur(2px);
    transition-duration: 0.3s;
  }
`;
