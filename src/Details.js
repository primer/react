import React from 'react'
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
`

class DetailsBase extends React.Component {
  constructor(props) {
    super(props)
    this.state = {open: Boolean(props.open)}
    this.toggle = this.toggle.bind(this)
  }

  toggle(event) {
    if (event) {
      event.preventDefault()
    }
    this.setState({open: !this.state.open})
  }

  render() {
    const {children, render = getRenderer(children), ...rest} = this.props
    const {open} = this.state

    return (
      <DetailsReset {...rest} open={open}>
        {render({open, toggle: this.toggle})}
      </DetailsReset>
    )
  }
}

function getRenderer(children) {
  return typeof children === 'function' ? children : () => children
}

const Details = styled(DetailsBase)(COMMON)

Details.defaultProps = {
  theme
}

Details.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.string,
  open: PropTypes.bool,
  render: PropTypes.func,
  theme: PropTypes.object,
  ...COMMON.propTypes
}

export default Details
