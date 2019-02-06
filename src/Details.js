import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'

const DetailsReset = styled('details')`
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

const overlayStyles = `
background: red;
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
`

export const DetailsContext = React.createContext({
  toggle: () => {},
});

class DetailsBase extends React.Component {
  constructor(props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {open: Boolean(props.open), toggle: this.toggle}
  }

  toggle(event) {
    if (event) {
      event.preventDefault()
    }
    this.setState({open: !this.state.open})
  }

  render() {
    const {children, render = getRenderer(children), overlay, ...rest} = this.props
    const {open} = this.state
    return (
      <DetailsContext.Provider value={this.state}>
        <DetailsReset {...rest} open={open} css="background: red">
          {render({open, toggle: this.toggle})}
        </DetailsReset>
      </DetailsContext.Provider>
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
