import { useState, useRef } from 'react'

interface DesktopIconProps {
  icon: string
  label: string
  link?: string
  isDownload?: boolean
  onClick?: () => void
  onContextMenu?: (e: React.MouseEvent<HTMLButtonElement>) => void
  isContextActive?: boolean
}

export function DesktopIcon({
  icon,
  label,
  link,
  isDownload,
  onClick,
  onContextMenu,
  isContextActive = false,
}: DesktopIconProps) {
  const [isSelected, setIsSelected] = useState(false)
  const clickTimeoutRef = useRef<number | null>(null)

  const handleClick = () => {
    if (!clickTimeoutRef.current) {
      setIsSelected(true)
      clickTimeoutRef.current = window.setTimeout(() => {
        clickTimeoutRef.current = null
        setIsSelected(false)
      }, 300)
    } else {
      clearTimeout(clickTimeoutRef.current)
      clickTimeoutRef.current = null
      setIsSelected(false)
      if (link) {
        if (isDownload) {
          window.open(link, '_blank')
        } else {
          window.open(link, '_blank', 'noopener,noreferrer')
        }
      } else if (onClick) {
        onClick()
      }
    }
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onContextMenu) return
    e.preventDefault()
    e.stopPropagation()
    onContextMenu(e)
  }

  const highlighted = isSelected || isContextActive

  return (
    <button
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`w-24 flex flex-col items-center p-2 rounded
        ${highlighted ? 'bg-blue-500/30' : ''}`}
    >
      <img src={icon} alt={label} className="w-12 h-12" />
      <span className="text-center text-sm mt-1 break-words">{label}</span>
    </button>
  )
}
