import type {HTMLProps} from 'react'
import type React from 'react'
import {useState} from 'react'
import classes from './ValidationAnimationContainer.module.css'

interface Props extends HTMLProps<HTMLDivElement> {
  show?: boolean
}
const ValidationAnimationContainer: React.FC<React.PropsWithChildren<Props>> = ({show, children}) => {
  const [shouldRender, setRender] = useState(show)

  // Start rendering as soon as `show` becomes true. Adjusting state during render
  // (instead of from an effect) avoids the extra post-commit render the effect caused.
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
