import { TaskBar } from './TaskBar'
import { DesktopIcon } from './DesktopIcon'
import githubIcon from '../assets/icons/github.png'
import linkedinIcon from '../assets/icons/linkedin.png'
import instagramIcon from '../assets/icons/instagram.png'
import codepenIcon from '../assets/icons/codepen.png'

const desktopIcons = [
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
    icon: instagramIcon,
    label: 'Instagram',
    link: 'https://instagram.com/pariasabet13',
  },
  {
    icon: codepenIcon,
    label: 'CodePen',
    link: 'https://codepen.io/PariaSabet13',
  },
]

export function WelcomeScreen() {
  return (
    <div className="fixed inset-0 bg-[#274472] text-white flex flex-col animate-fadeIn">
      <div className="flex-1 p-4">
        <div className="grid grid-cols-[repeat(auto-fill,96px)] gap-1 justify-start">
          {desktopIcons.map((icon, index) => (
            <DesktopIcon
              key={index}
              icon={icon.icon}
              label={icon.label}
              link={icon.link}
            />
          ))}
        </div>
      </div>
      <TaskBar />
    </div>
  )
}

export default WelcomeScreen
