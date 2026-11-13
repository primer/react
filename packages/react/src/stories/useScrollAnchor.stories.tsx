import React, {useRef, useState} from 'react'
import type {Meta} from '@storybook/react-vite'
import {Button} from '../Button'
import {useScrollAnchor} from '../hooks/useScrollAnchor'
import classes from './ScrollAnchor.stories.module.css'

export default {
  title: 'Hooks/useScrollAnchor',
} as Meta

export const ScrollAnchor = () => {
  const [enabled, setEnabled] = useState(true)
  const [loadedPages, setLoadedPages] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const disabledAnchorRef = useRef<HTMLDivElement>(null)

  useScrollAnchor({containerRef, anchorRef: enabled ? anchorRef : disabledAnchorRef})

  const olderComments = Array.from({length: loadedPages * 3}, (_, index) => `Earlier comment ${index + 1}`)

  return (
    <>
      <style>{`html { overflow-anchor: none !important; }`}</style>
      <div className={classes.Root}>
        <p className={classes.Instructions}>
          Scroll until the highlighted comment is in view, then load earlier comments. Toggle the hook to compare how
          the comment moves. Native browser scroll anchoring is disabled in this story so the hook's effect is visible
          in every browser.
        </p>
        <p className={classes.Instructions}>
          <code>{'useScrollAnchor({containerRef, anchorRef})'}</code> watches the timeline container and preserves the
          highlighted comment's viewport position. It adjusts window scrolling only.
        </p>
        <div className={classes.Controls}>
          <Button onClick={() => setLoadedPages(page => page + 1)}>Load earlier comments</Button>
          <Button onClick={() => setEnabled(value => !value)}>{enabled ? 'Disable' : 'Enable'} scroll anchor</Button>
          <span className={classes.Status}>Hook is {enabled ? 'on' : 'off'}</span>
        </div>
        <div className={classes.Timeline} ref={containerRef}>
          {olderComments.map(comment => (
            <div className={classes.Item} key={comment}>
              {comment}
            </div>
          ))}
          {['Comment 1', 'Comment 2', 'Comment 3'].map(comment => (
            <div className={classes.Item} key={comment}>
              {comment}
            </div>
          ))}
          <div className={`${classes.Item} ${classes.Anchor}`} ref={anchorRef}>
            <strong>You're reading this comment</strong>
            <p>Keep this comment at the same viewport position while content is added above it.</p>
          </div>
          {Array.from({length: 12}, (_, index) => (
            <div className={classes.Item} key={`later-comment-${index + 1}`}>
              Comment {index + 4}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
