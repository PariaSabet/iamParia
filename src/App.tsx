import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { WindowsLoader } from './components/WindowsLoader'
import { WelcomeScreen } from './components/WelcomeScreen'

function App() {
  const [screen, setScreen] = useState<'loading' | 'desktop' | 'shutdown' | 'off'>('loading')

  useEffect(() => {
    if (screen === 'loading') {
      const timer = setTimeout(() => setScreen('desktop'), 5000)
      return () => clearTimeout(timer)
    }
    if (screen === 'shutdown') {
      const timer = setTimeout(() => {
        document.body.style.background = '#000'
        setScreen('off')
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [screen])

  const handleLogOff = useCallback(() => setScreen('loading'), [])
  const handleShutDown = useCallback(() => setScreen('shutdown'), [])

  if (screen === 'loading') return <WindowsLoader />
  if (screen === 'shutdown') {
    return (
      <div className="fixed inset-0 bg-[#0A246A] flex items-center justify-center z-[9999]">
        <p className="text-white text-xl">Windows is shutting down...</p>
      </div>
    )
  }
  if (screen === 'desktop') {
    return <WelcomeScreen onLogOff={handleLogOff} onShutDown={handleShutDown} />
  }

  return (
    <div
      className="fixed inset-0 bg-black flex flex-col items-center justify-center cursor-pointer select-none"
      onClick={() => {
        document.body.style.background = ''
        setScreen('loading')
      }}
    >
      <p className="text-[#c0c0c0] text-lg">It is now safe to turn off your computer.</p>
      <p className="text-[#808080] text-sm mt-6 animate-pulse">Click anywhere to restart</p>
    </div>
  )
}

export default App
