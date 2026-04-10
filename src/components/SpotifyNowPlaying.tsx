import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { getAccessToken } from '../utils/spotify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBackward,
  faForward,
  faList,
  faMusic,
  faPause,
  faPlay,
  faStop,
  faStepBackward,
  faStepForward,
  faVolumeHigh,
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

const STREAMING_PREF_STORAGE_KEY = 'iamParia.preferredStreaming'

type StreamingServiceId =
  | 'spotify'
  | 'apple_music'
  | 'youtube_music'
  | 'youtube'
  | 'deezer'
  | 'tidal'
  | 'amazon_music'

function buildStreamingLinks(track: {
  name: string
  artist: string
  spotifyUrl: string
}): Array<{ id: StreamingServiceId; label: string; url: string }> {
  const term = encodeURIComponent(`${track.artist} ${track.name}`.trim())
  return [
    {
      id: 'spotify',
      label: 'Spotify',
      url: track.spotifyUrl || `https://open.spotify.com/search/${term}`,
    },
    {
      id: 'apple_music',
      label: 'Apple Music',
      url: `https://music.apple.com/us/search?term=${term}`,
    },
    {
      id: 'youtube_music',
      label: 'YouTube Music',
      url: `https://music.youtube.com/search?q=${term}`,
    },
    {
      id: 'youtube',
      label: 'YouTube',
      url: `https://www.youtube.com/results?search_query=${term}`,
    },
    {
      id: 'deezer',
      label: 'Deezer',
      url: `https://www.deezer.com/search/${term}`,
    },
    {
      id: 'tidal',
      label: 'Tidal',
      url: `https://listen.tidal.com/search?q=${term}`,
    },
    {
      id: 'amazon_music',
      label: 'Amazon Music',
      url: `https://music.amazon.com/search?q=${term}`,
    },
  ]
}

function readPreferredStreamingId(): StreamingServiceId | null {
  try {
    const raw = localStorage.getItem(STREAMING_PREF_STORAGE_KEY)
    if (!raw) return null
    const allowed: StreamingServiceId[] = [
      'spotify',
      'apple_music',
      'youtube_music',
      'youtube',
      'deezer',
      'tidal',
      'amazon_music',
    ]
    return allowed.includes(raw as StreamingServiceId)
      ? (raw as StreamingServiceId)
      : null
  } catch {
    return null
  }
}

function rememberPreferredStreaming(id: StreamingServiceId) {
  try {
    localStorage.setItem(STREAMING_PREF_STORAGE_KEY, id)
  } catch {
    /* ignore quota / private mode */
  }
}

/** Classic WMP (XP)–style flat toolbar controls */
const wmpTransportBtn =
  'inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center border-0 bg-transparent p-0 text-[#2a2a2a] transition-colors hover:bg-black/[0.07] active:bg-black/[0.11] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#316ac5] disabled:pointer-events-none disabled:opacity-[0.38]'

const wmpTransportBtnPrimary =
  'inline-flex h-[28px] w-[28px] shrink-0 items-center justify-center border-0 bg-transparent p-0 text-[#2a2a2a] transition-colors hover:bg-black/[0.07] active:bg-black/[0.11] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#316ac5]'

function WmpEtchedSeparator() {
  return (
    <span
      className="mx-0.5 inline-block h-[18px] w-px shrink-0 self-center bg-[#808080] shadow-[1px_0_0_rgba(255,255,255,0.9)]"
      aria-hidden={true}
    />
  )
}

