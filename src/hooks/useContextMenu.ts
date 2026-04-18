import { useCallback, useState } from 'react'
import type { ContextMenuItem } from '../components/ContextMenu'

export interface ContextMenuState {
  x: number
  y: number
  items: ContextMenuItem[]
}

export function useContextMenu() {
  const [menuState, setMenuState] = useState<ContextMenuState | null>(null)

  const openMenu = useCallback(
    (x: number, y: number, items: ContextMenuItem[]) => {
      setMenuState({ x, y, items })
    },
    []
  )

  const closeMenu = useCallback(() => {
    setMenuState(null)
  }, [])

  return { menuState, openMenu, closeMenu }
}
