import { WindowModal } from './WindowModal'
import folderIcon from '../assets/icons/folder.png'
import randomMealGeneratorIcon from '../assets/icons/planning.png'
import cssArtsIcon from '../assets/icons/css-file.png'
import noteAppIcon from '../assets/icons/notes.png'
import githubIcon from '../assets/icons/github.svg'

interface Project {
  title: string
  description: string
  link: string
  icon: string
  githubLink: string
}

interface ProjectsWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectsWindow({ isOpen, onClose }: ProjectsWindowProps) {
  const projects: Project[] = [
    {
      title: 'Meal Generator',
      description: 'Have no idea what to eat? Generate a random meal!',

      link: 'https://randomrecipesgenerator.netlify.app/',
      icon: randomMealGeneratorIcon,
      githubLink: 'https://github.com/PariaSabet/randomMealGenerator',
    },
    {
      title: 'CSS Arts',
      description: 'I make arts with CSS just for fun',

      link: 'https://cssartss.netlify.app/',
      icon: cssArtsIcon,
      githubLink: 'https://github.com/PariaSabet/cssArts',
    },
    {
      title: 'Note App',
      description: 'A note app with Markdown support',

      link: 'https://noteappwithmarkdown.netlify.app/',
      icon: noteAppIcon,
      githubLink: 'https://github.com/PariaSabet/note-taking-app',
    },
  ]

  return (
    <WindowModal
      isOpen={isOpen}
      onClose={onClose}
      title="My Projects"
      icon={folderIcon}
      itemCount={projects.length}
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
        {projects.map((project, index) => (
          <a
            key={index}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-2 rounded group"
          >
            <img
              src={project.icon}
              alt={project.title}
              className="w-16 h-16 mb-2"
            />
            <span className="text-center text-xs">{project.title}</span>

            {/* Tooltip on hover */}
            <div className="hidden group-hover:block absolute bg-white border border-gray-200 p-2 rounded shadow-lg mt-24 z-10 w-48">
              <h4 className="font-bold">{project.title}</h4>
              <p className="text-sm mt-1">{project.description}</p>
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-1 block"
              >
                <img src={githubIcon} alt="GitHub" className="w-5 h-5" />
              </a>
            </div>
          </a>
        ))}
      </div>
    </WindowModal>
  )
}
