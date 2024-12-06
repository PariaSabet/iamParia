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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-[#ECE9D8] text-black w-[800px] h-[600px] rounded-lg shadow-xl">
        {/* Window Title Bar */}
        <div className="bg-gradient-to-r from-[#0A246A] via-[#3A6EA5] to-[#0A246A] px-2 py-1 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-2">
            <img src={folderIcon} alt="Folder" className="w-4 h-4" />
            <span className="text-white">My Projects</span>
          </div>
          <div className="flex gap-1">
            <button className="text-white hover:bg-[#1f3b69] px-2 rounded">
              -
            </button>
            <button className="text-white hover:bg-[#1f3b69] px-2 rounded">
              □
            </button>
            <button
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
            My Computer/My Projects
          </div>
        </div>

        {/* Projects Content */}
        <div className="p-4 overflow-auto h-[calc(100%-8rem)] bg-white">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
            {projects.map((project, index) => (
              <a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-2 hover:bg-[#ECE9D8] rounded group"
              >
                <img
                  src={project.icon}
                  alt={project.title}
                  className="w-16 h-16 mb-2"
                />
                <span className="text-center text-xs group-hover:text-[#0A246A]">
                  {project.title}
                </span>

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
        </div>

        {/* Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#F1EFE2] border-t border-[#919B9C] px-2 py-0.5">
          <span className="text-sm">{projects.length} items</span>
        </div>
      </div>
    </div>
  )
}
