import './StartMenu.css'
import emailIcon from '../assets/icons/Email.png'
import musicIcon from '../assets/icons/music.png'
import videoIcon from '../assets/icons/videos.png'
import pictureIcon from '../assets/icons/pictures.png'
import computerIcon from '../assets/icons/computer.png'
interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function StartMenu({ isOpen, onClose, className = '' }: StartMenuProps) {
  if (!isOpen) return null

  return (
    <div
      className={`fixed bottom-10 left-0
        min-h-96 shadow-lg
        w-full md:w-[320px] md:left-0 text-gray-950
        ${className}`}
    >
      <div className="start-menu-overlay" onClick={onClose} />
      <div className="start-menu">
        <div className="start-menu-left ">
          {/* <div className="menu-item">
            <img src="/icons/ie.png" alt="Internet" />
            <span>Internet Explorer</span>
          </div> */}
          <a
            href="mailto:pariasabet13@gmail.com?subject=Hello from your portfolio&body=Hi, I found your website and..."
            className="menu-item"
          >
            <div className="flex items-center">
              <img src={emailIcon} alt="Email" />
              <span>E-mail me</span>
            </div>
          </a>
          {/* <div className="menu-item">
            <img src="/icons/msn.png" alt="MSN" />
            <span>MSN Messenger Service</span>
          </div> */}
        </div>
        <div className="start-menu-right">
          {/* <div className="menu-item">
            <img src="/icons/documents.png" alt="Documents" />
            <span>My Documents</span>
          </div> */}
          <a
            href="https://instagram.com/pariasabet13"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-item"
          >
            <div className="flex items-center">
              <img src={pictureIcon} alt="Pictures" />
              <span>My Pictures</span>
            </div>
          </a>

          <a
            href="https://www.youtube.com/@pariasabet13"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-item"
          >
            <div className="flex items-center">
              <img src={videoIcon} alt="Videos" />
              <span>My Videos</span>
            </div>
          </a>

          <a
            href="https://open.spotify.com/user/paria_n_s?si=8903d2fec10f4c5b"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-item"
          >
            <div className="flex items-center">
              <img src={musicIcon} alt="Music" />
              <span>My Music</span>
            </div>
          </a>

          <a
            href="https://apple.fandom.com/wiki/Apple_M2_Max"
            target="_blank"
            rel="noopener noreferrer"
            className="menu-item"
          >
            <div className="flex items-center">
              <img src={computerIcon} alt="Computer" />
              <span>My Computer</span>
            </div>
          </a>
          {/* <div className="menu-item">
            <img src="/icons/control-panel.png" alt="Control Panel" />
            <span>Control Panel</span>
          </div> */}
        </div>
      </div>
    </div>
  )
}
