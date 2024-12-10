import './StartMenu.css'
import emailIcon from '../assets/icons/Email.png'
import musicIcon from '../assets/icons/music.png'
import videoIcon from '../assets/icons/videos.png'
import pictureIcon from '../assets/icons/pictures.png'
import computerIcon from '../assets/icons/computer.png'
import userIcon from '../assets/icons/woman.png'
import { useEffect, useRef } from 'react'

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function StartMenu({ isOpen, onClose, className = '' }: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className={`fixed bottom-10 left-0
        min-h-96 shadow-lg z-50
        w-full md:w-[320px] md:left-0 text-gray-950
        ${className}`}
    >
      <div className="start-menu flex flex-col rounded-lg">
        <div className="start-menu-header bg-gradient-to-r from-[#0A246A] via-[#3A6EA5] to-[#0A246A] rounded-t-lg">
          <div className="text-white px-3 py-2 flex items-center gap-2 border-b">
            <img
              className="w-8 h-8 border border-transparent"
              src={userIcon}
              alt="Paria"
            />
            <span className="font-bold text-sm">Paria Sabet</span>
          </div>
        </div>
        <div className="start-menu-content flex flex-row h-full">
          <div className="start-menu-left rounded-bl-lg">
            <a
              href="mailto:pariasabet13@gmail.com?subject=Hello from your portfolio&body=Hi, I found your website and..."
              className="flex items-center p-2 cursor-pointer rounded hover:bg-[#316ac5] hover:text-white"
            >
              <div className="flex items-center">
                <img src={emailIcon} alt="Email" className="w-4 h-4 mr-2" />
                <span className="text-sm">E-mail me</span>
              </div>
            </a>
          </div>
          <div className="start-menu-right rounded-br-lg flex flex-col gap-2">
            <a
              href="https://instagram.com/pariasabet13"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-2 cursor-pointer rounded hover:bg-[#316ac5] hover:text-white"
            >
              <div className="flex items-center">
                <img
                  src={pictureIcon}
                  alt="Pictures"
                  className="w-4 h-4 mr-2"
                />
                <span className="text-sm">My Pictures</span>
              </div>
            </a>

            <a
              href="https://www.youtube.com/@pariasabet13"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-2 cursor-pointer rounded hover:bg-[#316ac5] hover:text-white"
            >
              <div className="flex items-center">
                <img src={videoIcon} alt="Videos" className="w-4 h-4 mr-2" />
                <span className="text-sm">My Videos</span>
              </div>
            </a>

            <a
              href="https://open.spotify.com/user/paria_n_s?si=8903d2fec10f4c5b"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-2 cursor-pointer rounded hover:bg-[#316ac5] hover:text-white"
            >
              <div className="flex items-center">
                <img src={musicIcon} alt="Music" className="w-4 h-4 mr-2" />
                <span className="text-sm">My Music</span>
              </div>
            </a>

            <a
              href="https://apple.fandom.com/wiki/Apple_M2_Max"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-2 cursor-pointer rounded hover:bg-[#316ac5] hover:text-white"
            >
              <div className="flex items-center">
                <img
                  src={computerIcon}
                  alt="Computer"
                  className="w-4 h-4 mr-2"
                />
                <span className="text-sm">My Computer</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
