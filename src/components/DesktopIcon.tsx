interface DesktopIconProps {
  icon: string
  label: string
  link: string
  isDownload?: boolean
}

export function DesktopIcon({
  icon,
  label,
  link,
  isDownload,
}: DesktopIconProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      download={isDownload}
      className="w-24 h-24 flex flex-col items-center justify-center gap-1 p-2 rounded hover:bg-white/10 cursor-pointer"
    >
      <img src={icon} alt={label} className="w-12 h-12" />
      <span className="text-sm text-center">{label}</span>
    </a>
  )
}
