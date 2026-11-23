import {useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode} from 'react'
import {PlayIcon, StopIcon, SyncIcon, VideoIcon} from '@primer/octicons-react'
import {Button} from '../../Button'
import BaseStyles from '../../BaseStyles'
import Heading from '../../Heading'
import Label from '../../Label'
import {ProgressBar} from '../../ProgressBar'
import Text from '../../Text'
import {KeybindingHint} from '../../KeybindingHint'
import {SegmentedControl} from '../../SegmentedControl'
import {ThemeProvider} from '../../ThemeProvider'
import {useResizeObserver} from '../../hooks/useResizeObserver'
import {useMedia} from '../../hooks/useMedia'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import {SHOWCASE_COUNTDOWN, type ShowcaseConfig} from './showcase'
import {
  convertShowcaseTime,
  DEFAULT_SHOWCASE_LAYOUT,
  getShowcaseChapters,
  getShowcaseDuration,
  getShowcasePlayback,
  type ShowcaseLayout,
} from './showcasePlayback'
import classes from './SelectPanelShowcase.module.css'

export interface ShowcasePreviewProps {
  config: ShowcaseConfig
  resetKey: number
  onReady: () => void
}

interface SelectPanelShowcaseProps {
  renderPreview: (props: ShowcasePreviewProps) => ReactNode
  defaultLayout?: ShowcaseLayout
}

const platformCapabilities = [
  {label: 'Popover API', benefit: 'Top-layer rendering'},
  {label: 'CSS Anchor Positioning', benefit: 'Browser-managed placement'},
  {label: 'Invoker Commands API', benefit: 'Declarative browser commands'},
  {label: 'Native <dialog> element', benefit: 'Browser-managed modality'},
  {label: 'Virtualization', benefit: 'An optional TanStack Virtual collection for large datasets'},
] as const

const compositionCandidates = [
  {
    name: 'FilteredActionList',
    opportunity: 'Open up the collection without rebuilding selection and keyboard behavior.',
    parts: ['Search', 'Collection', 'States'],
  },
  {
    name: 'Autocomplete',
    opportunity: 'Keep the existing parts. Make the menu and its options more flexible.',
    parts: ['Input', 'Options', 'Groups'],
  },
  {
    name: 'Dialog',
    opportunity: 'More freedom in layout. Keep shared modal and focus behavior.',
    parts: ['Header', 'Body', 'Actions'],
  },
  {
    name: 'TextInput',
    opportunity: 'Compose field content without adding another configuration prop.',
    parts: ['Input', 'Visuals', 'Counter'],
  },
  {
    name: 'Pagination',
    opportunity: 'Custom navigation layouts, powered by a shared pagination model.',
    parts: ['Previous', 'Pages', 'Next'],
  },
] as const

const candidatePartColors = {
  Search: 'blue',
  Collection: 'purple',
  States: 'orange',
  Input: 'green',
  Options: 'pink',
  Groups: 'indigo',
  Header: 'cyan',
  Body: 'brown',
  Actions: 'red',
  Visuals: 'teal',
  Counter: 'olive',
  Previous: 'plum',
  Pages: 'auburn',
  Next: 'pine',
} satisfies Record<(typeof compositionCandidates)[number]['parts'][number], string>

function CompositionCandidates() {
  return (
    <ol className={classes.Candidates} aria-label="Candidates for composition">
      {compositionCandidates.map((candidate, index) => (
        <li key={candidate.name} className={classes.Candidate} style={{animationDelay: `${650 + index * 180}ms`}}>
          <span className={classes.CandidateNumber} aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <Heading as="h2">{candidate.name}</Heading>
          <Text as="p">{candidate.opportunity}</Text>
          <div className={classes.CandidateParts}>
            {candidate.parts.map(part => (
              <Label
                key={part}
                variant="primary"
                style={{'--fgColor-default': `var(--display-${candidatePartColors[part]}-fgColor)`} as CSSProperties}
              >
                {part}
              </Label>
            ))}
          </div>
        </li>
      ))}
    </ol>
  )
}

