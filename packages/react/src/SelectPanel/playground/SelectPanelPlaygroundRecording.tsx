import {useCallback, useEffect, useRef, useState, type ReactNode} from 'react'
import {PlayIcon, StopIcon, SyncIcon, VideoIcon} from '@primer/octicons-react'
import {Button} from '../../Button'
import Text from '../../Text'
import {SelectPanelPlayground} from './SelectPanelPlayground'
import {
  getPlaygroundRecordingFrame,
  PLAYGROUND_RECORDING_COUNTDOWN,
  PLAYGROUND_RECORDING_DURATION,
  type PlaygroundRecordingConfig,
} from './playgroundRecording'
import classes from './SelectPanelPlaygroundRecording.module.css'

export interface PlaygroundRecordingPreviewProps {
  config: PlaygroundRecordingConfig
  resetKey: number
  onReady: () => void
}

interface SelectPanelPlaygroundRecordingProps {
  skinSource?: string
  renderPreview: (props: PlaygroundRecordingPreviewProps) => ReactNode
}

export function SelectPanelPlaygroundRecording({skinSource, renderPreview}: SelectPanelPlaygroundRecordingProps) {
  const [clock, setClock] = useState({elapsedMs: 0, playing: false})
  const [recording, setRecording] = useState(false)
  const [ready, setReady] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const startedAt = useRef(0)
  const onReady = useCallback(() => setReady(true), [])
  const elapsedMs = Math.max(0, clock.elapsedMs)
  const frame = getPlaygroundRecordingFrame(elapsedMs)
  const finished = elapsedMs === PLAYGROUND_RECORDING_DURATION

  useEffect(() => {
    if (!clock.playing) return
    const timer = window.setInterval(() => {
      const next = Math.min(PLAYGROUND_RECORDING_DURATION, performance.now() - startedAt.current)
      setClock({elapsedMs: next, playing: next < PLAYGROUND_RECORDING_DURATION})
    }, 100)
    return () => window.clearInterval(timer)
  }, [clock.playing])

  useEffect(() => {
    function pause() {
      setRecording(false)
      setClock(current => ({...current, playing: false}))
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') pause()
    }
    function onVisibilityChange() {
      if (document.hidden) pause()
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  function start(countdown: number) {
    startedAt.current = performance.now() + countdown
    setResetKey(current => current + 1)
    setClock({elapsedMs: -countdown, playing: true})
  }

  function togglePlayback() {
    if (clock.playing) {
      setClock(current => ({...current, playing: false}))
    } else if (finished || clock.elapsedMs === 0) {
      start(0)
    } else {
      startedAt.current = performance.now() - clock.elapsedMs
      setClock(current => ({...current, playing: true}))
    }
  }

  const controls = (
    <>
      <div className={classes.Playback} hidden={recording} role="group" aria-label="Playground recording controls">
        <Button
          size="small"
          variant="primary"
          leadingVisual={clock.playing ? StopIcon : finished ? SyncIcon : PlayIcon}
          disabled={!ready}
          onClick={togglePlayback}
        >
          {clock.playing ? 'Pause' : finished ? 'Replay' : clock.elapsedMs !== 0 ? 'Resume' : 'Play tour'}
        </Button>
        <Button
          size="small"
          leadingVisual={VideoIcon}
          disabled={!ready}
          onClick={() => {
            setRecording(true)
            start(PLAYGROUND_RECORDING_COUNTDOWN)
          }}
        >
          Record mode
        </Button>
        <div className={classes.Status}>
          <Text size="small" weight="semibold" role="status">
            {frame.cue.label}
          </Text>
          <Text size="small" className={classes.Muted}>
            {Math.floor(elapsedMs / 1_000)} / 25s. Escape pauses.
          </Text>
        </div>
      </div>
      {recording ? (
        <Text className={classes.SrOnly} role="status">
          {finished ? 'Tour finished.' : 'Recording mode.'} Press Escape to show playback controls.
        </Text>
      ) : null}
    </>
  )

  return (
    <div className={classes.Recording} data-playing={clock.playing} data-recording={recording}>
      <SelectPanelPlayground
        skinSource={skinSource}
        playback={{frame, controls}}
        renderPreview={() => renderPreview({config: {elapsedMs}, resetKey, onReady})}
      />
      {clock.elapsedMs < 0 && clock.playing ? (
        <div className={classes.Countdown} role="status" aria-label="Recording countdown">
          <span className={classes.CountdownNumber}>{Math.ceil(-clock.elapsedMs / 1_000)}</span>
          <span>Ready to record. Escape pauses.</span>
        </div>
      ) : null}
    </div>
  )
}
