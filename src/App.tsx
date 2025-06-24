import lottie, { type AnimationItem } from 'lottie-web';
import { useEffect, useRef, useState } from 'react';
import { Container } from './AnimationContainer';
import { AnimationControls } from './AnimationControls';
import { AnimationFileInput } from './AnimationFileInput';
import { TimeDisplay } from './TimeDisplay';
import { Timeline } from './Timeline';
import { useQuery } from './services/useQuery';

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [animation, setAnimation] = useState<AnimationItem | null>(null)
  const [isPlayingBeforeScrub, setIsPlayingBeforeScrub] = useState<boolean>(false)
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
      renderer: 'svg',
      loop: false,
      autoplay: false,
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

  const handleSeek = (time: number) => {
    if (animation) {
      animation?.goToAndStop(Math.floor(time), true);
    }
  }

  const duration = animation?.getDuration(true) || -1;

  return (
    <>
      <Container ref={containerRef} />
      <br />
      {animation && (
        <>
          <div style={{ display: 'flex', justifyContent: "space-between" }}>
            <AnimationControls
              isPaused={!!animation.isPaused}
              loop={!!animation.loop}
              onLoopChange={(shouldLoop) => animation.setLoop(shouldLoop)}
              onPause={() => animation.pause()}
              onPlay={() => animation.play()}
            />
            <TimeDisplay currentTime={animation.currentFrame} duration={duration} />
          </div>
          <Timeline
            duration={duration}
            currentTime={animation.currentFrame}
            //
            onSeek={handleSeek}
            onScrub={(isScrubbing) => {
              if (isScrubbing) {
                setIsPlayingBeforeScrub(!animation.isPaused);
                animation.pause();
              } else {
                if (isPlayingBeforeScrub) {
                  animation.play()
                }
              }
            }}
            //
            isPlaying={!animation.isPaused}
            onPlaybackChange={(shouldPlay) => {
              if (shouldPlay) {
                animation.play();
              } else {
                animation.pause();
              }
            }}
            //
            isLooping={!!animation.loop}
            onLoopChange={(shouldLoop) => {
              animation.setLoop(shouldLoop);
            }}

          />
        </>
      )}
      <br />
      <AnimationFileInput
        onFileChange={setAnimationJsonPath}
        defaultFile={queryOptions.file}
      />
    </>
  )
}

export default App;
