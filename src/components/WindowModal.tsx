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
}: WindowModalProps) {
  const WINDOW_WIDTH = 800
  const WINDOW_HEIGHT = 600
  const MINIMIZE_ANIMATION_MS = 240
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  )
  const [isMinimizing, setIsMinimizing] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [windowTransform, setWindowTransform] = useState(
    'translate(0px, 0px) scale(1, 1)'
  )
  const dragState = useRef({ isDragging: false, offsetX: 0, offsetY: 0 })
  const windowRef = useRef<HTMLDivElement>(null)
  const animationTimeoutRef = useRef<number | null>(null)
  const previousMinimizedRef = useRef(isMinimized)

  useEffect(() => {
    if (isOpen && !position) {
      setPosition({
        x: Math.max(0, (window.innerWidth - WINDOW_WIDTH) / 2),
        y: Math.max(0, (window.innerHeight - WINDOW_HEIGHT) / 2),
      })
    }
    if (!isOpen) {
      setPosition(null)
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
    if (isMinimizing || isRestoring) return
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
        className={`absolute bg-[#ECE9D8] text-black w-[800px] h-[600px] rounded-lg shadow-xl ${
          isAnimating ? 'pointer-events-none' : ''
        }`}
        style={{
          left: position?.x ?? 0,
          top: position?.y ?? 0,
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
          className="bg-gradient-to-r from-[#0A246A] via-[#3A6EA5] to-[#0A246A] px-2 py-1 flex items-center justify-between rounded-t-lg cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleTitleBarMouseDown}
        >
          <div className="flex items-center gap-2">
            <img src={icon} alt="Window Icon" className="w-4 h-4" />
            <span className="text-white">{title}</span>
          </div>
          <div className="flex gap-1">
            <button
              className="text-white hover:bg-[#1f3b69] px-2 rounded"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleMinimize}
              title="Minimize"
            >
              -
            </button>
            <button
              className="text-white hover:bg-[#1f3b69] px-2 rounded"
              onMouseDown={(e) => e.stopPropagation()}
            >
              □
            </button>
            <button
              onMouseDown={(e) => e.stopPropagation()}
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
