import { useEffect, useState } from 'react'
import { WindowModal } from './WindowModal'
import pictureIcon from '../assets/icons/pictures.png'

export interface Wallpaper {
  id: string
  name: string
  backgroundImage: string
}

interface DisplayPropertiesWindowProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
  isMinimized?: boolean
  minimizeTargetRect?: DOMRect | null
  zIndex?: number
  onFocus?: () => void
  wallpapers: Wallpaper[]
  currentWallpaperId: string
  onApplyWallpaper: (id: string) => void
}

const TABS = ['Themes', 'Desktop', 'Screen Saver', 'Appearance', 'Settings']

export function DisplayPropertiesWindow({
  isOpen,
  onClose,
  onMinimize,
  isMinimized = false,
  minimizeTargetRect = null,
  zIndex,
  onFocus,
  wallpapers,
  currentWallpaperId,
  onApplyWallpaper,
}: DisplayPropertiesWindowProps) {
  const [selectedId, setSelectedId] = useState(currentWallpaperId)
  const [activeTab, setActiveTab] = useState<string>('Desktop')

  useEffect(() => {
    if (isOpen) {
      setSelectedId(currentWallpaperId)
      setActiveTab('Desktop')
    }
  }, [isOpen, currentWallpaperId])

  const selectedWallpaper =
    wallpapers.find((w) => w.id === selectedId) ?? wallpapers[0]

  const handleApply = () => {
    onApplyWallpaper(selectedId)
  }

  const handleOk = () => {
    onApplyWallpaper(selectedId)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <WindowModal
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
      isMinimized={isMinimized}
      minimizeTargetRect={minimizeTargetRect}
      title="Display Properties"
      icon={pictureIcon}
      showExplorerChrome={false}
      zIndex={zIndex}
      onFocus={onFocus}
    >
      <div className="flex h-full min-h-0 flex-col bg-[#ECE9D8] text-black p-4 gap-3 text-[13px]">
        <div className="flex items-end gap-0 border-b border-[#8a8a8a]">
          {TABS.map((tab) => {
            const isActive = tab === activeTab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-[12px] border border-[#8a8a8a] rounded-t-md -mb-px ${
                  isActive
                    ? 'bg-[#ECE9D8] border-b-[#ECE9D8] relative z-10 font-semibold'
                    : 'bg-[#D8D4C0] text-[#333] hover:bg-[#e3dfcb]'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-auto">
          {activeTab === 'Desktop' ? (
            <>
              <div className="flex justify-center">
                <div
                  className="relative"
                  style={{
                    width: 260,
                    height: 200,
                    background:
                      'linear-gradient(to bottom, #2a2a2a, #1a1a1a)',
                    border: '6px solid #2f2f2f',
                    borderRadius: 12,
                    padding: 10,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: selectedWallpaper?.backgroundImage,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '1px solid #000',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 60,
                      height: 10,
                      background: '#2f2f2f',
                      borderRadius: '0 0 6px 6px',
                    }}
                  />
                </div>
              </div>

              <fieldset className="border border-[#8a8a8a] rounded-sm p-3 bg-[#F5F4EA]">
                <legend className="text-[12px] px-1">Background:</legend>
                <div className="flex flex-col gap-1 max-h-48 overflow-auto border border-[#8a8a8a] bg-white p-1">
                  {wallpapers.map((wallpaper) => {
                    const isSelected = wallpaper.id === selectedId
                    return (
                      <button
                        key={wallpaper.id}
                        onClick={() => setSelectedId(wallpaper.id)}
                        onDoubleClick={() => {
                          setSelectedId(wallpaper.id)
                          onApplyWallpaper(wallpaper.id)
                        }}
                        className={`flex items-center gap-2 px-2 py-1 text-left text-[12px] ${
                          isSelected
                            ? 'bg-[#316ac5] text-white'
                            : 'bg-white text-black hover:bg-[#e3e3e3]'
                        }`}
                      >
                        <span
                          className="inline-block shrink-0 border border-[#8a8a8a]"
                          style={{
                            width: 28,
                            height: 20,
                            backgroundImage: wallpaper.backgroundImage,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                        <span>{wallpaper.name}</span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-[#555]">
              <p>The {activeTab} tab is not available in this demo.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={handleOk}
            className="min-w-[72px] px-3 py-1 text-[12px] bg-[#ECE9D8] border border-[#0A246A] rounded-sm hover:bg-[#F5F4EA] active:translate-y-[1px]"
          >
            OK
          </button>
          <button
            onClick={handleCancel}
            className="min-w-[72px] px-3 py-1 text-[12px] bg-[#ECE9D8] border border-[#8a8a8a] rounded-sm hover:bg-[#F5F4EA] active:translate-y-[1px]"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="min-w-[72px] px-3 py-1 text-[12px] bg-[#ECE9D8] border border-[#8a8a8a] rounded-sm hover:bg-[#F5F4EA] active:translate-y-[1px]"
          >
            Apply
          </button>
        </div>
      </div>
    </WindowModal>
  )
}
