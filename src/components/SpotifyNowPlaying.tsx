import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { getAccessToken } from '../utils/spotify'
import spotifyIcon from '../assets/icons/spotify.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
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

interface SpotifyNowPlayingProps {
  isMinimized?: boolean
  onMinimize?: () => void
  onRestore?: () => void
  minimizeTargetRect?: DOMRect | null
}

export function SpotifyNowPlaying({
  isMinimized,
  onMinimize,
  onRestore,
  minimizeTargetRect = null,
}: SpotifyNowPlayingProps) {
  const MINIMIZE_ANIMATION_MS = 220
  const [internalIsMinimized, setInternalIsMinimized] = useState(false)
  const minimized = isMinimized ?? internalIsMinimized
  const [isMinimizing, setIsMinimizing] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [windowTransform, setWindowTransform] = useState(
    'translate(0px, 0px) scale(1, 1)'
  )
  const playerRef = useRef<HTMLDivElement>(null)
  const animationTimeoutRef = useRef<number | null>(null)
  const previousMinimizedRef = useRef(minimized)
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

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  useLayoutEffect(() => {
    const wasMinimized = previousMinimizedRef.current
    const isRestoringFromTaskbar = wasMinimized && !minimized

    if (!isRestoringFromTaskbar) {
      previousMinimizedRef.current = minimized
      return
    }

    const playerRect = playerRef.current?.getBoundingClientRect()
    if (!playerRect || !minimizeTargetRect) {
      setIsRestoring(false)
      setWindowTransform('translate(0px, 0px) scale(1, 1)')
      previousMinimizedRef.current = minimized
      return
    }

    const scaleX = Math.max(0.1, minimizeTargetRect.width / playerRect.width)
    const scaleY = Math.max(0.1, minimizeTargetRect.height / playerRect.height)
    const deltaX = minimizeTargetRect.left - playerRect.left
    const deltaY = minimizeTargetRect.top - playerRect.top

    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current)
    }

    setIsRestoring(true)
    setWindowTransform(
      `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`
    )

    requestAnimationFrame(() => {
      setWindowTransform('translate(0px, 0px) scale(1, 1)')
    })

    animationTimeoutRef.current = window.setTimeout(() => {
      setIsRestoring(false)
    }, MINIMIZE_ANIMATION_MS)

    previousMinimizedRef.current = minimized
  }, [minimized, minimizeTargetRect])

  const handleMinimize = () => {
    if (minimized || isMinimizing || isRestoring) return
    const playerRect = playerRef.current?.getBoundingClientRect()

    const finalizeMinimize = () => {
      setIsMinimizing(false)
      setWindowTransform('translate(0px, 0px) scale(1, 1)')
      if (onMinimize) {
        onMinimize()
        return
      }
      setInternalIsMinimized(true)
    }

    if (!playerRect || !minimizeTargetRect) {
      finalizeMinimize()
      return
    }

    const scaleX = Math.max(0.1, minimizeTargetRect.width / playerRect.width)
    const scaleY = Math.max(0.1, minimizeTargetRect.height / playerRect.height)
    const deltaX = minimizeTargetRect.left - playerRect.left
    const deltaY = minimizeTargetRect.top - playerRect.top

    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current)
    }

    setIsMinimizing(true)
    setWindowTransform('translate(0px, 0px) scale(1, 1)')

    requestAnimationFrame(() => {
      setWindowTransform(
        `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`
      )
    })

    animationTimeoutRef.current = window.setTimeout(() => {
      finalizeMinimize()
    }, MINIMIZE_ANIMATION_MS)
  }

  const handleRestore = () => {
    if (isMinimizing || isRestoring) return
    if (onMinimize) {
      if (minimized) {
        onRestore?.()
      }
      return
    }
    if (minimized) {
      setInternalIsMinimized(false)
    } else {
      setInternalIsMinimized(false)
    }
  }

  const isAnimating = isMinimizing || isRestoring
  const isHidden = minimized && !isAnimating

  // If data not loaded, show loading
  if (!trackData) {
    return (
      <div
        ref={playerRef}
        className="w-[380px] border border-black shadow-lg bg-gray-200 p-4 text-center"
        style={{
          opacity: isHidden ? 0 : 1,
          pointerEvents: isHidden || isAnimating ? 'none' : 'auto',
          transform: windowTransform,
          transformOrigin: 'top left',
          transition: isAnimating
            ? 'transform 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms ease'
            : undefined,
        }}
      >
        <p>Loading Windows Media Player...</p>
      </div>
    )
  }

  return (
    <div
      ref={playerRef}
      className="w-[380px] border border-black bg-[#F1EFE2] shadow-lg"
      style={{
        opacity: isHidden ? 0 : isMinimizing ? 0.88 : 1,
        pointerEvents: isHidden || isAnimating ? 'none' : 'auto',
        transform: windowTransform,
        transformOrigin: 'top left',
        transition: isAnimating
          ? 'transform 220ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms ease'
          : undefined,
      }}
    >
      {/* Title bar */}
      <div className="bg-gradient-to-r from-[#0A246A] via-[#3A6EA5] to-[#0A246A] px-2 py-1 flex items-center justify-between">
        <img src={spotifyIcon} alt="Window Icon" className="w-4 h-4" />
        <div className="flex-1 font-bold">Paria's Media Player</div>
        {/* Minimize, Maximize, Close buttons */}
        <div className="flex gap-1">
          <button
            className="w-6 h-5 flex items-center justify-center rounded border border-white/25 bg-white/15 text-white/95 transition-colors hover:bg-white/25 active:bg-white/35"
            aria-label="Minimize media player"
            onClick={handleMinimize}
          >
            <svg
              viewBox="0 0 10 10"
              className="w-3 h-3"
              fill="none"
              aria-hidden="true"
            >
              <path d="M1 7.5h8" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
          <button
            className="w-6 h-5 flex items-center justify-center rounded border border-white/25 bg-white/15 text-white/95 transition-colors hover:bg-white/25 active:bg-white/35"
            aria-label={minimized ? 'Restore media player' : 'Maximize media player'}
            onClick={handleRestore}
          >
            {minimized ? (
              <svg
                viewBox="0 0 10 10"
                className="w-3 h-3"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3.2 2h4.8v4.8H3.2zM2 3.2H6.8V8H2z"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 10 10"
                className="w-3 h-3"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="1.8"
                  y="1.8"
                  width="6.4"
                  height="6.4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
            )}
          </button>
          <button
            className="w-6 h-5 flex items-center justify-center rounded border border-[#b63f3f] bg-[#d9534f]/85 text-white transition-colors hover:bg-[#e05f5b] active:bg-[#c84c48]"
            aria-label="Close media player"
          >
            <svg
              viewBox="0 0 10 10"
              className="w-3 h-3"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 2l6 6M8 2L2 8"
                stroke="currentColor"
                strokeWidth="1.3"
              />
            </svg>
          </button>
        </div>
      </div>

      {isHidden ? null : (
        <>
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
        </>
      )}
    </div>
  )
}
