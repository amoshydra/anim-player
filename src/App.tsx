import { css } from '@linaria/core';
import { useEffect, useRef, useState } from 'react';
import { Container } from './AnimationContainer';
import { AnimationController } from './AnimationController';
import { AnimationFileDataViewer } from './AnimationFileDataViewer';
import { AnimationFileInput } from './AnimationFileInput';
import { EnhancedLottiePlayer, type ControlledAnimation } from './classes/EnhancedLottiePlayer';
import { useQuery } from './services/useQuery';

export const App = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [animation, setAnimation] = useState<ControlledAnimation | null>(null)
  const [animationJsonPath, setAnimationJsonPath] = useState<string | undefined>(undefined);
  const queryOptions = useQuery();

  useEffect(() => {
    if (!containerRef.current) return;

    const player = new EnhancedLottiePlayer({
      container: containerRef.current,
      renderer: queryOptions.renderer,
      loop: queryOptions.loop,
      autoplay: queryOptions.autoPlay,
      path: animationJsonPath,
    });

    setAnimation(player.instance);

    return () => {
      setAnimation(null);
      player.destroy();
    }
  }, [animationJsonPath]);

  return (
    <>
      <Container ref={containerRef} />
      <br />
      {animation && (
        <AnimationController
          animation={animation}
        />
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
