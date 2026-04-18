import { useEffect, useRef, useState } from 'react'
import { TaskBar } from './TaskBar'
import { DesktopIcon } from './DesktopIcon'
import { ProjectsWindow } from './ProjectsWindow'
import { NotepadWindow } from './NotepadWindow'
import { AICloneWindow } from './AICloneWindow'
import { ContextMenu } from './ContextMenu'
import type { ContextMenuItem } from './ContextMenu'
import { useContextMenu } from '../hooks/useContextMenu'
import { DisplayPropertiesWindow } from './DisplayPropertiesWindow'
import type { Wallpaper } from './DisplayPropertiesWindow'
import folderIcon from '../assets/icons/folder.png'
import resumeIcon from '../assets/icons/curriculum-vitae.png'
import githubIcon from '../assets/icons/git.png'
import linkedinIcon from '../assets/icons/linkedin.png'
import codepenIcon from '../assets/icons/coding.png'
import youtubeIcon from '../assets/icons/youtube.png'
import instagramIcon from '../assets/icons/instagram.png'
import twitterIcon from '../assets/icons/retweet.png'
import buyMeACoffeeIcon from '../assets/icons/coffee-cup.png'
import resumePdf from '../assets/resume/Resume.pdf'
import stravaIcon from '../assets/icons/running.png'
import xpBackground from '../assets/background.webp'
import { SpotifyNowPlaying } from './SpotifyNowPlaying'
import gameIcon from '../assets/icons/folder-games.png'
import { GamesWindow } from './GamesWindow'
import notepadIcon from '../assets/icons/notepad.png'
import aiCloneIcon from '../assets/icons/ai.png'
import mediaPlayerTaskbarIcon from '../assets/icons/media-player-note.svg'
import pictureIcon from '../assets/icons/pictures.png'

interface DesktopIconData {
  icon: string
  label: string
  link?: string
  isDownload?: boolean
  onClick?: () => void
}

type IconSortMode = 'none' | 'name' | 'type'

const WALLPAPER_STORAGE_KEY = 'iampariaWallpaper'
const DEFAULT_WALLPAPER_ID = 'bliss'

const wallpapers: Wallpaper[] = [
  {
    id: 'bliss',
    name: 'Bliss',
    backgroundImage: `url(${xpBackground})`,
  },
  {
    id: 'azul',
    name: 'Azul',
    backgroundImage:
      'linear-gradient(180deg, #1b3a76 0%, #3a6ea5 50%, #89b6e0 100%)',
  },
  {
    id: 'red-moon',
    name: 'Red Moon',
    backgroundImage:
      'radial-gradient(circle at 30% 35%, #f7b267 0%, #b94a3d 35%, #3e1022 75%, #140406 100%)',
  },
  {
    id: 'plum',
    name: 'Plum',
    backgroundImage:
      'linear-gradient(135deg, #2c1e4a 0%, #6a4c93 50%, #f6c6d3 100%)',
  },
]

interface WelcomeScreenProps {
  onLogOff: () => void
  onShutDown: () => void
}

