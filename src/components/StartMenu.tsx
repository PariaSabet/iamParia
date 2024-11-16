import './StartMenu.css'

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function StartMenu({ isOpen, onClose, className = '' }: StartMenuProps) {
  if (!isOpen) return null

  return (
    <div
      className={`fixed bottom-10 left-0 bg-[#000080] text-white 
        min-h-96 shadow-lg
        w-full md:w-[320px] md:left-0 
        ${className}`}
    >
      <div className="start-menu-overlay" onClick={onClose} />
      <div className="start-menu">
        <div className="start-menu-left">
          <div className="menu-item">
            <img src="/icons/ie.png" alt="Internet" />
            <span>Internet Explorer</span>
          </div>
          <div className="menu-item">
            <img src="/icons/email.png" alt="Email" />
            <span>E-mail</span>
          </div>
          <div className="menu-item">
            <img src="/icons/msn.png" alt="MSN" />
            <span>MSN Messenger Service</span>
          </div>
        </div>
        <div className="start-menu-right">
          <div className="menu-item">
            <img src="/icons/documents.png" alt="Documents" />
            <span>My Documents</span>
          </div>
          <div className="menu-item">
            <img src="/icons/pictures.png" alt="Pictures" />
            <span>My Pictures</span>
          </div>
          <div className="menu-item">
            <img src="/icons/music.png" alt="Music" />
            <span>My Music</span>
          </div>
          <div className="menu-item">
            <img src="/icons/computer.png" alt="Computer" />
            <span>My Computer</span>
          </div>
          <div className="menu-item">
            <img src="/icons/control-panel.png" alt="Control Panel" />
            <span>Control Panel</span>
          </div>
        </div>
      </div>
    </div>
  )
}
