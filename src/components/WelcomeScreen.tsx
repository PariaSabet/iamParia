import { useState } from 'react'
import { TaskBar } from './TaskBar'
import { DesktopIcon } from './DesktopIcon'
import { ProjectsWindow } from './ProjectsWindow'
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

const desktopIcons = [
  {
    icon: folderIcon,
    label: 'My Projects',
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
    label: 'Buy Me a Coffee',
    link: 'https://buymeacoffee.com/pariasabet13',
  },
]

export function WelcomeScreen() {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)

  desktopIcons[0].onClick = () => setIsProjectsOpen(true)

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
      <TaskBar />
      <ProjectsWindow
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
      />
    </div>
  )
}

export default WelcomeScreen
