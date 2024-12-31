import folderIcon from '../assets/icons/folder.png'

interface WindowModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  icon?: string
  children: React.ReactNode
  itemCount?: number
}

export function WindowModal({
  isOpen,
  onClose,
  title,
  icon = folderIcon,
  children,
  itemCount,
}: WindowModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-[#ECE9D8] text-black w-[800px] h-[600px] rounded-lg shadow-xl">
        {/* Window Title Bar */}
        <div className="bg-gradient-to-r from-[#0A246A] via-[#3A6EA5] to-[#0A246A] px-2 py-1 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-2">
            <img src={icon} alt="Window Icon" className="w-4 h-4" />
            <span className="text-white">{title}</span>
          </div>
          <div className="flex gap-1">
            <button className="text-white hover:bg-[#1f3b69] px-2 rounded">
              -
            </button>
            <button className="text-white hover:bg-[#1f3b69] px-2 rounded">
              □
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-red-600 px-2 rounded"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-[#F1EFE2] border-b border-[#919B9C] px-2 py-1">
          <span className="text-sm">View</span>
        </div>

        {/* Address Bar */}
        <div className="bg-[#F1EFE2] px-2 py-1 flex items-center gap-2 border-b border-[#919B9C]">
          <span className="text-sm">Address</span>
          <div className="flex-1 bg-white border border-[#919B9C] px-2 py-0.5 text-sm">
            My Computer/ {title}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto h-[calc(100%-8rem)] bg-white">
          {children}
        </div>

        {/* Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#F1EFE2] border-t border-[#919B9C] px-2 py-0.5">
          <span className="text-sm">{itemCount} items</span>
        </div>
      </div>
    </div>
  )
}