export function ShowcaseTypewriter({title}: {title: string}) {
  return (
    <span aria-hidden="true" className={classes.Typewriter}>
      {Array.from(title).map((character, index) => (
        <span
          key={index}
          className={classes.TypedCharacter}
          style={{animationDelay: `${(index / title.length) * 750}ms`}}
        >
          {character}
        </span>
      ))}
      <span className={classes.Caret} />
    </span>
  )
}

export function PlatformCapabilities({
  time,
  duration,
  reducedMotion,
}: {
  time: number
  duration: number
  reducedMotion: boolean
}) {
  const activeIndex = Math.min(
    platformCapabilities.length - 1,
    Math.floor(time / (duration / platformCapabilities.length)),
  )
  return (
    <div className={classes.PlatformCapabilities} data-reduced-motion={reducedMotion}>
      <div className={classes.CapabilityWindow}>
        <span className={classes.CapabilityPointer} aria-hidden="true">
          ▸
        </span>
        <ul className={classes.CapabilityWheel} aria-label="Platform and performance capabilities">
          {platformCapabilities.map((capability, index) => (
            <li
              key={capability.label}
              className={classes.Capability}
              data-active={index === activeIndex}
              style={
                {
                  '--capability-angle': `${index * 24}deg`,
                  '--capability-delay': `${(index * duration) / platformCapabilities.length}ms`,
                } as CSSProperties
              }
            >
              {capability.label}
              <span className={classes.SrOnly}>. {capability.benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function formatTime(milliseconds: number) {
  const seconds = Math.floor(Math.max(0, milliseconds) / 1_000)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

export function SelectPanelShowcase({
  renderPreview,
  defaultLayout = DEFAULT_SHOWCASE_LAYOUT,
}: SelectPanelShowcaseProps) {
  const [layout, setLayout] = useState(defaultLayout)
  const [clock, setClock] = useState({elapsedMs: 0, playing: false})
  const [recording, setRecording] = useState(false)
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])
  const elapsedMs = Math.max(0, clock.elapsedMs)
  const {chapter, frame, scriptTime, phase, phaseTime, phaseDuration} = getShowcasePlayback(elapsedMs, layout)
  const duration = getShowcaseDuration(layout)
  const chapters = getShowcaseChapters(layout)
  const finished = elapsedMs === duration
  const showNarrative = phase !== 'demo'
  const showDemo = phase === 'demo' || phase === 'split'
  const showNext = chapter.id === 'next'
  const fullWidthNarrative = layout === 'slideshow' || showNext || chapter.id === 'closing'
  const platformSummary = layout === 'slideshow' && frame.scene.id === 'platform'
  const title = chapter.title
  const description = platformSummary
    ? 'Native browser APIs and an optional virtualized collection. Same composable SelectPanel.'
    : chapter.description
  const principle = showNext
    ? 'Not every component needs more parts. Start where composition makes a difference.'
    : platformSummary
      ? 'Opt-in platform and performance proofs of concept. Same composable SelectPanel.'
      : chapter.id === 'platform'
        ? 'Browser-native mechanics. Application-owned composition.'
        : chapter.id === 'closing'
          ? 'Existing API. Composable parts. Primer foundations.'
          : null
  const filmRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)', false)
  const motionActive =
    fullWidthNarrative && !reducedMotion && clock.elapsedMs >= 0 && !finished && (clock.playing || phaseTime > 0)
  const motionStyle: CSSProperties & {'--showcase-phase-duration': string} = {
    '--showcase-phase-duration': `${phaseDuration}ms`,
  }
  const viewportRef = useRef<HTMLDivElement>(null)
  const [availableWidth, setAvailableWidth] = useState(802)
  useResizeObserver(([entry]) => {
    if (entry.contentRect.width > 0) setAvailableWidth(entry.contentRect.width)
  }, viewportRef)
  const deviceWidth = (frame.mobile ? 375 : 800) + 2
  const previewHeight = 720
  const scale = Math.min(1, availableWidth / deviceWidth)
  const viewportStyle: CSSProperties & {'--select-panel-playground-preview-height': string} = {
    '--select-panel-playground-preview-height': `${previewHeight}px`,
    height: (previewHeight + 2) * scale,
  }

  useIsomorphicLayoutEffect(() => {
    if (!motionActive) return
    for (const animation of filmRef.current?.getAnimations({subtree: true}) ?? []) {
      animation.pause()
      animation.currentTime = phaseTime
      const endTime = animation.effect?.getComputedTiming().endTime
      if (clock.playing && typeof endTime === 'number' && phaseTime < endTime) animation.play()
    }
  }, [motionActive, phaseTime, phase, clock.playing])

  useEffect(() => {
    if (!clock.playing) return
    let previous = performance.now()
    const timer = window.setInterval(() => {
      const now = performance.now()
      const delta = now - previous
      previous = now
      setClock(current => {
        if (!current.playing) return current
        const next = Math.min(duration, current.elapsedMs + delta)
        return {elapsedMs: next, playing: next < duration}
      })
    }, 100)
    return () => window.clearInterval(timer)
  }, [clock.playing, duration])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setRecording(false)
      setClock(current => ({...current, playing: false}))
    }
    function onVisibilityChange() {
      if (document.hidden) setClock(current => ({...current, playing: false}))
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  const previewProps = {
    config: {elapsedMs: scriptTime, playing: clock.playing && clock.elapsedMs >= 0 && !showNext},
    resetKey: 0,
    onReady,
  }

  return (
    <ThemeProvider colorMode="day" dayScheme="light">
      <BaseStyles>
        <main className={classes.Showcase} data-recording={recording} data-layout={layout}>
          <div
            ref={filmRef}
            className={classes.Film}
            data-layout={layout}
            data-phase={phase}
            data-scene={chapter.id}
            data-motion={motionActive}
            style={motionStyle}
          >
            <section className={classes.Narrative} aria-labelledby="showcase-title" hidden={!showNarrative}>
              <div key={chapter.id} className={classes.SceneCopy}>
                {!fullWidthNarrative ? (
                  <Text as="p" className={classes.Eyebrow}>
                    {chapter.label}
                  </Text>
                ) : null}
                <Heading
                  as="h1"
                  id="showcase-title"
                  className={classes.Headline}
                  aria-label={fullWidthNarrative ? title : undefined}
                >
                  {fullWidthNarrative ? <ShowcaseTypewriter title={title} /> : title}
                </Heading>
                {!fullWidthNarrative ? (
                  <Text as="p" className={classes.Description}>
                    {description}
                  </Text>
                ) : null}
              </div>
              {!fullWidthNarrative ? (
                <div className={classes.Parts} role="group" aria-label="Building blocks in this scene">
                  {frame.scene.parts.map(part => (
                    <Label
                      key={part}
                      size="large"
                      data-active={frame.platformFeature ? frame.platformFeature.label === part : undefined}
                    >
                      {part}
                    </Label>
                  ))}
                </div>
              ) : null}
              {platformSummary ? (
                <PlatformCapabilities time={phaseTime} duration={phaseDuration} reducedMotion={reducedMotion} />
              ) : null}
              {showNext ? <CompositionCandidates /> : null}
              {!fullWidthNarrative && principle ? (
                <Text as="p" className={classes.Principle}>
                  {principle}
                </Text>
              ) : null}
            </section>

            <section className={classes.Screen} aria-label="Scripted product demonstration" hidden={!showDemo}>
              <div className={classes.PreviewViewport} ref={viewportRef} style={viewportStyle}>
                <div
                  className={classes.Device}
                  data-mobile={frame.mobile}
                  style={{width: deviceWidth, transform: `scale(${scale})`}}
                >
                  {renderPreview(previewProps)}
                </div>
              </div>
              <div
                className={classes.SceneNote}
                role={frame.keyCue ? 'group' : undefined}
                aria-label={frame.keyCue ? 'Demonstrated keyboard input' : undefined}
                aria-description={frame.keyCue?.label}
                data-key-cue={frame.keyCue?.keys}
              >
                {frame.keyCue ? <KeybindingHint className={classes.KeyCue} keys={frame.keyCue.keys} /> : null}
              </div>
            </section>
          </div>

          <footer className={classes.Playback} hidden={recording}>
            <div className={classes.PlaybackTop}>
              <div className={classes.Buttons}>
                <Button
                  leadingVisual={clock.playing ? StopIcon : finished ? SyncIcon : PlayIcon}
                  disabled={!ready}
                  onClick={() =>
                    setClock(current => ({
                      elapsedMs: finished ? 0 : current.elapsedMs,
                      playing: !current.playing,
                    }))
                  }
                >
                  {clock.playing ? 'Pause' : finished ? 'Replay' : elapsedMs > 0 ? 'Resume' : 'Play demo'}
                </Button>
                <Button
                  leadingVisual={VideoIcon}
                  disabled={!ready}
                  onClick={() => {
                    setRecording(true)
                    setClock({elapsedMs: -SHOWCASE_COUNTDOWN, playing: true})
                  }}
                >
                  Record mode
                </Button>
              </div>
              <Text size="small" className={classes.Muted}>
                {formatTime(elapsedMs)} / {formatTime(duration)}
              </Text>
            </div>
            <SegmentedControl
              aria-label="Showcase layout"
              size="small"
              onChange={index => {
                const nextLayout = index === 0 ? 'slideshow' : 'split'
                setClock(current => ({
                  elapsedMs: convertShowcaseTime(Math.max(0, current.elapsedMs), layout, nextLayout),
                  playing: false,
                }))
                setLayout(nextLayout)
              }}
            >
              <SegmentedControl.Button selected={layout === 'slideshow'}>Slideshow</SegmentedControl.Button>
              <SegmentedControl.Button selected={layout === 'split'}>Split view</SegmentedControl.Button>
            </SegmentedControl>
            <ProgressBar progress={(elapsedMs / duration) * 100} aria-label="Showcase playback" />
            <nav className={classes.Chapters} aria-label="Showcase chapters">
              {chapters.map(scene => (
                <Button
                  key={scene.id}
                  size="small"
                  variant="invisible"
                  aria-current={scene.id === chapter.id ? 'step' : undefined}
                  onClick={() => setClock({elapsedMs: scene.playbackStart, playing: false})}
                >
                  {scene.label}
                </Button>
              ))}
            </nav>
            <Text as="p" size="small" className={classes.Muted}>
              A guided anatomy tour using real Primer components ({duration / 1_000} seconds).{' '}
              {layout === 'slideshow'
                ? 'Full-width introductions precede each demo. Switch to Split view for the original layout. '
                : 'Narration and demos appear side by side. '}
              Record mode hides controls after a three-second countdown. Press Escape to pause and show controls.
              Playback pauses when this tab is hidden.
            </Text>
            <Text as="p" role="status" className={classes.SrOnly}>
              {clock.playing ? 'Playing' : finished ? 'Finished' : 'Paused'}: {chapter.label}.
            </Text>
          </footer>
          {recording ? (
            <Text className={classes.SrOnly}>Recording mode. Press Escape to pause and show controls.</Text>
          ) : null}
          {clock.elapsedMs < 0 && clock.playing ? (
            <div className={classes.Countdown} role="status" aria-label="Recording countdown">
              <Text className={classes.CountdownNumber}>{Math.ceil(-clock.elapsedMs / 1_000)}</Text>
              <Text>Ready to record</Text>
            </div>
          ) : null}
        </main>
      </BaseStyles>
    </ThemeProvider>
  )
}
