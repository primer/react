import {
  getShowcaseFrame,
  showcaseScenes,
  showcaseAppearanceOrder,
  SHOWCASE_DURATION,
  SHOWCASE_THEME_PLAYBACK_DURATION,
  type ShowcaseFrame,
} from './showcase'

export type ShowcaseLayout = 'slideshow' | 'split'

export const DEFAULT_SHOWCASE_LAYOUT: ShowcaseLayout = 'slideshow'
export const SHOWCASE_TEXT_HOLD_DURATION = 2_000
export const SHOWCASE_INTRO_DURATION = 2_500 + SHOWCASE_TEXT_HOLD_DURATION
export const SHOWCASE_PLATFORM_DURATION = 6_000
export const SHOWCASE_NEXT_DURATION = 8_000

const textScenes = new Set<ShowcaseFrame['scene']['id'] | 'next'>(['platform', 'closing', 'next'])

export function getShowcaseChapters(layout: ShowcaseLayout) {
  const scenes = [
    ...showcaseScenes.filter(scene => scene.id !== 'customize-intro' && scene.id !== 'closing'),
    {
      id: 'next' as const,
      start: SHOWCASE_DURATION,
      label: "What's next?",
      title: 'Where could composition go next?',
      description: 'Potential next explorations. More flexible parts, built on the foundations we already have.',
      parts: [],
    },
    showcaseScenes.find(scene => scene.id === 'closing')!,
  ]
  let playbackStart = 0
  return scenes.map(scene => {
    const index = showcaseScenes.findIndex(candidate => candidate.id === scene.id)
    const scriptDuration =
      scene.id === 'next' ? 0 : (showcaseScenes[index + 1]?.start ?? SHOWCASE_DURATION) - scene.start
    const isTextSlide = scene.id === 'next' || (layout === 'slideshow' && textScenes.has(scene.id))
    const isPlatformSummary = layout === 'slideshow' && scene.id === 'platform'
    const isCustomization = scene.id === 'customize'
    const introDuration = layout === 'slideshow' && !isTextSlide ? SHOWCASE_INTRO_DURATION : 0
    const contentDuration =
      scene.id === 'next'
        ? SHOWCASE_NEXT_DURATION
        : isCustomization
          ? showcaseAppearanceOrder.length * SHOWCASE_THEME_PLAYBACK_DURATION
          : isPlatformSummary
            ? SHOWCASE_PLATFORM_DURATION
            : scriptDuration + (isTextSlide ? SHOWCASE_TEXT_HOLD_DURATION : 0)
    const scriptRate =
      scene.id === 'next' ? 0 : isPlatformSummary || isCustomization ? scriptDuration / contentDuration : 1
    const chapter = {...scene, playbackStart, introDuration, contentDuration, scriptDuration, scriptRate}
    playbackStart += introDuration + contentDuration
    return chapter
  })
}

export function getShowcaseDuration(layout: ShowcaseLayout) {
  return getShowcaseChapters(layout).reduce(
    (total, chapter) => total + chapter.introDuration + chapter.contentDuration,
    0,
  )
}

export function getShowcasePlayback(elapsedMs: number, layout: ShowcaseLayout) {
  const duration = getShowcaseDuration(layout)
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0 || elapsedMs > duration) {
    throw new RangeError(`Showcase playback time must be between 0 and ${duration} milliseconds.`)
  }
  const chapters = getShowcaseChapters(layout)
  const chapterIndex = chapters.findLastIndex(candidate => elapsedMs >= candidate.playbackStart)
  const chapter = chapters[chapterIndex]
  const chapterTime = elapsedMs - chapter.playbackStart
  const scriptOffset = Math.max(0, chapterTime - chapter.introDuration) * chapter.scriptRate
  const scriptTime =
    chapter.id === 'next' || elapsedMs === duration
      ? SHOWCASE_DURATION
      : chapter.start + (scriptOffset >= chapter.scriptDuration ? chapter.scriptDuration - 1 : scriptOffset)
  const phase =
    chapter.id === 'next' || chapter.id === 'closing'
      ? 'card'
      : layout === 'split'
        ? 'split'
        : textScenes.has(chapter.id)
          ? 'card'
          : chapterTime < chapter.introDuration
            ? 'intro'
            : 'demo'
  const phaseTime = chapterTime - (phase === 'demo' ? chapter.introDuration : 0)
  const phaseDuration = phase === 'intro' ? chapter.introDuration : chapter.contentDuration
  return {chapter, frame: getShowcaseFrame(scriptTime), scriptTime, phase, phaseTime, phaseDuration}
}

export function convertShowcaseTime(elapsedMs: number, from: ShowcaseLayout, to: ShowcaseLayout) {
  const {chapter: currentChapter, scriptTime, phase, phaseTime} = getShowcasePlayback(elapsedMs, from)
  if (from === to) return elapsedMs
  if (elapsedMs === getShowcaseDuration(from)) return getShowcaseDuration(to)
  const chapter = getShowcaseChapters(to).find(candidate => candidate.id === currentChapter.id)!
  if (currentChapter.id === 'next' || currentChapter.id === 'closing') {
    return chapter.playbackStart + (phaseTime / currentChapter.contentDuration) * chapter.contentDuration
  }
  if (phase === 'intro') return chapter.playbackStart
  return chapter.playbackStart + chapter.introDuration + (scriptTime - chapter.start) / chapter.scriptRate
}
