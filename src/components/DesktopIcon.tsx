import { useState, useRef } from 'react'

interface DesktopIconProps {
  icon: string
  label: string
  link?: string
  isDownload?: boolean
  onClick?: () => void
}

export function DesktopIcon({
  icon,
  label,
  link,
  isDownload,
  onClick,
}: DesktopIconProps) {
  const [isSelected, setIsSelected] = useState(false)
  const clickTimeoutRef = useRef<number | null>(null)

  const handleClick = () => {
    if (!clickTimeoutRef.current) {
      // First click
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

  return (
    <button
      onClick={handleClick}
      className={`w-24 flex flex-col items-center p-2 rounded
        ${isSelected ? 'bg-blue-500/30' : ''}`}
    >
      <img src={icon} alt={label} className="w-12 h-12" />
      <span className="text-center text-sm mt-1 break-words">{label}</span>
    </button>
  )
}
