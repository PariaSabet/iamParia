interface DesktopIconProps {
  icon: string
  label: string
  link: string
}

export function DesktopIcon({ icon, label, link }: DesktopIconProps) {
  const handleClick = () => {
    window.open(link, '_blank')
  }

  return (
    <div
      className="flex flex-col items-center w-24 p-2 cursor-pointer group rounded hover:bg-white/10"
      onClick={handleClick}
    >
      <img
        src={icon}
        alt={label}
        className="w-12 h-12 mb-1 group-hover:scale-105 transition-transform"
        draggable="false"
      />
      <span
        className="text-white text-center text-sm px-1 break-words select-none
                   group-hover:bg-[#0b61ff] group-hover:text-white
                   whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
      >
        {label}
      </span>
    </div>
  )
}
