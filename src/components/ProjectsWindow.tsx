interface Project {
  title: string
  description: string
  technologies: string[]
  link: string
}

interface ProjectsWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectsWindow({ isOpen, onClose }: ProjectsWindowProps) {
  const projects: Project[] = [
    // Add your projects here
    {
      title: 'Project 1',
      description: 'Description of project 1',
      technologies: ['React', 'TypeScript', 'Tailwind'],
      link: 'https://github.com/yourusername/project1',
    },
    // Add more projects as needed
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
          <span className="text-white">My Projects</span>
          <button
            onClick={onClose}
            className="text-white hover:bg-red-600 px-2 rounded"
          >
            ✕
          </button>
        </div>

        {/* Projects Content */}
        <div className="p-4 overflow-auto h-[calc(100%-2rem)]">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white p-4 mb-4 rounded shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-bold text-[#0A246A]">
                {project.title}
              </h3>
              <p className="mt-2">{project.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="bg-[#ECE9D8] px-2 py-1 rounded text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                View Project →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
