import {useCallback, useEffect, useId, useRef, useState, type CSSProperties} from 'react'
import {PlayIcon, StopIcon, SyncIcon, VideoIcon} from '@primer/octicons-react'
import BaseStyles from '../../BaseStyles'
import {Button} from '../../Button'
import {ThemeProvider} from '../../ThemeProvider'
import ToggleSwitch from '../../ToggleSwitch'
import {useMedia} from '../../hooks/useMedia'
import {useResizeObserver} from '../../hooks/useResizeObserver'
import {SelectPanelFilmSource} from './SelectPanelFilmSource'
import {SelectPanelFilmDesktop} from './SelectPanelFilmDesktop'
import {filmDuration, filmNotifications, filmScenes} from './filmTimeline'
import classes from './SelectPanelFilm.module.css'

const filmDesktop = {x: 129.6, y: 50, scale: 0.82, chromeHeight: 80}

function timeLabel(time: number) {
  return `${Math.floor(time / 60_000)}:${String(Math.floor(time / 1_000) % 60).padStart(2, '0')}`
}

export function SelectPanelFilm({duration = filmDuration}: {duration?: number}) {
  const [clock, setClock] = useState({time: 0, playing: false})
  const [autoplay, setAutoplay] = useState(true)
  const autoplayLabel = useId()
  const currentScene = filmScenes.findLast(scene => clock.time >= scene.time)!
  const nextScene = filmScenes.find(scene => scene.time > clock.time && scene.time < duration)
  // Hold the current scene's last frame, aligned with the slider's 10ms steps.
  const sceneEnd = nextScene ? nextScene.time - 10 : duration
  const playbackEnd = autoplay ? duration : sceneEnd
  const [presenting, setPresenting] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const exitPresentation = useCallback(() => {
    setClock(current => ({...current, playing: false}))
    setCountdown(0)
    setPresenting(false)
  }, [])
  const [ready, setReady] = useState(false)
  const [sound, setSound] = useState(true)
  const [soundError, setSoundError] = useState<string | null>(null)
  const audio = useRef<AudioContext | null>(null)
  const lastSound = useRef(0)
  const enableAudio = async () => {
    try {
      const context = audio.current ?? new AudioContext()
      audio.current = context
      await context.resume()
    } catch (reason) {
      setSoundError(`Film sound could not start: ${String(reason)}`)
    }
  }
  const [pointer, setPointer] = useState({x: 1120, y: 375})
  const onReady = useCallback((anchor?: {x: number; y: number}) => {
    if (anchor) setPointer(anchor)
    setReady(true)
  }, [])
  const [focus, setFocus] = useState({x: 720, y: 405})
  const onFocus = useCallback((center: {x: number; y: number}) => setFocus(center), [])
  const viewport = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(1440)
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)', false)
  useResizeObserver(([entry]) => setWidth(entry.contentRect.width), viewport)

  useEffect(() => {
    const context = audio.current
    // eslint-disable-next-line react-you-might-not-need-an-effect/no-event-handler -- Audio follows the continuous clock, including pause and seek.
    if (clock.playing && sound && context?.state === 'running') {
      const notification = filmNotifications.find(time => time > lastSound.current && time <= clock.time)
      if (notification !== undefined) {
        for (const [index, frequency] of [880, 1174].entries()) {
          const oscillator = context.createOscillator()
          const gain = context.createGain()
          const start = context.currentTime + index * 0.075
          oscillator.type = 'sine'
          oscillator.frequency.value = frequency
          gain.gain.setValueAtTime(0, start)
          gain.gain.linearRampToValueAtTime(0.035, start + 0.01)
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15)
          oscillator.connect(gain).connect(context.destination)
          oscillator.start(start)
          oscillator.stop(start + 0.16)
          oscillator.onended = () => {
            oscillator.disconnect()
            gain.disconnect()
          }
        }
      }
    }
    lastSound.current = clock.time
  }, [clock.time, clock.playing, sound])

  useEffect(
    () => () => {
      if (audio.current && audio.current.state !== 'closed') {
        void audio.current.close()
      }
    },
    [],
  )

  useEffect(() => {
    if (!clock.playing) return
    let previous = performance.now()
    let frame: number
    const advance = (now: number) => {
      // The first RAF timestamp can precede the effect's performance.now().
      const delta = Math.max(0, now - previous)
      previous = Math.max(previous, now)
      setClock(current => {
        const time = Math.min(playbackEnd, current.time + delta)
        return {time, playing: current.playing && time < playbackEnd}
      })
      frame = requestAnimationFrame(advance)
    }
    frame = requestAnimationFrame(advance)
    return () => cancelAnimationFrame(frame)
  }, [clock.playing, playbackEnd])

  useEffect(() => {
    if (countdown === 0) return
    const timer = window.setTimeout(() => {
      setCountdown(countdown - 1)
      if (countdown === 1) setClock({time: 0, playing: true})
    }, 1_000)
    return () => window.clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      exitPresentation()
    }
    const onVisibilityChange = () => {
      if (!document.hidden) return
      exitPresentation()
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [exitPresentation])

  const displayTime = reducedMotion && clock.time < 8_000 ? (clock.time < 3_000 ? 0 : 8_000) : clock.time
  const style: CSSProperties & {
    '--film-time': string
    '--film-scale': number
    '--film-pan-x': string
    '--film-pan-y': string
    '--film-pointer-x': string
    '--film-pointer-y': string
    '--film-label-pan-x': string
    '--film-label-pan-y': string
    '--film-browser-scale': number
    '--film-browser-x': string
    '--film-browser-y': string
    '--film-browser-chrome-height': string
  } = {
    '--film-time': `-${displayTime}ms`,
    '--film-scale': width / 1440,
    '--film-pan-x': `${720 - filmDesktop.x - focus.x * filmDesktop.scale}px`,
    '--film-pan-y': `${405 - filmDesktop.y - (filmDesktop.chromeHeight + focus.y) * filmDesktop.scale}px`,
    '--film-pointer-x': `${pointer.x}px`,
    '--film-pointer-y': `${pointer.y}px`,
    '--film-label-pan-x': `${720 - filmDesktop.x - pointer.x * filmDesktop.scale}px`,
    '--film-label-pan-y': `${405 - filmDesktop.y - (filmDesktop.chromeHeight + pointer.y) * filmDesktop.scale}px`,
    '--film-browser-scale': filmDesktop.scale,
    '--film-browser-x': `${filmDesktop.x}px`,
    '--film-browser-y': `${filmDesktop.y}px`,
    '--film-browser-chrome-height': `${filmDesktop.chromeHeight}px`,
  }

  return (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <main className={classes.Film} data-presenting={presenting}>
          <div className={classes.Viewport} ref={viewport} style={style}>
            <div
              className={classes.Stage}
              role="img"
              aria-label="A SelectPanel film: a GitHub issue in a desktop browser zooms into labels becoming building blocks; a team assembles agent assignment, then explores mobile and native platform experiments."
            >
              <div className={classes.Lens}>
                <div className={classes.Camera}>
                  <SelectPanelFilmDesktop>
                    <SelectPanelFilmSource
                      time={displayTime}
                      onReady={onReady}
                      onFocus={onFocus}
                      onEscape={exitPresentation}
                    />
                    <div className={classes.Pointer} aria-hidden="true">
                      <svg width="30" height="36" viewBox="0 0 30 36" fill="none" aria-hidden="true">
                        <path
                          d="M3 2L25 20L15 22L10 32L3 2Z"
                          fill="currentColor"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </SelectPanelFilmDesktop>
                </div>
              </div>
              {countdown > 0 ? (
                <div className={classes.Countdown} role="status">
                  {countdown}
                </div>
              ) : null}
            </div>
          </div>
          <div className={classes.Controls} style={{visibility: presenting ? 'hidden' : undefined}}>
            <div className={classes.Playback}>
              <Button
                disabled={!ready}
                leadingVisual={clock.playing ? StopIcon : PlayIcon}
                onClick={() => {
                  if (sound) void enableAudio()
                  setClock(current => ({
                    time:
                      current.time === duration
                        ? 0
                        : !autoplay && current.time === sceneEnd
                          ? (nextScene?.time ?? 0)
                          : current.time,
                    playing: !current.playing,
                  }))
                }}
              >
                {clock.playing ? 'Pause scene' : clock.time === duration ? 'Replay scene' : 'Play scene'}
              </Button>
              <Button leadingVisual={SyncIcon} onClick={() => setClock({time: 0, playing: false})}>
                Restart
              </Button>
              <Button
                aria-pressed={sound}
                onClick={() => {
                  if (!sound) void enableAudio()
                  setSound(!sound)
                }}
              >
                {sound ? 'Sound on' : 'Sound off'}
              </Button>
              {duration > 8_000 ? (
                <div className={classes.Autoplay}>
                  <span id={autoplayLabel}>Autoplay next scene</span>
                  <ToggleSwitch
                    size="small"
                    aria-labelledby={autoplayLabel}
                    checked={autoplay}
                    onChange={setAutoplay}
                  />
                </div>
              ) : null}
              <span className={classes.Time}>
                {timeLabel(clock.time)} / {timeLabel(duration)}
              </span>
              <Button
                disabled={!ready}
                leadingVisual={VideoIcon}
                onClick={() => {
                  if (sound) void enableAudio()
                  setClock({time: 0, playing: false})
                  setPresenting(true)
                  setCountdown(3)
                }}
              >
                Present scene
              </Button>
            </div>
            {soundError ? <span role="alert">{soundError}</span> : null}
            <input
              aria-label="Scene position"
              aria-valuetext={timeLabel(clock.time)}
              type="range"
              min={0}
              max={duration}
              step={10}
              value={clock.time}
              disabled={!ready}
              onChange={event => setClock({time: Number(event.target.value), playing: false})}
            />
            {duration > 8_000 ? (
              <nav className={classes.Chapters} aria-label="Film scenes">
                {filmScenes
                  .filter(scene => scene.time < duration)
                  .map(scene => (
                    <Button
                      key={scene.time}
                      size="small"
                      variant="invisible"
                      aria-current={scene === currentScene ? 'step' : undefined}
                      onClick={() => setClock({time: scene.time, playing: false})}
                    >
                      {scene.name}
                    </Button>
                  ))}
              </nav>
            ) : null}
          </div>
        </main>
      </BaseStyles>
    </ThemeProvider>
  )
}
