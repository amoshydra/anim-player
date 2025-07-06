import { css, cx } from '@linaria/core';
import type { AnimationItem } from 'lottie-web';
import React, { memo, useEffect, useRef, useState } from 'react';
import { LuInfo, LuX } from 'react-icons/lu';
import { AnimationFileDataViewerJsonViewer } from './AnimationFileDataViewerJsonViewer';
import { IconButton } from './ComponentButtons';
import type { MarkerUnprocessed } from './types/Animation';

interface AnimationFileDataViewerProps {
  animation: AnimationItem | null;
}

interface Data {
  assets: unknown[]
  ddd: number
  fr: number
  h: number
  ip: number
  layers: Exclude<object, null>[]
  markers: MarkerUnprocessed
  meta: {
    a: string;
    d: string;
    /**
     * @example "LottieFiles AE 3.1.1"
     */
    g: string;
    k: string;
    tc: string;
  }
  /**
   * name
   */
  nm: string
  op: number
  /**
   * @example "4.8.0"
   */
  v: string
  w: number;
}

export const AnimationFileDataViewer: React.FC<AnimationFileDataViewerProps> = memo(({ animation }) => {
  const animationData = useAnimationData(animation)
  const modalRef = useRef <HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const openModal = () => {
    modalRef.current?.showModal();
    setOpen(true);
  };

  const closeModal = () => {
    modalRef.current?.close();
  };

  if (!animationData) return null;

  return (
    <>
      <IconButton
        aria-label="View animation data"
        onClick={openModal}
      >
        <LuInfo />
      </IconButton>

      <dialog
        className={cssDialog}
        ref={modalRef}
        onClose={() => {
          setOpen(false);
        }}
      >
        <div className={cssDialogInner}>
          <div className={cx(cssDialogHeader, cssDialogContent)}>
            <IconButton
              data-outline="false"
              onClick={closeModal}
              aria-label='close'
            >
              <LuX />
            </IconButton>
            <h3 className={cssTitle}>Animation Data</h3>
          </div>
          <div className={cx(cssDialogContent, cssDataContainer)}>
            {open && animationData && (
              <>
                <div className={cssInfoViewContainer}>
                  <span className={cssLabel}>Name:</span>
                  <span className={cssData}>{animationData.nm}</span>

                  <span className={cssLabel}>Version:</span>
                  <span className={cssData}>{animationData.v}</span>

                  <span className={cssLabel}>Frame rate:</span>
                  <span className={cssData}>{animationData.fr}</span>

                  <span className={cssLabel}>Total frames:</span>
                  <span className={cssData}>{animationData.op}</span>
                </div>
                <AnimationFileDataViewerJsonViewer
                  data={animationData}
                />
              </>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
});

const tryRun = (fn: () => void) => {
  try {
    return fn()
  } catch (e) {
    // ignore
  }
}

const useAnimationData = (animation: AnimationItem | null | undefined) => {
  const [animationData, setAnimationData] = useState<Data | null>(null) ;

  useEffect(() => {
    const handler = () => {
      setAnimationData((animation as unknown as { animationData: Data }).animationData);
    }
    tryRun(() => {
      animation?.addEventListener("config_ready", handler);
    })
    return () => {
      tryRun(() => {
        animation?.removeEventListener("config_ready", handler);
      });
    }
  }, [animation]);

  return animationData;
}

const cssDialog = css`
  padding: 0;
  height: 100%;

  &::backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Ensure it's above other content */
  }
`;

const cssDialogInner = css`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

// Dialog header
const cssDialogHeader = css`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
`;
const cssTitle = css`
  font-size: 1.25rem;
  line-height: 1.25em;
  margin: 0;
  margin-top: 0.5rem;
`;

// General

const cssDialogContent = css`
  padding: 1rem;
`;

// Info view container
const cssLabel = css`
  font-weight: bold;
`;
const cssData = css`
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

const cssInfoViewContainer = css`
  display: grid;
  column-gap: 0.25rem;
  row-gap: 0.25rem;
  grid-template-columns: minmax(auto, max-content) minmax(auto, max-content);
  font-size: 1rem;
  white-space: nowrap;
  height: 8.25rem;
  overflow-x: auto;
`;

const cssDataContainer = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  flex-shrink: 1;
  row-gap: 1rem;
  align-content: start;
  white-space: nowrap;
`;
