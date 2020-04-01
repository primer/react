import React, {useState, useEffect, useCallback, useRef} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'

// The <details> element is not yet supported in Edge so we have to use a polyfill.
// We have to check if window is defined before importing the polyfill
// so the code doesn’t run while pages build
// uses require because of primer/components issue #638
if (typeof window !== 'undefined') {
  require('details-element-polyfill')
}

const StyledDetails = styled('details')`
  & > summary {
    list-style: none;
  }
  & > summary::-webkit-details-marker {
    display: none;
  }

  ${COMMON}
`
function getRenderer(children) {
  return typeof children === 'function' ? children : () => children
}

function Details({children, overlay, render = getRenderer(children), open, onToggle, defaultOpen = false, ...rest}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  // only handle open state if user doesn't provide a value for the open prop
  const shouldHandleOpen = typeof open === 'undefined'
  const ref = useRef(null)

  const closeMenu = useCallback(
    event => {
      // only close the menu if we're clicking outside
      if (event && event.target.closest('details') !== ref.current) {
        setInternalOpen(false)
        document.removeEventListener('click', closeMenu)
      }
    },
    [ref]
  )
  // handles the overlay behavior - closing the menu when clicking outside of it
  useEffect(() => {
    if (shouldHandleOpen && overlay && internalOpen) {
      document.addEventListener('click', closeMenu)
      return () => {
        document.removeEventListener('click', closeMenu)
      }
    }
  }, [internalOpen, shouldHandleOpen, overlay, closeMenu])

  function handleToggle(e) {
    onToggle && onToggle(e)

    if (!e.defaultPrevented) {
      setInternalOpen(e.target.open)
    }
  }

  return (
    <StyledDetails
      {...rest}
      ref={ref}
      open={shouldHandleOpen ? internalOpen : open}
      onToggle={shouldHandleOpen ? handleToggle : onToggle}
      overlay={overlay}
    >
      {render({open})}
    </StyledDetails>
  )
}

Details.defaultProps = {
  theme,
  overlay: false
}

Details.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.string,
  defaultOpen: PropTypes.bool,
  overlay: PropTypes.bool,
  render: PropTypes.func,
  theme: PropTypes.object,
  ...COMMON.propTypes
}

export default Details
