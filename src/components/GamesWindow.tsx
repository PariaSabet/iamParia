import { WindowModal } from './WindowModal'
import folderIcon from '../assets/icons/folder.png'
import gameIcon from '../assets/icons/tic-tac-toe.png'
import githubIcon from '../assets/icons/github.svg'

interface Game {
  title: string
  description: string
  link: string
  icon: string
  githubLink: string
}

interface GamesWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function GamesWindow({ isOpen, onClose }: GamesWindowProps) {
  const games: Game[] = [
    {
      title: 'Tic-Tac-Toe',
      description: 'a 3d version of the classic game',
      link: 'https://tictactoe3d.netlify.app/',
      icon: gameIcon,
      githubLink: 'https://github.com/PariaSabet/tic-tac-toe',
    },
  ]

  return (
    <WindowModal
      isOpen={isOpen}
      onClose={onClose}
      title="Games"
      icon={folderIcon}
      itemCount={games.length}
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
        {games.map((game, index) => (
          <a
            key={index}
            href={game.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-2 rounded group"
          >
            <img src={game.icon} alt={game.title} className="w-16 h-16 mb-2" />
            <span className="text-center text-xs">{game.title}</span>

            {/* Tooltip on hover */}
            <div className="hidden group-hover:block absolute bg-white border border-gray-200 p-2 rounded shadow-lg mt-24 z-10 w-48">
              <h4 className="font-bold">{game.title}</h4>
              <p className="text-sm mt-1">{game.description}</p>
              <a
                href={game.githubLink}
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
