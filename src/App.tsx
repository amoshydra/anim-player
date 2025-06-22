import lottie, { type AnimationItem } from 'lottie-web'
import { useEffect, useRef, useState } from 'react'
import './App.css'
import Timeline from './Timeline'

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [animation, setAnimation] = useState<AnimationItem | null>(null)
  const [, setTick] = useState<number>(0);

  useEffect(() => {
    let animationInstance: AnimationItem | null = null
    if (containerRef.current) {
      animationInstance = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: '/test-animation.json'
      })

      setAnimation(animationInstance)

      const cat = () => {
        setTick(v => v + 1);
        requestAnimationFrame(cat);
      }
      requestAnimationFrame(cat);

      return () => {
        if (animationInstance) animationInstance.destroy()
      }
    }
  }, [])

  const handleSeek = (time: number) => {
    if (animation) {
      animation?.goToAndStop(time, true);
    }
  }

  return (
    <>
      <div ref={containerRef} style={{ width: '500px', height: '500px', border: '1px solid #ccc' }}></div>
      <br />
      <Timeline
        duration={animation?.getDuration(true) || 0}
        currentTime={animation?.currentFrame || 0}
        onSeek={handleSeek}
        onScrub={(isScrubbing) => {
          if (isScrubbing) {
            animation?.pause();
          } else {
            animation?.play()
          }
        }}
      />
    </>
  )
}

export default App
