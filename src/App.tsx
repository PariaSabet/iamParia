import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 5000) // 10 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isLoading ? (
        <div className="windows__bg">
          <div className="windows__bg--inner">
            <div className="windows__logo">
              <div className="windows__logo--inner red"></div>
              <div className="windows__logo--inner green"></div>
              <div className="windows__logo--inner blue"></div>
              <div className="windows__logo--inner yellow"></div>
            </div>
            <div className="windows__name">
              <p>Microsoft</p>
              <div className="windows__name--inner">
                Windows<span>xp</span>
              </div>
            </div>
            <div className="windows__bg--loading">
              <ul>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="welcome-screen">Welcome to Paria's PC</div>
      )}
    </>
  )
}

export default App
