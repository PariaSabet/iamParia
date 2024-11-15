import { useState, useEffect } from 'react'
import './App.css'
import { WindowsLoader } from './components/WindowsLoader'
import { WelcomeScreen } from './components/WelcomeScreen'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 5000) // 5 seconds

    return () => clearTimeout(timer)
  }, [])

  return <>{isLoading ? <WindowsLoader /> : <WelcomeScreen />}</>
}

export default App
