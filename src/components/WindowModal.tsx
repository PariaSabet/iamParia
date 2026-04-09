import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import folderIcon from '../assets/icons/folder.png'

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
  /** Explorer-style View + Address rows (My Computer path). Off for app windows like Notepad. */
  showExplorerChrome?: boolean
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
  showExplorerChrome = true,
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
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-200"
        style={{ opacity: isMinimizing ? 0 : 1 }}
        onClick={isAnimating ? undefined : onClose}
      ></div>
      <div
        ref={windowRef}
        className={`absolute flex flex-col bg-[#ECE9D8] text-black shadow-xl overflow-hidden ${
          isAnimating ? 'pointer-events-none' : ''
        }`}
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
            <div className="bg-[#F1EFE2] border-b border-[#919B9C] px-2 py-1">
              <span className="text-sm">View</span>
            </div>
            <div className="bg-[#F1EFE2] px-2 py-1 flex items-center gap-2 border-b border-[#919B9C]">
              <span className="text-sm">Address</span>
              <div className="flex-1 bg-white border border-[#919B9C] px-2 py-0.5 text-sm">
                My Computer/ {title}
              </div>
            </div>
          </>
        ) : null}

        {/* Content */}
        <div
          className={
            showExplorerChrome
              ? 'flex-1 min-h-0 overflow-auto p-4 bg-white'
              : 'flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden p-0'
          }
        >
          {children}
        </div>

        {/* Status Bar */}
        <div
          className={`shrink-0 bg-[#F1EFE2] border-t border-[#919B9C] px-2 py-0.5 ${
            isMaximized ? '' : 'rounded-b-lg'
          }`}
        >
          <span className="text-sm">{itemCount} items</span>
        </div>
      </div>
    </div>
  )
}
