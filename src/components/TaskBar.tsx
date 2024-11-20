import { useState, useEffect } from 'react'
import startIcon from '../assets/logo.svg'
import spotifyIcon from '../assets/icons/spotify.svg'
import { StartMenu } from './StartMenu'

export function TaskBar() {
  const [currentTime, setCurrentTime] = useState('')
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)

  const toggleStartMenu = () => {
    setIsStartMenuOpen(!isStartMenuOpen)
  }

  const handleSpotifyClick = () => {
    window.open(
      'https://open.spotify.com/user/paria_n_s?si=8903d2fec10f4c5b',
      '_blank'
    )
  }

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="h-10 bg-gradient-to-b from-[#245edb] via-[#2b76e9] to-[#1553c7] flex items-center justify-between w-full">
        <div
          className="h-full float-left text-2xl font-bold italic bg-[radial-gradient(circle,#5eac56_0%,#3c873c_100%)] bg-center bg-no-repeat bg-cover shadow-[inset_0px_5px_10px_#79ce71,4px_0_8px_#3f8cf3] py-[2px] pr-6 pl-2 text-shadow rounded-r-lg mr-4 cursor-pointer"
          onClick={toggleStartMenu}
        >
          <img src={startIcon} alt="Start" className="w-6 h-6 mr-2 inline" />
          <span className="text-white">Start</span>
        </div>
        <div className="flex items-center h-full">
          <div className="flex h-full float-right font-['calibri'] bg-[linear-gradient(to_bottom,#1290E9_0%,#19B9F3_9%,#1290E9_18%,#1290E9_92%,#1941A5_100%)] bg-center bg-no-repeat bg-cover shadow-[inset_0px_5px_10px_#14A5F0,0px_5px_10px_#333333] py-[9px] pr-6 pl-4 border-l border-[#092E51] text-shadow cursor-pointer uppercase">
            <div
              className="h-full flex items-center px-2 cursor-pointer hover:bg-[#1290E9]/20"
              onClick={handleSpotifyClick}
              title="Open Spotify Profile"
            >
              <img src={spotifyIcon} alt="Spotify" className="w-4 h-4" />
            </div>
            <div className="text-white">{currentTime}</div>
          </div>
        </div>
      </div>
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        className="w-full md:w-auto"
      />
    </>
  )
}
