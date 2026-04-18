import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './ContextMenu.css'

export interface ContextMenuItem {
  id?: string
  label?: string
  icon?: string
  disabled?: boolean
  separator?: boolean
  checked?: boolean
  bold?: boolean
  accelerator?: string
  submenu?: ContextMenuItem[]
  onClick?: () => void
}

interface ContextMenuProps {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
  /** Internal: used by submenus so the outside-click handler is only owned by the root. */
  isSubmenu?: boolean
}

const MENU_PADDING = 4

export function ContextMenu({ x, y, items, onClose, isSubmenu = false }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ left: number; top: number }>({
    left: x,
    top: y,
  })
  const [openSubmenu, setOpenSubmenu] = useState<{
    index: number
    x: number
    y: number
  } | null>(null)
  const submenuTimerRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useLayoutEffect(() => {
    const el = menuRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    let left = x
    let top = y
    if (left + rect.width + MENU_PADDING > window.innerWidth) {
      left = Math.max(MENU_PADDING, window.innerWidth - rect.width - MENU_PADDING)
    }
    if (top + rect.height + MENU_PADDING > window.innerHeight) {
      top = Math.max(MENU_PADDING, window.innerHeight - rect.height - MENU_PADDING)
    }
    setPosition({ left, top })
  }, [x, y, items])

  useEffect(() => {
    if (isSubmenu) return

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null
      if (menuRef.current && target && menuRef.current.contains(target)) return
      const submenuEl = document.querySelector('.context-menu-submenu')
      if (submenuEl && target && submenuEl.contains(target)) return
      onClose()
    }

    const findSelectable = (start: number, direction: 1 | -1): number | null => {
      if (items.length === 0) return null
      let i = start
      for (let step = 0; step < items.length; step++) {
        i = (i + direction + items.length) % items.length
        const candidate = items[i]
        if (!candidate.separator && !candidate.disabled) return i
      }
      return null
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = findSelectable(activeIndex ?? -1, 1)
        if (next !== null) setActiveIndex(next)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const start = activeIndex ?? items.length
        const next = findSelectable(start, -1)
        if (next !== null) setActiveIndex(next)
        return
      }
      if (e.key === 'Enter' && activeIndex !== null) {
        const item = items[activeIndex]
        if (item && !item.separator && !item.disabled && !item.submenu) {
          e.preventDefault()
          item.onClick?.()
          onClose()
        }
      }
    }

    const handleScroll = () => onClose()
    const handleResize = () => onClose()
    const handleBlur = () => onClose()

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as Node | null
      if (menuRef.current && target && menuRef.current.contains(target)) {
        e.preventDefault()
        return
      }
    }

    document.addEventListener('mousedown', handleMouseDown, true)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)
    window.addEventListener('blur', handleBlur)
    document.addEventListener('contextmenu', handleContextMenu, true)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown, true)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('contextmenu', handleContextMenu, true)
    }
  }, [isSubmenu, onClose, items, activeIndex])

  const clearSubmenuTimer = () => {
    if (submenuTimerRef.current !== null) {
      window.clearTimeout(submenuTimerRef.current)
      submenuTimerRef.current = null
    }
  }

  useEffect(() => () => clearSubmenuTimer(), [])

  const scheduleOpenSubmenu = (index: number, rowEl: HTMLElement) => {
    clearSubmenuTimer()
    submenuTimerRef.current = window.setTimeout(() => {
      const rect = rowEl.getBoundingClientRect()
      setOpenSubmenu({ index, x: rect.right - 2, y: rect.top })
    }, 200)
  }

  const scheduleCloseSubmenu = () => {
    clearSubmenuTimer()
    submenuTimerRef.current = window.setTimeout(() => {
      setOpenSubmenu(null)
    }, 200)
  }

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled || item.separator || item.submenu) return
    item.onClick?.()
    onClose()
  }

  return (
    <>
      <div
        ref={menuRef}
        className={isSubmenu ? 'context-menu context-menu-submenu' : 'context-menu'}
        style={{ left: position.left, top: position.top }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {items.map((item, index) => {
          if (item.separator) {
            return <div key={`sep-${index}`} className="context-menu-separator" />
          }
          const hasIcon = Boolean(item.icon) || item.checked
          const classes = ['context-menu-item']
          if (item.disabled) classes.push('disabled')
          if (hasIcon) classes.push('has-icon')
          if (item.bold) classes.push('bold')
          if (activeIndex === index && !item.disabled) classes.push('active')
          return (
            <div
              key={item.id ?? `${item.label}-${index}`}
              className={classes.join(' ')}
              onClick={() => handleItemClick(item)}
              onMouseEnter={(e) => {
                setActiveIndex(index)
                if (item.submenu && !item.disabled) {
                  scheduleOpenSubmenu(index, e.currentTarget)
                } else {
                  clearSubmenuTimer()
                  setOpenSubmenu(null)
                }
              }}
              onMouseLeave={() => {
                if (item.submenu) {
                  scheduleCloseSubmenu()
                }
              }}
            >
              {item.checked ? (
                <span className="context-menu-item-check">✓</span>
              ) : item.icon ? (
                <span className="context-menu-item-icon">
                  <img src={item.icon} alt="" />
                </span>
              ) : null}
              <span className="context-menu-item-label">{item.label}</span>
              {item.accelerator ? (
                <span className="context-menu-item-accelerator">{item.accelerator}</span>
              ) : null}
              {item.submenu ? <span className="context-menu-item-arrow">▸</span> : null}
            </div>
          )
        })}
      </div>
      {openSubmenu && items[openSubmenu.index]?.submenu ? (
        <div
          onMouseEnter={clearSubmenuTimer}
          onMouseLeave={scheduleCloseSubmenu}
        >
          <ContextMenu
            x={openSubmenu.x}
            y={openSubmenu.y}
            items={items[openSubmenu.index].submenu!}
            onClose={onClose}
            isSubmenu
          />
        </div>
      ) : null}
    </>
  )
}
