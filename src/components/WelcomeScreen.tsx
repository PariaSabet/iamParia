import { TaskBar } from './TaskBar'
import { DesktopIcon } from './DesktopIcon'
import githubIcon from '../assets/icons/github.png'
import linkedinIcon from '../assets/icons/linkedin.png'
import instagramIcon from '../assets/icons/instagram.png'
import codepenIcon from '../assets/icons/codepen.png'
import buyMeACoffeeIcon from '../assets/icons/bmc-logo.svg'
import youtubeIcon from '../assets/icons/youtube.png'
import resumeIcon from '../assets/icons/resume.png'
import resumePdf from '../assets/resume/Resume.pdf'
import twitterIcon from '../assets/icons/twitter.png'
import stravaIcon from '../assets/icons/strava.svg'
import xpBackground from '../assets/background.webp'

const desktopIcons = [
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
            />
          ))}
        </div>
      </div>
      <TaskBar />
    </div>
  )
}

export default WelcomeScreen
