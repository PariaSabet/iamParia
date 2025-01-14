import { marked } from 'marked'
import icon from '../assets/icons/notepad.png'
import markdownContent from '../assets/content/AboutMe'

interface NotepadWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function NotepadWindow({ isOpen, onClose }: NotepadWindowProps) {
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
            <span className="text-white">notepad</span>
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

        <div className="bg-[#F1EFE2] border-b border-[#919B9C] px-2 py-1 flex justify-start gap-3">
          <span className="text-sm">File</span>
          <span className="text-sm">Edit</span>
          <span className="text-sm">Format</span>
          <span className="text-sm">View</span>
          <span className="text-sm">Help</span>
        </div>

        <div className="p-4 overflow-auto h-[calc(100%-5rem)] bg-white font-mono">
          <div
            className="markdown-preview"
            dangerouslySetInnerHTML={{ __html: marked(markdownContent) }}
          />
          <textarea disabled className="w-full h-full p-2" />
        </div>
      </div>
    </div>
  )
}
