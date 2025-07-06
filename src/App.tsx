import lottie, { type AnimationItem } from 'lottie-web';
import { useEffect, useRef, useState } from 'react';
import { Container } from './AnimationContainer';
import { AnimationControls } from './AnimationControls';
import { AnimationFileInput } from './AnimationFileInput';
import { useControlledAnimation } from './AnimationStateMachineController';
import { TimeDisplay } from './TimeDisplay';
import { Timeline } from './Timeline';
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
      <AnimationFileInput
        onFileChange={setAnimationJsonPath}
        defaultFile={queryOptions.file}
      />
    </>
  );
}


const AnimationController = ({ animation: _animation, autoPlay }: { animation: AnimationItem, autoPlay: boolean }) => {
  const animation = useControlledAnimation(_animation, autoPlay);
  const [isPlayingBeforeScrub, setIsPlayingBeforeScrub] = useState<boolean>(false)

  const handleSeek = (time: number) => {
    if (animation) {
      animation?.goToAndStop(Math.floor(time), true);
    }
  }

  const duration = animation?.getDuration(true) || -1;

  return (
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
        //
        markers={animation.markers}
        onMarkerClick={(marker) => {
          console.log(marker);
        }}
      />
    </>
  );
}
