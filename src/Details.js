import React, {useState} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'

const openStyles = `
  & > summary::before {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 80;
    display: block;
    cursor: default;
    content: " ";
    background: transparent;
  }
  background: 'red';
`

const DetailsReset = styled('details')`
  ${props => props.open ? openStyles : `background: 'red';`}
  & > summary {
    list-style: none;
  }
  & > summary::before {
    display: none;
  }
  & > summary::-webkit-details-marker {
    display: none;
  }
  ${props => props.overlay && props.open ? overlayStyles : ''}
`

function DetailsBase({children, overlay, ...rest}){
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(!open);
  const render = children === 'function' ? children : () => children
  return (
    <DetailsReset {...rest} open={open} overlay={overlay}>
      {render({open, toggle})}
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
  open: PropTypes.bool,
  overlay: PropTypes.bool,
  render: PropTypes.func,
  theme: PropTypes.object,
  ...COMMON.propTypes
}

export default Details
