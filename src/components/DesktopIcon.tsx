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
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (link) {
      window.open(link, '_blank')
    }
  }

  return (
    <a
      className="w-24 flex flex-col items-center p-2 cursor-pointer hover:bg-white hover:bg-opacity-20 rounded"
      onClick={handleClick}
      download={isDownload}
    >
      <img src={icon} alt={label} className="w-12 h-12 mb-1" />
      <span className="text-center text-sm break-words w-full text-shadow-sm">
        {label}
      </span>
    </a>
  )
}
