import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'

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

  useEffect(
    () => {
      if (overlay && open) {
        document.addEventListener('click', closeMenu)
        return () => {
          document.removeEventListener('click', closeMenu)
        }
      }
    },
    [open, overlay]
  )

  function toggle(event) {
    setOpen(event.target.open)
  }

  function closeMenu(event) {
    if (event) event.preventDefault()
    setOpen(false)
  }

  return (
    <DetailsReset {...rest} open={open} onToggle={toggle} overlay={overlay}>
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
