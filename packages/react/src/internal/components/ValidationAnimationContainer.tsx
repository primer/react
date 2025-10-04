import type {HTMLProps} from 'react'
import type React from 'react'
import {useEffect, useState} from 'react'
import classes from './ValidationAnimationContainer.module.css'

interface Props extends HTMLProps<HTMLDivElement> {
  show?: boolean
}
const ValidationAnimationContainer: React.FC<React.PropsWithChildren<Props>> = ({show, children}) => {
  const [shouldRender, setRender] = useState(show)

  useEffect(() => {
    if (show) setRender(true)
  }, [show])

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
