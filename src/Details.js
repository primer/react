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

function Details({
  children,
  overlay,
  render = getRenderer(children),
  open: userOpen,
  onClickOutside,
  onToggle,
  defaultOpen = false,
  ...rest
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const ref = useRef(null)
  // only use internal open state if user doesn't provide a value for the open prop
  const open = userOpen || internalOpen

  const onClickOutsideInternal = useCallback(
    event => {
      if (event.target.closest('details') !== ref.current) {
        onClickOutside && onClickOutside(event)
        if (!event.defaultPrevented) {
          setInternalOpen(false)
        }
      }
    },
    [ref, onClickOutside, setInternalOpen]
  )

  // handles the overlay behavior - closing the menu when clicking outside of it
  useEffect(() => {
    if (open && overlay) {
      document.addEventListener('click', onClickOutsideInternal)
      return () => {
        document.removeEventListener('click', onClickOutsideInternal)
      }
    }
  }, [open, overlay, onClickOutsideInternal])

  function handleToggle(e) {
    onToggle && onToggle(e)

    if (!e.defaultPrevented) {
      setInternalOpen(e.target.open)
    }
  }

  return (
    <StyledDetails {...rest} ref={ref} open={open} onToggle={handleToggle} overlay={overlay}>
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
