import type {HTMLProps} from 'react'
import type React from 'react'
import {useState} from 'react'
import classes from './ValidationAnimationContainer.module.css'

interface Props extends HTMLProps<HTMLDivElement> {
  show?: boolean
}
const ValidationAnimationContainer: React.FC<React.PropsWithChildren<Props>> = ({show, children}) => {
  const [shouldRender, setRender] = useState(show)

  // Mounting is derived from `show`, so compute it during render. Un-mounting is
  // deferred to `onAnimationEnd` so the exit animation can play. Deriving this in
  // render avoids the extra commit/paint an effect + setState would introduce.
  if (show && !shouldRender) {
    setRender(true)
  }

  const onAnimationEnd = () => {
    if (!show) setRender(false)
  }

  return shouldRender ? (
    <div style={{height: show ? 'auto' : 0, overflow: 'hidden'}}>
      <div data-show={show ? '' : undefined} onAnimationEnd={onAnimationEnd} className={classes.Animation}>
        {children}
      </div>
    </div>
  ) : null
}

export default ValidationAnimationContainer
