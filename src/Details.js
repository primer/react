import React, {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'

// The <details> element is not yet supported in Edge so we have to use a polyfill.
// We have to check if window is defined before importing the polyfill
// so the code doesn’t run while pages build
if (typeof window !== 'undefined') {
  import('details-element-polyfill')
}

const DetailsReset = styled('details')`
  & > summary {
    list-style: none;
  }
  & > summary::-webkit-details-marker {
    display: none;
  }
`
function getRenderer(children) {
  return typeof children === 'function' ? children : () => children
}

function DetailsBase({children, overlay, render = getRenderer(children), defaultOpen = false, ...rest}) {
  const [open, setOpen] = useState(defaultOpen)
  const ref = useRef(null)

  useEffect(() => {
    if (overlay && open) {
      document.addEventListener('click', closeMenu)
      return () => {
        document.removeEventListener('click', closeMenu)
      }
    }
  }, [open, overlay])

  function toggle(event) {
    setOpen(event.target.open)
  }

  function closeMenu(event) {
    // only close the menu if we're clicking outside
    if (event && event.target.closest('details') !== ref.current) {
      setOpen(false)
      document.removeEventListener('click', closeMenu)
    }
  }

  return (
    <DetailsReset {...rest} ref={ref} open={open} onToggle={toggle} overlay={overlay}>
      {render({open})}
    </DetailsReset>
  )
}

const Details = styled(DetailsBase)(COMMON)

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
