import { useState, useEffect } from 'react'
import startIcon from '../assets/logo.svg'

export function TaskBar() {
  const [currentTime, setCurrentTime] = useState('')

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
    <div className="h-10 bg-gradient-to-b from-[#245edb] via-[#2b76e9] to-[#1553c7] flex items-center justify-between">
      <div className="h-full float-left text-[22px] font-bold italic bg-[radial-gradient(circle,#5eac56_0%,#3c873c_100%)] bg-center bg-no-repeat bg-cover shadow-[inset_0px_5px_10px_#79ce71,4px_0_8px_#3f8cf3] py-[2px] pr-[25px] pl-[10px] text-shadow rounded-r-lg mr-4 cursor-pointer">
        <img src={startIcon} alt="Start" className="w-6 h-6 mr-2 inline" />
        <span className="text-white">Start</span>
      </div>
      <div className="h-full float-right font-['calibri'] bg-[linear-gradient(to_bottom,#1290E9_0%,#19B9F3_9%,#1290E9_18%,#1290E9_92%,#1941A5_100%)] bg-center bg-no-repeat bg-cover shadow-[inset_0px_5px_10px_#14A5F0,0px_5px_10px_#333333] py-[9px] pr-[15px] pl-[25px] border-l border-[#092E51] text-shadow cursor-pointer uppercase">
        <div className="text-white">{currentTime}</div>
      </div>
    </div>
  )
}
