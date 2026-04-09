import { marked } from 'marked'
import icon from '../assets/icons/notepad.png'
import markdownContent from '../assets/content/AboutMe'
import { WindowModal } from './WindowModal'

interface NotepadWindowProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
  isMinimized?: boolean
  minimizeTargetRect?: DOMRect | null
}

export function NotepadWindow({
  isOpen,
  onClose,
  onMinimize,
  isMinimized = false,
  minimizeTargetRect = null,
}: NotepadWindowProps) {
  return (
    <WindowModal
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
      isMinimized={isMinimized}
      minimizeTargetRect={minimizeTargetRect}
      title="notepad"
      icon={icon}
      itemCount={1}
      showExplorerChrome={false}
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0 bg-[#F1EFE2] border-b border-[#919B9C] px-2 py-1 flex justify-start gap-3">
          <span className="text-sm">File</span>
          <span className="text-sm">Edit</span>
          <span className="text-sm">Format</span>
          <span className="text-sm">View</span>
          <span className="text-sm">Help</span>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-white p-0 font-mono">
          <div
            className="markdown-preview px-2 py-1"
            dangerouslySetInnerHTML={{ __html: marked(markdownContent) }}
          />
          <textarea disabled className="w-full border-0 bg-transparent px-2 py-1" />
        </div>
      </div>
    </WindowModal>
  )
}
