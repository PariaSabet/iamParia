import './StartMenu.css'
import emailIcon from '../assets/icons/Email.png'
import musicIcon from '../assets/icons/music.png'
import videoIcon from '../assets/icons/videos.png'
import pictureIcon from '../assets/icons/pictures.png'
import computerIcon from '../assets/icons/computer.png'
import userIcon from '../assets/icons/woman.png'
import linkedinIcon from '../assets/icons/linkedin.png'
import folderIcon from '../assets/icons/folder.png'
import gameIcon from '../assets/icons/folder-games.png'
import notepadIcon from '../assets/icons/notepad.png'
import aiCloneIcon from '../assets/icons/ai.png'
import resumeIcon from '../assets/icons/curriculum-vitae.png'
import githubIcon from '../assets/icons/git.png'
import resumePdf from '../assets/resume/Resume.pdf'
import { useEffect, useRef } from 'react'

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenProjects: () => void
  onOpenGames: () => void
  onOpenNotepad: () => void
  onOpenAIClone: () => void
  onLogOff: () => void
  onShutDown: () => void
  className?: string
}

export function StartMenu({
  isOpen,
  onClose,
  onOpenProjects,
  onOpenGames,
  onOpenNotepad,
  onOpenAIClone,
  onLogOff,
  onShutDown,
  className = '',
}: StartMenuProps) {
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

  const handleAction = (action: () => void) => {
    action()
    onClose()
  }

  return (
    <div
      ref={menuRef}
      className={`fixed bottom-10 left-0
        min-h-96 shadow-lg z-50
        w-full md:w-[380px] md:left-0 text-gray-950
        ${className}`}
    >
      <div className="start-menu flex flex-col rounded-t-lg">
        {/* User Header */}
        <div className="start-menu-header bg-gradient-to-r from-[#0A246A] via-[#3A6EA5] to-[#0A246A] rounded-t-lg">
          <div className="text-white px-4 py-3 flex items-center gap-3">
            <img
              className="w-12 h-12 border-2 border-white rounded-sm"
              src={userIcon}
              alt="Paria"
            />
            <span className="font-bold text-base">Paria Sabet</span>
          </div>
        </div>

        {/* Content area */}
        <div className="start-menu-content flex flex-row">
          {/* Left Panel */}
          <div className="start-menu-left flex flex-col justify-between">
            <div>
              {/* Pinned programs (large icons) */}
              <a
                href="https://linkedin.com/in/pariasabet"
                target="_blank"
                rel="noopener noreferrer"
                className="start-menu-item start-menu-pinned-item"
              >
                <img src={linkedinIcon} alt="LinkedIn" className="w-8 h-8 mr-3" />
                <div>
                  <div className="text-sm font-semibold">LinkedIn</div>
                  <div className="text-[11px] text-gray-500">Professional Network</div>
                </div>
              </a>
              <a
                href="mailto:pariasabet13@gmail.com?subject=Hello from your portfolio&body=Hi, I found your website and..."
                className="start-menu-item start-menu-pinned-item"
              >
                <img src={emailIcon} alt="Email" className="w-8 h-8 mr-3" />
                <div>
                  <div className="text-sm font-semibold">E-mail me</div>
                  <div className="text-[11px] text-gray-500">pariasabet13@gmail.com</div>
                </div>
              </a>

              <div className="start-menu-separator" />

              {/* Standard programs */}
              <button
                onClick={() => handleAction(onOpenProjects)}
                className="start-menu-item w-full"
              >
                <img src={folderIcon} alt="Projects" className="w-6 h-6 mr-2" />
                <span className="text-sm">My Projects</span>
              </button>
              <button
                onClick={() => handleAction(onOpenGames)}
                className="start-menu-item w-full"
              >
                <img src={gameIcon} alt="Games" className="w-6 h-6 mr-2" />
                <span className="text-sm">Games</span>
              </button>
              <button
                onClick={() => handleAction(onOpenNotepad)}
                className="start-menu-item w-full"
              >
                <img src={notepadIcon} alt="About Me" className="w-6 h-6 mr-2" />
                <span className="text-sm">About Me</span>
              </button>
              <button
                onClick={() => handleAction(onOpenAIClone)}
                className="start-menu-item w-full"
              >
                <img src={aiCloneIcon} alt="AI Clone" className="w-6 h-6 mr-2" />
                <span className="text-sm">AI Clone</span>
              </button>
              <a
                href={resumePdf}
                download
                className="start-menu-item"
              >
                <img src={resumeIcon} alt="Resume" className="w-6 h-6 mr-2" />
                <span className="text-sm">Resume</span>
              </a>
            </div>

            {/* All Programs footer */}
            <div className="start-menu-all-programs">
              <span className="text-sm">All Programs</span>
              <svg width="8" height="10" viewBox="0 0 8 10" className="ml-1 inline-block">
                <polygon points="0,0 8,5 0,10" fill="#2e7d32" />
              </svg>
            </div>
          </div>

          {/* Right Panel */}
          <div className="start-menu-right flex flex-col">
            {/* Documents group */}
            <a
              href={resumePdf}
              download
              className="start-menu-item"
            >
              <img src={resumeIcon} alt="Documents" className="w-4 h-4 mr-2" />
              <span className="text-sm font-bold">My Documents</span>
            </a>
            <a
              href="https://instagram.com/pariasabet13"
              target="_blank"
              rel="noopener noreferrer"
              className="start-menu-item"
            >
              <img src={pictureIcon} alt="Pictures" className="w-4 h-4 mr-2" />
              <span className="text-sm font-bold">My Pictures</span>
            </a>
            <a
              href="https://open.spotify.com/user/paria_n_s?si=8903d2fec10f4c5b"
              target="_blank"
              rel="noopener noreferrer"
              className="start-menu-item"
            >
              <img src={musicIcon} alt="Music" className="w-4 h-4 mr-2" />
              <span className="text-sm font-bold">My Music</span>
            </a>
            <a
              href="https://www.youtube.com/@pariasabet13"
              target="_blank"
              rel="noopener noreferrer"
              className="start-menu-item"
            >
              <img src={videoIcon} alt="Videos" className="w-4 h-4 mr-2" />
              <span className="text-sm font-bold">My Videos</span>
            </a>

            <div className="start-menu-separator" />

            {/* System group */}
            <a
              href="https://apple.fandom.com/wiki/Apple_M2_Max"
              target="_blank"
              rel="noopener noreferrer"
              className="start-menu-item"
            >
              <img src={computerIcon} alt="Computer" className="w-4 h-4 mr-2" />
              <span className="text-sm font-bold">My Computer</span>
            </a>
            <a
              href="https://github.com/pariasabet"
              target="_blank"
              rel="noopener noreferrer"
              className="start-menu-item"
            >
              <img src={githubIcon} alt="GitHub" className="w-4 h-4 mr-2" />
              <span className="text-sm font-bold">My Network Places</span>
            </a>
          </div>
        </div>

        {/* Shutdown bar */}
        <div className="start-menu-shutdown rounded-b-lg">
          <button
            onClick={() => handleAction(onLogOff)}
            className="start-menu-shutdown-btn"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-1">
              <path d="M6 1v6h4V1H6zM4 3.5 2.5 5l3 3L4 9.5 1 6.5V13h14V6.5L12 9.5 10.5 8l3-3L12 3.5 8 7.5 4 3.5z" fill="currentColor"/>
            </svg>
            Log Off
          </button>
          <button
            onClick={() => handleAction(onShutDown)}
            className="start-menu-shutdown-btn start-menu-shutdown-btn-off"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mr-1">
              <path d="M12 2v10M6.34 6.34a8 8 0 1 0 11.32 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Turn Off Computer
          </button>
        </div>
      </div>
    </div>
  )
}
