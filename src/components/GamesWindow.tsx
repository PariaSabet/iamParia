import { WindowModal } from './WindowModal'
import folderIcon from '../assets/icons/folder.png'

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
    // {
    //   title: 'Game 1',
    //   description: 'Description 1',
    //   link: 'https://example.com',
    //   icon: 'icon1.png',
    //   githubLink: 'https://github.com/example/game1',
    // },
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
          <div
            key={index}
            className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold mb-2">{game.title}</h3>
            <p className="text-gray-600">{game.description}</p>
          </div>
        ))}
      </div>
    </WindowModal>
  )
}