export function WelcomeScreen({ onLogOff, onShutDown }: WelcomeScreenProps) {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)
  const [isProjectsMinimized, setIsProjectsMinimized] = useState(false)
  const [isGamesOpen, setIsGamesOpen] = useState(false)
  const [isGamesMinimized, setIsGamesMinimized] = useState(false)
  const [isNotepadOpen, setIsNotepadOpen] = useState(false)
  const [isNotepadMinimized, setIsNotepadMinimized] = useState(false)
  const [isAICloneOpen, setIsAICloneOpen] = useState(false)
  const [isAICloneMinimized, setIsAICloneMinimized] = useState(false)
  const [isMediaPlayerMinimized, setIsMediaPlayerMinimized] = useState(false)
  const [isDisplayPropsOpen, setIsDisplayPropsOpen] = useState(false)
  const [isDisplayPropsMinimized, setIsDisplayPropsMinimized] = useState(false)
  const [iconSort, setIconSort] = useState<IconSortMode>('none')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [contextIconLabel, setContextIconLabel] = useState<string | null>(null)
  const [wallpaperId, setWallpaperId] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_WALLPAPER_ID
    return localStorage.getItem(WALLPAPER_STORAGE_KEY) ?? DEFAULT_WALLPAPER_ID
  })
  const focusCounterRef = useRef(0)
  const [windowZIndices, setWindowZIndices] = useState<Record<string, number>>({})
  const taskbarButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const { menuState, openMenu, closeMenu } = useContextMenu()

  const setTaskbarButtonRef =
    (windowId: string) => (el: HTMLButtonElement | null) => {
      taskbarButtonRefs.current[windowId] = el
    }

  const getMinimizeTargetRect = (windowId: string) =>
    taskbarButtonRefs.current[windowId]?.getBoundingClientRect() ?? null

  const bringToFront = (windowId: string) => {
    focusCounterRef.current += 1
    setWindowZIndices((indices) => ({ ...indices, [windowId]: 50 + focusCounterRef.current }))
  }

  const openProjects = () => {
    setIsProjectsOpen(true)
    setIsProjectsMinimized(false)
    bringToFront('projects')
  }
  const openGames = () => {
    setIsGamesOpen(true)
    setIsGamesMinimized(false)
    bringToFront('games')
  }
  const openNotepad = () => {
    setIsNotepadOpen(true)
    setIsNotepadMinimized(false)
    bringToFront('notepad')
  }
  const openAIClone = () => {
    setIsAICloneOpen(true)
    setIsAICloneMinimized(false)
    bringToFront('ai-clone')
  }
  const openDisplayProperties = () => {
    setIsDisplayPropsOpen(true)
    setIsDisplayPropsMinimized(false)
    bringToFront('display-properties')
  }

  const showDesktop = () => {
    if (isProjectsOpen) setIsProjectsMinimized(true)
    if (isGamesOpen) setIsGamesMinimized(true)
    if (isNotepadOpen) setIsNotepadMinimized(true)
    if (isAICloneOpen) setIsAICloneMinimized(true)
    if (isDisplayPropsOpen) setIsDisplayPropsMinimized(true)
    setIsMediaPlayerMinimized(true)
  }

  const applyWallpaper = (id: string) => {
    setWallpaperId(id)
    try {
      localStorage.setItem(WALLPAPER_STORAGE_KEY, id)
    } catch {
      /* ignore storage errors */
    }
  }

  const triggerRefresh = () => {
    setIsRefreshing(true)
    window.setTimeout(() => setIsRefreshing(false), 200)
  }

  const desktopIcons: DesktopIconData[] = [
      {
        icon: folderIcon,
        label: 'My Projects',
        onClick: openProjects,
      },
      {
        icon: gameIcon,
        label: 'Games',
        onClick: openGames,
      },
      {
        icon: notepadIcon,
        label: 'About Me',
        onClick: openNotepad,
      },
      {
        icon: resumeIcon,
        label: 'Resume',
        link: resumePdf,
        isDownload: true,
      },
      {
        icon: githubIcon,
        label: 'GitHub',
        link: 'https://github.com/pariasabet',
      },
      {
        icon: linkedinIcon,
        label: 'LinkedIn',
        link: 'https://linkedin.com/in/pariasabet',
      },
      {
        icon: codepenIcon,
        label: 'CodePen',
        link: 'https://codepen.io/PariaSabet13',
      },
      {
        icon: youtubeIcon,
        label: 'YouTube',
        link: 'https://www.youtube.com/@pariasabet13',
      },
      {
        icon: instagramIcon,
        label: 'Instagram',
        link: 'https://instagram.com/pariasabet13',
      },
      {
        icon: twitterIcon,
        label: 'X or Twitter',
        link: 'https://x.com/PariaSabet13',
      },
      {
        icon: stravaIcon,
        label: 'Strava',
        link: 'https://www.strava.com/athletes/pariasabet',
      },
      {
        icon: buyMeACoffeeIcon,
        label: 'Buy me Tea',
        link: 'https://buymeacoffee.com/pariasabet13',
      },
      {
        icon: aiCloneIcon,
        label: 'AI Clone',
        onClick: openAIClone,
      },
    ]

  const getIconTypeRank = (iconData: DesktopIconData) => {
    if (iconData.isDownload) return 0 // document
    if (iconData.link) return 1 // link
    return 2 // folder/app
  }

  const sortedIcons = (() => {
    if (iconSort === 'none') return desktopIcons
    const copy = [...desktopIcons]
    if (iconSort === 'name') {
      copy.sort((a, b) => a.label.localeCompare(b.label))
    } else if (iconSort === 'type') {
      copy.sort((a, b) => {
        const typeDiff = getIconTypeRank(a) - getIconTypeRank(b)
        if (typeDiff !== 0) return typeDiff
        return a.label.localeCompare(b.label)
      })
    }
    return copy
  })()

  useEffect(() => {
    if (!menuState) setContextIconLabel(null)
  }, [menuState])

  const activeWallpaper =
    wallpapers.find((w) => w.id === wallpaperId) ?? wallpapers[0]

  const buildDesktopMenu = (): ContextMenuItem[] => [
    {
      id: 'arrange',
      label: 'Arrange Icons By',
      submenu: [
        {
          id: 'arrange-name',
          label: 'Name',
          checked: iconSort === 'name',
          onClick: () => setIconSort('name'),
        },
        {
          id: 'arrange-type',
          label: 'Type',
          checked: iconSort === 'type',
          onClick: () => setIconSort('type'),
        },
        { separator: true },
        {
          id: 'arrange-auto',
          label: 'Auto Arrange',
          checked: iconSort !== 'none',
          onClick: () =>
            setIconSort((prev) => (prev === 'none' ? 'name' : 'none')),
        },
        {
          id: 'arrange-align',
          label: 'Align to Grid',
          checked: true,
          disabled: true,
        },
      ],
    },
    {
      id: 'refresh',
      label: 'Refresh',
      onClick: triggerRefresh,
    },
    { separator: true },
    {
      id: 'paste',
      label: 'Paste',
      disabled: true,
    },
    {
      id: 'paste-shortcut',
      label: 'Paste Shortcut',
      disabled: true,
    },
    { separator: true },
    {
      id: 'new',
      label: 'New',
      submenu: [
        { id: 'new-folder', label: 'Folder', disabled: true },
        { id: 'new-shortcut', label: 'Shortcut', disabled: true },
        { separator: true },
        {
          id: 'new-text',
          label: 'Text Document',
          icon: notepadIcon,
          onClick: openNotepad,
        },
      ],
    },
    { separator: true },
    {
      id: 'properties',
      label: 'Properties',
      icon: pictureIcon,
      onClick: openDisplayProperties,
    },
  ]

  const buildIconMenu = (iconData: DesktopIconData): ContextMenuItem[] => {
    const items: ContextMenuItem[] = [
      {
        id: 'open',
        label: 'Open',
        bold: true,
        icon: iconData.icon,
        onClick: () => {
          if (iconData.link) {
            if (iconData.isDownload) {
              window.open(iconData.link, '_blank')
            } else {
              window.open(iconData.link, '_blank', 'noopener,noreferrer')
            }
          } else if (iconData.onClick) {
            iconData.onClick()
          }
        },
      },
    ]

    if (iconData.link && !iconData.isDownload) {
      items.push({
        id: 'open-new-tab',
        label: 'Open in new tab',
        onClick: () =>
          window.open(iconData.link, '_blank', 'noopener,noreferrer'),
      })
      items.push({ separator: true })
      items.push({
        id: 'copy-link',
        label: 'Copy link address',
        onClick: () => {
          try {
            navigator.clipboard?.writeText(iconData.link!)
          } catch {
            /* ignore */
          }
        },
      })
    }

    items.push({ separator: true })
    items.push({
      id: 'icon-properties',
      label: 'Properties',
      onClick: () => {
        const details: string[] = []
        details.push(`Name: ${iconData.label}`)
        if (iconData.link) {
          details.push(
            iconData.isDownload
              ? `Type: Document (PDF)`
              : `Type: Internet Shortcut`
          )
          details.push(`Target: ${iconData.link}`)
        } else {
          details.push('Type: Application')
        }
        window.alert(details.join('\n'))
      },
    })

    return items
  }

  const buildTaskbarMenu = (): ContextMenuItem[] => [
    {
      id: 'show-desktop',
      label: 'Show the Desktop',
      bold: true,
      onClick: showDesktop,
    },
    { separator: true },
    {
      id: 'task-manager',
      label: 'Task Manager',
      disabled: true,
    },
    { separator: true },
    {
      id: 'taskbar-properties',
      label: 'Properties',
      disabled: true,
    },
  ]

  const handleDesktopContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    openMenu(e.clientX, e.clientY, buildDesktopMenu())
  }

  const handleIconContextMenu = (iconData: DesktopIconData) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setContextIconLabel(iconData.label)
      openMenu(e.clientX, e.clientY, buildIconMenu(iconData))
    }

  const handleTaskbarContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    openMenu(e.clientX, e.clientY, buildTaskbarMenu())
  }

  return (
    <div
      className="fixed inset-0 text-white flex flex-col animate-fadeIn"
      style={{
        backgroundImage: activeWallpaper.backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#0A246A',
      }}
    >
      <div
        className="flex-1 p-4 bg-black bg-opacity-50"
        onContextMenu={handleDesktopContextMenu}
        style={{
          transition: 'opacity 120ms ease',
          opacity: isRefreshing ? 0.35 : 1,
        }}
      >
        <div className="grid grid-cols-[repeat(auto-fill,96px)] gap-1 justify-start">
          {sortedIcons.map((iconData, index) => (
            <DesktopIcon
              key={`${iconData.label}-${index}`}
              icon={iconData.icon}
              label={iconData.label}
              link={iconData.link}
              isDownload={iconData.isDownload}
              onClick={iconData.onClick}
              onContextMenu={handleIconContextMenu(iconData)}
              isContextActive={contextIconLabel === iconData.label}
            />
          ))}
        </div>
      </div>
      <TaskBar
        onOpenProjects={openProjects}
        onOpenGames={openGames}
        onOpenNotepad={openNotepad}
        onOpenAIClone={openAIClone}
        onLogOff={onLogOff}
        onShutDown={onShutDown}
        onContextMenu={handleTaskbarContextMenu}
        windows={[
          ...(isProjectsOpen
            ? [
                {
                  id: 'projects',
                  title: 'My Projects',
                  icon: folderIcon,
                  isMinimized: isProjectsMinimized,
                  onClick: () => setIsProjectsMinimized((prev) => !prev),
                  buttonRef: setTaskbarButtonRef('projects'),
                },
              ]
            : []),
          ...(isGamesOpen
            ? [
                {
                  id: 'games',
                  title: 'Games',
                  icon: gameIcon,
                  isMinimized: isGamesMinimized,
                  onClick: () => setIsGamesMinimized((prev) => !prev),
                  buttonRef: setTaskbarButtonRef('games'),
                },
              ]
            : []),
          ...(isNotepadOpen
            ? [
                {
                  id: 'notepad',
                  title: 'About Me',
                  icon: notepadIcon,
                  isMinimized: isNotepadMinimized,
                  onClick: () => setIsNotepadMinimized((prev) => !prev),
                  buttonRef: setTaskbarButtonRef('notepad'),
                },
              ]
            : []),
          ...(isAICloneOpen
            ? [
                {
                  id: 'ai-clone',
                  title: "Paria's Messenger",
                  icon: aiCloneIcon,
                  isMinimized: isAICloneMinimized,
                  onClick: () => setIsAICloneMinimized((prev) => !prev),
                  buttonRef: setTaskbarButtonRef('ai-clone'),
                },
              ]
            : []),
          ...(isDisplayPropsOpen
            ? [
                {
                  id: 'display-properties',
                  title: 'Display Properties',
                  icon: pictureIcon,
                  isMinimized: isDisplayPropsMinimized,
                  onClick: () => setIsDisplayPropsMinimized((prev) => !prev),
                  buttonRef: setTaskbarButtonRef('display-properties'),
                },
              ]
            : []),
          {
            id: 'media-player',
            title: "Paria's Media Player",
            icon: mediaPlayerTaskbarIcon,
            isMinimized: isMediaPlayerMinimized,
            onClick: () => setIsMediaPlayerMinimized((prev) => !prev),
            buttonRef: setTaskbarButtonRef('media-player'),
          },
        ]}
      />
      <ProjectsWindow
        isOpen={isProjectsOpen}
        isMinimized={isProjectsMinimized}
        minimizeTargetRect={getMinimizeTargetRect('projects')}
        onMinimize={() => setIsProjectsMinimized(true)}
        onClose={() => {
          setIsProjectsOpen(false)
          setIsProjectsMinimized(false)
        }}
        zIndex={windowZIndices['projects']}
        onFocus={() => bringToFront('projects')}
        sidebarLinks={[
          {
            icon: gameIcon,
            label: 'Games',
            onClick: () => {
              setIsGamesOpen(true)
              setIsGamesMinimized(false)
              bringToFront('games')
            },
          },
          {
            icon: notepadIcon,
            label: 'About Me',
            onClick: () => {
              setIsNotepadOpen(true)
              setIsNotepadMinimized(false)
              bringToFront('notepad')
            },
          },
          {
            icon: folderIcon,
            label: 'My Computer',
          },
        ]}
      />
      <GamesWindow
        isOpen={isGamesOpen}
        isMinimized={isGamesMinimized}
        minimizeTargetRect={getMinimizeTargetRect('games')}
        onMinimize={() => setIsGamesMinimized(true)}
        onClose={() => {
          setIsGamesOpen(false)
          setIsGamesMinimized(false)
        }}
        zIndex={windowZIndices['games']}
        onFocus={() => bringToFront('games')}
        sidebarLinks={[
          {
            icon: folderIcon,
            label: 'My Projects',
            onClick: () => {
              setIsProjectsOpen(true)
              setIsProjectsMinimized(false)
              bringToFront('projects')
            },
          },
          {
            icon: notepadIcon,
            label: 'About Me',
            onClick: () => {
              setIsNotepadOpen(true)
              setIsNotepadMinimized(false)
              bringToFront('notepad')
            },
          },
          {
            icon: folderIcon,
            label: 'My Computer',
          },
        ]}
      />
      <NotepadWindow
        isOpen={isNotepadOpen}
        isMinimized={isNotepadMinimized}
        minimizeTargetRect={getMinimizeTargetRect('notepad')}
        onMinimize={() => setIsNotepadMinimized(true)}
        onClose={() => {
          setIsNotepadOpen(false)
          setIsNotepadMinimized(false)
        }}
        zIndex={windowZIndices['notepad']}
        onFocus={() => bringToFront('notepad')}
      />
      <AICloneWindow
        isOpen={isAICloneOpen}
        isMinimized={isAICloneMinimized}
        minimizeTargetRect={getMinimizeTargetRect('ai-clone')}
        onMinimize={() => setIsAICloneMinimized(true)}
        onClose={() => {
          setIsAICloneOpen(false)
          setIsAICloneMinimized(false)
        }}
        zIndex={windowZIndices['ai-clone']}
        onFocus={() => bringToFront('ai-clone')}
      />
      <DisplayPropertiesWindow
        isOpen={isDisplayPropsOpen}
        isMinimized={isDisplayPropsMinimized}
        minimizeTargetRect={getMinimizeTargetRect('display-properties')}
        onMinimize={() => setIsDisplayPropsMinimized(true)}
        onClose={() => {
          setIsDisplayPropsOpen(false)
          setIsDisplayPropsMinimized(false)
        }}
        zIndex={windowZIndices['display-properties']}
        onFocus={() => bringToFront('display-properties')}
        wallpapers={wallpapers}
        currentWallpaperId={wallpaperId}
        onApplyWallpaper={applyWallpaper}
      />
      <div className="fixed bottom-12 right-4">
        <SpotifyNowPlaying
          isMinimized={isMediaPlayerMinimized}
          minimizeTargetRect={getMinimizeTargetRect('media-player')}
          onMinimize={() => setIsMediaPlayerMinimized(true)}
          onRestore={() => setIsMediaPlayerMinimized(false)}
        />
      </div>
      {menuState ? (
        <ContextMenu
          x={menuState.x}
          y={menuState.y}
          items={menuState.items}
          onClose={closeMenu}
        />
      ) : null}
    </div>
  )
}

export default WelcomeScreen
