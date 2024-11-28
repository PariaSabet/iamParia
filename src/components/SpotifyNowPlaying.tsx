import { useState, useEffect } from 'react'

export interface SpotifyTrack {
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string }>
  }
  external_urls: {
    spotify: string
  }
}

export interface NowPlayingResponse {
  is_playing: boolean
  item: SpotifyTrack
}

export function SpotifyNowPlaying() {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch(
          'https://api.spotify.com/v1/me/player/currently-playing',
          {
            headers: {
              Authorization: `Bearer BQATRI-AGK2IF03saUz7rzMHQF0ErwsFm2F-zU_njSftKmChjqoJxLNgUAn2DFZ2VXDquPTCHoWnqDwMTb79x4gwA93jEaGn_2O5r08Aqgn1Rjz1Se6_FHBHMQGVCtBkRTZLUlcauLfoReQnpkgB3JH_1JMn2sdG5uBf6nGt5qHq0Eq7mwp6s4TsoaI
`,
            },
          }
        )

        if (response.status === 204) {
          setCurrentTrack(null)
          return
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setCurrentTrack(data.item)
      } catch (error) {
        console.error('Error fetching now playing:', error)
        setError('Failed to fetch currently playing track')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (isLoading || error || !currentTrack) {
    return null // Return nothing when there's no song playing, loading, or error
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg max-w-[300px]">
      <div className="mb-2 text-gray-300 text-sm font-medium">
        🎵 I am listening to...
      </div>
      <div className="flex items-center gap-3">
        {currentTrack.album.images[0] && (
          <img
            src={currentTrack.album.images[0].url}
            alt="Album Art"
            className="w-12 h-12 rounded"
          />
        )}
        <div className="overflow-hidden">
          <p className="text-white font-medium truncate">{currentTrack.name}</p>
          <p className="text-gray-300 text-sm truncate">
            {currentTrack.artists.map((artist) => artist.name).join(', ')}
          </p>
        </div>
      </div>
    </div>
  )
}