/** Wedge volume: gray groove and blue fill share one hypotenuse (no slope mismatch). */
function WmpVolumeWedge({
  level = 0.7,
  className = '',
}: {
  level?: number
  className?: string
}) {
  const topRightYPct = 12
  const splitXPct = Math.min(100, Math.max(0, level * 100))
  const yOnHypPct =
    100 + (topRightYPct - 100) * (splitXPct / 100)

  return (
    <div
      className={`relative h-[18px] w-[46px] ${className}`}
      title="Volume in Spotify"
      role="presentation"
    >
      {/* Full wedge groove (gray) */}
      <div
        className="absolute inset-0 border border-[#7d7b71] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.35)]"
        style={{
          clipPath: `polygon(0% 100%, 100% ${topRightYPct}%, 100% 100%)`,
          background:
            'linear-gradient(to bottom, #d2cdc0 0%, #9a9588 100%)',
        }}
      />
      {/* Filled portion: same slanted top edge, cut at thumb x */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#a8ccf0] to-[#2458a0]"
        style={{
          clipPath: `polygon(0% 100%, ${splitXPct}% ${yOnHypPct}%, ${splitXPct}% 100%)`,
        }}
      />
      <div
        className="absolute bottom-px z-[1] w-[4px] rounded-[1px] border border-[#4a4a4a] bg-gradient-to-b from-[#f5f5f5] to-[#9a9a9a] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
        style={{
          left: `${splitXPct}%`,
          top: `calc(${yOnHypPct}% - 1px)`,
          bottom: '1px',
          transform: 'translateX(-50%)',
        }}
      />
    </div>
  )
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
  const helpNoteRef = useRef<HTMLDivElement>(null)
  const playMenuContainerRef = useRef<HTMLDivElement>(null)
  const animationTimeoutRef = useRef<number | null>(null)
  const previousMinimizedRef = useRef(minimized)
  const [helpNoteVisible, setHelpNoteVisible] = useState(false)
  const [playMenuOpen, setPlayMenuOpen] = useState(false)
  const [trackData, setTrackData] = useState<{
    name: string
    artist: string
    album: string
    albumImageUrl: string
    isPlaying: boolean
    spotifyUrl: string
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
            spotifyUrl: currentData.item.external_urls.spotify,
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
                spotifyUrl: lastPlayed.external_urls.spotify,
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

  const openTrackOnPreferredService = () => {
    if (!trackData) return
    const links = buildStreamingLinks(trackData)
    const pref = readPreferredStreamingId()
    const match = pref ? links.find((l) => l.id === pref) : undefined
    const chosen = match ?? links[0]
    if (chosen?.url) {
      window.open(chosen.url, '_blank', 'noopener,noreferrer')
    }
  }

  useEffect(() => {
    if (!playMenuOpen) return
    const onDocMouseDown = (e: MouseEvent) => {
      const el = playMenuContainerRef.current
      if (el && !el.contains(e.target as Node)) {
        setPlayMenuOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPlayMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [playMenuOpen])

  useEffect(() => {
    if (!helpNoteVisible) return
    const el = helpNoteRef.current
    if (!el) return
    el.focus()
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [helpNoteVisible])

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
        <p>Loading Paria&apos;s Media Player...</p>
      </div>
    )
  }

  const streamingLinksForToolbar = buildStreamingLinks(trackData)
  const preferredStreamingId = readPreferredStreamingId()
  const preferredStreamingLabel = preferredStreamingId
    ? streamingLinksForToolbar.find((l) => l.id === preferredStreamingId)?.label
    : null

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
      <div className="flex items-center justify-between border-b border-black/25 bg-gradient-to-r from-[#0A246A] via-[#3A6EA5] to-[#0A246A] px-2 py-1 font-['Tahoma','Segoe_UI',system-ui,sans-serif] text-white">
        <div className="flex min-w-0 flex-1 items-center gap-2 pr-2">
          <span
            className="flex h-4 w-4 shrink-0 items-center justify-center opacity-95"
            aria-hidden={true}
          >
            <FontAwesomeIcon icon={faMusic} className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1 truncate text-[13px] font-bold tracking-tight">
            Paria&apos;s Media Player
          </div>
        </div>
        {/* Minimize, Maximize, Close buttons */}
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
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
            type="button"
            className="w-6 h-5 flex items-center justify-center rounded border border-white/25 bg-white/15 text-white/95 transition-colors hover:bg-white/25 active:bg-white/35"
            aria-label={
              minimized ? 'Restore media player' : 'Maximize media player'
            }
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
            type="button"
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
          <div className="flex h-6 items-center border-b border-black/10 bg-[#F1EFE2] px-1 font-['Tahoma','Segoe_UI',system-ui,sans-serif] text-xs text-black">
            <span className="mr-1 cursor-default rounded px-1.5 py-0.5 transition-colors hover:bg-black/5">
              File
            </span>
            <span className="mr-1 cursor-default rounded px-1.5 py-0.5 transition-colors hover:bg-black/5">
              View
            </span>
            <div className="relative mr-1" ref={playMenuContainerRef}>
              <button
                type="button"
                className="cursor-pointer rounded border-0 bg-transparent px-1.5 py-0.5 text-inherit transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b579a] focus-visible:ring-offset-0"
                aria-label="Play — choose a streaming service"
                aria-haspopup="menu"
                aria-expanded={playMenuOpen}
                aria-controls="media-player-play-menu"
                onClick={() => setPlayMenuOpen((o) => !o)}
              >
                Play
              </button>
              {playMenuOpen ? (
                <div
                  id="media-player-play-menu"
                  role="menu"
                  aria-label="Open track on a streaming service"
                  className="absolute left-0 top-full z-40 mt-0.5 min-w-[10.5rem] border border-neutral-600 bg-[#ece9d8] py-0.5 font-['Tahoma','Segoe_UI',system-ui,sans-serif] shadow-[2px_2px_4px_rgba(0,0,0,0.25)]"
                >
                  {buildStreamingLinks(trackData).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitem"
                      className="block w-full px-3 py-1 text-left text-xs text-black transition-colors hover:bg-[#316ac5] hover:text-white focus-visible:bg-[#316ac5] focus-visible:text-white focus-visible:outline-none"
                      onClick={() => {
                        rememberPreferredStreaming(item.id)
                        window.open(item.url, '_blank', 'noopener,noreferrer')
                        setPlayMenuOpen(false)
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <span className="mr-1 cursor-default rounded px-1.5 py-0.5 transition-colors hover:bg-black/5">
              Favorites
            </span>
            <span className="mr-1 cursor-default rounded px-1.5 py-0.5 transition-colors hover:bg-black/5">
              Go
            </span>
            <button
              type="button"
              className="mr-1 cursor-pointer rounded border-0 bg-transparent px-1.5 py-0.5 text-inherit transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b579a] focus-visible:ring-offset-0"
              onClick={() => setHelpNoteVisible((v) => !v)}
              aria-expanded={helpNoteVisible}
              aria-controls="media-player-help-note"
              aria-label="Help — about this player"
            >
              Help
            </button>
          </div>

          {helpNoteVisible ? (
            <div
              ref={helpNoteRef}
              id="media-player-help-note"
              tabIndex={-1}
              className="border-b border-gray-400 bg-[#fffacd] px-2 py-1.5 text-[11px] leading-snug text-neutral-900 outline-none ring-2 ring-inset ring-[#2b579a]/40"
            >
              Track and playback status come from the{' '}
              <strong>Spotify Web API</strong> (currently playing and recently
              played). Use <strong>Play</strong> to open this track on Spotify,
              Apple Music, YouTube Music, and more (other apps use a search for
              this artist and title). Your choice is remembered for the toolbar
              play button. Skip and stop only work inside each app.
            </div>
          ) : null}

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

          {/* Playback bar — Windows Media Player (XP) style */}
          <div className="border-t border-[#808080] bg-[#ece9d8] font-['Tahoma','Segoe_UI',system-ui,sans-serif] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            {/* Seek / progress row (full width, above buttons) */}
            <div className="px-2 pb-1 pt-1.5">
              <div className="relative h-[15px] w-full">
                <div className="absolute inset-x-0 top-1/2 h-[8px] -translate-y-1/2 rounded-[1px] border border-[#7d7b71] bg-gradient-to-b from-[#b5b1a5] to-[#d8d4ca] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.28),inset_-1px_-1px_1px_rgba(255,255,255,0.35)]">
                  <div
                    className="absolute left-0 top-0 h-full rounded-[1px] bg-gradient-to-b from-[#b8d4f6] via-[#5b8fd4] to-[#214a8f] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition-[width] duration-700 ease-out"
                    style={{
                      width: `${trackData.isPlaying ? 40 : 12}%`,
                    }}
                  />
                  <div
                    className="absolute top-1/2 z-[1] h-[12px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-[1px] border border-[#5f5f5f] bg-gradient-to-b from-white via-[#e8e8e8] to-[#a8a8a8] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_0_0_1px_rgba(0,0,0,0.08)]"
                    style={{
                      left: `${trackData.isPlaying ? 40 : 12}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Transport + volume row */}
            <div className="flex items-center px-1 pb-1.5 pt-0.5">
              <button
                type="button"
                className={wmpTransportBtnPrimary}
                aria-label={
                  preferredStreamingLabel
                    ? trackData.isPlaying
                      ? `Open in ${preferredStreamingLabel} (currently playing)`
                      : `Open in ${preferredStreamingLabel}`
                    : trackData.isPlaying
                      ? 'Open in Spotify (currently playing)'
                      : 'Open in Spotify'
                }
                title={
                  preferredStreamingLabel
                    ? `Opens in ${preferredStreamingLabel}. Change from the Play menu.`
                    : 'Opens in Spotify. Choose another app from the Play menu.'
                }
                onClick={openTrackOnPreferredService}
              >
                <FontAwesomeIcon
                  icon={trackData.isPlaying ? faPause : faPlay}
                  className="h-[14px] w-[14px]"
                />
              </button>
              <button
                type="button"
                className={wmpTransportBtn}
                aria-label="Stop (use Spotify app)"
                title="Use the Spotify app to stop playback"
                disabled
              >
                <FontAwesomeIcon icon={faStop} className="h-3 w-3" />
              </button>
              <WmpEtchedSeparator />
              <button
                type="button"
                className={wmpTransportBtn}
                aria-label="Previous track (use Spotify app)"
                title="Use the Spotify app to change tracks"
                disabled
              >
                <FontAwesomeIcon icon={faStepBackward} className="h-3 w-3" />
              </button>
              <button
                type="button"
                className={wmpTransportBtn}
                aria-label="Rewind (use Spotify app)"
                title="Use the Spotify app"
                disabled
              >
                <FontAwesomeIcon icon={faBackward} className="h-3 w-3" />
              </button>
              <button
                type="button"
                className={wmpTransportBtn}
                aria-label="Fast forward (use Spotify app)"
                title="Use the Spotify app"
                disabled
              >
                <FontAwesomeIcon icon={faForward} className="h-3 w-3" />
              </button>
              <button
                type="button"
                className={wmpTransportBtn}
                aria-label="Next track (use Spotify app)"
                title="Use the Spotify app to change tracks"
                disabled
              >
                <FontAwesomeIcon icon={faStepForward} className="h-3 w-3" />
              </button>
              <WmpEtchedSeparator />
              <button
                type="button"
                className={wmpTransportBtn}
                aria-label="Now playing list (not available)"
                title="Decorative control"
                disabled
              >
                <FontAwesomeIcon icon={faList} className="h-3 w-3" />
              </button>
              <WmpEtchedSeparator />
              <div className="ml-auto flex shrink-0 items-center gap-0.5 pl-1">
                <span
                  className="flex h-[26px] w-[22px] items-center justify-center text-[#2a2a2a]"
                  aria-hidden={true}
                >
                  <FontAwesomeIcon
                    icon={faVolumeHigh}
                    className="h-3 w-3"
                  />
                </span>
                <WmpVolumeWedge level={0.7} />
              </div>
            </div>
          </div>

          {/* Bottom metadata section (Source, Show, Clip, Author, etc.) */}
          <div className="text-xs px-2 py-1 bg-black space-y-1 border-t border-gray-400">
            <div>
              <strong>Source:</strong> Spotify
            </div>
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
