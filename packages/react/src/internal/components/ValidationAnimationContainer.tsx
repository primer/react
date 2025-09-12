import type {HTMLProps} from 'react'
import type React from 'react'
import {useEffect, useState} from 'react'
import styled, {keyframes, css} from 'styled-components'

interface Props extends HTMLProps<HTMLDivElement> {
  show?: boolean
}

const fadeIn = keyframes`
    0% {
      opacity: 0;
      transform: translateY(-100%);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  `
// using easeOutQuint easing fn https://easings.net/#easeOutQuint
const AnimatedElement = styled.div<Props>`
  animation: ${props => props.show && css`170ms ${fadeIn} cubic-bezier(0.44, 0.74, 0.36, 1);`};
  @media (prefers-reduced-motion) {
    animation: none;
  }
`
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
      <AnimatedElement show={show} onAnimationEnd={onAnimationEnd}>
        {children}
      </AnimatedElement>
    </div>
  ) : null
}

export default ValidationAnimationContainer
