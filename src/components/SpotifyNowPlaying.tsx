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

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN

export function SpotifyNowPlaying() {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const getAccessToken = async () => {
    const basic = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${basic}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: REFRESH_TOKEN,
        }),
      })

      const data = await response.json()
      setAccessToken(data.access_token)
    } catch (error) {
      console.error('Error getting access token:', error)
      setError('Failed to authenticate with Spotify')
    }
  }

  // Get initial access token and refresh it periodically
  useEffect(() => {
    getAccessToken()
    const interval = setInterval(getAccessToken, 3600 * 1000) // Refresh every hour
    return () => clearInterval(interval)
  }, [])

  // Fetch currently playing track
  useEffect(() => {
    const fetchNowPlaying = async () => {
      if (!accessToken) return

      try {
        const response = await fetch(
          'https://api.spotify.com/v1/me/player/currently-playing',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
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

    if (accessToken) {
      fetchNowPlaying()
      const interval = setInterval(fetchNowPlaying, 30000)
      return () => clearInterval(interval)
    }
  }, [accessToken])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!currentTrack) {
    return <div>No song playing right now!</div>
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg max-w-[300px]">
      {currentTrack ? (
        <div className="flex items-center gap-3">
          {currentTrack.album.images[0] && (
            <img
              src={currentTrack.album.images[0].url}
              alt="Album Art"
              className="w-12 h-12 rounded"
            />
          )}
          <div className="overflow-hidden">
            <p className="text-white font-medium truncate">
              {currentTrack.name}
            </p>
            <p className="text-gray-300 text-sm truncate">
              {currentTrack.artists.map((artist) => artist.name).join(', ')}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-300">Not playing</p>
      )}
    </div>
  )
}
