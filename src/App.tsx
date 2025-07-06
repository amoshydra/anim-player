import { css } from '@linaria/core';
import lottie, { type AnimationItem } from 'lottie-web';
import { useEffect, useRef, useState } from 'react';
import { Container } from './AnimationContainer';
import { AnimationController } from './AnimationController';
import { AnimationFileDataViewer } from './AnimationFileDataViewer';
import { AnimationFileInput } from './AnimationFileInput';
import { useQuery } from './services/useQuery';

export const App = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [animation, setAnimation] = useState<AnimationItem | null>(null)
  const [animationJsonPath, setAnimationJsonPath] = useState<string | undefined>(undefined);
  const [, setTick] = useState<number>(0);
  const queryOptions = useQuery();

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy existing animation
    if (animation) {
      animation.destroy();
    }

    const animationInstance = lottie.loadAnimation({
      container: containerRef.current,
      renderer: queryOptions.renderer,
      loop: queryOptions.loop,
      autoplay: false, // controlled
      path: animationJsonPath,
    });
    setAnimation(animationInstance);

    const cat = () => {
      setTick(v => v + 1);
      requestAnimationFrame(cat);
    }
    requestAnimationFrame(cat);

    return () => {
      animationInstance.destroy();
    }
  }, [animationJsonPath]);

  return (
    <>
      <Container ref={containerRef} />
      <br />
      {animation && (
        <AnimationController animation={animation} autoPlay={queryOptions.autoPlay}/>
      )}
      <br />
      <div className={cssRow}>
        <AnimationFileInput
          onFileChange={setAnimationJsonPath}
          defaultFile={queryOptions.file}
        />
        <AnimationFileDataViewer
          animationData={(animation as unknown as { animationData: object } | null)?.animationData}
        />
      </div>
    </>
  );
}

const cssRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
