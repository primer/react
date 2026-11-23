import {useCallback, useEffect, useRef, useState} from 'react'
import useLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import {animateSelectPanel} from './filmAnatomy'
import {filmTiming} from './filmTimeline'
import classes from './SelectPanelFilm.module.css'

export function SelectPanelFilmSource({
  time,
  onReady,
  onFocus,
  onEscape,
}: {
  time: number
  onReady: (anchor?: {x: number; y: number}) => void
  onFocus: (center: {x: number; y: number}) => void
  onEscape: () => void
}) {
  const frame = useRef<HTMLIFrameElement | null>(null)
  const attachFrame = useCallback((element: HTMLIFrameElement | null) => {
    frame.current = element
    if (element) element.inert = true
  }, [])
  const [loadVersion, setLoadVersion] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const anatomy = useRef<ReturnType<typeof animateSelectPanel> | null>(null)
  const elapsed = useRef(time)

  useEffect(() => {
    const sourceDocument = frame.current?.contentDocument
    if (!sourceDocument) return
    let disposed = false
    let preparing = false
    let ready = false
    let sourceTrigger: HTMLButtonElement | null = null
    let phoneFrame: HTMLIFrameElement | null = null
    let phoneDocument: Document | null = null
    const seek = () => {
      // Draft drop targets must be measured after the source clock's render commits.
      const sourceTime = sourceDocument.querySelector('[data-film-time]')?.getAttribute('data-film-time')
      if (sourceTime === String(elapsed.current)) anatomy.current?.seek(elapsed.current)
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      onEscape()
    }
    const listenToPhone = () => {
      phoneDocument?.removeEventListener('keydown', handleEscape, true)
      phoneDocument = phoneFrame?.contentDocument ?? null
      phoneDocument?.addEventListener('keydown', handleEscape, true)
    }
    const synchronizePhone = () => {
      const current = sourceDocument.querySelector<HTMLIFrameElement>('iframe[title="Agent assignment on a phone"]')
      if (current === phoneFrame) return
      phoneFrame?.removeEventListener('load', listenToPhone)
      phoneFrame = current
      phoneFrame?.addEventListener('load', listenToPhone)
      listenToPhone()
    }
    sourceDocument.addEventListener('keydown', handleEscape, true)
    let animatedPanel: HTMLElement | null = null
    const timeout = window.setTimeout(() => setError('The SelectPanel source story did not become ready.'), 15_000)
    const prepare = async () => {
      const trigger = sourceTrigger?.isConnected
        ? sourceTrigger
        : sourceDocument.querySelector<HTMLButtonElement>('[data-film-issue] button[aria-haspopup="dialog"]')
      if (!trigger || preparing) return
      sourceTrigger = trigger
      if (!ready) {
        const label = trigger.querySelector<HTMLElement>('[data-component="text"]')
        if (!label) {
          setError('The SelectPanel trigger is missing its Labels text.')
          return
        }
        ready = true
        window.clearTimeout(timeout)
        frame.current?.contentWindow?.postMessage(
          {type: 'select-panel-film-time', time: elapsed.current},
          window.location.origin,
        )
        const bounds = label.getBoundingClientRect()
        onReady({x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2})
      }
      if (anatomy.current && animatedPanel?.isConnected) {
        seek()
        return
      }
      const panel = sourceDocument.getElementById(trigger.getAttribute('aria-controls') ?? '')
      if (panel !== animatedPanel) {
        anatomy.current?.dispose()
        anatomy.current = null
        animatedPanel = null
      }
      if (!panel) return
      if (anatomy.current) return
      if (!panel.querySelector('[role="option"]')) return
      preparing = true
      try {
        await sourceDocument.fonts.ready
        if (disposed || !panel.isConnected) return
        for (const animation of panel.getAnimations()) animation.cancel()
        sourceDocument.body.style.overflow = 'hidden'
        anatomy.current = animateSelectPanel(panel, trigger)
        animatedPanel = panel
        const bounds = panel.getBoundingClientRect()
        onFocus({x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2})
        seek()
      } catch (reason) {
        if (!disposed) setError(reason instanceof Error ? reason.message : String(reason))
      } finally {
        preparing = false
        if (!disposed && !panel.isConnected) void prepare()
      }
    }
    const observer = new MutationObserver(() => {
      synchronizePhone()
      void prepare()
    })
    observer.observe(sourceDocument.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-film-time'],
    })
    synchronizePhone()
    void prepare()
    return () => {
      disposed = true
      observer.disconnect()
      sourceDocument.removeEventListener('keydown', handleEscape, true)
      phoneFrame?.removeEventListener('load', listenToPhone)
      phoneDocument?.removeEventListener('keydown', handleEscape, true)
      window.clearTimeout(timeout)
      anatomy.current?.dispose()
      anatomy.current = null
    }
  }, [loadVersion, onReady, onFocus, onEscape])

  useLayoutEffect(() => {
    elapsed.current = time
    // Restore extracted nodes before React can close and unmount their original panel.
    if (time < filmTiming.split) anatomy.current?.seek(time)
    frame.current?.contentWindow?.postMessage({type: 'select-panel-film-time', time}, window.location.origin)
  }, [time])

  return (
    <>
      {/* eslint-disable-next-line @eslint-react/dom/no-missing-iframe-sandbox -- Trusted same-origin Storybook; choreography needs its live DOM. */}
      <iframe
        ref={attachFrame}
        className={classes.Source}
        title="Live SelectPanel source story"
        src="/iframe.html?id=components-selectpanel-film--source-surface&viewMode=story"
        tabIndex={-1}
        onLoad={() => {
          setLoadVersion(version => version + 1)
        }}
      />
      {error ? (
        <div className={classes.SourceError} role="alert">
          {error}
        </div>
      ) : null}
    </>
  )
}
