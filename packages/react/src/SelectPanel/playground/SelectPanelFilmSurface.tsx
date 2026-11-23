import {memo, useEffect, useState} from 'react'
import {SelectPanelFilmIssue} from './SelectPanelFilmIssue'
import {FilmAgentPicker, SelectPanelFilmSequence} from './SelectPanelFilmSequence'
import {filmDuration, filmTiming} from './filmTimeline'

const OpeningIssue = memo(SelectPanelFilmIssue)

export function SelectPanelFilmSurface({mobile = false}: {mobile?: boolean}) {
  const [time, setTime] = useState(0)
  useEffect(() => {
    const receive = (event: MessageEvent<unknown>) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      const message = event.data
      if (
        typeof message === 'object' &&
        message !== null &&
        'type' in message &&
        message.type === 'select-panel-film-time' &&
        'time' in message &&
        typeof message.time === 'number' &&
        Number.isFinite(message.time) &&
        message.time >= 0 &&
        message.time <= filmDuration
      ) {
        setTime(message.time)
      }
    }
    window.addEventListener('message', receive)
    if (mobile) window.parent.postMessage({type: 'select-panel-film-ready'}, window.location.origin)
    return () => window.removeEventListener('message', receive)
  }, [mobile])

  return (
    <div data-film-time={time}>
      {mobile ? (
        <FilmAgentPicker time={Math.min(time, filmTiming.teamReturn)} mobile />
      ) : (
        <>
          <OpeningIssue time={Math.min(time, 8_000)} />
          {time >= 8_000 ? <SelectPanelFilmSequence time={time} /> : null}
        </>
      )}
    </div>
  )
}
