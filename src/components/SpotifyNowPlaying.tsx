import { useState, useEffect } from 'react'
import { getAccessToken } from '../utils/spotify'
import spotifyIcon from '../assets/icons/spotify.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMinus,
  faSquare,
  faTimes,
  faPause,
  faPlay,
  faStop,
  faStepBackward,
  faStepForward,
} from '@fortawesome/free-solid-svg-icons'

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

export interface RecentlyPlayedResponse {
  items: Array<{
    track: SpotifyTrack
    played_at: string
  }>
}

export function SpotifyNowPlaying() {
  const [trackData, setTrackData] = useState<{
    name: string
    artist: string
    album: string
    albumImageUrl: string
    isPlaying: boolean
  } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get token for currently playing
        const currentToken = await getAccessToken('current')
        if (!currentToken) {
          console.error('Failed to get current playing access token')
          return
        }

        // First try to get currently playing
        const currentResponse = await fetch(
          'https://api.spotify.com/v1/me/player/currently-playing',
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
          }
        )

        if (currentResponse.status === 200) {
          const currentData: NowPlayingResponse = await currentResponse.json()
          setTrackData({
            name: currentData.item.name,
            artist: currentData.item.artists[0].name,
            album: currentData.item.album.name,
            albumImageUrl: currentData.item.album.images[0]?.url,
            isPlaying: currentData.is_playing,
          })
        } else {
          // If nothing is playing, get recently played
          const recentToken = await getAccessToken('recent')
          if (!recentToken) {
            console.error('Failed to get recent played access token')
            return
          }

          const recentResponse = await fetch(
            'https://api.spotify.com/v1/me/player/recently-played?limit=1',
            {
              headers: {
                Authorization: `Bearer ${recentToken}`,
              },
            }
          )

          if (recentResponse.ok) {
            const recentData: RecentlyPlayedResponse =
              await recentResponse.json()
            if (recentData.items.length > 0) {
              const lastPlayed = recentData.items[0].track
              setTrackData({
                name: lastPlayed.name,
                artist: lastPlayed.artists[0].name,
                album: lastPlayed.album.name,
                albumImageUrl: lastPlayed.album.images[0]?.url,
                isPlaying: false,
              })
            }
          }
        }
      } catch (error) {
        console.error('Error fetching Spotify data:', error)
        setTrackData(null)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 10000)

    return () => clearInterval(interval)
  }, [])

  // If data not loaded, show loading
  if (!trackData) {
    return (
      <div className="w-[380px] border border-black shadow-lg bg-gray-200 p-4 text-center">
        <p>Loading Windows Media Player...</p>
      </div>
    )
  }

  return (
    <div className="w-[380px] border border-black bg-[#F1EFE2] shadow-lg">
      {/* Title bar */}
      <div className="bg-gradient-to-r from-[#0A246A] via-[#3A6EA5] to-[#0A246A] px-2 py-1 flex items-center justify-between">
        <img src={spotifyIcon} alt="Window Icon" className="w-4 h-4" />
        <div className="flex-1 font-bold">Paria's Media Player</div>
        {/* Minimize, Maximize, Close buttons */}
        <div className="flex gap-1">
          <button className="text-white hover:bg-[#1f3b69] px-2 rounded">
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <button className="text-white hover:bg-[#1f3b69] px-2 rounded">
            <FontAwesomeIcon icon={faSquare} />
          </button>
          <button className="text-white hover:bg-red-600 px-2 rounded">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>

      {/* Menu bar */}
      <div className="flex items-center text-xs bg-[#F1EFE2] text-black px-2 h-6">
        <span className="mr-4 cursor-default">File</span>
        <span className="mr-4 cursor-default">View</span>
        <span className="mr-4 cursor-default">Play</span>
        <span className="mr-4 cursor-default">Favorites</span>
        <span className="mr-4 cursor-default">Go</span>
        <span className="mr-4 cursor-default">Help</span>
      </div>

      {/* Main content area (album art + big black box) */}
      <div className="bg-black h-40 flex items-center justify-center">
        {trackData.albumImageUrl ? (
          <img
            src={trackData.albumImageUrl}
            alt={`${trackData.album} cover`}
            className="max-h-full max-w-full"
          />
        ) : (
          // Placeholder if there's no album art
          <div className="text-white text-sm">No Album Art</div>
        )}
      </div>

      {/* Playback Controls */}
      <div className="p-2 flex items-center gap-2 bg-[#F1EFE2]">
        <button className="w-6 h-6 hover:bg-gray-400 border border-gray-400">
          <FontAwesomeIcon icon={faPause} />
        </button>
        <button className="w-6 h-6 hover:bg-gray-400 border border-gray-400">
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button className="w-6 h-6 hover:bg-gray-400 border border-gray-400">
          <FontAwesomeIcon icon={faStop} />
        </button>
        <button className="w-6 h-6 hover:bg-gray-400 border border-gray-400">
          <FontAwesomeIcon icon={faStepBackward} />
        </button>
        <button className="w-6 h-6 hover:bg-gray-400 border border-gray-400">
          <FontAwesomeIcon icon={faStepForward} />
        </button>

        {/* Seek bar placeholder */}
        <div className="flex-1 border border-gray-400 bg-[#F1EFE2] h-2 rounded mx-2"></div>

        {/* Volume slider placeholder */}
        <div className="w-16 border border-gray-400 bg-[#F1EFE2] h-2 rounded"></div>
      </div>

      {/* Bottom metadata section (Show, Clip, Author, etc.) */}
      <div className="text-xs px-2 py-1 bg-black space-y-1 border-t border-gray-400">
        <div>
          <strong>Show:</strong>{' '}
          {trackData.isPlaying ? 'Currently Playing' : 'Last Played'}
        </div>
        <div>
          <strong>Clip:</strong> {trackData.name}
        </div>
        <div>
          <strong>Author:</strong> {trackData.artist}
        </div>
        <div>
          <strong>Album:</strong> {trackData.album}
        </div>
      </div>
    </div>
  )
}
