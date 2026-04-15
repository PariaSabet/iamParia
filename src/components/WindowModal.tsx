import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import folderIcon from '../assets/icons/folder.png'

export interface SidebarLink {
  icon: string
  label: string
  onClick?: () => void
}

interface WindowModalProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
  isMinimized?: boolean
  minimizeTargetRect?: DOMRect | null
  title: string
  icon?: string
  children: React.ReactNode
  itemCount?: number
  /** Custom status bar text. When provided, overrides the default "{itemCount} items" display. */
  statusText?: string
  /** Explorer-style View + Address rows (My Computer path). Off for app windows like Notepad. */
  showExplorerChrome?: boolean
  /** Links shown in the "Other Places" sidebar section. Only used when showExplorerChrome is true. */
  sidebarLinks?: SidebarLink[]
  /** Dynamic z-index for window stacking order. Higher values render on top. */
  zIndex?: number
  /** Called when the window is clicked to bring it to front. */
  onFocus?: () => void
}

export function WindowModal({
  isOpen,
  onClose,
  onMinimize,
  isMinimized = false,
  minimizeTargetRect = null,
  title,
  icon = folderIcon,
  children,
  itemCount,
  statusText,
  showExplorerChrome = true,
  sidebarLinks,
  zIndex = 50,
  onFocus,
}: WindowModalProps) {
  const WINDOW_WIDTH = 800
  const WINDOW_HEIGHT = 600
  const TASKBAR_HEIGHT = 40
  const MINIMIZE_ANIMATION_MS = 240
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  )
  const [isMinimizing, setIsMinimizing] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [windowTransform, setWindowTransform] = useState(
    'translate(0px, 0px) scale(1, 1)'
  )
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})
  const toggleSection = (id: string) =>
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }))

  const dragState = useRef({ isDragging: false, offsetX: 0, offsetY: 0 })
  const windowRef = useRef<HTMLDivElement>(null)
  const animationTimeoutRef = useRef<number | null>(null)
  const previousMinimizedRef = useRef(isMinimized)
  const previousNormalPositionRef = useRef<{ x: number; y: number } | null>(null)

  const getCenteredPosition = () => ({
    x: Math.max(0, (window.innerWidth - WINDOW_WIDTH) / 2),
    y: Math.max(0, (window.innerHeight - WINDOW_HEIGHT) / 2),
  })

  const clampPosition = (x: number, y: number) => ({
    x: Math.min(Math.max(0, x), Math.max(0, window.innerWidth - WINDOW_WIDTH)),
    y: Math.min(Math.max(0, y), Math.max(0, window.innerHeight - WINDOW_HEIGHT)),
  })

  useEffect(() => {
    if (isOpen && !position) {
      setPosition(getCenteredPosition())
    }
    if (!isOpen) {
      setPosition(null)
      setIsMaximized(false)
      previousNormalPositionRef.current = null
    }
  }, [isOpen, position])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.current.isDragging) return
      const maxX = Math.max(0, window.innerWidth - WINDOW_WIDTH)
      const maxY = Math.max(0, window.innerHeight - WINDOW_HEIGHT)
      const nextX = e.clientX - dragState.current.offsetX
      const nextY = e.clientY - dragState.current.offsetY
      setPosition({
        x: Math.min(Math.max(0, nextX), maxX),
        y: Math.min(Math.max(0, nextY), maxY),
      })
    }
    const handleMouseUp = () => {
      dragState.current.isDragging = false
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  useLayoutEffect(() => {
    const wasMinimized = previousMinimizedRef.current
    const isRestoringFromTaskbar = isOpen && wasMinimized && !isMinimized

    if (!isRestoringFromTaskbar) {
      previousMinimizedRef.current = isMinimized
      return
    }

    const windowRect = windowRef.current?.getBoundingClientRect()
    if (!windowRect || !minimizeTargetRect) {
      setIsRestoring(false)
      setWindowTransform('translate(0px, 0px) scale(1, 1)')
      previousMinimizedRef.current = isMinimized
      return
    }

    const scaleX = Math.max(0.1, minimizeTargetRect.width / windowRect.width)
    const scaleY = Math.max(0.1, minimizeTargetRect.height / windowRect.height)
    const deltaX = minimizeTargetRect.left - windowRect.left
    const deltaY = minimizeTargetRect.top - windowRect.top

    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current)
    }

    setIsRestoring(true)
    setWindowTransform(
      `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`
    )

    requestAnimationFrame(() => {
      setWindowTransform('translate(0px, 0px) scale(1, 1)')
    })

    animationTimeoutRef.current = window.setTimeout(() => {
      setIsRestoring(false)
    }, MINIMIZE_ANIMATION_MS)

    previousMinimizedRef.current = isMinimized
  }, [isMinimized, isOpen, minimizeTargetRect])

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (isMinimizing || isRestoring || isMaximized) return
    if (e.button !== 0) return
    e.preventDefault()
    const rect = windowRef.current?.getBoundingClientRect()
    if (!rect) return
    dragState.current = {
      isDragging: true,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    }
  }

  const handleMinimize = () => {
    if (!onMinimize || isMinimizing || isRestoring) return
    const windowRect = windowRef.current?.getBoundingClientRect()

    if (!windowRect || !minimizeTargetRect) {
      onMinimize()
      return
    }

    const scaleX = Math.max(0.1, minimizeTargetRect.width / windowRect.width)
    const scaleY = Math.max(0.1, minimizeTargetRect.height / windowRect.height)
    const deltaX = minimizeTargetRect.left - windowRect.left
    const deltaY = minimizeTargetRect.top - windowRect.top

    setIsMinimizing(true)
    setWindowTransform('translate(0px, 0px) scale(1, 1)')

    requestAnimationFrame(() => {
      setWindowTransform(
        `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`
      )
    })

    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current)
    }

    animationTimeoutRef.current = window.setTimeout(() => {
      setIsMinimizing(false)
      setWindowTransform('translate(0px, 0px) scale(1, 1)')
      onMinimize()
    }, MINIMIZE_ANIMATION_MS)
  }

  const handleToggleMaximize = () => {
    if (isAnimating) return

    if (!isMaximized) {
      previousNormalPositionRef.current = position
      setPosition({ x: 0, y: 0 })
      setIsMaximized(true)
      return
    }

    const previousPosition = previousNormalPositionRef.current
    if (previousPosition) {
      setPosition(clampPosition(previousPosition.x, previousPosition.y))
    } else {
      setPosition(getCenteredPosition())
    }
    setIsMaximized(false)
  }

  const isAnimating = isMinimizing || isRestoring

  if (!isOpen) return null
  if (isMinimized && !isAnimating) return null

  return (
    <div className="fixed inset-0" style={{ zIndex }}>
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-200"
        style={{ opacity: isMinimizing ? 0 : 1 }}
        onClick={isAnimating ? undefined : onClose}
      ></div>
      <div
        ref={windowRef}
        onMouseDown={onFocus}
        className={`absolute flex flex-col bg-[#ECE9D8] text-black shadow-xl overflow-hidden ${
          isMaximized ? '' : 'rounded-lg'
        } ${isAnimating ? 'pointer-events-none' : ''}`}
        style={{
          left: position?.x ?? 0,
          top: position?.y ?? 0,
          width: isMaximized ? '100vw' : `${WINDOW_WIDTH}px`,
          height: isMaximized
            ? `calc(100vh - ${TASKBAR_HEIGHT}px)`
            : `${WINDOW_HEIGHT}px`,
          borderRadius: isMaximized ? 0 : undefined,
          transform: windowTransform,
          transformOrigin: 'top left',
          transition: isAnimating
            ? 'transform 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms ease'
            : undefined,
          opacity: isMinimizing ? 0.88 : 1,
        }}
      >
        {/* Window Title Bar */}
        <div
          className={`bg-gradient-to-r from-[#0A246A] via-[#3A6EA5] to-[#0A246A] px-2 py-1 flex items-center justify-between cursor-grab active:cursor-grabbing select-none ${
            isMaximized ? '' : 'rounded-t-lg'
          }`}
          onMouseDown={handleTitleBarMouseDown}
        >
          <div className="flex items-center gap-2">
            <img src={icon} alt="Window Icon" className="w-4 h-4" />
            <span className="text-white">{title}</span>
          </div>
          <div className="flex gap-1">
            <button
              className="w-6 h-5 flex items-center justify-center rounded border border-white/25 bg-white/15 text-white/95 transition-colors hover:bg-white/25 active:bg-white/35"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleMinimize}
              title="Minimize"
              aria-label="Minimize window"
            >
              <svg
                viewBox="0 0 10 10"
                className="w-3 h-3"
                fill="none"
                aria-hidden="true"
              >
                <path d="M1 7.5h8" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
            <button
              className="w-6 h-5 flex items-center justify-center rounded border border-white/25 bg-white/15 text-white/95 transition-colors hover:bg-white/25 active:bg-white/35"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleToggleMaximize}
              title={isMaximized ? 'Restore Down' : 'Maximize'}
              aria-label={isMaximized ? 'Restore down' : 'Maximize window'}
            >
              {isMaximized ? (
                <svg
                  viewBox="0 0 10 10"
                  className="w-3 h-3"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3.2 2h4.8v4.8H3.2zM2 3.2H6.8V8H2z"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 10 10"
                  className="w-3 h-3"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="1.8"
                    y="1.8"
                    width="6.4"
                    height="6.4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              )}
            </button>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={onClose}
              className="w-6 h-5 flex items-center justify-center rounded border border-[#b63f3f] bg-[#d9534f]/85 text-white transition-colors hover:bg-[#e05f5b] active:bg-[#c84c48]"
              aria-label="Close window"
            >
              <svg
                viewBox="0 0 10 10"
                className="w-3 h-3"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 2l6 6M8 2L2 8"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
              </svg>
            </button>
          </div>
        </div>

        {showExplorerChrome ? (
          <>
            {/* Menu Bar */}
            <div className="bg-[#F1EFE2] border-b border-[#919B9C] px-1 py-0.5 flex items-center gap-0">
              {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map(
                (item) => (
                  <button
                    key={item}
                    className="px-2 py-0.5 text-sm hover:bg-[#c6c3b5] hover:shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#919B9C] rounded-sm"
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            {/* Navigation Toolbar */}
            <div className="bg-[#F1EFE2] border-b border-[#919B9C] px-1 py-0.5 flex items-center gap-0.5">
              {/* Back */}
              <button className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm hover:bg-[#c6c3b5] hover:shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#919B9C] opacity-50 cursor-default">
                <svg viewBox="0 0 16 16" className="w-5 h-5" fill="none">
                  <circle cx="8" cy="8" r="7" fill="#3C8A3F" opacity="0.85" />
                  <path d="M9.5 4.5L6 8l3.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs">Back</span>
                <svg viewBox="0 0 6 4" className="w-2 h-1.5"><path d="M0 0l3 3 3-3z" fill="#555" /></svg>
              </button>

              {/* Forward */}
              <button className="flex items-center gap-0.5 px-1 py-0.5 rounded-sm hover:bg-[#c6c3b5] hover:shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#919B9C] opacity-50 cursor-default">
                <svg viewBox="0 0 16 16" className="w-5 h-5" fill="none">
                  <circle cx="8" cy="8" r="7" fill="#3C8A3F" opacity="0.45" />
                  <path d="M6.5 4.5L10 8l-3.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Up */}
              <button className="flex items-center px-1.5 py-0.5 rounded-sm hover:bg-[#c6c3b5] hover:shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#919B9C]">
                <svg viewBox="0 0 16 16" className="w-5 h-5" fill="none">
                  <path d="M3 12h10V6H3z" fill="#F5D55E" stroke="#8B7730" strokeWidth="0.7" />
                  <path d="M3 6V4h4l1 2H3z" fill="#F5D55E" stroke="#8B7730" strokeWidth="0.7" />
                  <path d="M8 11V7.5M6 9.5l2-2 2 2" stroke="#3C8A3F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Separator */}
              <div className="w-px h-5 bg-[#919B9C] mx-1" />

              {/* Search */}
              <button className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm hover:bg-[#c6c3b5] hover:shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#919B9C]">
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                  <circle cx="6.5" cy="6.5" r="4" stroke="#3C6EB5" strokeWidth="1.3" />
                  <path d="M9.5 10l3.5 3.5" stroke="#3C6EB5" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-xs">Search</span>
              </button>

              {/* Folders */}
              <button className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm hover:bg-[#c6c3b5] hover:shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#919B9C]">
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                  <path d="M2 13h12V6H2z" fill="#F5D55E" stroke="#8B7730" strokeWidth="0.7" />
                  <path d="M2 6V4h4l1.5 2H2z" fill="#F5D55E" stroke="#8B7730" strokeWidth="0.7" />
                </svg>
                <span className="text-xs">Folders</span>
              </button>

              {/* Separator */}
              <div className="w-px h-5 bg-[#919B9C] mx-1" />

              {/* Views */}
              <button className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm hover:bg-[#c6c3b5] hover:shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#919B9C]">
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                  <rect x="1" y="1" width="5" height="5" rx="0.5" fill="#7B9CC6" stroke="#4A6F9C" strokeWidth="0.5" />
                  <rect x="8" y="1" width="5" height="5" rx="0.5" fill="#7B9CC6" stroke="#4A6F9C" strokeWidth="0.5" />
                  <rect x="1" y="8" width="5" height="5" rx="0.5" fill="#7B9CC6" stroke="#4A6F9C" strokeWidth="0.5" />
                  <rect x="8" y="8" width="5" height="5" rx="0.5" fill="#7B9CC6" stroke="#4A6F9C" strokeWidth="0.5" />
                </svg>
                <svg viewBox="0 0 6 4" className="w-2 h-1.5"><path d="M0 0l3 3 3-3z" fill="#555" /></svg>
              </button>
            </div>

            {/* Address Bar */}
            <div className="bg-[#F1EFE2] px-1 py-1 flex items-center gap-1.5 border-b border-[#919B9C]">
              <span className="text-xs font-normal pl-1">Address</span>
              <div className="flex-1 flex items-center bg-white border border-[#7F9DB9] rounded-sm overflow-hidden">
                <img src={icon} alt="" className="w-4 h-4 ml-1 shrink-0" />
                <span className="flex-1 px-1.5 py-0.5 text-sm truncate">
                  My Computer/ {title}
                </span>
                <button className="shrink-0 px-1 border-l border-[#7F9DB9] hover:bg-[#e4e1d4]">
                  <svg viewBox="0 0 6 4" className="w-2 h-1.5"><path d="M0 0l3 3.5 3-3.5z" fill="#333" /></svg>
                </button>
              </div>
              <button className="shrink-0 flex items-center gap-1 px-2 py-0.5 bg-[#F1EFE2] border border-[#919B9C] rounded-sm hover:bg-[#e4e1d4] hover:shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#919B9C] text-xs">
                <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
                  <path d="M2 6h6M8 6l-2.5-3M8 6L5.5 9" stroke="#3C8A3F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Go
              </button>
            </div>
          </>
        ) : null}

        {/* Content */}
        {showExplorerChrome ? (
          <div className="flex-1 min-h-0 flex bg-white">
            {/* Left Sidebar */}
            <div className="w-[180px] shrink-0 bg-[#D6DFF7] border-r border-[#919B9C] overflow-y-auto">
              {/* Tasks Section */}
              <div className="m-1.5 mb-0">
                <button
                  onClick={() => toggleSection('tasks')}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-t-md text-xs font-bold text-white"
                  style={{
                    background: 'linear-gradient(to right, #3169B3, #6A9BD6, #3169B3)',
                  }}
                >
                  <span>File and Folder Tasks</span>
                  <svg
                    viewBox="0 0 10 6"
                    className={`w-2.5 h-2 transition-transform ${collapsedSections.tasks ? '-rotate-90' : ''}`}
                    fill="white"
                  >
                    <path d="M0 0l5 5 5-5z" />
                  </svg>
                </button>
                {!collapsedSections.tasks && (
                  <div
                    className="px-2 py-2 rounded-b-md space-y-1.5"
                    style={{ background: 'linear-gradient(to bottom, #D6E5F7, #EFF3FA)' }}
                  >
                    <div className="flex items-center gap-1.5 text-xs text-[#1F4E8C] hover:underline cursor-default">
                      <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="none">
                        <rect x="1" y="3" width="10" height="8" rx="0.5" fill="#F5D55E" stroke="#8B7730" strokeWidth="0.6" />
                        <path d="M1 5V3.5h3.5l1 1.5H1z" fill="#F5D55E" stroke="#8B7730" strokeWidth="0.6" />
                      </svg>
                      Make a new folder
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#1F4E8C] hover:underline cursor-default">
                      <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="none">
                        <circle cx="6" cy="5" r="3.5" fill="#6BA3D6" stroke="#3A6EA5" strokeWidth="0.6" />
                        <path d="M6 8.5v2.5M4 11h4" stroke="#3A6EA5" strokeWidth="0.7" strokeLinecap="round" />
                      </svg>
                      Publish to the web
                    </div>
                  </div>
                )}
              </div>

              {/* Other Places Section */}
              {sidebarLinks && sidebarLinks.length > 0 && (
                <div className="m-1.5 mb-0">
                  <button
                    onClick={() => toggleSection('places')}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-t-md text-xs font-bold text-white"
                    style={{
                      background: 'linear-gradient(to right, #3169B3, #6A9BD6, #3169B3)',
                    }}
                  >
                    <span>Other Places</span>
                    <svg
                      viewBox="0 0 10 6"
                      className={`w-2.5 h-2 transition-transform ${collapsedSections.places ? '-rotate-90' : ''}`}
                      fill="white"
                    >
                      <path d="M0 0l5 5 5-5z" />
                    </svg>
                  </button>
                  {!collapsedSections.places && (
                    <div
                      className="px-2 py-2 rounded-b-md space-y-1.5"
                      style={{ background: 'linear-gradient(to bottom, #D6E5F7, #EFF3FA)' }}
                    >
                      {sidebarLinks.map((link, i) => (
                        <button
                          key={i}
                          onClick={link.onClick}
                          className="flex items-center gap-1.5 text-xs text-[#1F4E8C] hover:underline w-full text-left"
                        >
                          <img src={link.icon} alt="" className="w-4 h-4 shrink-0" />
                          {link.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Details Section */}
              <div className="m-1.5">
                <button
                  onClick={() => toggleSection('details')}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-t-md text-xs font-bold text-white"
                  style={{
                    background: 'linear-gradient(to right, #3169B3, #6A9BD6, #3169B3)',
                  }}
                >
                  <span>Details</span>
                  <svg
                    viewBox="0 0 10 6"
                    className={`w-2.5 h-2 transition-transform ${collapsedSections.details ? '-rotate-90' : ''}`}
                    fill="white"
                  >
                    <path d="M0 0l5 5 5-5z" />
                  </svg>
                </button>
                {!collapsedSections.details && (
                  <div
                    className="px-2 py-2 rounded-b-md"
                    style={{ background: 'linear-gradient(to bottom, #D6E5F7, #EFF3FA)' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <img src={icon} alt="" className="w-8 h-8" />
                      <span className="text-xs font-bold text-center">{title}</span>
                      {itemCount !== undefined && (
                        <span className="text-[10px] text-gray-600">
                          {itemCount} {itemCount === 1 ? 'item' : 'items'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 overflow-auto p-4">
              {children}
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden p-0">
            {children}
          </div>
        )}

        {/* Status Bar */}
        <div
          className={`shrink-0 bg-[#F1EFE2] border-t border-[#919B9C] px-2 py-0.5 ${
            isMaximized ? '' : 'rounded-b-lg'
          }`}
        >
          <span className="text-sm">
            {statusText ?? `${itemCount} items`}
          </span>
        </div>
      </div>
    </div>
  )
}
