import lottie from 'lottie-web'
import { useEffect } from 'react'
import './App.css'

function App() {
  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: document.getElementById('animation-container')!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/test-animation.json'
    })

    return () => {
      animation.destroy()
    }
  }, [])

  return (
    <>
      <h1>Lottie Animation Viewer</h1>
      <div id="animation-container" style={{ width: '500px', height: '500px' }}></div>
    </>
  )
}

export default App
