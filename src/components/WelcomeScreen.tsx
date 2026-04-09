import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TaskBar } from './TaskBar'
import { DesktopIcon } from './DesktopIcon'
import { ProjectsWindow } from './ProjectsWindow'
import { NotepadWindow } from './NotepadWindow'
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
import spotifyIcon from '../assets/icons/spotify.png'

const desktopIcons = [
  {
    icon: folderIcon,
    label: 'My Projects',
    onClick: () => {},
  },
  {
    icon: gameIcon,
    label: 'Games',
    onClick: () => {},
  },
  {
    icon: notepadIcon,
    label: 'About Me',
    onClick: () => {},
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
    onClick: () => {},
  },
]

export function WelcomeScreen() {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)
  const [isProjectsMinimized, setIsProjectsMinimized] = useState(false)
  const [isGamesOpen, setIsGamesOpen] = useState(false)
  const [isGamesMinimized, setIsGamesMinimized] = useState(false)
  const [isNotepadOpen, setIsNotepadOpen] = useState(false)
  const [isNotepadMinimized, setIsNotepadMinimized] = useState(false)
  const [isMediaPlayerMinimized, setIsMediaPlayerMinimized] = useState(false)
  const taskbarButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const navigate = useNavigate()

  const setTaskbarButtonRef =
    (windowId: string) => (el: HTMLButtonElement | null) => {
      taskbarButtonRefs.current[windowId] = el
    }

  const getMinimizeTargetRect = (windowId: string) =>
    taskbarButtonRefs.current[windowId]?.getBoundingClientRect() ?? null

  desktopIcons[0].onClick = () => {
    setIsProjectsOpen(true)
    setIsProjectsMinimized(false)
  }
  desktopIcons[1].onClick = () => {
    setIsGamesOpen(true)
    setIsGamesMinimized(false)
  }
  desktopIcons[2].onClick = () => {
    setIsNotepadOpen(true)
    setIsNotepadMinimized(false)
  }
  desktopIcons[12].onClick = () => navigate('/ai-clone')

  return (
    <div
      className="fixed inset-0 text-white flex flex-col animate-fadeIn"
      style={{
        backgroundImage: `url(${xpBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex-1 p-4 bg-black bg-opacity-50">
        <div className="grid grid-cols-[repeat(auto-fill,96px)] gap-1 justify-start">
          {desktopIcons.map((icon, index) => (
            <DesktopIcon
              key={index}
              icon={icon.icon}
              label={icon.label}
              link={icon.link}
              isDownload={icon.isDownload}
              onClick={icon.onClick}
            />
          ))}
        </div>
      </div>
      <TaskBar
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
          {
            id: 'media-player',
            title: "Paria's Media Player",
            icon: spotifyIcon,
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
      />
      <div className="fixed bottom-12 right-4">
        <SpotifyNowPlaying
          isMinimized={isMediaPlayerMinimized}
          minimizeTargetRect={getMinimizeTargetRect('media-player')}
          onMinimize={() => setIsMediaPlayerMinimized(true)}
          onRestore={() => setIsMediaPlayerMinimized(false)}
        />
      </div>
    </div>
  )
}

export default WelcomeScreen
